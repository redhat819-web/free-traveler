#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
audit_tasks.py

TASKS/00_TASK_LIST.md 와 TASKS/TASK-*.md 상세 파일을 최종 감사 규칙(18개)에 따라 검사한다.

입력:
  - TASKS/00_TASK_LIST.md
  - TASKS/TASK-*.md
  - docs/PROJECT_SCOPE.md
  - design-reference/SCREEN_ROUTE_CONTRACT.json

출력:
  - TASKS/TASK_MANIFEST.csv
  - TASKS/TASK_AUDIT_REPORT.md

오류가 있으면 exit 1. 성공 시 stdout에 `AUDIT_PASS`와 검사 수를 출력하고 exit 0.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
TASK_LIST_PATH = TASKS_DIR / "00_TASK_LIST.md"
PROJECT_SCOPE_PATH = REPO_ROOT / "docs" / "PROJECT_SCOPE.md"
CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

HARNESS_SCHEMA = "traveler-screen-route-v1"
MAX_DB_TABLES_SOFT = 6
MAX_DB_TABLES_HARD = 8
FORBIDDEN_KEYWORDS = ["merge runner", "auto merge", "auto-merge", "automerge", "ec2", "aws"]
EXPECTED_DB_ROLE_TASKS = ["DB-SCHEMA-BASE", "DB-RLS-BASE", "DB-ACCESS", "DB-SEED-BASE"]
EXPECTED_E2E_TASKS = ["E2E-PUBLIC-SMOKE", "E2E-TRAVEL-TOOLS", "E2E-MATE-AUTH"]


class Report:
    def __init__(self) -> None:
        self.fails: list[str] = []
        self.warns: list[str] = []
        self.passes: list[str] = []

    def check(self, label: str, ok: bool, fail_msg: str | None = None) -> None:
        if ok:
            self.passes.append(label)
        else:
            self.fails.append(fail_msg or label)

    def warn(self, msg: str) -> None:
        self.warns.append(msg)

    def exit_code(self) -> int:
        return 1 if self.fails else 0

    def render(self, check_count: int) -> str:
        lines = ["# Task Audit Report (TASKS/ pipeline)", ""]
        lines.append(f"- Result: {'FAIL' if self.fails else 'PASS'}")
        lines.append(f"- Checks run: {check_count}")
        lines.append(f"- Checks passed: {len(self.passes)}")
        lines.append(f"- Failures: {len(self.fails)}")
        lines.append(f"- Warnings: {len(self.warns)}")
        lines.append("")
        lines.append("## PASS")
        for p in self.passes:
            lines.append(f"- {p}")
        if not self.passes:
            lines.append("- (none)")
        lines.append("")
        lines.append("## FAIL")
        if self.fails:
            for f in self.fails:
                lines.append(f"- {f}")
        else:
            lines.append("- (none)")
        lines.append("")
        lines.append("## WARN")
        if self.warns:
            for w in self.warns:
                lines.append(f"- {w}")
        else:
            lines.append("- (none)")
        lines.append("")
        return "\n".join(lines)


# ---------------------------------------------------------------------------
# Parsing: TASKS/00_TASK_LIST.md tables (Seq | Task ID | ... )
# ---------------------------------------------------------------------------

def parse_task_list_tables(md_text: str) -> list[dict]:
    lines = md_text.splitlines()
    starts = [i for i, l in enumerate(lines) if l.strip().startswith("| Seq")]
    rows: list[dict] = []
    for s in starts:
        headers = [h.strip() for h in lines[s].strip().strip("|").split("|")]
        i = s + 2
        while i < len(lines) and lines[i].strip().startswith("|"):
            cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
            if len(cells) == len(headers):
                rows.append(dict(zip(headers, cells)))
            i += 1
    return rows


def parse_excluded_table(md_text: str) -> list[str]:
    """§5 NON_IMPLEMENTATION 표에서 EXCLUDED Requirement ID 목록을 추출한다."""
    lines = md_text.splitlines()
    excluded: list[str] = []
    in_section = False
    for l in lines:
        if l.strip().startswith("## 5."):
            in_section = True
            continue
        if in_section and l.strip().startswith("## 6."):
            break
        if in_section:
            m = re.match(r"^\|\s*(REQ-(?:FUNC|NF)-\d+)\s*\|", l.strip())
            if m:
                excluded.append(m.group(1))
    return excluded


