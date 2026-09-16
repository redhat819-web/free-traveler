# SRS UI/UX Revision — Free Traveler (06)

- **Document ID:** SRS-UIUX-REVISED-TRAVEL-001
- **개정 대상:** `02_SRS_BASELINE.md` (SRS-TRAVEL-001, Revision 1.0)
- **개정 근거:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `docs/STITCH_VALIDATION_REPORT.md`
- **작성 기준일:** 2026-09-15
- **개정 범위:** `02_SRS_BASELINE.md` §3.5 "Page and Route Inventory"만 개정한다. **REQ-FUNC-001~080, REQ-NF-001~034 요구사항 본문·수용 기준은 어떤 항목도 삭제·변경하지 않으며**, 전체 원문은 `02_SRS_BASELINE.md` §4를 그대로 따른다. 이 문서는 라우트 구조 개정 사항만 다룬다.

---

## 1. 개정 사유

`02_SRS_BASELINE.md` §3.5는 여행지·안전정보·항공·호텔·동행·인증·마이페이지·관리자를 각각 별도 Route(`/destinations`, `/destinations/[slug]`, `/flights`, `/hotels`, `/mates/new`, `/safety`, `/safety/[countryCode]`, `/auth/*`, `/my/*`, `/admin/*` 등)로 나열했다. `03_UI_COVERAGE_ANALYSIS.md`에서 이 요구사항들을 5개 디자인 Screen(SCR-001~005)에 재배치했고, `design-reference/UI_CONTRACT.md`·`SCREEN_ROUTE_CONTRACT.json`에서 5개 Screen 구조가 Route 계약으로 확정됨에 따라, SRS의 Route Inventory를 실제 구현 구조와 일치시키기 위해 개정한다.

---

## 2. 개정된 §3.5 Page and Route Inventory

| Route | Page | Access | 비고 |
|---|---|---|---|
| `/` | SCR-001 메인 | Public | 여행지 목록/상세 Drawer, 국가 안전정보 Drawer, 최근 동행 미리보기 포함 |
| `/about` | SCR-002 대표 소개 | Public | 단독 유지(보조 Screen) |
| `/travel-tools` | SCR-003 통합 여행 준비 | Public(동행 작성 탭은 Adult Member) | 항공/숙소/동행 구하기 3탭 통합 |
| `/mates` | SCR-004 동행 조회 | Public(참가 요청·신고·차단은 Adult Member) | 목록+상세 좌우 분할/Drawer |
| `/account` | SCR-005 계정·관리 | Public/Adult Member/Admin | Guest/Member/Admin 배타적 탭 |

기존 Route와의 대응 관계는 `docs/05_UIUX_APPROVED.md` §2 "기존 다중 Route → 5개 Screen 통합" 표를 따른다. `/destinations/*`, `/flights`, `/hotels`, `/mates/[id]`, `/mates/new`, `/safety/*`, `/auth/*`, `/my/*`, `/admin/*`는 독립 Route로 존재하지 않고 위 5개 Route 내부의 탭·Drawer·패널·모달로 구현한다.

### 기술 Route(5 Screen 수에 미포함, 유지)

| Route | 목적 |
|---|---|
| `src/app/auth/callback/route.ts` | Supabase 인증 콜백 |
| `src/app/api/**/route.ts` | 동행/참가 요청/신고/관리자 처리 API |
| `src/app/not-found.tsx` | 전역 404 |
| `src/app/error.tsx` | 전역 500/런타임 오류 |

---

## 3. UI Route Contract

| Screen ID | Route | Page Entry | 우선순위 | Mobile 변형 |
|---|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심 | 필수(390px 반응형) |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조 | 없음 |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 | 필수(390px 반응형) |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 | 없음(Drawer로 대응) |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 | 없음 |

- `schema_version`: `traveler-screen-route-v1` (`design-reference/SCREEN_ROUTE_CONTRACT.json` 원본 기준)
- 완료 조건: Route 중복 없음, Page Entry 중복 없음, Screen 수 5, 핵심 4개(SCR-001·003·004·005)·보조 1개(SCR-002) 구분 존재. 검증 결과는 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `completion_criteria`를 참조한다.

---

## 4. Release Acceptance Criteria

`docs/05_UIUX_APPROVED.md` §4와 동일한 기준을 이 SRS 개정본의 승인 조건으로도 적용한다.

1. REQ-FUNC-001~080, REQ-NF-001~034 총 114건이 `docs/UIUX_TRACEABILITY.md`에서 삭제 없이 전부 추적된다.
2. `SCREEN_ROUTE_CONTRACT.json`의 Screen 수가 5, Route·Page Entry 중복이 없다.
3. `PROJECT_SCOPE.md`의 EXCLUDED 20건이 Screen에 배치되지 않고 EXCLUDED로만 표시된다.
4. SCR-003의 항공편/숙소/동행 구하기가 실제 내부 탭으로 구현된다(외부 링크로 대체 금지).
5. SCR-005의 Guest/Member/Admin 3탭 구조가 코드에 존재한다.
6. SCR-001·SCR-003 Mobile 변형이 실제 390px 반응형 레이아웃이다.
7. Airbnb 상표 요소, 구매·예약·결제 UI, Proprietary Font, 토큰 외 임의 색상이 없다.
8. 모든 Empty 상태에 안내+이용 방법+CTA 3요소가 있고 Lorem ipsum류 자리표시 문구가 없다.
9. `docs/UIUX_TRACEABILITY.md`의 모든 IMPLEMENT 행에 실제 Task ID와 Test 결과가 채워진다(현재는 `PENDING_TASK_GENERATION`).
10. 핵심 4개·보조 1개 구분이 전 문서에서 일관된다.

**현재 상태:** 1~3, 10은 이 개정 시점에 충족되어 있다. 4~9는 `docs/STITCH_VALIDATION_REPORT.md`에 기록된 미해결 항목(SCR-003 탭 미통합, SCR-003 Mobile 비반응형, SCR-005 Member/Admin 탭 부재) 및 향후 Task 생성·구현 단계에서 충족해야 하는 미완료 조건이며, 이 문서 작성 시점에 구현되었다고 기록하지 않는다.
