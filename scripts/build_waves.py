#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
build_waves.py

TASKS/TASK_MANIFEST.csv, TASKS/TASK-*.md(Expected Files), design-reference/SCREEN_ROUTE_CONTRACT.json를
근거로 Wave 편성 계획을 만든다.

입력(실제 경로 — 저장소에 `TASKS/details/`는 존재하지 않으며 상세 파일은 `TASKS/TASK-<ID>.md`에
평면적으로 존재한다. 요청된 `TASKS/details/TASK-*.md` 대신 이 실제 경로를 읽는다):
  - TASKS/TASK_MANIFEST.csv
  - TASKS/TASK-*.md (Expected Files 절)
  - design-reference/SCREEN_ROUTE_CONTRACT.json

출력:
  - TASKS/TASK_DAG.md
  - TASKS/WAVE_PLAN.md
  - TASKS/WAVE_STATE.json
  - TASKS/TASK_MANIFEST.csv에 wave_id 열 추가(다른 열은 유지)

규칙:
  1. Depends On 그래프의 순환 의존성을 검사한다(있으면 아무 파일도 쓰지 않고 exit 1).
  2. 어떤 Task도 자신의 Depends On보다 이르거나 같은 Wave가 아니면 실패한다
     (이 스크립트는 Depends On이 있는 Task를 그 의존 Task보다 "엄격히 뒤" Wave에만 배치해
     같은 Wave 안에서의 의존 관계 자체를 만들지 않는다 — 단순하고 항상 안전한 규칙).
  3. Wave당 기본 4~7개 Task를 배치한다(의존 사슬이 강제하는 경우 더 작은 Wave가 생길 수 있다 —
     이 경우 그 사실을 TASK_DAG.md/WAVE_PLAN.md에 명시한다).
  4. Page Owner Task는 해당 Screen Wave 그룹의 마지막 Wave에 배치한다.
  5. Expected Files가 크게 겹치는(둘 다 create가 아닌 modify/replace_starter인) Task는
     같은 Wave에 함께 두지 않는다.
  6. 한 Wave의 `task_ids`는 Task ID 오름차순으로 기록한다(`/run-wave`가 이 순서대로 한 개씩 실행).
  7. 자동 재시도·자동 수정 같은 복잡한 로직은 만들지 않는다(순수 결정적 배치 알고리즘만 사용).
  8. 이 스크립트는 Git Branch/PR/Merge를 생성하지 않는다. 코드를 구현하지도 않는다(계획 문서 생성 전용).

Wave 그룹 순서(1~10)는 사용자가 지정한 순서를 그대로 따른다. Wave ID는 W00~W10으로 고정하지
않고, 그룹이 여러 Wave로 나뉜 만큼 W01, W02, ...으로 순차 부여한다.

성공 시: stdout에 순환 의존성 수·Wave별 Task 수·Page Owner 위치를 출력, exit 0.
실패 시(순환 의존성 등): 오류를 출력하고 exit 1. 이 경우 어떤 출력 파일도 쓰지 않는다.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
TASK_DAG_PATH = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_PATH = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_PATH = TASKS_DIR / "WAVE_STATE.json"

SCHEMA_VERSION = "traveler-wave-plan-v1"
MAX_WAVE_SIZE = 7
TARGET_MIN_WAVE_SIZE = 4

# 사용자가 지정한 10개 Wave 그룹 순서(제목만 고정, 그룹 번호가 곧 실행 순서)
GROUP_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}

FOUNDATION_UI_TASK_IDS = {"GLOBAL-NAV-FOOTER", "GLOBAL-RESPONSIVE", "GLOBAL-TOAST"}
TAIL_GLOBAL_TASK_IDS = {"GLOBAL-A11Y", "GLOBAL-SEO-META", "GLOBAL-PERF", "GLOBAL-ERROR-PAGES"}
SCREEN_TO_GROUP = {"SCR-001": 4, "SCR-002": 5, "SCR-003": 6, "SCR-004": 7, "SCR-005": 8}


