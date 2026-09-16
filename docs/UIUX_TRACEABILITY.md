# Free Traveler — UI/UX Traceability Matrix

- **Document ID:** UIUX-TRACE-TRAVEL-001
- **기반 문서:** `docs/02_SRS_BASELINE.md`(요구사항 원문), `docs/PROJECT_SCOPE.md`(IMPLEMENT/EXCLUDED 분류), `docs/03_UI_COVERAGE_ANALYSIS.md`(Screen 배치), `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`(Route·Page Entry), `docs/STITCH_VALIDATION_REPORT.md`
- **작성 기준일:** 2026-09-15
- **Requirement 총수:** 114 (REQ-FUNC-001~080 = 80건, REQ-NF-001~034 = 34건) — 전량 유지, 삭제 없음

## 열 정의

| 열 | 의미 |
|---|---|
| **Requirement** | `02_SRS_BASELINE.md` 요구사항 ID |
| **Implementation Status** | `PROJECT_SCOPE.md` 확정 분류: `IMPLEMENT` 또는 `EXCLUDED` |
| **Screen** | 배치된 승인 Screen(SCR-001~005), `전역(공통 레이아웃)`, `N/A(기술 Route)`, 또는 `N/A(제외)` |
| **Route** | Screen에 대응하는 Next.js Route (`design-reference/SCREEN_ROUTE_CONTRACT.json` 기준) |
| **Page Entry** | 대응 Page Entry 파일 경로 |
| **Task** | 구현 작업 ID. `docs/tasks/TASKLIST.json`(2026-09-15 `/gen-tasklist` 실행) 생성 후 IMPLEMENT 항목은 매핑된 실제 Task ID(복수면 쉼표 구분)로 갱신되었으며, EXCLUDED 항목은 작업 대상이 아니므로 `N/A(EXCLUDED)` |
| **Test** | 검증 식별자. `02_SRS_BASELINE.md` §5 Traceability의 `TC-FUNC-XXX`/`TC-NF-XXX` ID를 그대로 사용하되, 아직 실행되지 않았으므로 `(NOT_RUN)`을 병기. EXCLUDED는 `N/A(EXCLUDED)` |
| **Status** | 이 요구사항의 현재 처리 단계. IMPLEMENT는 `SCREEN_APPROVED_AWAITING_IMPLEMENTATION`(Screen·Route는 확정되었으나 코드 구현·테스트는 아직 수행되지 않음), EXCLUDED는 `EXCLUDED_CONFIRMED` |

이 문서 작성 시점 기준 어떤 Requirement도 구현·테스트가 완료되었다고 기록하지 않는다. Task/Test 열은 이후 Task 생성 및 구현 단계에서 실제 ID·결과로 갱신한다.

---

## F1. Destination Guide (REQ-FUNC-001~010) — SCR-001

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-02,TASK-PO-SCR-001,TASK-DATA-01 | TC-FUNC-001 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-002 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-02,TASK-CMP-SCR-001-03,TASK-PO-SCR-001 | TC-FUNC-002 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-003 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-01,TASK-PO-SCR-001 | TC-FUNC-003 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-004 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-04,TASK-PO-SCR-001,TASK-DATA-01 | TC-FUNC-004 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-005 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-02,TASK-PO-SCR-001 | TC-FUNC-005 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-006 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-04,TASK-PO-SCR-001,TASK-DATA-01 | TC-FUNC-006 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-007 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-04,TASK-PO-SCR-001,TASK-DATA-01 | TC-FUNC-007 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-008 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-02,TASK-PO-SCR-001,TASK-DATA-01 | TC-FUNC-008 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-009 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-02,TASK-PO-SCR-001,TASK-DATA-01 | TC-FUNC-009 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-010 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-01,TASK-PO-SCR-001 | TC-FUNC-010 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

## F2. Flight Link-out (REQ-FUNC-011~018) — SCR-003

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-03,TASK-PO-SCR-003 | TC-FUNC-011 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-012 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-03,TASK-PO-SCR-003 | TC-FUNC-012 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-013 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-03,TASK-PO-SCR-003 | TC-FUNC-013 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-014 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-03,TASK-PO-SCR-003 | TC-FUNC-014 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-015 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-03,TASK-CMP-SCR-003-06,TASK-PO-SCR-003 | TC-FUNC-015 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-016 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-05,TASK-PO-SCR-003 | TC-FUNC-016 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-017 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-03,TASK-PO-SCR-003,TASK-DB-03 | TC-FUNC-017 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-018 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-05,TASK-PO-SCR-003 | TC-FUNC-018 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

