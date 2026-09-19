# SEC-APPLICATION-TRANSITION — 참가 요청 상태 전이 서버 강제 (기록용, 미착수)

- **Task ID:** `SEC-APPLICATION-TRANSITION`
- **Category:** SECURITY_HARDENING
- **Status:** NOT_STARTED — 착수 금지, 기록만
- **기록일:** 2026-09-19 (W22 UNIT-MATE-STATE 작업 중 발견)

## 문제

"참가 요청은 PENDING 상태에서만 ACCEPTED/REJECTED로 전이할 수 있다"는 규칙이 **코드 어디에도 서버 측 강제 로직으로 존재하지 않는다.**

- `src/lib/db/applications.ts`의 `updateApplicationStatus(applicationId, status)`는 현재 상태와 무관하게 무조건 update를 수행한다(상태 전이 검증 없음).
- `supabase/rls_policies.sql`의 `mate_applications_update_author` 정책은 "누가"(작성자/Admin) 바꿀 수 있는지만 검사하고, "어떤 상태에서 어떤 상태로" 바꿀 수 있는지는 검사하지 않는다.
- `src/components/mates/JoinRequestForm.tsx`는 `{app.status === "pending" && (...승인/거절 버튼...)}` 식으로 **UI 버튼 노출 조건으로만** 이 규칙을 흉내내고 있다 — API를 직접 호출하면(예: devtools, 재요청) ACCEPTED/REJECTED 상태의 요청도 다시 상태를 바꿀 수 있다.

## 영향

- 낮음~중간: 악용 시 이미 거절된 요청을 승인 처리하거나, 승인된 요청을 임의로 거절 처리하는 등 데이터 일관성 문제가 발생할 수 있다. 다만 mate_applications는 author_id 소유 mate에 한정되므로 제3자 악용 범위는 제한적이다.

## 처리 방향(결정 필요)

1. `src/lib/db/applications.ts`의 `updateApplicationStatus`에 현재 상태 조회 후 `pending → accepted/rejected`만 허용하는 서버 측 검증 추가.
2. 또는 RLS `mate_applications_update_author` 정책의 `using`/`with check` 절에 `status = 'pending'` 조건을 추가해 DB 레벨에서 강제.

## 후속 조치

- `mate-state.ts`의 `canTransitionApplication()`은 이번 W22 UNIT-MATE-STATE 작업에서 "이동"이 아니라 **새로 추론해 작성한 순수 함수**이며, 아직 어떤 실제 코드 경로에서도 호출되지 않는다(테스트 전용). 이 Task가 착수되면 실제 서버 액션/RLS에 연결해야 함.
