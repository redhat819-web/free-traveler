# E2E-TRAVEL-TOOLS — 통합 여행 준비 Smoke(항공/숙소/탭)

- **Task ID:** `E2E-TRAVEL-TOOLS`
- **제목:** 통합 여행 준비 Smoke(항공/숙소/탭)
- **Category:** E2E_TEST
- **Type:** test
- **Priority:** P0
- **Screen / Route / Page Entry:** N/A / N/A / N/A

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 59번 행(`E2E-TRAVEL-TOOLS`)을 상세화한 것이다.
- Category: **E2E_TEST** / 우선순위: **P0**
- 선행 Task(PAGE-SCR003)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.

## Requirement Ref

- (SCR-003 항공·숙소 흐름 통합 검증)
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

- `PAGE-SCR003`

## Expected Files

- `tests/e2e/travel-tools.spec.ts` (create)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- Playwright **Chromium 프로젝트만**: 탭 전환 상태 유지, 항공/숙소 입력→검증 오류→요약→외부 이동 버튼 속성(`target=_blank`, `rel=noopener noreferrer`) 확인

## Visual AC

- (Task List Visual AC 열이 비어 있음 — §2.1 Page Owner Acceptance Criteria 절 참조)
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구 및 내용 없는 Card를 두지 않는다(D-001/DESIGN.md 공통 규칙).

## Security/Privacy AC

- Airbnb 상표 요소·구매/예약/결제 UI·실시간 항공권/호텔 가격·광고·별점을 포함하지 않는다.
- 입력값(국가·지역·날짜 등)을 서버·DB·분석 이벤트·외부 URL query에 전달하지 않는다(브라우저 state 전용).

## Test Cases

- 이 Task 단독으로 실행되는 자동화 테스트는 없으며, 의존하는 Page Owner의 E2E Task로 통합 검증된다.

## Verify

- Task List §2.1 공통 Verify(E2E-PUBLIC-SMOKE / MANUAL-CHECK-RESPONSIVE / MANUAL-CHECK-A11Y) 참조

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
