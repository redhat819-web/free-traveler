#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
check_screen_contract.py

design-reference/SCREEN_ROUTE_CONTRACT.json, TASKS/TASK_MANIFEST.csv,
src/app 디렉터리를 대조해 Screen/Route/Page Owner 구성이 계약과 일치하는지 검사한다.

성공 시: CHECK_SCREEN_CONTRACT_PASS 출력, exit 0.
실패 시: [파일 / 화면 ID / 수정 힌트] 형식의 오류를 stdout에 출력, exit 1.

사용법:
  python scripts/check_screen_contract.py --mode=plan
  python scripts/check_screen_contract.py --mode=ci
  python scripts/check_screen_contract.py --mode=release
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent

CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = REPO_ROOT / "TASKS" / "TASK_MANIFEST.csv"
SRC_APP_DIR = REPO_ROOT / "src" / "app"
PREVIEW_CHECK_DIR = REPO_ROOT / "docs" / "preview-checks"

HARNESS_SCHEMA = "traveler-screen-route-v1"

FIXED_SCREENS = {
    "SCR-001": "/",
    "SCR-002": "/about",
    "SCR-003": "/travel-tools",
    "SCR-004": "/mates",
    "SCR-005": "/account",
}

# 사용자 화면으로 세지 않는 허용 기술 경로 (glob-ish prefix 매칭)
ALLOWED_TECHNICAL_ROUTE_PREFIXES = [
    "auth/callback",
    "api/",
    "not-found",
]

# SCR-003은 여행 입력(항공/숙소)과 동행 작성 양쪽 요구를 모두 포함해야 한다.
SCR003_FLIGHT_HOTEL_KEYWORDS = ["항공", "숙박", "숙소"]
SCR003_MATE_KEYWORDS = ["동행"]

# 여행지 상세/안전정보를 별도 Page로 만들었는지 의심되는 경로 패턴
FORBIDDEN_NEW_PAGE_HINTS = [
    "destination",
    "destinations",
    "safety",
]


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []

    def error(self, file: str, screen_id: str, hint: str) -> None:
        self.errors.append(f"[{file} / {screen_id} / {hint}]")

    @property
    def ok(self) -> bool:
        return not self.errors


def load_contract(report: Report) -> dict | None:
    if not CONTRACT_PATH.is_file():
        report.error(str(CONTRACT_PATH), "-", "SCREEN_ROUTE_CONTRACT.json 파일을 생성하세요.")
        return None
    try:
        data = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        report.error(str(CONTRACT_PATH), "-", f"JSON 파싱 오류를 수정하세요: {exc}")
        return None

    schema_version = data.get("schema_version")
    if schema_version != HARNESS_SCHEMA:
        report.error(
            str(CONTRACT_PATH),
            "-",
            f"schema_version을 '{HARNESS_SCHEMA}'로 맞추세요 (현재: {schema_version!r}).",
        )
        return None
    return data


def load_manifest(report: Report) -> list[dict]:
    if not MANIFEST_PATH.is_file():
        report.error(str(MANIFEST_PATH), "-", "TASK_MANIFEST.csv 파일을 생성하세요.")
        return []
    with MANIFEST_PATH.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    return rows


def strip_backticks(value: str | None) -> str:
    if not value:
        return ""
    return value.strip().strip("`").strip()


def check_fixed_screens(contract: dict, report: Report) -> dict[str, dict]:
    """계약에 정확히 5개 고정 화면이 존재하는지 검사하고 screen_id -> screen dict 반환."""
    screens = contract.get("screens", [])
    by_id: dict[str, dict] = {}
    for screen in screens:
        screen_id = screen.get("screen_id")
        if screen_id:
            by_id.setdefault(screen_id, screen)

    if len(screens) != 5 or set(FIXED_SCREENS) != set(by_id):
        report.error(
            str(CONTRACT_PATH),
            "-",
            f"고정 화면 5개({', '.join(FIXED_SCREENS)})와 정확히 일치하도록 screens 배열을 수정하세요 "
            f"(현재: {sorted(by_id)}).",
        )

    for screen_id, expected_route in FIXED_SCREENS.items():
        screen = by_id.get(screen_id)
        if screen is None:
            report.error(str(CONTRACT_PATH), screen_id, f"{screen_id} 항목을 screens 배열에 추가하세요.")
            continue
        actual_route = screen.get("route")
        if actual_route != expected_route:
            report.error(
                str(CONTRACT_PATH),
                screen_id,
                f"route를 '{expected_route}'로 수정하세요 (현재: {actual_route!r}).",
            )

    return by_id


