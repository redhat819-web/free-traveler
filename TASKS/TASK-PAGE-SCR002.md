# PAGE-SCR002 — 대표 소개 화면 조립

- **Task ID:** `PAGE-SCR002`
- **제목:** 대표 소개 화면 조립
- **Category:** PAGE_OWNER
- **Type:** page_owner
- **Priority:** P0
- **Screen / Route / Page Entry:** SCR-002 / `/about` / `src/app/about/page.tsx`

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 2번 행(`PAGE-SCR002`)을 상세화한 것이다.
- Category: **PAGE_OWNER** / 우선순위: **P0**
- 선행 Task(CMP-SCR002-PROFILE-HERO, CMP-SCR002-STATS, CMP-SCR002-PHILOSOPHY, CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRY-CHIPS, CMP-SCR002-GALLERY, CMP-SCR002-MEMORABLE-CTA, DATA-REPRESENTATIVE, GLOBAL-NAV-FOOTER)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.
- Page Owner Task는 하위 Component를 새로 만들지 않고, 이미 만들어진 Component를 실제 Route Page로 조립하는 것만 범위로 한다.

## Requirement Ref

- (조립)
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: `/about`
- Page Entry: `src/app/about/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md` — `SCR-002` 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — `SCR-002` 항목

## Depends On

- `CMP-SCR002-PROFILE-HERO`
- `CMP-SCR002-STATS`
- `CMP-SCR002-PHILOSOPHY`
- `CMP-SCR002-TIMELINE`
- `CMP-SCR002-COUNTRY-CHIPS`
- `CMP-SCR002-GALLERY`
- `CMP-SCR002-MEMORABLE-CTA`
- `DATA-REPRESENTATIVE`
- `GLOBAL-NAV-FOOTER`

## Expected Files

- `src/app/about/page.tsx` (create)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- Profile Hero(대표 이미지 1장 + 한 문장, 데이터 출처: `DATA-REPRESENTATIVE.hero`)
- 여행 지표(`50+ Trips`, `30+ Countries`, 데이터 출처: `DATA-REPRESENTATIVE.stats`)
- 소개·철학(좌우 분할, 데이터 출처: `DATA-REPRESENTATIVE.philosophy`)
- Timeline 6개 이상(데이터 출처: `DATA-REPRESENTATIVE.timeline`)
- 방문 국가 30개(권역별 Chip, 데이터 출처: `DATA-REPRESENTATIVE.countries`)
- Gallery 8개 이상(데이터 출처: `DATA-REPRESENTATIVE.gallery`)
- 기억에 남는 여행지 4개 + CTA(데이터 출처: `DATA-REPRESENTATIVE.memorable` + `DATA-DESTINATIONS` 상세 연결)

## Visual AC

- 최소 콘텐츠 수: Timeline 6개 이상 / 방문 국가 30개 / Gallery 이미지 8장 이상 / 기억에 남는 여행지 4개.
- Desktop 좌우 분할·Gallery 4×2, Mobile 세로 스택·Gallery 1~2열.
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지. 정적 콘텐츠 상시 존재이므로 Empty State는 정의하지 않되, 이미지 로드 실패 시 alt 텍스트 유지 대체 플레이스홀더를 사용한다.
- 이 화면은 `src/data/representative.ts` 정적 데이터만 사용하는 Server Component로 렌더되므로 별도의 클라이언트 Loading 상태를 두지 않는다(비동기 DB 조회가 없어 Loading/Error 상태가 해당하지 않음).

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
- Expected Files 목록 밖의 파일 생성·수정을 금지한다.
- 이 Task 단계에서 구현 코드, Git Branch, Commit을 생성하지 않는다(본 문서는 계획 문서다).