## F3. Hotel Link-out (REQ-FUNC-019~026) — SCR-003

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-04,TASK-PO-SCR-003 | TC-FUNC-019 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-020 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-04,TASK-PO-SCR-003 | TC-FUNC-020 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-021 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-04,TASK-PO-SCR-003 | TC-FUNC-021 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-022 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-04,TASK-PO-SCR-003 | TC-FUNC-022 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-023 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-04,TASK-CMP-SCR-003-06,TASK-PO-SCR-003 | TC-FUNC-023 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-024 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-05,TASK-PO-SCR-003 | TC-FUNC-024 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-025 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-04,TASK-PO-SCR-003,TASK-DB-03 | TC-FUNC-025 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-026 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-05,TASK-PO-SCR-003 | TC-FUNC-026 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

## F4. Travel Mate (REQ-FUNC-027~045) — SCR-003/004/005 (전역 REQ-FUNC-043 포함)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-01,TASK-PO-SCR-005,TASK-AUTH-01 | TC-FUNC-027 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-028 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-03,TASK-PO-SCR-005,TASK-AUTH-03 | TC-FUNC-028 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-029 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-03,TASK-PO-SCR-005 | TC-FUNC-029 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-030 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | TASK-CMP-SCR-004-02,TASK-PO-SCR-004 | TC-FUNC-030 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-031 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-07,TASK-PO-SCR-003 | TC-FUNC-031 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-032 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-07,TASK-PO-SCR-003 | TC-FUNC-032 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-033 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | TASK-CMP-SCR-004-04,TASK-PO-SCR-004,TASK-DB-03 | TC-FUNC-033 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-034 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | TASK-CMP-SCR-004-05,TASK-PO-SCR-004,TASK-DB-01 | TC-FUNC-034 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-035 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | TASK-CMP-SCR-004-05,TASK-PO-SCR-004,TASK-DB-01 | TC-FUNC-035 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-036 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-05,TASK-PO-SCR-005,TASK-DB-02 | TC-FUNC-036 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-037 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | TASK-CMP-SCR-004-03,TASK-PO-SCR-004,TASK-DB-03 | TC-FUNC-037 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-038 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-04,TASK-PO-SCR-005 | TC-FUNC-038 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-039 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | TASK-CMP-SCR-004-04,TASK-CMP-SCR-004-06,TASK-PO-SCR-004 | TC-FUNC-039 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-040 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-06,TASK-PO-SCR-005,TASK-DB-03 | TC-FUNC-040 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-041 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-07,TASK-PO-SCR-005,TASK-DB-03 | TC-FUNC-041 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-042 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-07,TASK-PO-SCR-005,TASK-DB-03 | TC-FUNC-042 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-043 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-01 | TC-FUNC-043 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-044 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-DB-02 | TC-FUNC-044 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-045 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-03,TASK-PO-SCR-005,TASK-DB-03 | TC-FUNC-045 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

## F5. Country Safety (REQ-FUNC-046~056) — SCR-001 (055·056 EXCLUDED)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-05,TASK-PO-SCR-001,TASK-DATA-02 | TC-FUNC-046 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-047 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-05,TASK-PO-SCR-001,TASK-DATA-02 | TC-FUNC-047 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-048 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-06,TASK-PO-SCR-001,TASK-DATA-02 | TC-FUNC-048 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-049 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-06,TASK-PO-SCR-001 | TC-FUNC-049 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-050 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-06,TASK-PO-SCR-001,TASK-DATA-02 | TC-FUNC-050 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-051 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-05,TASK-PO-SCR-001 | TC-FUNC-051 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-052 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-05,TASK-PO-SCR-001,TASK-DATA-02 | TC-FUNC-052 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-053 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-06,TASK-PO-SCR-001,TASK-DATA-02 | TC-FUNC-053 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-054 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-06,TASK-PO-SCR-001 | TC-FUNC-054 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-055 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-FUNC-056 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |

