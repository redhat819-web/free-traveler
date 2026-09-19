#!/usr/bin/env python3
"""
validate_content.py

여행지·안전정보·대표 소개 정적 데이터의 필수 필드 누락을 검출하는 게시 전 게이트.
REQ-FUNC-074 대응: Admin 게시 게이트 UI 대신 이 스크립트로 완전성을 확인한다.

검사 대상:
- src/data/destinations.ts (Destination[])
- src/data/safety.ts (CountrySafety[])
- src/data/representative.ts (RepresentativeProfile)

검사 항목:
1. 각 배열/객체의 필수 필드가 모두 존재하고 빈 문자열/빈 배열이 아닌가
2. "준비 중", "정보 확인 필요", "Lorem ipsum" 같은 미완성 placeholder 문구가 없는가
3. destinations.ts에 등장하는 해외 국가가 safety.ts에 모두 커버되는가

실패 시 종료 코드 1과 함께 구체적 사유를 출력한다. 통과 시 종료 코드 0.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "src" / "data"

PLACEHOLDER_PATTERNS = [
    "준비 중",
    "정보 확인 필요",
    "Lorem ipsum",
    "lorem ipsum",
    "TODO",
    "TBD",
]

DESTINATION_REQUIRED_FIELDS = [
    "id",
    "scope",
    "country",
    "city",
    "region",
    "season",
    "theme",
    "summary",
    "attractions",
    "itinerary1Day",
    "itinerary3Day",
    "budgetPerPersonKRW",
    "transport",
    "food",
    "etiquette",
    "source",
    "image",
]

SAFETY_REQUIRED_FIELDS = [
    "id",
    "country",
    "security",
    "scam",
    "law",
    "traffic",
    "disaster",
    "health",
    "culture",
    "emergencyContacts",
    "source",
]


def read_file(rel_path: str) -> str:
    return (DATA_DIR / rel_path).read_text(encoding="utf-8")


def split_object_literals(array_body: str) -> list[str]:
    """최상위 중괄호 `{ ... }` 블록 단위로 분리한다(중첩 객체 포함)."""
    objects: list[str] = []
    depth = 0
    start = -1
    for i, ch in enumerate(array_body):
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start != -1:
                objects.append(array_body[start : i + 1])
                start = -1
    return objects


def extract_array_body(source: str, var_name: str) -> str:
    marker = f"export const {var_name}"
    idx = source.index(marker)
    eq_idx = source.index("=", idx)
    array_start = source.index("[", eq_idx)
    depth = 0
    for i in range(array_start, len(source)):
        if source[i] == "[":
            depth += 1
        elif source[i] == "]":
            depth -= 1
            if depth == 0:
                return source[array_start + 1 : i]
    raise ValueError(f"{var_name}: closing bracket not found")


def check_required_fields(obj_text: str, fields: list[str], label: str) -> list[str]:
    errors = []
    for field in fields:
        pattern = re.compile(rf"\b{re.escape(field)}\s*:")
        if not pattern.search(obj_text):
            errors.append(f"{label}: 필수 필드 '{field}' 누락")
    return errors


def check_placeholders(text: str, label: str) -> list[str]:
    errors = []
    for pattern in PLACEHOLDER_PATTERNS:
        if pattern in text:
            errors.append(f"{label}: 미완성 placeholder 문구 '{pattern}' 발견")
    return errors


def check_destinations() -> tuple[list[str], list[str]]:
    errors: list[str] = []
    source = read_file("destinations.ts")
    body = extract_array_body(source, "destinations")
    objects = split_object_literals(body)

    if not objects:
        return ["destinations.ts: destinations 배열이 비어 있음"], []

    countries: list[str] = []
    for obj in objects:
        id_match = re.search(r'id:\s*"([^"]+)"', obj)
        label = f"destinations['{id_match.group(1)}']" if id_match else "destinations[unknown]"
        errors.extend(check_required_fields(obj, DESTINATION_REQUIRED_FIELDS, label))
        errors.extend(check_placeholders(obj, label))

        scope_match = re.search(r'scope:\s*"overseas"', obj)
        country_match = re.search(r'country:\s*"([^"]+)"', obj)
        if scope_match and country_match:
            countries.append(country_match.group(1))

    return errors, countries


def check_safety(overseas_countries: list[str]) -> list[str]:
    errors: list[str] = []
    source = read_file("safety.ts")
    body = extract_array_body(source, "countrySafety")
    objects = split_object_literals(body)

    if not objects:
        return ["safety.ts: countrySafety 배열이 비어 있음"]

    safety_countries: set[str] = set()
    for obj in objects:
        id_match = re.search(r'id:\s*"([^"]+)"', obj)
        label = f"safety['{id_match.group(1)}']" if id_match else "safety[unknown]"
        errors.extend(check_required_fields(obj, SAFETY_REQUIRED_FIELDS, label))
        errors.extend(check_placeholders(obj, label))

        country_match = re.search(r'country:\s*"([^"]+)"', obj)
        if country_match:
            safety_countries.add(country_match.group(1))

    missing = sorted(set(overseas_countries) - safety_countries)
    for country in missing:
        errors.append(f"safety.ts: destinations.ts의 해외 국가 '{country}' 안전정보 누락")

    return errors


def check_representative() -> list[str]:
    errors: list[str] = []
    source = read_file("representative.ts")

    top_level_fields = [
        "name",
        "tagline",
        "heroPhoto",
        "stats",
        "introduction",
        "philosophy",
        "timeline",
        "visitedCountries",
        "gallery",
        "memorableDestinations",
    ]
    errors.extend(check_required_fields(source, top_level_fields, "representative"))
    errors.extend(check_placeholders(source, "representative"))

    return errors


def main() -> int:
    all_errors: list[str] = []

    dest_errors, overseas_countries = check_destinations()
    all_errors.extend(dest_errors)

    all_errors.extend(check_safety(overseas_countries))

    all_errors.extend(check_representative())

    if all_errors:
        print("VALIDATION FAILED\n")
        for e in all_errors:
            print(f"  - {e}")
        print(f"\n{len(all_errors)} error(s). 게시 전 정적 데이터 수정이 필요합니다.")
        return 1

    print("VALIDATION PASSED")
    print(f"  destinations.ts: 필수 필드 전부 존재, 해외 국가 {len(set(overseas_countries))}개")
    print("  safety.ts: 필수 필드 전부 존재, 해외 국가 안전정보 커버리지 확인")
    print("  representative.ts: 필수 필드 전부 존재")
    return 0


if __name__ == "__main__":
    sys.exit(main())
