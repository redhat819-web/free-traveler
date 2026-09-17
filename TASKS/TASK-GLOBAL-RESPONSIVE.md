# GLOBAL-RESPONSIVE — 반응형 레이아웃 기반

- **Task ID:** `GLOBAL-RESPONSIVE`
- **제목:** 반응형 레이아웃 기반
- **Category:** GLOBAL
- **Type:** global
- **Priority:** P0
- **Screen / Route / Page Entry:** N/A / N/A / N/A

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 47번 행(`GLOBAL-RESPONSIVE`)을 상세화한 것이다.
- Category: **GLOBAL** / 우선순위: **P0**
- 선행 Task 없음 — 독립적으로 착수 가능하다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.

## Requirement Ref

- `REQ-FUNC-065`
- `REQ-NF-003`
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: N/A
- Route: N/A
- Page Entry: N/A

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md`
- `design-reference/SCREEN_ROUTE_CONTRACT.json`

## Depends On

- 없음

## Expected Files

- `src/app/globals.css` (modify)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- 320px~Desktop 가로 스크롤·겹침 없음
- `design-reference/D-001/DESIGN.md`의 색상·폰트·간격·radius 토큰을 `globals.css`에 CSS 변수로 정의하고, Next.js 스타터 기본값(`--background`, `--foreground` 등)을 대체한다.

## Visual AC

- Card 1열(Mobile)/그리드(Desktop)
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구 및 내용 없는 Card를 두지 않는다(D-001/DESIGN.md 공통 규칙).
- `body`의 배경·기본 글자색·기본 폰트가 D-001 토큰을 사용한다.

## Security/Privacy AC

- —

## Test Cases

- `MANUAL-CHECK-RESPONSIVE` 시나리오로 검증한다.

## Verify

- MANUAL-CHECK-RESPONSIVE
- 자체 검증: `src` 아래 `.tsx`/`.css`에서 `globals.css` 밖의 임의 hex 색상 사용이 없는지 검색한다.
- `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build` 실행.

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
- Expected Files 목록 밖의 파일 생성·수정을 금지한다.
- 이 Task 단계에서 구현 코드, Git Branch, Commit을 생성하지 않는다(본 문서는 계획 문서다).
