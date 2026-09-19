# GLOBAL-A11Y — 접근성 기본기

- **Task ID:** `GLOBAL-A11Y`
- **제목:** 접근성 기본기
- **Category:** GLOBAL
- **Type:** global
- **Priority:** P1
- **Screen / Route / Page Entry:** N/A / N/A / N/A

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 49번 행(`GLOBAL-A11Y`)을 상세화한 것이다.
- Category: **GLOBAL** / 우선순위: **P1**
- 선행 Task 없음 — 독립적으로 착수 가능하다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.

## Requirement Ref

- `REQ-FUNC-079`
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

- 없음

## Expected Files

- `src/components/**/*.tsx` (전역 적용, modify)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- 폼·모달·탭·알림 시맨틱 HTML + ARIA 상태

## Visual AC

- 포커스 링 `color.focus.ring` 2px
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구 및 내용 없는 Card를 두지 않는다(D-001/DESIGN.md 공통 규칙).

## Security/Privacy AC

- —

## Test Cases

- `MANUAL-CHECK-A11Y` 시나리오로 검증한다.

## Verify

- MANUAL-CHECK-A11Y

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

## 완료 후 재검토 (2026-09-19)

`MANUAL-CHECK-A11Y`/`MANUAL-CHECK-PERF-SEO` 수동 점검에서 아래 4건이 이 Task
완료 이후에도 남아 있음이 확인되었다(포커스 트랩·Esc·탭 화살표 이동 3건은
`TASKS/TASK-FIX-A11Y-DIALOG-TABS.md`로 수정 완료, 색 대비 1건은
`TASKS/TASK-A11Y-COLOR-CONTRAST.md`로 기록만 함).

**원인**: 이 Task의 **Functional AC가 REQ-NF-023(WCAG 2.2 Level AA)의 실제
범위보다 좁게 작성되어 있었다.**

- Functional AC: "폼·모달·탭·알림 **시맨틱 HTML + ARIA 상태**" — `role`/`aria-*`
  속성이 붙어 있는지만 요구하고, 그 속성이 실제로 동작하는지(포커스 트랩, Esc,
  화살표 키 이동)는 AC에 없었다. 즉 `role="dialog"`+`aria-modal="true"`만
  있으면 이 AC상으로는 "충족"으로 판정되는 구조였다 — 실제 WCAG 2.2 AA는
  2.1.2(No Keyboard Trap의 역방향인 "탈출 가능해야 함"), 2.4.3(Focus Order),
  ARIA Authoring Practices의 Dialog/Tabs 패턴(포커스 트랩·Esc·화살표 이동)까지
  요구한다.
- Visual AC: "포커스 링 2px"만 명시되어 있고, **색 대비 기준(WCAG 1.4.3, 텍스트
  4.5:1/큰 텍스트 3:1)이 아예 AC에 없었다.**
- 결과적으로 `Definition of Done`의 "Functional/Visual AC 전 항목 충족" 체크가
  이 좁은 AC 기준으로는 통과했지만, 상위 Requirement(`REQ-NF-023`)는 충족되지
  않은 상태로 "완료" 처리되었다.

**재발 방지를 위해 확인할 것**: 이후 Wave에서 REQ-NF-023/024/025(접근성) 계열
Task를 상세화할 때는 Task List의 Functional/Visual AC 열이 Requirement의
실제 목표(WCAG 레벨 등)를 요약이 아니라 검증 가능한 항목으로 전부 나열하는지
먼저 확인한다. 이번처럼 "시맨틱 HTML + ARIA 상태"처럼 마크업 존재만 가리키는
표현은 상호작용/시각 기준(포커스 트랩, 키보드 내비게이션, 색 대비)을 암묵적으로
빠뜨릴 위험이 있다.
