# REFACTOR-EXTRACT-PURE-LOGIC — mate-state 순수 함수 인라인 중복 이동 (완료)

- **Task ID:** `REFACTOR-EXTRACT-PURE-LOGIC`
- **Category:** REFACTOR
- **Status:** DONE — 2026-09-19

## 배경

`src/lib/mate-state.ts`의 순수 함수(`isMateClosed`, `hasActiveApplication`)와
동일한 로직이 여러 컴포넌트에 인라인으로 중복 구현되어 있었다. Diff 감사로
완전히 일치하는 지점만 확인 후 이동했다(로직 변경 없음, 순수 이동만).

## 처리 순서

1. Diff 감사: 인라인 구현과 lib 구현을 함수별로 대조, 완전 일치/불일치 판정.
2. 불일치 발견 시 이동 대상에서 제외(`MyActivity.tsx`의 `hasActiveApplicants`는
   `mate_id` 기준으로 lib의 `requester_id` 기준 `hasActiveApplication`과
   조회 축이 달라 보류).
3. 완전 일치하는 4곳만 파일 단위 커밋으로 이동.

## 이동 완료 (4개 파일, 각 파일 단위 커밋)

- `hasActiveApplication`
  - `src/components/mates/JoinRequestForm.tsx` (원래 이동 대상 목록 포함)
- `isMateClosed`
  - `src/components/mates/MatePostList.tsx` (원래 이동 대상 목록 포함)
  - `src/app/mates/page.tsx` — **diff 감사 중 추가 발견**(원래 5개 파일 목록에 없었음)
  - `src/components/mates/MateDetailPanel.tsx` — **diff 감사 중 추가 발견**(원래 5개 파일 목록에 없었음)

## 검증

각 커밋마다 `tsc --noEmit`, `eslint`, `vitest run`(61 tests) 통과. 완료 후
`git grep`으로 인라인 잔존 여부 확인.

## 보류 처리 (착수하지 않음, 각각 별도 기록)

- `canTransitionApplication` → `TASKS/TASK-SEC-APPLICATION-TRANSITION.md`
- `effectiveMateStatus`, `MyActivity.tsx`의 `hasActiveApplicants`(lib 추출 가치 검토)
  → `TASKS/TASK-REFACTOR-UNUSED-LIB-FUNCTIONS.md`
- `MyActivity.tsx:242`의 `status`만 확인하는 마감 판정(만료 미반영, `isMateClosed`와
  다른 결과를 낼 수 있음) → `TASKS/TASK-BUG-MATE-CLOSED-INCONSISTENT.md`
  (완료 이동 작업 중 화면 간 판정 불일치로 새로 발견됨)