def fail(msg: str) -> int:
    print(msg)
    return 1


def read_manifest() -> tuple[list[str], dict[str, dict]]:
    if not MANIFEST_PATH.is_file():
        raise SystemExit(fail(f"BUILD_WAVES_FAIL — 파일 없음: {MANIFEST_PATH.relative_to(REPO_ROOT)}"))
    with MANIFEST_PATH.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = [h for h in reader.fieldnames if h != "wave_id"]
        rows = {r["task_id"]: r for r in reader}
    return fieldnames, rows


def parse_depends(raw: str) -> list[str]:
    if not raw:
        return []
    return [d.strip() for d in raw.split(";") if d.strip()]


def parse_expected_files(task_id: str) -> list[tuple[str, str]]:
    """TASKS/TASK-<ID>.md의 '## Expected Files' 절에서 (경로, verb) 목록을 추출한다."""
    path = TASKS_DIR / f"TASK-{task_id}.md"
    if not path.is_file():
        return []
    text = path.read_text(encoding="utf-8")
    m = re.search(r"^## Expected Files\s*\n(.*?)(?=\n## )", text, flags=re.S | re.M)
    if not m:
        return []
    body = m.group(1)
    out: list[tuple[str, str]] = []
    for line in body.splitlines():
        line = line.strip()
        if not line.startswith("-"):
            continue
        file_paths = re.findall(r"`([^`]+)`", line)
        if not file_paths:
            continue
        paren = re.search(r"\(([^)]*)\)\s*$", line)
        verb = "create"
        if paren:
            text_in_paren = paren.group(1)
            if "modify" in text_in_paren:
                verb = "modify"
            elif "replace_starter" in text_in_paren:
                verb = "replace_starter"
            elif "create" in text_in_paren:
                verb = "create"
        for fp in file_paths:
            out.append((fp, verb))
    return out


def normalize_surface(file_path: str) -> str:
    """glob(`**`, `*`) 앞부분까지만 남겨 충돌 비교용 표면(surface) 키로 정규화한다."""
    idx = min([i for i in (file_path.find("*"), file_path.find("**")) if i != -1], default=-1)
    if idx == -1:
        return file_path
    return file_path[:idx].rstrip("/")


def group_of(task_id: str, row: dict) -> int:
    category = row.get("category", "")
    screen = row.get("screen", "")
    if task_id == "CI-PIPELINE":
        return 1
    if task_id in FOUNDATION_UI_TASK_IDS:
        return 2
    if category == "DATA":
        return 2
    if task_id == "CMP-SCR005-AUTH":
        return 3
    if category == "DB":
        return 3
    if screen in SCREEN_TO_GROUP:
        return SCREEN_TO_GROUP[screen]
    if task_id in TAIL_GLOBAL_TASK_IDS:
        return 9
    if category in ("UNIT_TEST", "INTEGRATION_TEST", "E2E_TEST", "MANUAL_CHECK"):
        return 9
    if category == "RELEASE_CHECK":
        return 10
    # 알려진 65개 Task 밖의 새 Task가 추가된 경우를 위한 안전망 — 마지막 검증 그룹에 둔다.
    return 9


def detect_cycles(task_ids: list[str], deps: dict[str, list[str]]) -> list[list[str]]:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {t: WHITE for t in task_ids}
    cycles: list[list[str]] = []
    stack: list[str] = []

    def visit(u: str) -> None:
        color[u] = GRAY
        stack.append(u)
        for v in deps.get(u, []):
            if v not in color:
                continue
            if color[v] == GRAY:
                i = stack.index(v)
                cycles.append(stack[i:] + [v])
            elif color[v] == WHITE:
                visit(v)
        stack.pop()
        color[u] = BLACK

    for t in task_ids:
        if color[t] == WHITE:
            visit(t)
    return cycles


