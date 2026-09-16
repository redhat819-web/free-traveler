# Free Traveler — Wave Plan

- **Document ID:** WAVEPLAN-TRAVEL-002
- **생성 기준일:** 2026-09-16
- **생성 방법:** `python scripts/build_waves.py`. 입력은 `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK-<ID>.md`(Expected Files), `design-reference/SCREEN_ROUTE_CONTRACT.json`이다. 이 문서는 계획 문서이며 구현 코드를 만들지 않는다.
- **Wave ID 규칙:** W00~W10으로 미리 고정하지 않았다 — 그룹이 Task 수(7개 초과) 또는 파일 충돌로 여러 Wave로 나뉜 만큼 W01부터 순차 부여했다. 이 문서와 `WAVE_STATE.json`의 Wave ID가 이후 단계(`/run-wave`, `/prepare-task`)의 정본이다.
- **Task 총수:** 65개, **Wave 총수:** 24개

## Wave 그룹(사용자 지정 순서 1~10)

| 그룹 | 내용 | 이 그룹의 Wave |
|---:|---|---|
| 1 | Scaffold, 문서, Harness 확인 | W01 |
| 2 | Airbnb 스타일 공통 UI, 정적 데이터, Layout | W02, W03 |
| 3 | Supabase Auth, 6개 Table, 기본 RLS | W04, W05, W06 |
| 4 | SCR-001 메인 Component와 Page Owner | W07, W08 |
| 5 | SCR-002 대표 소개 Component와 Page Owner | W09, W10 |
| 6 | SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner | W11, W12, W13 |
| 7 | SCR-004 동행 목록·상세·신청 Component와 Page Owner | W14, W15, W16, W17, W18 |
| 8 | SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner | W19, W20 |
| 9 | Unit·Playwright·접근성·CI | W21, W22, W23 |
| 10 | Vercel Preview와 Release 확인 | W24 |

## Wave 요약

| Wave | 그룹 | Task 수 | Page Owner | 4~7 기본 범위 |
|---|---|---:|---|---|
| W01 | 1 | 1 | — | 아니오(의존 사슬로 축소) |
| W02 | 2 | 6 | — | 예 |
| W03 | 2 | 1 | — | 아니오(의존 사슬로 축소) |
| W04 | 3 | 1 | — | 아니오(의존 사슬로 축소) |
| W05 | 3 | 2 | — | 아니오(의존 사슬로 축소) |
| W06 | 3 | 2 | — | 아니오(의존 사슬로 축소) |
| W07 | 4 | 7 | — | 예 |
| W08 | 4 | 1 | `PAGE-SCR001` | 아니오(의존 사슬로 축소) |
| W09 | 5 | 7 | — | 예 |
| W10 | 5 | 1 | `PAGE-SCR002` | 아니오(의존 사슬로 축소) |
| W11 | 6 | 5 | — | 예 |
| W12 | 6 | 1 | — | 아니오(의존 사슬로 축소) |
| W13 | 6 | 1 | `PAGE-SCR003` | 아니오(의존 사슬로 축소) |
| W14 | 7 | 3 | — | 아니오(의존 사슬로 축소) |
| W15 | 7 | 1 | — | 아니오(의존 사슬로 축소) |
| W16 | 7 | 1 | — | 아니오(의존 사슬로 축소) |
| W17 | 7 | 2 | — | 아니오(의존 사슬로 축소) |
| W18 | 7 | 1 | `PAGE-SCR004` | 아니오(의존 사슬로 축소) |
| W19 | 8 | 4 | — | 예 |
| W20 | 8 | 1 | `PAGE-SCR005` | 아니오(의존 사슬로 축소) |
| W21 | 9 | 7 | — | 예 |
| W22 | 9 | 5 | — | 예 |
| W23 | 9 | 3 | — | 아니오(의존 사슬로 축소) |
| W24 | 10 | 1 | — | 아니오(의존 사슬로 축소) |

---

## W01 — 그룹 1: Scaffold, 문서, Harness 확인 (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CI-PIPELINE` | CI | (없음) |

