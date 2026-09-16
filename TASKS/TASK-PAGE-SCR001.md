# PAGE-SCR001 — 메인 화면 조립

- **Task ID:** `PAGE-SCR001`
- **제목:** 메인 화면 조립
- **Category:** PAGE_OWNER
- **Type:** page_owner
- **Priority:** P0
- **Screen / Route / Page Entry:** SCR-001 / `/` / `src/app/page.tsx`

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 1번 행(`PAGE-SCR001`)을 상세화한 것이다.
- Category: **PAGE_OWNER** / 우선순위: **P0**
- 선행 Task(CMP-SCR001-SEARCH-HERO, CMP-SCR001-DESTINATION-GRID, CMP-SCR001-DESTINATION-DRAWER, CMP-SCR001-SAFETY-PANEL, CMP-SCR001-RECENT-MATES, CMP-SCR001-FAVORITES, CMP-SCR001-SHARE, DATA-DESTINATIONS, DATA-SAFETY, GLOBAL-NAV-FOOTER, GLOBAL-TOAST)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.
- Page Owner Task는 하위 Component를 새로 만들지 않고, 이미 만들어진 Component를 실제 Route Page로 조립하는 것만 범위로 한다.

## Requirement Ref

- (조립 Task, §6에서 하위 Component가 개별 REQ 보유)
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md` — `SCR-001` 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — `SCR-001` 항목

## Depends On

- `CMP-SCR001-SEARCH-HERO`
- `CMP-SCR001-DESTINATION-GRID`
- `CMP-SCR001-DESTINATION-DRAWER`
- `CMP-SCR001-SAFETY-PANEL`
- `CMP-SCR001-RECENT-MATES`
- `CMP-SCR001-FAVORITES`
- `CMP-SCR001-SHARE`
- `DATA-DESTINATIONS`
- `DATA-SAFETY`
- `GLOBAL-NAV-FOOTER`
- `GLOBAL-TOAST`

## Expected Files

- `src/app/page.tsx` (replace_starter)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- Hero(검색 입력, `CMP-SCR001-SEARCH-HERO`, 정적 카피)
- 국내 여행지 6개(`CMP-SCR001-DESTINATION-GRID`, 데이터 출처: `DATA-DESTINATIONS` `scope=DOMESTIC`)
- 해외 여행지 6개(`CMP-SCR001-DESTINATION-GRID`, 데이터 출처: `DATA-DESTINATIONS` `scope=OVERSEAS`)
- 여행 동기 6개(`CMP-SCR001-DESTINATION-GRID` 내 테마 Chip, 데이터 출처: `DATA-DESTINATIONS.themes`)
- 국가별 주의사항 6개(`CMP-SCR001-SAFETY-PANEL`, 데이터 출처: `DATA-SAFETY`)
- 최근 동행글 3개 또는 완성형 Empty State(`CMP-SCR001-RECENT-MATES`, 데이터 출처: `DB-ACCESS`의 mates 조회)
- free_traveler 소개 요약(`CMP-SCR001-DESTINATION-DRAWER`가 아닌 별도 CTA 배너, 데이터 출처: `DATA-REPRESENTATIVE`)

## Visual AC

- Card 최소 개수: 국내 6 / 해외 6 / 테마 Chip 6 / 안전정보 6 / 최근 동행 3(또는 Empty State).
- Desktop 3×2 Card 그리드, Mobile 1열 — 반응형 콘텐츠 밀도는 `D-001/DESIGN.md` §15·§16 토큰(Section padding 64~96px/40~64px, 콘텐츠 최대 폭 1200~1280px) 그대로 적용.
- Hero 아래에서 다음 Section 제목·카드 상단 일부가 보여야 하며(Hero 높이 뷰포트 60~70%), 큰 빈 영역을 만들지 않는다.
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 Card를 어디에도 두지 않는다.
- Section 6(최근 동행글)에 데이터가 없으면 "아직 등록된 동행 모집글이 없습니다" 안내 문장 + 이용 방법 2줄 + "동행 글 작성하기" CTA로 구성된 완성형 Empty State를 표시한다(빈 화면처럼 보이지 않게).
- Section 6(최근 동행글, `DB-ACCESS` 조회)이 로딩 중인 동안에는 실제 Card와 동일한 크기·개수(3개)의 Skeleton을 표시한다(빈 화면·레이아웃 이동 금지). 로딩 실패 시 "동행 글을 불러오지 못했습니다" 안내 + 다시 시도 버튼을 표시한다(GLOBAL-ERROR-PAGES와 별개로 Section 단위 인라인 오류로 처리).

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
- Expected Files 목록 밖의 파일 생성·수정을 금지한다.
- 이 Task 단계에서 구현 코드, Git Branch, Commit을 생성하지 않는다(본 문서는 계획 문서다).
