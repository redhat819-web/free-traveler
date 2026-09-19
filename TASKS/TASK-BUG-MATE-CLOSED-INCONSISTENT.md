# BUG-MATE-CLOSED-INCONSISTENT — 화면별 마감 판정 불일치 (기록용, 미착수)

- **Task ID:** `BUG-MATE-CLOSED-INCONSISTENT`
- **Category:** BUG
- **Status:** NOT_STARTED — 착수 금지, 기록만
- **기록일:** 2026-09-19 (REFACTOR-EXTRACT-PURE-LOGIC에서 3곳을 `isMateClosed`로
  통일하는 과정에서 발견)

## 문제

`status='open'`이고 `end_date`가 과거인 모집글에 대해 화면별 판정이 갈린다.

- `MatePostList.tsx` / `mates/page.tsx` / `MateDetailPanel.tsx`
  → **마감**으로 표시 (`isMateClosed`: `status === "closed"` 또는 `end_date` 만료 중
  하나라도 해당하면 마감)
- `MyActivity.tsx:242`
  → **모집중**으로 표시 (`mate.status === "closed"` 컬럼만 확인, `end_date` 미반영)

같은 모집글이 화면에 따라 다르게 표시된다.

## 발견 경로

`REFACTOR-EXTRACT-PURE-LOGIC`(`TASKS/TASK-REFACTOR-EXTRACT-PURE-LOGIC.md`)에서
인라인 마감 판정 3곳을 `lib/mate-state.ts`의 `isMateClosed`로 통일한 결과,
`MyActivity.tsx:242`만 이 규칙을 따르지 않고 있다는 사실이 drift로 드러났다.

## 검토 필요

1. 마감 판정의 정본이 `isMateClosed`인지 확인한다
   (`status` = 수동 마감, `end_date` = 자동 만료라는 해석이 스펙 의도와 맞는지).
2. 맞다면 `MyActivity.tsx:242`를 `isMateClosed`로 교체한다.
3. 서버/RLS 쪽에도 같은 불일치가 있는지 확인한다
   (조회 필터나 정책이 `status`만 보고 `end_date`를 반영하지 않는 곳이 있는지).
4. 만료된 모집글에 참가 요청이 실제로 가능한 상태인지 확인한다
   — 가능하다면 `TASKS/TASK-SEC-APPLICATION-TRANSITION.md`와 연관된 문제다.

3, 4번을 넣은 이유: 화면 계층만 고쳐도 서버가 만료된 글의 참가 요청을 계속
받아준다면 반쪽짜리 수정이 되기 때문이다.

## 참고

- 단순히 한 줄을 `isMateClosed`로 바꾸는 것으로 보이지만, `MyActivity.tsx`의
  "내 참가요청" 목록에서 마감 판정이 바뀌면 사용자에게 보이는 상태가 달라진다.
  스펙상 의도(위 1번)를 먼저 확인한 뒤 착수해야 한다.
- `TASKS/TASK-REFACTOR-UNUSED-LIB-FUNCTIONS.md`와는 성격이 다르다(그 Task는
  "호출처 없는 미연결 함수" 정리이고, 이 Task는 "실제로 쓰이면서 다른 판정을
  내는 코드"의 불일치다). 서로 합치지 않는다.
