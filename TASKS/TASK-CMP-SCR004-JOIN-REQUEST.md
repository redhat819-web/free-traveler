# CMP-SCR004-JOIN-REQUEST — 참가 요청 Form

- **Task ID:** `CMP-SCR004-JOIN-REQUEST`
- **제목:** 참가 요청 Form
- **Category:** COMPONENT
- **Type:** component
- **Priority:** P0
- **Screen / Route / Page Entry:** SCR-004 / /mates / src/app/mates/page.tsx

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 30번 행(`CMP-SCR004-JOIN-REQUEST`)을 상세화한 것이다.
- Category: **COMPONENT** / 우선순위: **P0**
- 선행 Task(CMP-SCR005-AUTH, DB-ACCESS, CMP-SCR004-DETAIL)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.

## Requirement Ref

- `REQ-FUNC-034`
- `REQ-FUNC-035`
- `REQ-FUNC-036`
- `REQ-NF-005`
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md` — `SCR-004` 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — `SCR-004` 항목

## Depends On

- `CMP-SCR005-AUTH`
- `DB-ACCESS`
- `CMP-SCR004-DETAIL`

## Expected Files

- `src/components/mates/JoinRequestForm.tsx` (create)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- 500자 이내 비공개 메시지, PENDING 저장, 동일 글 중복 PENDING/ACCEPTED 차단, 작성자 승인/거절

## Visual AC

- 상태 배지(대기/승인/거절)
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구 및 내용 없는 Card를 두지 않는다(D-001/DESIGN.md 공통 규칙).

## Security/Privacy AC

- 비작성자 상태 변경 403

## Test Cases

- `UNIT-MATE-STATE` 시나리오로 검증한다.
- `E2E-MATE-AUTH` 시나리오로 검증한다.

## Verify

- UNIT-MATE-STATE, E2E-MATE-AUTH

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
