#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
validate_harness.py

Free Traveler 저장소의 Harness 구성(CLAUDE.md, Skill, Command, 핵심 규칙 마커)이
실제로 존재하고 일관되는지 검사한다.

성공 시: stdout에 VALIDATE_HARNESS_PASS 출력, exit 0.
실패 시: 누락된 파일/규칙을 stdout에 출력, exit 1.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent

CLAUDE_MD = REPO_ROOT / "CLAUDE.md"
SKILL_MD = REPO_ROOT / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
COMMANDS_DIR = REPO_ROOT / ".claude" / "commands"
DESIGN_PATH = REPO_ROOT / "design-reference" / "D-001" / "DESIGN.md"
SCREEN_CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"

REQUIRED_COMMANDS = [
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
]

HARNESS_SCHEMA = "traveler-screen-route-v1"


class Report:
    def __init__(self) -> None:
        self.fails: list[str] = []
        self.passes: list[str] = []

    def check(self, label: str, ok: bool, fail_msg: str | None = None) -> None:
        if ok:
            self.passes.append(label)
        else:
            self.fails.append(fail_msg or label)


def read_text(path: Path) -> str:
    if not path.is_file():
        return ""
    return path.read_text(encoding="utf-8")


def all_docs_text() -> str:
    """CLAUDE.md + Skill + 모든 Command 파일 텍스트를 합쳐, 규칙 존재 여부를 넓게 검사한다."""
    parts = [read_text(CLAUDE_MD), read_text(SKILL_MD)]
    if COMMANDS_DIR.is_dir():
        for p in sorted(COMMANDS_DIR.glob("*.md")):
            parts.append(read_text(p))
    return "\n".join(parts)


