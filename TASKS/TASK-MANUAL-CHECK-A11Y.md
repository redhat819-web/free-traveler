# MANUAL-CHECK-A11Y — 접근성 수동 확인

- **Task ID:** `MANUAL-CHECK-A11Y`
- **제목:** 접근성 수동 확인
- **Category:** MANUAL_CHECK
- **Type:** test
- **Priority:** P2
- **Screen / Route / Page Entry:** N/A / N/A / N/A
- **Status:** DONE(조건부) — 2026-09-19 (사용자 수동 점검 6/7 통과, 1건 미해결 이월 —
  `TASKS/TASK-A11Y-FOCUS-TRAP-CYCLE.md`로 분리. 이 1건 때문에 W23을 막지 않기로
  사용자가 명시적으로 결정함)

---

## 점검 결과 (2026-09-19, 최종)

1차 점검 실패 3건(Drawer 포커스 트랩 없음/Esc 무반응, `/travel-tools` 탭 화살표 불가) →
`TASKS/TASK-FIX-A11Y-DIALOG-TABS.md`로 분리해 수정 → 재점검 결과 **6/7 통과, 1건
(Drawer 포커스 트랩 순환)은 3차 시도에도 미해결로 확인**되어 별도 Task로 이월한다.

| 흐름 | 결과 |
|---|---|
| Drawer Esc 닫기 | **통과** |
| Drawer 포커스 복귀(닫은 뒤 열었던 카드로 복귀) | **통과** |
| 홈 국내/해외 탭(→ 화살표 + roving tabindex) | **통과** |
| `/travel-tools` 항공/숙소/동행 탭 | **통과** |
| `/account` 로그인/가입/재설정 탭 | **통과** |
| `/account` 정책 문서 탭 | **통과** |
| **Drawer 포커스 트랩(순환)** | **미해결** — Tab을 계속 누르면 내부 focusable 요소를 다 돈 뒤 Drawer 밖으로 이탈(15회까지는 안 나가고 그 이상에서 이탈). 자동화(Chromium, dev/prod 빌드)로는 재현되지 않았으나 사용자의 실제 브라우저에서는 재빌드 후에도 3차 재현됨. `TASKS/TASK-A11Y-FOCUS-TRAP-CYCLE.md`(NOT_STARTED)로 분리, 착수하지 않음. |

**미확인(범위 밖 취급)**: `BlockButton.tsx`(차단 확인 모달)는 `/mates`에 실제 동행글이
0건이라 세션·데이터 부재로 점검 불가. `DestinationDrawer`/`SafetyPanel`/
`MateDetailPanel`(Mobile)에서 동일한 `useDialogA11y` 패턴이 통과했으므로 이 3곳
통과로 갈음한다(사용자 판단, 2026-09-19).

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 62번 행(`MANUAL-CHECK-A11Y`)을 상세화한 것이다.
- Category: **MANUAL_CHECK** / 우선순위: **P2**
- 선행 Task(GLOBAL-A11Y)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.

## Requirement Ref

- `REQ-NF-023`
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

- `GLOBAL-A11Y`

## Expected Files

- Expected Files 없음 (MANUAL_CHECK 카테고리, 산출물은 사용자 점검 결과)
  — `TASKS/00_TASK_LIST.md` §3 표(Seq 62)에 Expected Files 열 자체가 없음을 확인함(2026-09-19).

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- 키보드만으로 5개 핵심 흐름(탐색/필터/폼 제출/Drawer 열고 닫기/탭 전환) 조작 가능 여부 확인

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