def compute_layers(group_tasks: set[str], deps: dict[str, list[str]], order: list[str]) -> dict[str, int]:
    layer: dict[str, int] = {}

    def get_layer(t: str) -> int:
        if t in layer:
            return layer[t]
        d_in_group = [d for d in deps.get(t, []) if d in group_tasks]
        layer[t] = 0 if not d_in_group else 1 + max(get_layer(d) for d in d_in_group)
        return layer[t]

    for t in order:
        if t in group_tasks:
            get_layer(t)
    return layer


def chunk_layer(
    task_ids_sorted: list[str],
    heavy_surfaces: dict[str, set[str]],
) -> list[list[str]]:
    """같은 (group, layer) 안의 Task를 크기(<=7)·파일 충돌 기준으로 Wave 단위 chunk로 나눈다."""
    chunks: list[list[str]] = []
    current: list[str] = []
    current_surfaces: set[str] = set()

    for tid in task_ids_sorted:
        my_surfaces = heavy_surfaces.get(tid, set())
        conflict = bool(my_surfaces & current_surfaces)
        if current and (conflict or len(current) >= MAX_WAVE_SIZE):
            chunks.append(current)
            current = []
            current_surfaces = set()
        current.append(tid)
        current_surfaces |= my_surfaces

    if current:
        chunks.append(current)
    return chunks


