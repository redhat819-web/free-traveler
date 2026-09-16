# PAGE-SCR004 — 동행 조회 화면 조립

- **Task ID:** `PAGE-SCR004`
- **제목:** 동행 조회 화면 조립
- **Category:** PAGE_OWNER
- **Type:** page_owner
- **Priority:** P0
- **Screen / Route / Page Entry:** SCR-004 / `/mates` / `src/app/mates/page.tsx`

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 4번 행(`PAGE-SCR004`)을 상세화한 것이다.
- Category: **PAGE_OWNER** / 우선순위: **P0**
- 선행 Task(CMP-SCR004-INTRO, CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-DETAIL, CMP-SCR004-JOIN-REQUEST, CMP-SCR004-REPORT, CMP-SCR004-BLOCK, CMP-SCR005-AUTH, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.
- Page Owner Task는 하위 Component를 새로 만들지 않고, 이미 만들어진 Component를 실제 Route Page로 조립하는 것만 범위로 한다.

## Requirement Ref

- (조립)
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md` — `SCR-004` 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — `SCR-004` 항목

## Depends On

- `CMP-SCR004-INTRO`
- `CMP-SCR004-FILTER`
- `CMP-SCR004-LIST`
- `CMP-SCR004-DETAIL`
- `CMP-SCR004-JOIN-REQUEST`
- `CMP-SCR004-REPORT`
- `CMP-SCR004-BLOCK`
- `CMP-SCR005-AUTH`
- `DB-ACCESS`
- `GLOBAL-NAV-FOOTER`
- `GLOBAL-TOAST`

## Expected Files

- `src/app/mates/page.tsx` (create)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- Intro(제목 + 설명 2문장 + "새 동행 글 작성하기" CTA)
- Filter + 결과 요약(`CMP-SCR004-FILTER`, 데이터 출처: `DB-ACCESS`의 mates 쿼리)
- 동행 목록(`CMP-SCR004-LIST`, 최대 8개 우선 노출, 데이터 출처: `DB-ACCESS`)
- 상세(`CMP-SCR004-DETAIL`, Desktop 좌우 분할 / Mobile Drawer, 참가·신고·차단 진입점 포함)
- 신청 방법 3단계(정적 카피)
- 안전·신고·차단 안내 + CTA 배너

## Visual AC

- 목록 Card 최대 8개 우선 노출(그 이상 "더 보기"), 목록과 상세 중 하나만 존재하는 레이아웃 금지.
- 검색 결과 0건이면 "조건에 맞는 모집글이 아직 없습니다" 안내 + 검색 조건 초기화 버튼 + "동행 글 작성하기" CTA + 참가 요청 이용 방법 3줄 요약으로 구성된 완성형 Empty State를 Section 3 자리에 표시한다.
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지.
- Section 2~4(`CMP-SCR004-FILTER`/`CMP-SCR004-LIST`/`CMP-SCR004-DETAIL`, 모두 `DB-ACCESS` 조회)가 로딩 중인 동안에는 실제 목록·상세와 동일한 레이아웃의 Skeleton을 표시한다(레이아웃 이동 금지). 조회 실패 시 "목록을 불러오지 못했습니다" 안내 + 다시 시도 버튼을 표시하고, 빈 결과(0건)와 로딩 실패를 서로 다른 문구로 구분한다.

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
- 광고 삽입
- 별점 UI
- 실시간 항공권/호텔 가격 표시
- 상세 패널에서 연락처 직접 노출
- Expected Files 목록 밖의 파일 생성·수정을 금지한다.
- 이 Task 단계에서 구현 코드, Git Branch, Commit을 생성하지 않는다(본 문서는 계획 문서다).
