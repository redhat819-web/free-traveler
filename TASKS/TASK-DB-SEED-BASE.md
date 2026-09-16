# DB-SEED-BASE — 데모/테스트 시드 데이터

- **Task ID:** `DB-SEED-BASE`
- **제목:** 데모/테스트 시드 데이터
- **Category:** DB
- **Type:** db
- **Priority:** P1
- **Screen / Route / Page Entry:** N/A / N/A / N/A

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 45번 행(`DB-SEED-BASE`)을 상세화한 것이다.
- Category: **DB** / 우선순위: **P1**
- 선행 Task(DB-SCHEMA-BASE)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.
- DB Task는 `member_profiles`, `mates`, `mate_applications`, `mate_blocks`, `mate_reports`, `outbound_url_settings` 6개 테이블 범위를 넘지 않는다.

## Requirement Ref

- (E2E 테스트 지원, 직접 REQ 없음)
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

- `DB-SCHEMA-BASE`

## Expected Files

- `supabase/seed.sql` (create)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- 동행 글·프로필 샘플 데이터로 E2E 흐름 재현 가능

## Visual AC

- —
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구 및 내용 없는 Card를 두지 않는다(D-001/DESIGN.md 공통 규칙).

## Security/Privacy AC

- 시드 데이터에 실제 개인정보 미포함

## Test Cases

- `E2E-MATE-AUTH` 시나리오로 검증한다.

## Verify

- E2E-MATE-AUTH

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
