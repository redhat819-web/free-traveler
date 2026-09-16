# RELEASE-CHECK-VERCEL-SUPABASE — Vercel/Supabase 배포·환경변수·TLS 확인

- **Task ID:** `RELEASE-CHECK-VERCEL-SUPABASE`
- **제목:** Vercel/Supabase 배포·환경변수·TLS 확인
- **Category:** RELEASE_CHECK
- **Type:** test
- **Priority:** P2
- **Screen / Route / Page Entry:** N/A / N/A / N/A

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 65번 행(`RELEASE-CHECK-VERCEL-SUPABASE`)을 상세화한 것이다.
- Category: **RELEASE_CHECK** / 우선순위: **P2**
- 선행 Task(PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, CI-PIPELINE)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.

## Requirement Ref

- `REQ-NF-012`
- `REQ-NF-016`
- `REQ-NF-034`
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

- `PAGE-SCR001`
- `PAGE-SCR002`
- `PAGE-SCR003`
- `PAGE-SCR004`
- `PAGE-SCR005`
- `CI-PIPELINE`

## Expected Files

- (Expected Files 명시 없음 — Task List §3 표 원문 확인 필요)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- Vercel 환경변수(외부 URL, Supabase 키) 설정 확인, TLS 1.2+ 기본 적용 확인, 배포 후 5개 Route 재확인, 월 인프라 비용 목표 대비 확인

## Visual AC

- (Task List Visual AC 열이 비어 있음 — §2.1 Page Owner Acceptance Criteria 절 참조)
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구 및 내용 없는 Card를 두지 않는다(D-001/DESIGN.md 공통 규칙).

## Security/Privacy AC

- Airbnb 상표 요소·구매/예약/결제 UI·실시간 항공권/호텔 가격·광고·별점을 포함하지 않는다.

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