## F6. About free_traveler (REQ-FUNC-057~063) — SCR-002

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | TASK-CMP-SCR-002-01,TASK-CMP-SCR-002-02,TASK-PO-SCR-002,TASK-DATA-03 | TC-FUNC-057 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-058 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | TASK-CMP-SCR-002-03,TASK-PO-SCR-002,TASK-DATA-03 | TC-FUNC-058 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-059 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | TASK-CMP-SCR-002-05,TASK-PO-SCR-002,TASK-DATA-03 | TC-FUNC-059 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-060 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | TASK-CMP-SCR-002-04,TASK-PO-SCR-002,TASK-DATA-03 | TC-FUNC-060 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-061 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | TASK-CMP-SCR-002-01,TASK-CMP-SCR-002-06,TASK-PO-SCR-002,TASK-DATA-03 | TC-FUNC-061 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-062 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | TASK-CMP-SCR-002-08,TASK-PO-SCR-002 | TC-FUNC-062 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-063 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | TASK-CMP-SCR-002-07,TASK-PO-SCR-002,TASK-DATA-03 | TC-FUNC-063 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

## F7. Common, Admin, Governance (REQ-FUNC-064~080)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-01 | TC-FUNC-064 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-065 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-FUNC-065 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-066 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-02,TASK-PO-SCR-005,TASK-AUTH-01,TASK-AUTH-02 | TC-FUNC-066 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-067 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-01,TASK-PO-SCR-001 | TC-FUNC-067 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-068 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-04,TASK-PO-SCR-001 | TC-FUNC-068 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-069 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-04,TASK-PO-SCR-001 | TC-FUNC-069 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-070 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-FUNC-070 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-071 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-FUNC-072 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-FUNC-073 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-FUNC-074 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-DATA-04 | TC-FUNC-074 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-075 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-FUNC-076 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-FUNC-077 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-08,TASK-PO-SCR-005 | TC-FUNC-077 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-078 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-03 | TC-FUNC-078 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-079 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-FUNC-079 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-FUNC-080 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-02,TASK-PO-SCR-005 | TC-FUNC-080 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

---

## NFR — Performance (REQ-NF-001~007)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-NF-001 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-002 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-NF-002 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-003 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-NF-003 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-004 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-02,TASK-PO-SCR-001 | TC-NF-004 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-005 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-07,TASK-PO-SCR-003 | TC-NF-005 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-006 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-NF-006 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-007 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |

## NFR — Reliability and Recovery (REQ-NF-008~011)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-009 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-010 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-011 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |

## NFR — Security and Privacy (REQ-NF-012~018)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-DB-03 | TC-NF-012 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-013 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-DB-02 | TC-NF-013 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-014 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-DB-03,TASK-AUTH-01 | TC-NF-014 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-015 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-DB-03 | TC-NF-015 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-016 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-DB-03 | TC-NF-016 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-017 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | TASK-CMP-SCR-003-03,TASK-PO-SCR-003,TASK-DB-03 | TC-NF-017 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-018 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | TASK-CMP-SCR-005-03,TASK-PO-SCR-005 | TC-NF-018 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

## NFR — Safety and Moderation (REQ-NF-019~022)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | TASK-CMP-SCR-004-06,TASK-PO-SCR-004 | TC-NF-019 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-020 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-021 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-022 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |

## NFR — Accessibility (REQ-NF-023~025)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-NF-023 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-024 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-025 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |

## NFR — Content, Freshness, SEO, Copyright (REQ-NF-026~030)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-04,TASK-PO-SCR-001,TASK-DATA-04 | TC-NF-026 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-027 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-05,TASK-PO-SCR-001,TASK-DATA-02 | TC-NF-027 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-028 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | TASK-CMP-SCR-001-06,TASK-PO-SCR-001 | TC-NF-028 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-029 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-030 | IMPLEMENT | 전역(공통 레이아웃) | 전역(모든 Route) | `src/app/layout.tsx` | TASK-GLOBAL-02 | TC-NF-030 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

## NFR — Maintainability, Monitoring, Cost (REQ-NF-031~034)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-GLOBAL-04 | TC-NF-031 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |
| REQ-NF-032 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-033 | EXCLUDED | N/A(제외) | N/A | N/A | N/A(EXCLUDED) | N/A(EXCLUDED) | EXCLUDED_CONFIRMED |
| REQ-NF-034 | IMPLEMENT | N/A(기술 Route) | N/A(기술 Route) | N/A(기술 Route) | TASK-GLOBAL-04 | TC-NF-034 (NOT_RUN) | TASK_GENERATED_AWAITING_DETAIL |

---

## 집계 검증

| 구분 | 건수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |
| IMPLEMENT | 94 |
| EXCLUDED | 20 |
| Screen 배치(SCR-001~005 합) | 73 |
| 전역(공통 레이아웃) 배치 | 12 |
| N/A(기술 Route) 배치 | 9 |
| N/A(제외) 배치 | 20 |

합계는 `docs/03_UI_COVERAGE_ANALYSIS.md` §5 요약 집계와 일치한다.