def check_page_owner_uniqueness(manifest_rows: list[dict], report: Report) -> dict[str, list[dict]]:
    """각 화면의 Page Owner Task가 정확히 하나인지 검사하고 screen_id -> PAGE_OWNER rows 반환."""
    owners_by_screen: dict[str, list[dict]] = {sid: [] for sid in FIXED_SCREENS}
    for row in manifest_rows:
        if row.get("category") == "PAGE_OWNER":
            screen_id = row.get("screen", "").strip()
            if screen_id in owners_by_screen:
                owners_by_screen[screen_id].append(row)

    for screen_id, owners in owners_by_screen.items():
        if len(owners) != 1:
            task_ids = [r.get("task_id", "") for r in owners]
            report.error(
                str(MANIFEST_PATH),
                screen_id,
                f"{screen_id}의 PAGE_OWNER Task가 정확히 1개여야 합니다 (현재 {len(owners)}개: {task_ids}). "
                "TASK_MANIFEST.csv의 category=PAGE_OWNER 행을 정리하세요.",
            )

    return owners_by_screen


def check_page_owner_route_and_entry(
    owners_by_screen: dict[str, list[dict]], report: Report
) -> None:
    for screen_id, expected_route in FIXED_SCREENS.items():
        owners = owners_by_screen.get(screen_id, [])
        if len(owners) != 1:
            continue
        row = owners[0]
        route = strip_backticks(row.get("route"))
        page_entry = strip_backticks(row.get("page_entry"))
        expected_entry = f"src/app/{('' if screen_id == 'SCR-001' else expected_route.strip('/') + '/')}page.tsx"
        if route != expected_route:
            report.error(
                str(MANIFEST_PATH),
                screen_id,
                f"Task '{row.get('task_id')}'의 route를 '{expected_route}'로 수정하세요 (현재: {route!r}).",
            )
        if page_entry != expected_entry:
            report.error(
                str(MANIFEST_PATH),
                screen_id,
                f"Task '{row.get('task_id')}'의 page_entry를 '{expected_entry}'로 수정하세요 (현재: {page_entry!r}).",
            )


def is_technical_route(rel_posix: str) -> bool:
    return any(rel_posix.startswith(prefix) for prefix in ALLOWED_TECHNICAL_ROUTE_PREFIXES)


def check_no_extra_pages(report: Report) -> list[Path]:
    """src/app 아래 5개 고정 화면 + 허용 기술 경로 외의 page.tsx를 검출한다."""
    if not SRC_APP_DIR.is_dir():
        report.error(str(SRC_APP_DIR), "-", "src/app 디렉터리가 존재하지 않습니다.")
        return []

    allowed_page_entries = {
        f"app/{route.strip('/')}/page.tsx" if route != "/" else "app/page.tsx"
        for route in FIXED_SCREENS.values()
    }

    extra_pages: list[Path] = []
    for page_file in SRC_APP_DIR.rglob("page.tsx"):
        rel_from_src = page_file.relative_to(REPO_ROOT / "src").as_posix()
        if rel_from_src in allowed_page_entries:
            continue
        rel_from_app = page_file.relative_to(SRC_APP_DIR).as_posix()
        if is_technical_route(rel_from_app):
            continue
        extra_pages.append(page_file)

    for page_file in extra_pages:
        rel_posix = page_file.relative_to(REPO_ROOT / "src").as_posix()
        hint_lower = rel_posix.lower()
        if any(keyword in hint_lower for keyword in FORBIDDEN_NEW_PAGE_HINTS):
            report.error(
                str(page_file.relative_to(REPO_ROOT)),
                "-",
                "여행지 상세/안전정보는 새 Page(Route)로 만들지 않고 SCR-001 Drawer 등 기존 화면 내 "
                "상태로 구현하세요 (규칙 4, prohibited_features 참고).",
            )
        else:
            report.error(
                str(page_file.relative_to(REPO_ROOT)),
                "-",
                "SCREEN_ROUTE_CONTRACT.json에 없는 신규 Page입니다. 고정 5개 화면 또는 허용 기술 경로 "
                f"({', '.join(ALLOWED_TECHNICAL_ROUTE_PREFIXES)}) 범위 안에서만 Page를 생성하세요.",
            )

    return extra_pages