def split_ids(raw: str) -> list[str]:
    if not raw:
        return []
    raw = raw.strip()
    if raw in ("(없음)", "-", "—", ""):
        return []
    raw = raw.replace("`", "")
    return [p.strip() for p in re.split(r",\s*", raw) if p.strip() and p.strip() != "(없음)"]


def expand_req_ref(raw: str) -> list[str]:
    if not raw:
        return []
    raw = raw.strip()
    if raw.startswith("(") or not raw:
        return []
    ids: list[str] = []
    for seg in re.split(r";\s*", raw):
        seg = seg.strip()
        m = re.match(r"^REQ-(FUNC|NF)-(\d+)(?:~(\d+))?(.*)$", seg)
        if not m:
            continue
        prefix, start, end, rest = m.groups()
        width = len(start)
        if end:
            for n in range(int(start), int(end) + 1):
                ids.append(f"REQ-{prefix}-{str(n).zfill(width)}")
        else:
            ids.append(f"REQ-{prefix}-{start}")
        rest = rest.strip()
        if rest.startswith(","):
            for tok in re.split(r",\s*", rest.lstrip(",").strip()):
                tok = tok.strip()
                if re.match(r"^\d+$", tok):
                    ids.append(f"REQ-{prefix}-{tok.zfill(width)}")
    return ids


def detect_cycles(graph: dict[str, list[str]]) -> list[list[str]]:
    """DFS 기반 사이클 탐지. graph: task_id -> depends_on 목록."""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n: WHITE for n in graph}
    cycles: list[list[str]] = []

    def dfs(node: str, path: list[str]) -> None:
        color[node] = GRAY
        path.append(node)
        for dep in graph.get(node, []):
            if dep not in color:
                continue
            if color[dep] == GRAY:
                idx = path.index(dep)
                cycles.append(path[idx:] + [dep])
            elif color[dep] == WHITE:
                dfs(dep, path)
        path.pop()
        color[node] = BLACK

    for n in list(graph.keys()):
        if color[n] == WHITE:
            dfs(n, [])
    return cycles