## W02 — 그룹 2: Airbnb 스타일 공통 UI, 정적 데이터, Layout (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `DATA-DESTINATIONS` | DATA | (없음) |
| 2 | `DATA-REPRESENTATIVE` | DATA | (없음) |
| 3 | `DATA-SAFETY` | DATA | (없음) |
| 4 | `GLOBAL-NAV-FOOTER` | GLOBAL | (없음) |
| 5 | `GLOBAL-RESPONSIVE` | GLOBAL | (없음) |
| 6 | `GLOBAL-TOAST` | GLOBAL | (없음) |

## W03 — 그룹 2: Airbnb 스타일 공통 UI, 정적 데이터, Layout (layer 1)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `DATA-VALIDATION-SCRIPT` | DATA | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE |

## W04 — 그룹 3: Supabase Auth, 6개 Table, 기본 RLS (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `DB-SCHEMA-BASE` | DB | (없음) |

## W05 — 그룹 3: Supabase Auth, 6개 Table, 기본 RLS (layer 1)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `DB-RLS-BASE` | DB | DB-SCHEMA-BASE |
| 2 | `DB-SEED-BASE` | DB | DB-SCHEMA-BASE |

## W06 — 그룹 3: Supabase Auth, 6개 Table, 기본 RLS (layer 2)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR005-AUTH` | AUTH | DB-SCHEMA-BASE, DB-RLS-BASE |
| 2 | `DB-ACCESS` | DB | DB-SCHEMA-BASE, DB-RLS-BASE |

## W07 — 그룹 4: SCR-001 메인 Component와 Page Owner (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR001-DESTINATION-DRAWER` | COMPONENT | DATA-DESTINATIONS, DATA-SAFETY |
| 2 | `CMP-SCR001-DESTINATION-GRID` | COMPONENT | DATA-DESTINATIONS |
| 3 | `CMP-SCR001-FAVORITES` | COMPONENT | (없음) |
| 4 | `CMP-SCR001-RECENT-MATES` | COMPONENT | DB-ACCESS |
| 5 | `CMP-SCR001-SAFETY-PANEL` | COMPONENT | DATA-SAFETY |
| 6 | `CMP-SCR001-SEARCH-HERO` | COMPONENT | DATA-DESTINATIONS |
| 7 | `CMP-SCR001-SHARE` | COMPONENT | (없음) |

## W08 — 그룹 4: SCR-001 메인 Component와 Page Owner (layer 1)

- **Preview Checkpoint:** 이 Wave가 `completed`되면(Page Owner 포함) SCR-001 화면을 사람이 Preview로 확인하기 전까지 다음 그룹으로 자동 진행하지 않는다(`CLAUDE.md` 규칙 22).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `PAGE-SCR001` | PAGE_OWNER | CMP-SCR001-SEARCH-HERO, CMP-SCR001-DESTINATION-GRID, CMP-SCR001-DESTINATION-DRAWER, CMP-SCR001-SAFETY-PANEL, CMP-SCR001-RECENT-MATES, CMP-SCR001-FAVORITES, CMP-SCR001-SHARE, DATA-DESTINATIONS, DATA-SAFETY, GLOBAL-NAV-FOOTER, GLOBAL-TOAST |

## W09 — 그룹 5: SCR-002 대표 소개 Component와 Page Owner (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR002-COUNTRY-CHIPS` | COMPONENT | DATA-REPRESENTATIVE |
| 2 | `CMP-SCR002-GALLERY` | COMPONENT | DATA-REPRESENTATIVE |
| 3 | `CMP-SCR002-MEMORABLE-CTA` | COMPONENT | DATA-REPRESENTATIVE |
| 4 | `CMP-SCR002-PHILOSOPHY` | COMPONENT | DATA-REPRESENTATIVE |
| 5 | `CMP-SCR002-PROFILE-HERO` | COMPONENT | DATA-REPRESENTATIVE |
| 6 | `CMP-SCR002-STATS` | COMPONENT | DATA-REPRESENTATIVE |
| 7 | `CMP-SCR002-TIMELINE` | COMPONENT | DATA-REPRESENTATIVE |

## W10 — 그룹 5: SCR-002 대표 소개 Component와 Page Owner (layer 1)