def check_implemented_pages_exist(owners_by_screen: dict[str, list[dict]], report: Report) -> None:
    """ci/release 모드: Page Owner Task가 가리키는 page.tsx가 실제 구현되었는지 검사."""
    for screen_id, expected_route in FIXED_SCREENS.items():
        expected_entry_rel = (
            "src/app/page.tsx"
            if screen_id == "SCR-001"
            else f"src/app/{expected_route.strip('/')}/page.tsx"
        )
        entry_path = REPO_ROOT / expected_entry_rel
        owners = owners_by_screen.get(screen_id, [])
        detail_exists = owners and owners[0].get("detail_file_exists", "").strip().upper() == "Y"

        if not entry_path.is_file():
            if detail_exists:
                report.error(
                    expected_entry_rel,
                    screen_id,
                    f"{screen_id}의 Page 파일이 아직 구현되지 않았습니다. "
                    f"{expected_entry_rel}을 생성하고 Task를 조립하세요.",
                )
            continue


def check_scr003_dual_requirements(manifest_rows: list[dict], report: Report) -> None:
    scr003_rows = [row for row in manifest_rows if row.get("screen", "").strip() == "SCR-003"]
    titles = " ".join(row.get("title", "") for row in scr003_rows)
    task_ids_by_keyword_hit = {
        "flight_hotel": [
            row.get("task_id")
            for row in scr003_rows
            if any(k in row.get("title", "") for k in SCR003_FLIGHT_HOTEL_KEYWORDS)
        ],
        "mate": [
            row.get("task_id")
            for row in scr003_rows
            if any(k in row.get("title", "") for k in SCR003_MATE_KEYWORDS)
        ],
    }

    if not task_ids_by_keyword_hit["flight_hotel"]:
        report.error(
            str(MANIFEST_PATH),
            "SCR-003",
            "SCR-003에 항공/숙소 여행 입력(Flight/Hotel Form)을 다루는 Task가 없습니다. "
            "TASK_MANIFEST.csv에 해당 Task를 추가하세요.",
        )
    if not task_ids_by_keyword_hit["mate"]:
        report.error(
            str(MANIFEST_PATH),
            "SCR-003",
            "SCR-003에 동행 작성(Mate Compose)을 다루는 Task가 없습니다. "
            "TASK_MANIFEST.csv에 해당 Task를 추가하세요.",
        )


def check_preview_checkpoints(report: Report) -> None:
    for screen_id in FIXED_SCREENS:
        checkpoint = PREVIEW_CHECK_DIR / f"{screen_id}.md"
        if not checkpoint.is_file():
            report.error(
                str(checkpoint.relative_to(REPO_ROOT)) if PREVIEW_CHECK_DIR.exists() else str(checkpoint),
                screen_id,
                f"{screen_id} Preview Checkpoint 문서가 없습니다. "
                f"docs/preview-checks/{screen_id}.md를 작성해 Preview 확인 결과를 기록하세요.",
            )


def main() -> int:
    parser = argparse.ArgumentParser(description="Screen/Route/Page Owner 계약 검사")
    parser.add_argument(
        "--mode",
        choices=["plan", "ci", "release"],
        default="plan",
        help="plan: Page Owner/경로 계획만 검사, ci: 구현된 Page/공개 경로 검사, "
        "release: ci 검사 + Preview Checkpoint 존재 여부",
    )
    args = parser.parse_args()

    report = Report()

    contract = load_contract(report)
    manifest_rows = load_manifest(report)

    if contract is not None:
        check_fixed_screens(contract, report)

    owners_by_screen = check_page_owner_uniqueness(manifest_rows, report)
    check_page_owner_route_and_entry(owners_by_screen, report)
    check_scr003_dual_requirements(manifest_rows, report)

    if args.mode in ("ci", "release"):
        check_no_extra_pages(report)
        check_implemented_pages_exist(owners_by_screen, report)

    if args.mode == "release":
        check_preview_checkpoints(report)

    if report.ok:
        print("CHECK_SCREEN_CONTRACT_PASS")
        print(f"mode={args.mode}")
        return 0

    print(f"CHECK_SCREEN_CONTRACT_FAIL (mode={args.mode})")
    for err in report.errors:
        print(err)
    return 1


if __name__ == "__main__":
    sys.exit(main())