def main() -> int:
    report = Report()
    check_count = 0

    def run(label: str, ok: bool, fail_msg: str | None = None) -> None:
        nonlocal check_count
        check_count += 1
        report.check(label, ok, fail_msg)

    # ---- 1. CLAUDE.md 존재 ----
    run(
        "1. CLAUDE.md 존재",
        CLAUDE_MD.is_file(),
        f"1. FAIL — 파일 없음: {CLAUDE_MD.relative_to(REPO_ROOT)}",
    )
    claude_text = read_text(CLAUDE_MD)

    # ---- 2. Claude Code Skill 파일 존재 ----
    run(
        "2. traveler-project-pipeline Skill 파일 존재",
        SKILL_MD.is_file(),
        f"2. FAIL — 파일 없음: {SKILL_MD.relative_to(REPO_ROOT)}",
    )
    skill_text = read_text(SKILL_MD)
    if SKILL_MD.is_file():
        fm = re.search(r"^---\s*\n(.*?)\n---", skill_text, flags=re.S)
        if not fm or "name: traveler-project-pipeline" not in fm.group(1):
            report.fails.append(
                f"2. FAIL — {SKILL_MD.relative_to(REPO_ROOT)}의 frontmatter에 "
                "'name: traveler-project-pipeline'이 없음"
            )

    # ---- 3. 7개 Command 존재 ----
    missing_commands = []
    if not COMMANDS_DIR.is_dir():
        missing_commands = REQUIRED_COMMANDS[:]
    else:
        existing = {p.name for p in COMMANDS_DIR.glob("*.md")}
        missing_commands = [c for c in REQUIRED_COMMANDS if c not in existing]
    run(
        f"3. 필수 Command 7개 존재 ({', '.join(REQUIRED_COMMANDS)})",
        not missing_commands,
        f"3. FAIL — 누락된 Command: {missing_commands}",
    )

    # ---- 4. traveler-screen-route-v1 Marker 존재 ----
    marker_hit = f"HARNESS_SCHEMA={HARNESS_SCHEMA}" in claude_text or HARNESS_SCHEMA in claude_text
    run(
        f"4. HARNESS_SCHEMA 마커('{HARNESS_SCHEMA}') CLAUDE.md 내 존재",
        marker_hit,
        f"4. FAIL — CLAUDE.md에서 '{HARNESS_SCHEMA}' 마커를 찾지 못함",
    )

    # ---- 5. D-001 DESIGN 경로 일치 ----
    design_marker_hit = "DESIGN_PATH=design-reference/D-001/DESIGN.md" in claude_text
    design_file_exists = DESIGN_PATH.is_file()
    run(
        "5. DESIGN_PATH 마커가 실제 design-reference/D-001/DESIGN.md와 일치",
        design_marker_hit and design_file_exists,
        (
            f"5. FAIL — 마커 존재={design_marker_hit}, "
            f"실제 파일 존재={design_file_exists} ({DESIGN_PATH.relative_to(REPO_ROOT)})"
        ),
    )

    # ---- 6. Screen Contract 경로 일치 ----
    screen_marker_hit = (
        "SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json" in claude_text
    )
    screen_file_exists = SCREEN_CONTRACT_PATH.is_file()
    schema_ok = False
    if screen_file_exists:
        try:
            contract = json.loads(SCREEN_CONTRACT_PATH.read_text(encoding="utf-8"))
            schema_ok = contract.get("schema_version") == HARNESS_SCHEMA
        except (json.JSONDecodeError, OSError):
            schema_ok = False
    run(
        "6. SCREEN_CONTRACT 마커가 실제 SCREEN_ROUTE_CONTRACT.json과 일치(schema_version 포함)",
        screen_marker_hit and screen_file_exists and schema_ok,
        (
            f"6. FAIL — 마커 존재={screen_marker_hit}, 파일 존재={screen_file_exists}, "
            f"schema_version=={HARNESS_SCHEMA} 일치={schema_ok}"
        ),
    )

    combined = all_docs_text()

    # ---- 7. Page Owner 5개 규칙 존재 ----
    page_owner_rule = bool(
        re.search(r"Page\s*Owner", combined, flags=re.I)
        and re.search(r"5개|Screen당\s*1개|정확히\s*1개|정확히\s*5개", combined)
    )
    run(
        "7. Page Owner 5개(Screen당 1개) 규칙 존재",
        page_owner_rule,
        "7. FAIL — CLAUDE.md/Skill/Command 어디에서도 'Page Owner + 5개(Screen당 1개)' 규칙을 찾지 못함",
    )

    # ---- 8. DB Table 6개 기본 범위 존재 ----
    db_table_rule = bool(re.search(r"6개\s*Table|Table\s*6개|6개\s*테이블|DB\s*6개", combined))
    known_tables = ["member_profiles", "mate_applications", "mate_blocks", "mate_reports", "outbound_url_settings"]
    tables_named = sum(1 for t in known_tables if t in combined) >= 3
    run(
        "8. DB Table 6개 기본 범위 규칙 존재",
        db_table_rule and tables_named,
        f"8. FAIL — 6개 Table 문구 존재={db_table_rule}, 대표 테이블명 3개 이상 언급={tables_named}",
    )

    # ---- 9. 외부 입력 비저장 규칙 존재 ----
    no_transmit_rule = bool(
        re.search(r"(항공|숙소|Flight|Hotel).{0,40}(서버|DB|외부\s*URL|로그)", combined)
        and re.search(r"전달하지\s*않는다|전송하지\s*않는다|보내지\s*않는다|미전송|미전달", combined)
    )
    run(
        "9. 항공·숙소 외부 입력 비저장 규칙 존재",
        no_transmit_rule,
        "9. FAIL — 항공/숙소 입력값을 서버·DB·외부 URL·로그로 전달하지 않는다는 규칙 문구를 찾지 못함",
    )

    # ---- 10. Playwright Chromium Smoke 규칙 존재 ----
    playwright_rule = bool(
        re.search(r"Playwright", combined) and re.search(r"Chromium", combined, flags=re.I)
        and re.search(r"Smoke", combined, flags=re.I)
    )
    run(
        "10. Playwright Chromium Smoke 규칙 존재",
        playwright_rule,
        "10. FAIL — 'Playwright' + 'Chromium' + 'Smoke'가 함께 언급된 규칙을 찾지 못함",
    )

    # ---- 11. AUTO_MERGE=false ----
    auto_merge_false = "AUTO_MERGE=false" in claude_text
    auto_merge_true = "AUTO_MERGE=true" in claude_text
    run(
        "11. CLAUDE.md에 AUTO_MERGE=false 마커 존재(true 값 없음)",
        auto_merge_false and not auto_merge_true,
        f"11. FAIL — AUTO_MERGE=false 존재={auto_merge_false}, AUTO_MERGE=true 오염 여부={auto_merge_true}",
    )

    # ---- 12. AWS_ENABLED=false ----
    aws_false = "AWS_ENABLED=false" in claude_text
    aws_true = "AWS_ENABLED=true" in claude_text
    run(
        "12. CLAUDE.md에 AWS_ENABLED=false 마커 존재(true 값 없음)",
        aws_false and not aws_true,
        f"12. FAIL — AWS_ENABLED=false 존재={aws_false}, AWS_ENABLED=true 오염 여부={aws_true}",
    )

    # ---- 13. EXCLUDED 보호 규칙 존재 ----
    excluded_rule = bool(
        re.search(r"EXCLUDED", combined)
        and re.search(r"임의로\s*구현하지\s*않는다|상세\s*(구현\s*)?파일을?\s*만들지\s*않는다|구현하지\s*않는다", combined)
    )
    run(
        "13. EXCLUDED 보호 규칙 존재",
        excluded_rule,
        "13. FAIL — EXCLUDED 항목을 임의로 구현/생성하지 않는다는 보호 규칙을 찾지 못함",
    )

    # ---------------------------------------------------------------------
    print("# Harness Validation")
    print("")
    print(f"- Result: {'FAIL' if report.fails else 'PASS'}")
    print(f"- Checks run: {check_count}")
    print(f"- Checks passed: {len(report.passes)}")
    print(f"- Failures: {len(report.fails)}")
    print("")
    print("## PASS")
    for p in report.passes:
        print(f"- {p}")
    if not report.passes:
        print("- (none)")
    print("")
    print("## FAIL")
    if report.fails:
        for f in report.fails:
            print(f"- {f}")
    else:
        print("- (none)")
    print("")

    if report.fails:
        print(f"VALIDATE_HARNESS_FAIL ({len(report.fails)} failures / {check_count} checks)")
        return 1

    print(f"VALIDATE_HARNESS_PASS ({check_count} checks)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