- **Preview Checkpoint:** 이 Wave가 `completed`되면(Page Owner 포함) SCR-002 화면을 사람이 Preview로 확인하기 전까지 다음 그룹으로 자동 진행하지 않는다(`CLAUDE.md` 규칙 22).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `PAGE-SCR002` | PAGE_OWNER | CMP-SCR002-PROFILE-HERO, CMP-SCR002-STATS, CMP-SCR002-PHILOSOPHY, CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRY-CHIPS, CMP-SCR002-GALLERY, CMP-SCR002-MEMORABLE-CTA, DATA-REPRESENTATIVE, GLOBAL-NAV-FOOTER |

## W11 — 그룹 6: SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR003-FLIGHT-FORM` | COMPONENT | (없음) |
| 2 | `CMP-SCR003-HOTEL-FORM` | COMPONENT | (없음) |
| 3 | `CMP-SCR003-INTRO` | COMPONENT | (없음) |
| 4 | `CMP-SCR003-MATE-COMPOSE` | COMPONENT | CMP-SCR005-AUTH, DB-ACCESS |
| 5 | `CMP-SCR003-TIPS` | COMPONENT | (없음) |

## W12 — 그룹 6: SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner (layer 1)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR003-TABS` | COMPONENT | CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM, CMP-SCR003-MATE-COMPOSE |

## W13 — 그룹 6: SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner (layer 2)

- **Preview Checkpoint:** 이 Wave가 `completed`되면(Page Owner 포함) SCR-003 화면을 사람이 Preview로 확인하기 전까지 다음 그룹으로 자동 진행하지 않는다(`CLAUDE.md` 규칙 22).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `PAGE-SCR003` | PAGE_OWNER | CMP-SCR003-INTRO, CMP-SCR003-TABS, CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM, CMP-SCR003-MATE-COMPOSE, CMP-SCR003-TIPS, CMP-SCR005-AUTH, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST |

## W14 — 그룹 7: SCR-004 동행 목록·상세·신청 Component와 Page Owner (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR004-BLOCK` | COMPONENT | CMP-SCR005-AUTH, DB-ACCESS |
| 2 | `CMP-SCR004-FILTER` | COMPONENT | DB-ACCESS |
| 3 | `CMP-SCR004-INTRO` | COMPONENT | (없음) |

## W15 — 그룹 7: SCR-004 동행 목록·상세·신청 Component와 Page Owner (layer 1)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR004-LIST` | COMPONENT | DB-ACCESS, CMP-SCR004-FILTER |

## W16 — 그룹 7: SCR-004 동행 목록·상세·신청 Component와 Page Owner (layer 2)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR004-DETAIL` | COMPONENT | DB-ACCESS, CMP-SCR004-LIST |

## W17 — 그룹 7: SCR-004 동행 목록·상세·신청 Component와 Page Owner (layer 3)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR004-JOIN-REQUEST` | COMPONENT | CMP-SCR005-AUTH, DB-ACCESS, CMP-SCR004-DETAIL |
| 2 | `CMP-SCR004-REPORT` | COMPONENT | CMP-SCR005-AUTH, DB-ACCESS, CMP-SCR004-DETAIL |

## W18 — 그룹 7: SCR-004 동행 목록·상세·신청 Component와 Page Owner (layer 4)

- **Preview Checkpoint:** 이 Wave가 `completed`되면(Page Owner 포함) SCR-004 화면을 사람이 Preview로 확인하기 전까지 다음 그룹으로 자동 진행하지 않는다(`CLAUDE.md` 규칙 22).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `PAGE-SCR004` | PAGE_OWNER | CMP-SCR004-INTRO, CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-DETAIL, CMP-SCR004-JOIN-REQUEST, CMP-SCR004-REPORT, CMP-SCR004-BLOCK, CMP-SCR005-AUTH, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST |

## W19 — 그룹 8: SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `CMP-SCR005-ADMIN` | COMPONENT | CMP-SCR005-AUTH, DB-ACCESS |
| 2 | `CMP-SCR005-MY-ACTIVITY` | COMPONENT | CMP-SCR005-AUTH, DB-ACCESS |
| 3 | `CMP-SCR005-POLICY-PAGES` | COMPONENT | (없음) |
| 4 | `CMP-SCR005-PROFILE` | COMPONENT | CMP-SCR005-AUTH, DB-ACCESS |