def main() -> int:
    fieldnames, rows = read_manifest()
    task_ids = sorted(rows.keys())
    deps: dict[str, list[str]] = {}
    for tid in task_ids:
        d = parse_depends(rows[tid].get("depends_on", ""))
        missing = [x for x in d if x not in rows]
        if missing:
            return fail(f"BUILD_WAVES_FAIL — {tid}의 Depends On 참조 누락: {missing}")
        deps[tid] = d

    # ---- 규칙 1: 순환 의존성 검사 ----
    cycles = detect_cycles(task_ids, deps)
    if cycles:
        for c in cycles:
            print(f"BUILD_WAVES_FAIL — Dependency Cycle: {' -> '.join(c)}")
        return fail(f"BUILD_WAVES_FAIL — 순환 의존성 {len(cycles)}건으로 중단(출력 파일을 쓰지 않음)")

    # 위상 정렬 순서(안정적인 layer 계산을 위해 사용)
    indeg = {t: len(deps[t]) for t in task_ids}
    dependents: dict[str, list[str]] = defaultdict(list)
    for t, dl in deps.items():
        for d in dl:
            dependents[d].append(t)
    topo: list[str] = []
    queue = sorted([t for t, deg in indeg.items() if deg == 0])
    remaining = dict(indeg)
    while queue:
        queue.sort()
        cur = queue.pop(0)
        topo.append(cur)
        for nxt in dependents[cur]:
            remaining[nxt] -= 1
            if remaining[nxt] == 0:
                queue.append(nxt)

    # ---- SCREEN_ROUTE_CONTRACT.json 확인(5개 Screen 존재만 검증, 참고용) ----
    contract_screens: list[str] = []
    if CONTRACT_PATH.is_file():
        try:
            contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
            contract_screens = [s.get("screen_id", "") for s in contract.get("screens", [])]
        except (json.JSONDecodeError, OSError):
            contract_screens = []

    # ---- Expected Files 파싱 -> heavy surface(파일 충돌 판단용) ----
    heavy_surfaces: dict[str, set[str]] = defaultdict(set)
    surface_owners: dict[str, list[str]] = defaultdict(list)
    for tid in task_ids:
        for fp, verb in parse_expected_files(tid):
            if verb in ("modify", "replace_starter"):
                surf = normalize_surface(fp)
                heavy_surfaces[tid].add(surf)
                surface_owners[surf].append(tid)

    # ---- 그룹 배정 ----
    group_of_task = {tid: group_of(tid, rows[tid]) for tid in task_ids}
    tasks_by_group: dict[int, set[str]] = defaultdict(set)
    for tid, g in group_of_task.items():
        tasks_by_group[g].add(tid)

    # ---- 그룹별 layer 계산 후 Wave chunk 생성 ----
    wave_id_of: dict[str, str] = {}
    wave_records: list[dict] = []
    wave_no = 0

    for g in sorted(GROUP_TITLES.keys()):
        gtasks = tasks_by_group.get(g, set())
        if not gtasks:
            continue
        layers = compute_layers(gtasks, deps, topo)
        max_layer = max(layers.values(), default=0)
        for layer in range(max_layer + 1):
            layer_tasks = sorted([t for t in gtasks if layers[t] == layer])
            if not layer_tasks:
                continue
            for chunk in chunk_layer(layer_tasks, heavy_surfaces):
                wave_no += 1
                wid = f"W{wave_no:02d}"
                for tid in chunk:
                    wave_id_of[tid] = wid
                wave_records.append(
                    {
                        "wave_id": wid,
                        "group": g,
                        "group_title": GROUP_TITLES[g],
                        "layer": layer,
                        "task_ids": chunk,
                    }
                )

    # ---- 규칙 2 검증: 모든 의존 관계가 wave(dep) < wave(task) ----
    def wave_num(wid: str) -> int:
        return int(wid[1:])

    violations = []
    for tid in task_ids:
        for d in deps[tid]:
            if wave_num(wave_id_of[d]) >= wave_num(wave_id_of[tid]):
                violations.append((d, wave_id_of[d], tid, wave_id_of[tid]))
    if violations:
        for d, wd, t, wt in violations:
            print(f"BUILD_WAVES_FAIL — {d}({wd})가 {t}({wt})보다 앞서지 않음")
        return fail(f"BUILD_WAVES_FAIL — Wave 순서 위반 {len(violations)}건(출력 파일을 쓰지 않음)")

    # ---- 규칙 4 검증: Page Owner는 해당 Screen 그룹의 마지막 Wave의 마지막 Task ----
    page_owner_positions: dict[str, str] = {}
    page_owner_violations: list[str] = []
    for tid in task_ids:
        if rows[tid].get("category") != "PAGE_OWNER":
            continue
        g = group_of_task[tid]
        group_waves = [w for w in wave_records if w["group"] == g]
        last_wave = group_waves[-1]
        page_owner_positions[tid] = wave_id_of[tid]
        if wave_id_of[tid] != last_wave["wave_id"] or last_wave["task_ids"][-1] != tid:
            page_owner_violations.append(tid)
    if page_owner_violations:
        return fail(
            "BUILD_WAVES_FAIL — Page Owner가 소속 Screen 그룹의 마지막 Wave/마지막 순서가 아님: "
            f"{page_owner_violations}(출력 파일을 쓰지 않음)"
        )

    total = len(task_ids)
    today = date.today().isoformat()

    # ---- TASKS/TASK_DAG.md ----
    dag_lines = [
        "# Free Traveler — Task Dependency DAG",
        "",
        f"- **생성 기준일:** {today}",
        "- **생성 방법:** `python scripts/build_waves.py` — `TASKS/TASK_MANIFEST.csv`의 `depends_on`을 "
        "DFS(백엣지 탐지)로 순환 검사하고, 위상 정렬(Kahn) 순서를 산출했다.",
        f"- **Task 총수:** {total}개",
        f"- **순환 의존성:** {len(cycles)}건",
        f"- **SCREEN_ROUTE_CONTRACT.json Screen 수:** {len(contract_screens)}개 ({', '.join(contract_screens) or '확인 불가'})",
        "",
        "## Task별 의존 관계",
        "",
        "| Task ID | Group | Depends On | Depended On By |",
        "|---|---:|---|---|",
    ]
    for tid in task_ids:
        dep_str = ", ".join(deps[tid]) if deps[tid] else "(없음)"
        dependent_str = ", ".join(sorted(dependents.get(tid, []))) or "(없음)"
        dag_lines.append(f"| `{tid}` | {group_of_task[tid]} | {dep_str} | {dependent_str} |")
    dag_lines.append("")
    dag_lines.append("## 위상 정렬 실행 가능 순서(참고용, 실제 Wave 순서는 `WAVE_PLAN.md` 정본)")
    dag_lines.append("")
    dag_lines.append(", ".join(f"`{t}`" for t in topo))
    dag_lines.append("")
    TASK_DAG_PATH.write_text("\n".join(dag_lines) + "\n", encoding="utf-8")

    # ---- TASKS/WAVE_PLAN.md ----
    plan_lines = [
        "# Free Traveler — Wave Plan",
        "",
        "- **Document ID:** WAVEPLAN-TRAVEL-002",
        f"- **생성 기준일:** {today}",
        "- **생성 방법:** `python scripts/build_waves.py`. 입력은 `TASKS/TASK_MANIFEST.csv`, "
        "`TASKS/TASK-<ID>.md`(Expected Files), `design-reference/SCREEN_ROUTE_CONTRACT.json`이다. "
        "이 문서는 계획 문서이며 구현 코드를 만들지 않는다.",
        "- **Wave ID 규칙:** W00~W10으로 미리 고정하지 않았다 — 그룹이 Task 수(7개 초과) 또는 "
        "파일 충돌로 여러 Wave로 나뉜 만큼 W01부터 순차 부여했다. 이 문서와 `WAVE_STATE.json`의 "
        "Wave ID가 이후 단계(`/run-wave`, `/prepare-task`)의 정본이다.",
        f"- **Task 총수:** {total}개, **Wave 총수:** {len(wave_records)}개",
        "",
        "## Wave 그룹(사용자 지정 순서 1~10)",
        "",
        "| 그룹 | 내용 | 이 그룹의 Wave |",
        "|---:|---|---|",
    ]
    for g in sorted(GROUP_TITLES.keys()):
        group_waves = [w["wave_id"] for w in wave_records if w["group"] == g]
        plan_lines.append(f"| {g} | {GROUP_TITLES[g]} | {', '.join(group_waves) or '(해당 Task 없음)'} |")
    plan_lines.append("")
    plan_lines.append("## Wave 요약")
    plan_lines.append("")
    plan_lines.append("| Wave | 그룹 | Task 수 | Page Owner | 4~7 기본 범위 |")
    plan_lines.append("|---|---|---:|---|---|")
    for w in wave_records:
        owners = [t for t in w["task_ids"] if rows[t].get("category") == "PAGE_OWNER"]
        owner_str = ", ".join(f"`{o}`" for o in owners) if owners else "—"
        in_range = "예" if TARGET_MIN_WAVE_SIZE <= len(w["task_ids"]) <= MAX_WAVE_SIZE else "아니오(의존 사슬로 축소)"
        plan_lines.append(f"| {w['wave_id']} | {w['group']} | {len(w['task_ids'])} | {owner_str} | {in_range} |")
    plan_lines.append("")
    plan_lines.append("---")
    plan_lines.append("")

    for w in wave_records:
        g = w["group"]
        is_last_in_group = w["wave_id"] == [x["wave_id"] for x in wave_records if x["group"] == g][-1]
        plan_lines.append(f"## {w['wave_id']} — 그룹 {g}: {GROUP_TITLES[g]} (layer {w['layer']})")
        plan_lines.append("")
        if g in SCREEN_TO_GROUP.values() and is_last_in_group:
            screen_id = [s for s, gg in SCREEN_TO_GROUP.items() if gg == g][0]
            plan_lines.append(
                f"- **Preview Checkpoint:** 이 Wave가 `completed`되면(Page Owner 포함) {screen_id} 화면을 "
                "사람이 Preview로 확인하기 전까지 다음 그룹으로 자동 진행하지 않는다(`CLAUDE.md` 규칙 22)."
            )
        elif g == 10:
            plan_lines.append(
                "- **Preview Checkpoint:** 5개 Screen이 모두 확인된 뒤 `/release-check`로 "
                "`RELEASE_READY` 여부를 최종 판정한다."
            )
        else:
            plan_lines.append("- **Preview Checkpoint:** 없음(그룹 내부 Wave).")
        plan_lines.append("")
        plan_lines.append("| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |")
        plan_lines.append("|---:|---|---|---|")
        for i, tid in enumerate(w["task_ids"], start=1):
            dep_str = ", ".join(deps[tid]) if deps[tid] else "(없음)"
            plan_lines.append(f"| {i} | `{tid}` | {rows[tid].get('category','')} | {dep_str} |")
        plan_lines.append("")

    plan_lines.append("---")
    plan_lines.append("")
    plan_lines.append("## 편성 규칙 적용 메모")
    plan_lines.append("")
    plan_lines.append(
        "- 각 Wave 안에는 서로 의존하는 Task 쌍이 존재하지 않는다(모든 의존 관계는 "
        "`wave(선행) < wave(후행)`을 엄격히 만족) — 규칙 2 검증을 통과했다."
    )
    plan_lines.append(
        "- Expected Files가 `modify`/`replace_starter`로 크게 겹치는 Task는 같은 Wave에 배치하지 않았다(규칙 5)."
    )
    undersized = [w for w in wave_records if len(w["task_ids"]) < TARGET_MIN_WAVE_SIZE]
    if undersized:
        plan_lines.append(
            f"- 기본 4~7개 범위보다 작은 Wave {len(undersized)}개"
            f"({', '.join(w['wave_id'] for w in undersized)})는 Depends On 사슬(예: DB Schema→RLS→Access, "
            "동행 목록→상세→신청, Page Owner 단독 통합)이 강제한 결과다 — 같은 Wave 안에 의존 관계를 "
            "만들지 않기 위해 의도적으로 분리했다."
        )
    plan_lines.append("")
    WAVE_PLAN_PATH.write_text("\n".join(plan_lines) + "\n", encoding="utf-8")

    # ---- TASKS/WAVE_STATE.json ----
    state = {
        "schema_version": SCHEMA_VERSION,
        "generated_at": today,
        "waves": [],
    }
    for w in wave_records:
        g = w["group"]
        is_last_in_group = w["wave_id"] == [x["wave_id"] for x in wave_records if x["group"] == g][-1]
        checkpoint_required = (g in SCREEN_TO_GROUP.values() and is_last_in_group) or g == 10
        state["waves"].append(
            {
                "wave_id": w["wave_id"],
                "title": f"그룹 {g}: {GROUP_TITLES[g]} (layer {w['layer']})",
                "task_ids": w["task_ids"],
                "status": "pending",
                "checkpoint_required": checkpoint_required,
                "checkpoint_result": None,
            }
        )
    WAVE_STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # ---- TASK_MANIFEST.csv에 wave_id 열 추가 ----
    out_fieldnames = fieldnames + ["wave_id"]
    with MANIFEST_PATH.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=out_fieldnames)
        writer.writeheader()
        for tid in task_ids:
            row = {k: rows[tid].get(k, "") for k in fieldnames}
            row["wave_id"] = wave_id_of[tid]
            writer.writerow(row)

    # ---- 종료 출력 ----
    print("# Wave Build Report")
    print("")
    print(f"- 순환 의존성 수: {len(cycles)}")
    print(f"- Task 총수: {total}")
    print(f"- Wave 총수: {len(wave_records)}")
    print("")
    print("## Wave별 Task 수")
    for w in wave_records:
        flag = "" if TARGET_MIN_WAVE_SIZE <= len(w["task_ids"]) <= MAX_WAVE_SIZE else " (기본 4~7 범위 밖 — 의존 사슬로 축소)"
        print(f"  - {w['wave_id']} (그룹 {w['group']}: {GROUP_TITLES[w['group']]}): {len(w['task_ids'])}개{flag}")
    print("")
    print("## Page Owner 위치")
    for tid, wid in page_owner_positions.items():
        print(f"  - {tid} -> {wid}")
    print("")
    print(f"- 출력: {TASK_DAG_PATH.relative_to(REPO_ROOT)}, {WAVE_PLAN_PATH.relative_to(REPO_ROOT)}, "
          f"{WAVE_STATE_PATH.relative_to(REPO_ROOT)}, {MANIFEST_PATH.relative_to(REPO_ROOT)}(wave_id 열 추가)")
    print("")
    print("BUILD_WAVES_PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
