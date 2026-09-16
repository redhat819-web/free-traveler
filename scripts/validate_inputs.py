#!/usr/bin/env python3
"""
validate_inputs.py

Traveler Task Pipeline의 입력 검증 게이트.
`/gen-tasklist` 실행 전에 이 스크립트가 통과해야 한다.

검사 항목:
1. 필수 입력 문서가 모두 존재하는가
2. SCREEN_ROUTE_CONTRACT.json의 schema_version == HARNESS_SCHEMA("traveler-screen-route-v1")
3. screens 배열이 정확히 5개이고 route/page_entry 중복이 없는가
4. priority_summary에 core/supporting 구분이 존재하는가
5. UIUX_TRACEABILITY.md에 REQ-FUNC-001~080, REQ-NF-001~034 총 114개가 중복 없이
   있고, 각 행의 Implementation Status가 IMPLEMENT 또는 EXCLUDED 인가
6. 실제 src/app 파일 트리를 스캔해 각 Screen의 page_entry 존재 여부를 보고(정보성, 실패 아님)

실패 시 종료 코드 1과 함께 구체적 사유를 출력한다. 통과 시 종료 코드 0.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

HARNESS_SCHEMA = "traveler-screen-route-v1"
REPO_ROOT = Path(__file__).resolve().parent.parent

REQUIRED_FILES = [
    "docs/06_SRS_UIUX_REVISED.md",
    "docs/PROJECT_SCOPE.md",
    "docs/UIUX_TRACEABILITY.md",
    "design-reference/D-001/DESIGN.md",
    "design-reference/UI_CONTRACT.md",
    "design-reference/SCREEN_ROUTE_CONTRACT.json",
    "package.json",
]

EXPECTED_FUNC_COUNT = 80
EXPECTED_NF_COUNT = 34
EXPECTED_TOTAL = EXPECTED_FUNC_COUNT + EXPECTED_NF_COUNT
VALID_STATUSES = {"IMPLEMENT", "EXCLUDED"}


class ValidationError(Exception):
    pass


def check_required_files() -> list[str]:
    errors = []
    for rel in REQUIRED_FILES:
        if not (REPO_ROOT / rel).is_file():
            errors.append(f"missing required input file: {rel}")
    return errors


def load_screen_contract() -> dict:
    path = REPO_ROOT / "design-reference/SCREEN_ROUTE_CONTRACT.json"
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def check_screen_contract(contract: dict) -> list[str]:
    errors = []

    schema_version = contract.get("schema_version")
    if schema_version != HARNESS_SCHEMA:
        errors.append(
            f"schema_version mismatch: expected '{HARNESS_SCHEMA}', got '{schema_version}'"
        )

    screens = contract.get("screens", [])
    if len(screens) != 5:
        errors.append(f"screens array must contain exactly 5 entries, found {len(screens)}")

    ids = [s.get("screen_id") for s in screens]
    if len(ids) != len(set(ids)):
        errors.append("duplicate screen_id values found in screens array")

    routes = [s.get("route") for s in screens]
    if len(routes) != len(set(routes)):
        errors.append("duplicate route values found in screens array")

    page_entries = [s.get("page_entry") for s in screens]
    if len(page_entries) != len(set(page_entries)):
        errors.append("duplicate page_entry values found in screens array")

    priority_summary = contract.get("priority_summary", {})
    core = priority_summary.get("core", [])
    supporting = priority_summary.get("supporting", [])
    if not core:
        errors.append("priority_summary.core is empty; expected at least one core screen")
    if not supporting:
        errors.append("priority_summary.supporting is empty; expected at least one supporting screen")

    completion = contract.get("completion_criteria", {})
    for key in (
        "no_duplicate_routes",
        "no_duplicate_page_entries",
        "screen_count_equals_5",
        "core_supporting_split_present",
    ):
        if completion.get(key) is not True:
            errors.append(f"completion_criteria.{key} is not true in SCREEN_ROUTE_CONTRACT.json")

    return errors, screens


TRACE_ROW_RE = re.compile(
    r"^\|\s*(REQ-(?:FUNC|NF)-\d+)\s*\|\s*(IMPLEMENT|EXCLUDED)\s*\|"
)


def parse_traceability(path: Path) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    with path.open(encoding="utf-8") as f:
        for line in f:
            m = TRACE_ROW_RE.match(line.strip())
            if m:
                rows.append((m.group(1), m.group(2)))
    return rows


def check_traceability() -> list[str]:
    errors = []
    path = REPO_ROOT / "docs/UIUX_TRACEABILITY.md"
    rows = parse_traceability(path)

    ids = [r[0] for r in rows]
    if len(ids) != len(set(ids)):
        errors.append("UIUX_TRACEABILITY.md contains duplicate Requirement IDs")

    func_ids = {r for r in ids if r.startswith("REQ-FUNC-")}
    nf_ids = {r for r in ids if r.startswith("REQ-NF-")}

    if len(func_ids) != EXPECTED_FUNC_COUNT:
        errors.append(
            f"expected {EXPECTED_FUNC_COUNT} REQ-FUNC rows, found {len(func_ids)}"
        )
    if len(nf_ids) != EXPECTED_NF_COUNT:
        errors.append(f"expected {EXPECTED_NF_COUNT} REQ-NF rows, found {len(nf_ids)}")

    total = len(func_ids) + len(nf_ids)
    if total != EXPECTED_TOTAL:
        errors.append(f"expected {EXPECTED_TOTAL} total requirements, found {total}")

    for req_id, status in rows:
        if status not in VALID_STATUSES:
            errors.append(f"{req_id} has invalid Implementation Status '{status}'")

    return errors, rows


def report_page_entry_existence(screens: list[dict]) -> list[str]:
    info = []
    for s in screens:
        page_entry = s.get("page_entry")
        if not page_entry:
            continue
        exists = (REPO_ROOT / page_entry).is_file()
        state = "EXISTS" if exists else "MISSING (to be created)"
        info.append(f"  {s.get('screen_id')}: {page_entry} -> {state}")
    return info


def main() -> int:
    all_errors: list[str] = []

    all_errors.extend(check_required_files())

    screens: list[dict] = []
    if not any("SCREEN_ROUTE_CONTRACT.json" in e for e in all_errors):
        try:
            contract = load_screen_contract()
        except (json.JSONDecodeError, OSError) as exc:
            all_errors.append(f"failed to parse SCREEN_ROUTE_CONTRACT.json: {exc}")
        else:
            screen_errors, screens = check_screen_contract(contract)
            all_errors.extend(screen_errors)

    trace_errors: list[str] = []
    trace_rows: list[tuple[str, str]] = []
    if not any("UIUX_TRACEABILITY.md" in e for e in all_errors):
        trace_errors, trace_rows = check_traceability()
        all_errors.extend(trace_errors)

    if all_errors:
        print("VALIDATION FAILED\n")
        for e in all_errors:
            print(f"  - {e}")
        print(f"\n{len(all_errors)} error(s). Fix inputs before running /gen-tasklist.")
        return 1

    print("VALIDATION PASSED")
    print(f"  HARNESS_SCHEMA: {HARNESS_SCHEMA} (matched)")
    print(f"  Screens: {len(screens)} (5 expected)")
    print(f"  Requirements: {len(trace_rows)} (114 expected)")
    implement_count = sum(1 for _, status in trace_rows if status == "IMPLEMENT")
    excluded_count = sum(1 for _, status in trace_rows if status == "EXCLUDED")
    print(f"    IMPLEMENT: {implement_count}, EXCLUDED: {excluded_count}")
    print("  Page Entry existence (informational, not a failure condition):")
    for line in report_page_entry_existence(screens):
        print(line)
    return 0


if __name__ == "__main__":
    sys.exit(main())