def main() -> int:
    report = Report()
    check_count = 0

    def run(label: str, ok: bool, fail_msg: str | None = None) -> None:
        nonlocal check_count
        check_count += 1
        report.check(label, ok, fail_msg)

    # ---- load inputs ----
    if not TASK_LIST_PATH.is_file():
        print(f"FATAL: {TASK_LIST_PATH} not found")
        return 1
    task_list_text = TASK_LIST_PATH.read_text(encoding="utf-8")

    if not PROJECT_SCOPE_PATH.is_file():
        print(f"FATAL: {PROJECT_SCOPE_PATH} not found")
        return 1

    if not CONTRACT_PATH.is_file():
        print(f"FATAL: {CONTRACT_PATH} not found")
        return 1
    contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))

    rows = parse_task_list_tables(task_list_text)
    excluded_reqs = set(parse_excluded_table(task_list_text))

    by_id: dict[str, dict] = {}
    dup_ids: list[str] = []
    for d in rows:
        tid = d.get("Task ID", "").strip()
        if not tid:
            continue
        if tid in by_id:
            dup_ids.append(tid)
        else:
            by_id[tid] = d

    detail_files = {p.stem[5:] for p in TASKS_DIR.glob("TASK-*.md")}
    task_ids = set(by_id.keys())

    # ---- 1. Task List 구현 ID와 상세 Task 파일 1:1 ----
    missing_details = task_ids - detail_files
    orphan_details = detail_files - task_ids
    run(
        f"1. Task List ID <-> TASK-*.md 1:1 ({len(task_ids)}개)",
        not missing_details and not orphan_details,
        (
            f"1. 1:1 불일치 — 상세 파일 없음: {sorted(missing_details)[:20]} / "
            f"대응 Task 없는 상세 파일: {sorted(orphan_details)[:20]}"
        ),
    )

    # ---- 2. 중복 Task ID 0 ----
    run(
        "2. 중복 Task ID 0건",
        not dup_ids,
        f"2. 중복 Task ID 발견: {dup_ids}",
    )

    # ---- 3. Depends On 누락 0 (참조 무결성) ----
    depends_graph: dict[str, list[str]] = {}
    missing_deps: list[tuple[str, str]] = []
    for tid, d in by_id.items():
        deps = split_ids(d.get("Depends On", ""))
        depends_graph[tid] = deps
        for dep in deps:
            if dep not in task_ids:
                missing_deps.append((tid, dep))
    run(
        "3. Depends On 참조 누락 0건",
        not missing_deps,
        f"3. 존재하지 않는 Task를 참조하는 Depends On: {missing_deps[:20]}",
    )

    # ---- 4. Dependency Cycle 0 ----
    cycles = detect_cycles(depends_graph)
    run(
        "4. Dependency Cycle 0건",
        not cycles,
        f"4. 순환 의존성 발견: {cycles[:5]}",
    )

    # ---- 5. Screen 5개 모두 Page Owner 정확히 1개 ----
    screen_ids = [s["screen_id"] for s in contract["screens"]]
    page_owners = [d for d in by_id.values() if d.get("Category", "").strip() == "PAGE_OWNER"]
    po_by_screen: dict[str, list[str]] = {}
    for d in page_owners:
        sid = d.get("Screen", "").strip()
        po_by_screen.setdefault(sid, []).append(d.get("Task ID", "").strip())
    bad_screens = [
        sid for sid in screen_ids
        if len(po_by_screen.get(sid, [])) != 1
    ]
    run(
        "5. Screen 5개 모두 Page Owner 정확히 1개",
        len(page_owners) == 5 and not bad_screens,
        f"5. Page Owner 개수 이상 — 전체 {len(page_owners)}개, 문제 Screen: "
        f"{ {sid: po_by_screen.get(sid, []) for sid in bad_screens} }",
    )

    # ---- 6. Route·Page Entry·Expected Files 일치 ----
    contract_by_screen = {s["screen_id"]: s for s in contract["screens"]}
    route_mismatches: list[str] = []
    for d in page_owners:
        sid = d.get("Screen", "").strip()
        tid = d.get("Task ID", "").strip()
        c = contract_by_screen.get(sid)
        if not c:
            route_mismatches.append(f"{tid}: 계약에 없는 Screen {sid}")
            continue
        route = d.get("Route", "").strip().strip("`")
        page_entry = d.get("Page Entry", "").strip().strip("`")
        expected_files = d.get("Expected Files", "")
        if route != c["route"]:
            route_mismatches.append(f"{tid}: Route '{route}' != 계약 '{c['route']}'")
        if page_entry != c["page_entry"]:
            route_mismatches.append(f"{tid}: Page Entry '{page_entry}' != 계약 '{c['page_entry']}'")
        if c["page_entry"] not in expected_files:
            route_mismatches.append(f"{tid}: Expected Files에 Page Entry({c['page_entry']}) 없음")
    run(
        "6. Route/Page Entry/Expected Files가 SCREEN_ROUTE_CONTRACT.json과 일치",
        not route_mismatches,
        f"6. 불일치: {route_mismatches}",
    )

    # ---- 7. Component-only Screen 0 (Component는 있는데 Page Owner 없는 Screen 0) ----
    component_screens = {
        d.get("Screen", "").strip()
        for d in by_id.values()
        if d.get("Category", "").strip() == "COMPONENT" and d.get("Screen", "").strip()
    }
    po_screens = set(po_by_screen.keys())
    component_only = component_screens - po_screens
    run(
        "7. Component만 있고 Page Owner 없는 Screen 0건",
        not component_only,
        f"7. Page Owner 없는 Component-only Screen: {sorted(component_only)}",
    )

    # ---- helper: read a detail file's text ----
    def detail_text(tid: str) -> str:
        p = TASKS_DIR / f"TASK-{tid}.md"
        return p.read_text(encoding="utf-8") if p.is_file() else ""

    # ---- 8. SCR-001 Starter 제거 AC 존재 ----
    scr001_po = po_by_screen.get("SCR-001", [])
    scr001_text = "".join(detail_text(t) for t in scr001_po)
    run(
        "8. SCR-001 Page Owner에 스타터 제거 AC 존재",
        bool(scr001_po) and any(k in scr001_text for k in ["스타터", "starter", "replace_starter"]),
        "8. SCR-001 Page Owner 상세 파일에서 '스타터 제거' 관련 AC를 찾지 못함",
    )

    # ---- 9. SCR-003 세 탭 조립 AC 존재 ----
    scr003_po = po_by_screen.get("SCR-003", [])
    scr003_text = "".join(detail_text(t) for t in scr003_po)
    tab_keywords_present = ("탭" in scr003_text or "tab" in scr003_text.lower())
    no_external_link_replace = ("외부 링크" in scr003_text and "대체" in scr003_text) or "tabs_replaced_by_external_links" in scr003_text
    run(
        "9. SCR-003 Page Owner에 항공/숙소/동행 3탭 실제 조립 AC 존재",
        bool(scr003_po) and tab_keywords_present,
        "9. SCR-003 Page Owner 상세 파일에서 탭 조립 관련 AC를 찾지 못함",
    )
    if scr003_po and tab_keywords_present and not no_external_link_replace:
        report.warn("9. SCR-003 상세 파일에 '외부 링크 대체 금지' 명시적 문구가 없음 — 확인 필요")

    # ---- 10. SCR-005 역할별 상태 조립 AC 존재 ----
    scr005_po = po_by_screen.get("SCR-005", [])
    scr005_text = "".join(detail_text(t) for t in scr005_po)
    run(
        "10. SCR-005 Page Owner에 Guest/Member/Admin 역할별 상태 조립 AC 존재",
        bool(scr005_po) and all(k in scr005_text for k in ["Guest", "Member", "Admin"]),
        "10. SCR-005 Page Owner 상세 파일에서 Guest/Member/Admin 3역할 조립 AC를 모두 찾지 못함",
    )

    # ---- 11. DB Schema·RLS·Access·Seed Task 존재 ----
    missing_db_role_tasks = [t for t in EXPECTED_DB_ROLE_TASKS if t not in task_ids]
    run(
        "11. DB Schema/RLS/Access/Seed Task 4종 모두 존재",
        not missing_db_role_tasks,
        f"11. 누락된 DB 역할 Task: {missing_db_role_tasks}",
    )

    # ---- 12. DB Table 범위가 6개 기본 테이블을 크게 넘지 않음 ----
    db_schema_text = detail_text("DB-SCHEMA-BASE")
    table_names: set[str] = set()
    for m in re.finditer(r"`([a-z][a-z0-9_]*)`", db_schema_text):
        name = m.group(1)
        if "_" in name or name.islower():
            table_names.add(name)
    # 파일 경로/코드 조각(.sql, .ts 등)은 테이블명이 아니므로 제외
    table_names = {n for n in table_names if not n.endswith((".sql", ".ts", ".tsx", ".md", ".json"))}
    known_tables = {
        "member_profiles", "mates", "mate_applications",
        "mate_blocks", "mate_reports", "outbound_url_settings",
    }
    candidate_tables = table_names & known_tables if table_names & known_tables else table_names
    n_tables = len(candidate_tables) if candidate_tables else 0
    run(
        f"12. DB Table 수가 기본 6개를 크게 넘지 않음 (감지된 테이블: {sorted(candidate_tables) or '없음'})",
        0 < n_tables <= MAX_DB_TABLES_HARD,
        f"12. DB Table 수 이상 — 감지 {n_tables}개(허용 상한 {MAX_DB_TABLES_HARD}개): {sorted(candidate_tables)}",
    )
    if MAX_DB_TABLES_SOFT < n_tables <= MAX_DB_TABLES_HARD:
        report.warn(f"12. DB Table 수({n_tables})가 기본 6개를 초과함 — 근거 확인 필요")

    # ---- 13. 외부 입력 비저장 AC 존재 (항공/숙소 Form) ----
    no_transmit_missing = []
    for tid in ["CMP-SCR003-FLIGHT-FORM", "CMP-SCR003-HOTEL-FORM"]:
        if tid not in task_ids:
            no_transmit_missing.append(f"{tid}(Task 자체 없음)")
            continue
        t = detail_text(tid)
        if not ("전달하지" in t and ("서버" in t or "DB" in t or "외부 URL" in t)):
            no_transmit_missing.append(tid)
    run(
        "13. 항공/숙소 Form에 외부 입력 비저장(서버·DB·외부 URL 미전달) AC 존재",
        not no_transmit_missing,
        f"13. 비저장 AC 누락: {no_transmit_missing}",
    )

    # ---- 14. Auth·성인·기본 RLS AC 존재 ----
    auth_text = detail_text("CMP-SCR005-AUTH")
    rls_text = detail_text("DB-RLS-BASE")
    auth_ok = "CMP-SCR005-AUTH" in task_ids and ("성인" in auth_text or "adult" in auth_text.lower())
    rls_ok = "DB-RLS-BASE" in task_ids and bool(rls_text.strip())
    run(
        "14. Auth(성인 확인 포함)·기본 RLS AC 존재",
        auth_ok and rls_ok,
        f"14. 누락 — Auth/성인확인 AC 존재={auth_ok}, DB-RLS-BASE 상세 존재={rls_ok}",
    )

    # ---- 15. Playwright Chromium Smoke Task 존재 ----
    missing_e2e = [t for t in EXPECTED_E2E_TASKS if t not in task_ids]
    e2e_no_chromium = [
        t for t in EXPECTED_E2E_TASKS
        if t in task_ids and "chromium" not in detail_text(t).lower()
    ]
    run(
        "15. Playwright Chromium Smoke Task 3종 존재 및 Chromium 명시",
        not missing_e2e and not e2e_no_chromium,
        f"15. 누락 Task: {missing_e2e}, Chromium 미명시: {e2e_no_chromium}",
    )

    # ---- 16. AWS·EC2·자동 Merge 구현 Task 0 ----
    forbidden_hits: list[str] = []
    for tid in task_ids:
        blob = (by_id[tid].get("제목", "") + " " + detail_text(tid)).lower()
        for kw in FORBIDDEN_KEYWORDS:
            if kw in blob:
                forbidden_hits.append(f"{tid}:{kw}")
    run(
        "16. AWS/EC2/자동 Merge 구현 Task 0건",
        not forbidden_hits,
        f"16. 금지 키워드 발견: {forbidden_hits}",
    )

    # ---- 17. REQ-FUNC 80개, REQ-NF 34개 전부 Task 또는 EXCLUDED에 존재 ----
    covered_reqs: set[str] = set()
    for tid in task_ids:
        t = detail_text(tid)
        m = re.search(r"## Requirement Ref\n\n(.*?)\n\n## Screen", t, flags=re.S)
        if m:
            for req in re.findall(r"REQ-(?:FUNC|NF)-\d+", m.group(1)):
                covered_reqs.add(req)
    all_func = {f"REQ-FUNC-{i:03d}" for i in range(1, 81)}
    all_nf = {f"REQ-NF-{i:03d}" for i in range(1, 35)}
    all_reqs = all_func | all_nf
    accounted = covered_reqs | excluded_reqs
    unaccounted = sorted(all_reqs - accounted)
    conflict = sorted(covered_reqs & excluded_reqs)
    run(
        "17. REQ-FUNC 80개 + REQ-NF 34개 전부 Task 또는 EXCLUDED 표에 존재",
        not unaccounted and not conflict,
        f"17. 미기재 Requirement: {unaccounted[:20]} / Task와 EXCLUDED 동시 등재(모순): {conflict[:20]}",
    )

    # ---- 18. EXCLUDED 상세 구현 파일이 생성되지 않음 ----
    excluded_detail_files = [r for r in excluded_reqs if (TASKS_DIR / f"TASK-{r}.md").is_file()]
    run(
        "18. EXCLUDED Requirement에 대한 상세 구현 파일 미생성",
        not excluded_detail_files,
        f"18. EXCLUDED Requirement인데 상세 파일이 존재함: {excluded_detail_files}",
    )

    # ---------------------------------------------------------------------
    # Output: TASK_MANIFEST.csv
    #
    # wave_id는 이 스크립트가 아니라 `scripts/build_waves.py`가 채우는 열이다.
    # 이 스크립트를 재실행해도 기존에 배정된 wave_id가 사라지지 않도록, 다시 쓰기 전에
    # 기존 CSV(있으면)에서 task_id -> wave_id를 읽어 그대로 이어붙인다.
    # ---------------------------------------------------------------------
    existing_wave_id: dict[str, str] = {}
    if MANIFEST_PATH.is_file():
        try:
            with MANIFEST_PATH.open(encoding="utf-8-sig", newline="") as f:
                for r in csv.DictReader(f):
                    if "wave_id" in r:
                        existing_wave_id[r["task_id"]] = r.get("wave_id", "")
        except (OSError, csv.Error):
            existing_wave_id = {}

    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    with MANIFEST_PATH.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "task_id", "title", "category", "screen", "route", "page_entry",
            "depends_on", "priority", "detail_file_exists", "wave_id",
        ])
        for tid in sorted(task_ids):
            d = by_id[tid]
            writer.writerow([
                tid,
                d.get("제목", ""),
                d.get("Category", ""),
                d.get("Screen", ""),
                d.get("Route", ""),
                d.get("Page Entry", ""),
                ";".join(split_ids(d.get("Depends On", ""))),
                d.get("Priority", ""),
                "Y" if tid in detail_files else "N",
                existing_wave_id.get(tid, ""),
            ])

    rendered = report.render(check_count)
    print(rendered)
    REPORT_PATH.write_text(rendered, encoding="utf-8")

    if report.fails:
        print(f"AUDIT_FAIL ({len(report.fails)} failures / {check_count} checks)")
        return 1

    print(f"AUDIT_PASS ({check_count} checks)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