## W20 — 그룹 8: SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner (layer 1)

- **Preview Checkpoint:** 이 Wave가 `completed`되면(Page Owner 포함) SCR-005 화면을 사람이 Preview로 확인하기 전까지 다음 그룹으로 자동 진행하지 않는다(`CLAUDE.md` 규칙 22).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `PAGE-SCR005` | PAGE_OWNER | CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-ADMIN, CMP-SCR005-POLICY-PAGES, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST |

## W21 — 그룹 9: Unit·Playwright·접근성·CI (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `E2E-MATE-AUTH` | E2E_TEST | PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SEED-BASE |
| 2 | `E2E-TRAVEL-TOOLS` | E2E_TEST | PAGE-SCR003 |
| 3 | `GLOBAL-A11Y` | GLOBAL | (없음) |
| 4 | `GLOBAL-ERROR-PAGES` | GLOBAL | GLOBAL-NAV-FOOTER |
| 5 | `GLOBAL-PERF` | GLOBAL | (없음) |
| 6 | `GLOBAL-SEO-META` | GLOBAL | (없음) |
| 7 | `MANUAL-CHECK-CLIENT-STATE` | MANUAL_CHECK | CMP-SCR001-FAVORITES, CMP-SCR001-SHARE, GLOBAL-TOAST |

## W22 — 그룹 9: Unit·Playwright·접근성·CI (layer 0)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `MANUAL-CHECK-RESPONSIVE` | MANUAL_CHECK | GLOBAL-RESPONSIVE |
| 2 | `TEST-RLS-BASIC` | INTEGRATION_TEST | DB-RLS-BASE, DB-ACCESS |
| 3 | `UNIT-CONTACT-DETECTION` | UNIT_TEST | CMP-SCR003-MATE-COMPOSE |
| 4 | `UNIT-MATE-STATE` | UNIT_TEST | CMP-SCR004-JOIN-REQUEST, CMP-SCR004-DETAIL, CMP-SCR005-MY-ACTIVITY |
| 5 | `UNIT-TRAVEL-DATES` | UNIT_TEST | CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM |

## W23 — 그룹 9: Unit·Playwright·접근성·CI (layer 1)

- **Preview Checkpoint:** 없음(그룹 내부 Wave).

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `E2E-PUBLIC-SMOKE` | E2E_TEST | PAGE-SCR001, PAGE-SCR002, PAGE-SCR004, GLOBAL-ERROR-PAGES |
| 2 | `MANUAL-CHECK-A11Y` | MANUAL_CHECK | GLOBAL-A11Y |
| 3 | `MANUAL-CHECK-PERF-SEO` | MANUAL_CHECK | GLOBAL-PERF, GLOBAL-SEO-META |

## W24 — 그룹 10: Vercel Preview와 Release 확인 (layer 0)

- **Preview Checkpoint:** 5개 Screen이 모두 확인된 뒤 `/release-check`로 `RELEASE_READY` 여부를 최종 판정한다.

| 실행 순서(Task ID 오름차순) | Task ID | Category | Depends On |
|---:|---|---|---|
| 1 | `RELEASE-CHECK-VERCEL-SUPABASE` | RELEASE_CHECK | PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, CI-PIPELINE |

---

## 편성 규칙 적용 메모

- 각 Wave 안에는 서로 의존하는 Task 쌍이 존재하지 않는다(모든 의존 관계는 `wave(선행) < wave(후행)`을 엄격히 만족) — 규칙 2 검증을 통과했다.
- Expected Files가 `modify`/`replace_starter`로 크게 겹치는 Task는 같은 Wave에 배치하지 않았다(규칙 5).
- 기본 4~7개 범위보다 작은 Wave 17개(W01, W03, W04, W05, W06, W08, W10, W12, W13, W14, W15, W16, W17, W18, W20, W23, W24)는 Depends On 사슬(예: DB Schema→RLS→Access, 동행 목록→상세→신청, Page Owner 단독 통합)이 강제한 결과다 — 같은 Wave 안에 의존 관계를 만들지 않기 위해 의도적으로 분리했다.

