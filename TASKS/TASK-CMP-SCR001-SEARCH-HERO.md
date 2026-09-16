# CMP-SCR001-SEARCH-HERO — 검색 Hero

- **Task ID:** `CMP-SCR001-SEARCH-HERO`
- **제목:** 검색 Hero
- **Category:** COMPONENT
- **Type:** component
- **Priority:** P0
- **Screen / Route / Page Entry:** SCR-001 / / / src/app/page.tsx

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 6번 행(`CMP-SCR001-SEARCH-HERO`)을 상세화한 것이다.
- Category: **COMPONENT** / 우선순위: **P0**
- 선행 Task(DATA-DESTINATIONS)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.

## Requirement Ref

- `REQ-FUNC-003`
- `REQ-FUNC-067`
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md` — `SCR-001` 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — `SCR-001` 항목

## Depends On

- `DATA-DESTINATIONS`

## Expected Files

- `src/components/home/SearchHero.tsx` (create)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- 키워드 부분 일치 검색, 여행지/국가/테마 통합 검색

## Visual AC

- Hero 높이 뷰포트 60~70%, 제목+설명 2문장+보조 CTA
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구 및 내용 없는 Card를 두지 않는다(D-001/DESIGN.md 공통 규칙).

## Security/Privacy AC

- 검색 입력에 실행 코드 삽입 방지(입력 이스케이프)

## Test Cases

- `E2E-PUBLIC-SMOKE` 시나리오로 검증한다.

## Verify

- E2E-PUBLIC-SMOKE

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
