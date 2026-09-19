# REFACTOR-UNUSED-LIB-FUNCTIONS — lib 미연결 함수 정리 (기록용, 미착수)

- **Task ID:** `REFACTOR-UNUSED-LIB-FUNCTIONS`
- **Category:** REFACTOR
- **Status:** NOT_STARTED — 착수 금지, 기록만
- **기록일:** 2026-09-19 (mate-state.ts 인라인→lib 이동 diff 감사 중 발견)

## 배경

`src/lib/mate-state.ts`의 인라인 중복 이동 작업(2단계) 범위 확정 중, 아래 함수들이
어떤 실제 코드 경로에도 연결되어 있지 않거나(테스트 전용), 이동 대상 함수와 이름은
비슷하지만 의미가 달라 이동에서 제외된 것으로 확인되었다.

## 항목

1. **`effectiveMateStatus`** (`src/lib/mate-state.ts`)
   - lib에만 존재, 호출처 없음(테스트에서만 사용).
   - `MatePostList.tsx` / `mates/page.tsx` / `MateDetailPanel.tsx` 3곳은 각자 인라인으로
     `closed`(boolean)만 파생시켜 `"CLOSED"/"모집중"` 라벨 분기에 쓰고 있으며,
     `effectiveMateStatus`가 반환하는 `"open"/"closed"` 문자열 상태를 쓰지 않는다.
   - **판단 필요**: (a) 원래 이 3곳의 boolean 분기를 `effectiveMateStatus`로 통합할
     의도였는지, 아니면 (b) 애초에 불필요한 함수인지.
     - (a)면: 3곳을 `effectiveMateStatus(mate, todayIso) === "closed"`로 연결하는 작업.
     - (b)면: `effectiveMateStatus` 함수 및 관련 테스트 삭제.

2. **`MyActivity.tsx`의 `hasActiveApplicants`** (`src/components/account/MyActivity.tsx:75-78`)
   - `lib/mate-state.ts`의 `hasActiveApplication(applications, requesterId)`와 이름은
     비슷하지만 조회 축이 다르다: `hasActiveApplicants`는 `mate_id` 기준으로
     "이 모집글에 활성 신청자가 있는가"를 묻고, `hasActiveApplication`은 `requester_id`
     기준으로 "이 사용자가 활성 신청을 갖고 있는가"를 묻는다. 서로 대체 불가.
   - **판단 필요**: `hasActiveApplicants`를 lib에 별도 함수로 추출할 가치가 있는지
     (현재는 `MyActivity.tsx` 내부에만 존재).

## 참고

- 이번 2단계 이동 대상(`isMateClosed` 3곳, `hasActiveApplication` 1곳)에는 위 두 항목이
  포함되지 않는다. 별도 결정 없이 임의로 착수하지 않는다.
- 관련: `TASKS/TASK-SEC-APPLICATION-TRANSITION.md`(`canTransitionApplication` 보류 기록).
