# GAP-ACCOUNT-MY-SENT-APPLICATIONS — 내가 보낸 참가 요청이 /account에 표시되지 않음 (기록용, 미착수)

- **Task ID:** `GAP-ACCOUNT-MY-SENT-APPLICATIONS`
- **Category:** GAP
- **Status:** NOT_STARTED — 착수 금지, 기록만
- **기록일:** 2026-09-19 (`auth-smoke.spec.ts` 삭제 전 커버리지 대조 중 발견)

## 배경

`tests/e2e/auth-smoke.spec.ts`(규칙 18 위반으로 삭제 예정, `mate-auth.spec.ts`와
중복)의 `E2E-007` 시나리오는 "참가자가 참가 요청을 보낸 뒤 `/account`의 '내 활동'
화면에서 그 요청이 보이는지"를 검증하려 했다. 삭제 전 `mate-auth.spec.ts`가 이
시나리오를 대신 커버하는지 확인하는 과정에서, **이 기능 자체가 구현되어 있지
않다는 것**을 발견했다.

## 문제

- `src/components/account/MyActivity.tsx`는 `mates` 테이블을 `author_id = userId`로만
  조회한다 — **내가 작성한 모집글에 들어온 참가 요청**만 보여준다.
- **내가 다른 사람의 모집글에 보낸 참가 요청**은 `/account` 어디에도 표시되지 않는다.
- `src/lib/db/applications.ts`에도 "내가 보낸 신청 목록"을 조회하는 함수가 없다
  (`listApplicationsForMate(mateId)`만 있고, `requester_id` 기준 조회 함수는 없음).
- 참가자가 본인이 보낸 신청 상태를 확인할 수 있는 유일한 곳은 해당 모집글 상세의
  `JoinRequestForm`(`내 참가 요청: {status}` 인라인 표시)뿐이다 — 모집글을 다시
  찾아가야만 확인 가능하고, `/account`에 모아보는 화면이 없다.

## 검토 필요

1. 이게 SRS/PROJECT_SCOPE상 실제로 요구되는 기능인지 확인한다(`docs/06_SRS_UIUX_REVISED.md`,
   `TASKS/00_TASK_LIST.md`의 `CMP-SCR005-MY-ACTIVITY` AC 원문 재확인 필요 — 현재 AC에는
   "내 글 수정/마감/삭제, 참가 요청 승인/거절, 차단 목록·해제"만 있고 "내가 보낸 신청"은
   명시되어 있지 않아, 애초에 범위 밖이었을 가능성도 있다).
2. 범위 안이라면: `src/lib/db/applications.ts`에 `requester_id` 기준 조회 함수 추가,
   `MyActivity.tsx`에 "내가 보낸 참가 요청" 섹션 추가.
3. 범위 밖이라면: `auth-smoke.spec.ts` E2E-007 후반부는 애초에 잘못된 가정으로 작성된
   시나리오였다는 뜻이므로, 이 기록만 남기고 별도 조치 없이 종결.
