# PAGE-SCR003 — 통합 여행 준비 화면 조립

- **Task ID:** `PAGE-SCR003`
- **제목:** 통합 여행 준비 화면 조립
- **Category:** PAGE_OWNER
- **Type:** page_owner
- **Priority:** P0
- **Screen / Route / Page Entry:** SCR-003 / `/travel-tools` / `src/app/travel-tools/page.tsx`

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 3번 행(`PAGE-SCR003`)을 상세화한 것이다.
- Category: **PAGE_OWNER** / 우선순위: **P0**
- 선행 Task(CMP-SCR003-INTRO, CMP-SCR003-TABS, CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM, CMP-SCR003-MATE-COMPOSE, CMP-SCR003-TIPS, CMP-SCR005-AUTH, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.
- Page Owner Task는 하위 Component를 새로 만들지 않고, 이미 만들어진 Component를 실제 Route Page로 조립하는 것만 범위로 한다.

## Requirement Ref

- (조립)
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/app/travel-tools/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md` — `SCR-003` 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — `SCR-003` 항목

## Depends On

- `CMP-SCR003-INTRO`
- `CMP-SCR003-TABS`
- `CMP-SCR003-FLIGHT-FORM`
- `CMP-SCR003-HOTEL-FORM`
- `CMP-SCR003-MATE-COMPOSE`
- `CMP-SCR003-TIPS`
- `CMP-SCR005-AUTH`
- `DB-ACCESS`
- `GLOBAL-NAV-FOOTER`
- `GLOBAL-TOAST`

## Expected Files

- `src/app/travel-tools/page.tsx` (create)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- Intro(이용 순서 3단계, 정적 카피)
- 탭(항공편/숙소/동행 구하기, `CMP-SCR003-TABS`가 `CMP-SCR003-FLIGHT-FORM`/`CMP-SCR003-HOTEL-FORM`/`CMP-SCR003-MATE-COMPOSE`를 실제 내부 컴포넌트로 조립 — 외부 링크 버튼으로 대체 금지)
- 여행정보 Form(항공/숙소 공통 구조: 국가·지역·시작일·종료일, 데이터 출처: `DATA-DESTINATIONS`의 국가/지역 목록)
- 입력 요약 + 외부 이동(좌우 분할, 비전달 고지 포함)
- 찾기 Tip 3개(정적 카피)
- 동행 작성 Form(로그인·성인 확인 완료 시, 데이터 출처: `CMP-SCR005-AUTH` 세션 상태) 또는 로그인/성인 확인 안내 + 안전 안내

## Visual AC

- 탭별 폼 상태(미입력/검증 오류/요약)는 다른 탭으로 전환해도 유지된다.
- Tip Card 3개, 요약 Action Card 좌우 분할은 Mobile에서 세로 스택.
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지. 동행 탭 비로그인 상태는 "로그인/성인 확인이 필요합니다" 안내 + `/account` 이동 CTA로 구성된 완성형 상태로 표시한다(빈 폼만 노출 금지).
- 동행 탭은 `CMP-SCR005-AUTH` 세션 상태를 확인하는 동안 Skeleton(폼 영역과 동일 크기)을 표시하고, 로그인 상태 미확정 상태에서 로그인/비로그인 UI를 깜빡이며 전환하지 않는다. 세션 확인 실패 시 "로그인 상태를 확인하지 못했습니다" 안내 + 다시 시도 버튼을 표시한다.

## Security/Privacy AC

- Airbnb 상표 요소, 구매·예약·결제 UI, 실시간 항공권/호텔 가격, 광고, 별점을 어디에도 포함하지 않는다(`SCREEN_ROUTE_CONTRACT.json` `prohibited_features`/`global_prohibitions`).
- 로그인이 필요한 동작(즐겨찾기 관리, 참가 요청, 신고·차단, 동행 작성)은 비로그인 상태에서 `/account`로 안전하게 안내한다.

## Test Cases

- 이 Task 단독으로 실행되는 자동화 테스트는 없으며, 의존하는 Page Owner의 E2E Task로 통합 검증된다.

## Verify

- `E2E-PUBLIC-SMOKE`(SCR-001/002/004 열람)
- `E2E-TRAVEL-TOOLS`(SCR-003)
- `E2E-MATE-AUTH`(SCR-003 동행 탭/SCR-004 참가·신고·차단/SCR-005)
- `MANUAL-CHECK-RESPONSIVE`
- `MANUAL-CHECK-A11Y`(5개 Page Owner 공통)

## Definition of Done

- [ ] Expected Files에 명시된 파일만 생성/수정했다.
- [ ] Functional AC 전 항목을 충족했다.
- [ ] Visual AC 전 항목을 충족했다(Lorem ipsum/빈 Card/미완성 문구 없음 포함).
- [ ] Security/Privacy AC 전 항목을 충족했다.
- [ ] Forbidden 목록의 어떤 요소도 포함하지 않았다.
- [ ] Test Cases에 명시된 Verify 대상 테스트가 이 Task 범위를 커버한다.
- [ ] 관련 Requirement의 `docs/UIUX_TRACEABILITY.md` Status 갱신 준비가 되었다(실제 갱신은 별도 절차).

## Forbidden

- Airbnb 상표 요소(로고·브랜드 컬러 시스템·상표 문구) 사용
- 예약·결제·구매 UI 구현
- 라이선스 미확인 상업 폰트 파일 번들링
- D-001 DESIGN.md 디자인 토큰 밖의 임의 색상 값 사용
- 실시간 항공권/호텔 가격 표시
- 광고 삽입
- 별점 UI
- 항공/숙소/동행 탭을 외부 링크 버튼으로 대체
- Expected Files 목록 밖의 파일 생성·수정을 금지한다.
- 이 Task 단계에서 구현 코드, Git Branch, Commit을 생성하지 않는다(본 문서는 계획 문서다).
