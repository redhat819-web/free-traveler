# FIX-A11Y-DIALOG-TABS — Drawer/Modal 포커스 트랩·Esc, Tab 키보드 내비게이션 결함 수정

- **Task ID:** `FIX-A11Y-DIALOG-TABS`
- **Category:** FIX (GLOBAL-A11Y 재작업)
- **Status:** IN_PROGRESS — 2026-09-19 착수
- **기록일:** 2026-09-19 (`MANUAL-CHECK-A11Y` 수동 점검 실패 3건에서 발견)

## 배경

`GLOBAL-A11Y`(W21, 완료 처리됨)가 포커스 링·시맨틱 HTML·ARIA 상태를 다뤘지만,
Drawer/Modal의 포커스 트랩·Esc 처리·탭 그룹의 화살표 키 내비게이션은 해당 Task의
Functional AC("폼·모달·탭·알림 시맨틱 HTML + ARIA 상태")에 `role`/`aria-*` 속성
자체는 포함되었으나 키보드 상호작용(트랩/Esc/화살표 이동) 요구가 명시되어 있지 않아
누락되었다. `MANUAL-CHECK-A11Y` 수동 점검에서 아래 3건이 실패로 확인되어 별도
FIX Task로 분리한다.

## 실패 항목 (MANUAL-CHECK-A11Y 점검 결과)

1. 홈(`/`) 여행지 상세 Drawer — 포커스 트랩 없음(Tab으로 Drawer 밖 이탈)
2. 같은 Drawer — Esc로 닫히지 않음
3. `/travel-tools` 탭 — 좌우 화살표로 전환 불가, Tab이 탭 그룹을 하나씩 통과

## 동일 패턴 추가 조사 (착수 전 확인 완료)

- Drawer/Modal 직접 구현 확인: Radix/Headless UI 등 라이브러리 의존성 없음(`package.json`).
  기존 프로젝트 관례(외부 UI 라이브러리 미사용)에 맞춰 공용 훅으로 직접 구현한다.
- 동일한 포커스 트랩/Esc 결함이 있는 곳 4곳: `DestinationDrawer.tsx`, `SafetyPanel.tsx`
  안전정보 모달, `BlockButton.tsx` 차단 확인 모달, `MateDetailPanel.tsx`(Mobile 바텀시트 —
  `role="dialog"`/`aria-modal` 자체가 없어 3곳보다 결함이 더 근본적).
- 동일한 탭 키보드 내비게이션 결함이 있는 곳 2곳: `ToolTabs.tsx`(항공/숙소/동행),
  `DestinationGrid.tsx`(국내/해외).

## Expected Files

- `src/hooks/useDialogA11y.ts` (create) — 포커스 트랩·Esc·초기 포커스 이동·포커스 복귀·배경 `inert`·스크롤 잠금 공용 훅
- `src/hooks/useTabListKeyboard.ts` (create) — 좌우 화살표/Home/End 탭 전환 + roving tabindex 공용 헬퍼
- `src/app/layout.tsx` (modify) — 배경 `inert` 대상 지정을 위한 `id="app-shell"` 래퍼 추가
- `src/components/home/DestinationDrawer.tsx` (modify) — `useDialogA11y` 적용
- `src/components/home/SafetyPanel.tsx` (modify) — `useDialogA11y` 적용
- `src/components/mates/BlockButton.tsx` (modify) — `useDialogA11y` 적용
- `src/components/mates/MateDetailPanel.tsx` (modify) — Mobile 바텀시트일 때만 `role="dialog"`+`useDialogA11y` 적용(Desktop 2단 레이아웃에서는 비Modal 유지)
- `src/components/home/DestinationGrid.tsx` (modify) — 국내/해외 탭에 `useTabListKeyboard` 적용
- `src/components/travel-tools/ToolTabs.tsx` (modify) — 탭에 `useTabListKeyboard` 적용 + `role="tabpanel"`/`aria-controls`/`aria-labelledby` 연결

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- Drawer/Modal 4곳: Tab/Shift+Tab이 내부에서만 순환, Esc로 닫힘, 열릴 때 내부(닫기 버튼/제목)로 포커스 이동, 닫을 때 트리거 요소로 포커스 복귀, 열려 있는 동안 배경 콘텐츠 `inert`+`aria-hidden`, 배경 스크롤 잠금
- 탭 2곳: 좌우 화살표로 탭 전환, Home/End로 처음/끝 이동, 선택된 탭만 `tabIndex=0`(나머지 `-1`), `aria-selected`/`aria-controls` 연결

## Verify

- `tsc --noEmit`, `eslint`, 관련 Vitest(해당 없으면 생략)
- 자동화된 Playwright 검증 대상 아님 — 수정 후 `MANUAL-CHECK-A11Y` 재점검(사용자 수행)으로 최종 확인

## Forbidden

- Expected Files 목록 밖의 파일 생성·수정 금지
- 새 UI 라이브러리(Radix/Headless UI 등) 추가 금지 — 기존 직접 구현 관례 유지
- Drawer/Modal의 기존 시각 디자인(D-001 토큰) 변경 금지 — 키보드 동작만 추가

## 완료 후 처리

- `MANUAL-CHECK-A11Y`는 사용자 재점검 통과 전까지 미완료 상태를 유지한다(사용자 지시).
