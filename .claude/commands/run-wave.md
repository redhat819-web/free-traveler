---
description: Wave 단위로 Task를 prepare-task → implement-task 순서에 따라 하나씩 순차 구현한다(자동 Branch/PR/Merge 없음)
argument-hint: "WAVE_ID [--status | --dry-run | --resume]"
---

이 명령은 `TASKS/WAVE_PLAN.md`(Wave가 어떤 Task로 구성되는지)와 `TASKS/WAVE_STATE.json`(각 Wave의 진행 상태)을 읽어, 하나의 Wave 내부 Task를 `Depends On` 순서로 **한 번에 하나씩** `/prepare-task` → `/implement-task` 절차로 구현한다(`CLAUDE.md` 규칙 6·7, `DEC-010`·`DEC-011`). 이 명령 자체가 별도의 구현/검사 로직을 새로 만들지 않는다.

## 입력

- `WAVE_ID` (필수) — `TASKS/WAVE_PLAN.md`/`WAVE_STATE.json`에 정의된 Wave 식별자(예: `W13`).
- 옵션(상호 배타, 최대 1개) — `--status`, `--dry-run`, `--resume`. 아무 옵션도 없으면 기본 동작(순차 구현)을 수행한다.

`TASKS/WAVE_PLAN.md` 또는 `TASKS/WAVE_STATE.json`이 없으면, 또는 `WAVE_ID`가 두 파일에 없으면 어떤 옵션이든 진행하지 않고 `BLOCKED_INPUT`과 사유를 보고한 뒤 중단한다.

## Task 상태 판단 방법

`WAVE_STATE.json`의 각 Wave 객체는 **Wave 단위** 상태(`pending` | `in_progress` | `blocked` | `completed`)를 가지며, 선택적으로 **Task 단위** 상태를 담는 `tasks[]` 배열(`{ "task_id", "status", "commit" }`)을 가질 수 있다. 이 명령은 다음 우선순위로 판단한다(추측하지 않는다):

1. **1순위 — `tasks[]`가 있는 Wave**: 해당 Wave 객체에 `tasks[]`가 존재하면, 그 Task의 완료/pending/blocked 여부는 **`tasks[].status` 값을 그대로 신뢰**한다. 파일 존재 여부로 다시 추론하지 않는다. `commit`이 `null`이면 "구현은 됐지만 아직 커밋되지 않음"을 의미하며, 이 자체로 상태를 바꾸지 않는다.
2. **2순위 — `tasks[]`가 없는 Wave만** 기존 방식(파일 존재 기준)을 사용한다:
   - Task가 **완료**되었는지: `TASKS/TASK-<TASK_ID>.md`의 Expected Files가 실제로 모두 존재하는지(Glob/Read)로 판단한다. 단, Expected Files 중 **"수정(modify)" 대상으로 표기된 파일은 존재 여부만으로 완료를 판단하지 않는다**(그 파일은 대개 이미 존재하는 스타터 파일이라 "존재"가 "이 Task가 요구하는 수정을 반영했다"를 의미하지 않기 때문— 예: `src/app/layout.tsx`, `src/app/globals.css`). "create" 대상 파일만 존재 여부로 완료를 판단할 수 있다. modify 대상만 있는 Task는 `tasks[]`가 없는 한 파일 존재로 완료를 단정하지 말고 `BLOCKED_INPUT`(판단 불가)으로 보고한다.
   - Task가 **착수 가능**한지: `/prepare-task <WAVE_ID> <TASK_ID>`를 실제로 실행해 `READY_TO_IMPLEMENT`/`BLOCKED_*` 판정을 받는다.
   - Task가 **pending**(미착수)인지: (create 대상) Expected Files가 아직 하나도 존재하지 않고 `Depends On` 선행 Task가 모두 완료된 경우.
   - Task가 **blocked**인지: `/prepare-task` 판정이 `BLOCKED_*`이거나, Expected Files가 일부만 존재해 이전 실행이 중단된 것으로 보이는 경우.
3. **`tasks[]` 갱신 시점**: `/implement-task`로 한 Task를 구현한 직후, `WAVE_STATE.json`의 해당 Wave에 `tasks[]`가 있으면 그 Task 항목의 `status`를 즉시 갱신한다. 커밋 전이면 `commit`은 `null`로 둔다(커밋은 사용자가 명시적으로 요청할 때만 값이 채워진다).
4. **`--dry-run`과 `--status`는 `WAVE_STATE.json`을 수정하지 않는다** — 조회·시뮬레이션 목적이므로 `tasks[]`를 포함해 어떤 필드도 쓰지 않는다.

## `--status` — 현재 Wave와 Task 상태만 조회 (읽기 전용)

1. `WAVE_STATE.json`에서 `WAVE_ID`의 Wave 상태(`pending`/`in_progress`/`blocked`/`completed`)와 `checkpoint_required`/`checkpoint_result`를 읽는다.
2. `WAVE_PLAN.md`/`TASK_MANIFEST.csv`에서 이 Wave의 `task_ids`를 읽고, 각 Task에 대해 위 "Task 상태 판단 방법"으로 완료/pending/blocked 여부만 확인한다(이 단계에서는 `/prepare-task`의 8개 검사를 전부 실행하지 않고, Expected Files 존재 여부만으로 완료/미완료를 가볍게 판별한다 — 상세 판정이 필요하면 `--dry-run`을 사용한다).
3. Wave 상태 표와 Task별 상태 목록을 출력한다. **코드·문서·상태 파일 어느 것도 수정하지 않는다.**

## `--dry-run` — 실행 없이 계획만 출력 (읽기 전용)

1. `WAVE_ID`의 `task_ids`를 `Depends On` 기준 위상 정렬해 **실행될 순서**를 보여준다.
2. 이미 완료된 Task는 제외하고, 남은 각 Task에 대해 `/prepare-task <WAVE_ID> <TASK_ID>`를 실제로 실행해 현재 시점 판정(`READY_TO_IMPLEMENT` 또는 `BLOCKED_*`)을 보고한다.
3. 각 Task에 대해 실행될 Expected Files 목록과, 실행될 최소 검증(lint/typecheck/관련 Unit Test, Page Owner·E2E Task인 경우 Playwright)을 미리 나열한다.
4. Wave에 Page Owner Task가 포함되어 있으면 필요한 Browser Checkpoint(어느 Task 완료 직후 발생하는지)를 명시한다.
5. **`/implement-task`는 절대 실행하지 않는다.** 코드·문서·`WAVE_STATE.json` 어느 것도 수정하지 않는 순수 시뮬레이션이다.

## `--resume` — 중단된 Wave 재개

1. `WAVE_STATE.json`에서 `WAVE_ID`의 상태가 `blocked` 또는 `in_progress`인지 확인한다. `completed`이면 "이미 완료된 Wave입니다"를 보고하고 중단한다. `pending`이면 기본 동작(아래)과 동일하게 처음부터 시작한다.
2. `git status --porcelain`을 실행해 이전 세션이 남긴 미완료 변경이 있는지 확인한다. 있으면 그 상태를 그대로 보고하고 사용자 판단을 먼저 구한다(임의로 되돌리거나 커밋하지 않는다).
3. "Task 상태 판단 방법"에 따라 이 Wave에서 **가장 먼저 발견되는 pending 또는 blocked Task**부터 아래 "기본 동작"의 2번 단계로 이어서 실행한다.

## 기본 동작 — `/run-wave <WAVE_ID>` (옵션 없음)

1. **직전 Wave 완료 확인(규칙 1)** — `TASKS/WAVE_PLAN.md`의 Wave 순서(`W01`, `W02`, ...)에서 `WAVE_ID` 바로 앞 Wave를 찾는다. 그 Wave가 `WAVE_STATE.json`에서 `completed`가 아니면(첫 Wave `W01`은 이 검사를 생략한다) 이 Wave를 시작하지 않고 `BLOCKED_PREVIOUS_WAVE`와 함께 어떤 Wave가 완료되어야 하는지 보고한 뒤 중단한다.
2. **WAVE_STATE 갱신: `in_progress`** — 위 검사를 통과하면 `WAVE_STATE.json`의 `WAVE_ID` 상태를 `in_progress`로 갱신한다(이미 `in_progress`면 유지).
3. **pending Task 1개 선택** — 이 Wave의 `task_ids` 중 "Task 상태 판단 방법"으로 `pending`인 것을 `Depends On` 기준 위상 정렬해 **가장 먼저 실행 가능한 1개**만 선택한다. 남은 pending Task가 없으면 7번으로 진행한다.
4. **prepare-task 검사(규칙 3의 전제)** — 선택된 Task에 `/prepare-task <WAVE_ID> <TASK_ID>`의 8개 검사를 실행한다.
   - `BLOCKED_*`이면(**규칙 2**): `WAVE_STATE.json`의 이 Wave 상태를 `blocked`로 갱신하고, 사유(어떤 Task가 왜 blocked인지)를 기록한 뒤 **여기서 즉시 멈춘다**(같은 Wave의 다른 Task로 넘어가지 않는다).
5. **implement-task로 구현 + 최소 검증(규칙 3)** — `READY_TO_IMPLEMENT`이면 `/implement-task <WAVE_ID> <TASK_ID>`를 실행한다. Task 상세 파일의 "Test Cases"/"Verify"에 명시된 lint/typecheck/관련 Vitest만 최소 검증으로 실행한다(불필요한 전체 스위트 실행 금지). Page Owner Task이거나 `E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH`에 연결된 Task일 때만 관련 Playwright Chromium Smoke를 추가로 실행한다.
   - 검증이 하나라도 FAIL하면: `WAVE_STATE.json`의 이 Wave 상태를 `blocked`로 갱신하고 실패 원인을 보고한 뒤 멈춘다(다음 Task로 넘어가지 않는다).
6. **Browser Checkpoint 필요 여부 확인(규칙 4)** — 방금 완료한 Task가 이 Wave의 **Page Owner Task**(`category=PAGE_OWNER`)이면, `WAVE_STATE.json`의 `checkpoint_required`를 `true`로, `checkpoint_result`를 `null`로 설정하고 **`WAITING_FOR_PREVIEW`로 즉시 종료**한다(남은 pending Task가 있어도 더 진행하지 않는다 — `CLAUDE.md` 규칙 22). 사람이 Preview(Vercel Preview 또는 로컬 `next dev`)를 확인해 `checkpoint_result`를 기록하기 전까지 이 Wave를 자동으로 재개하지 않는다.
7. **다음 pending Task 계속 처리** — Page Owner Task가 아니었고 검증이 PASS했으면, 3번으로 돌아가 다음 pending Task를 처리한다.
8. **Wave 전체 완료(규칙 5)** — 남은 pending Task가 없고 Browser Checkpoint도 필요 없거나 이미 사람이 확인해 `checkpoint_result`가 채워졌으면, `WAVE_STATE.json`의 이 Wave 상태를 `completed`로 갱신하고 아래 "종료 보고" 형식으로 보고한다. **다음 Wave(`--resume`이든 새 `WAVE_ID`든)는 사람이 이 보고를 확인하고 명시적으로 다음 명령을 입력하기 전까지 자동으로 시작하지 않는다.**

## 종료 보고

`--status`/`--dry-run`을 제외한 모든 종료 지점(`WAITING_FOR_PREVIEW`, `blocked`, `completed`)에서 아래 5개 항목을 반드시 보고한다.

```
RESULT: <WAITING_FOR_PREVIEW | BLOCKED_PREVIOUS_WAVE | BLOCKED_* (Task 사유) | COMPLETED>
WAVE_ID: <입력값>

## 완료 Task
<이번 실행에서 DONE으로 확인된 TASK_ID 목록, 없으면 "없음">

## 변경 파일
<실제로 생성/수정된 파일 목록(Task별로 구분)>

## 통과한 검사
<Task별 lint/typecheck/Unit Test/Playwright 결과>

## 남은 수동 Browser 확인
<checkpoint_required=true이고 checkpoint_result가 비어 있으면 어느 화면/Task인지 명시, 없으면 "없음">

## 다음에 입력할 명령
<예: "/run-wave W13" (Preview 확인 후 재개), "/run-wave W13 --resume" (blocked 해소 후), 또는 "다음 Wave 착수 전 사용자 승인 필요">
```

## 금지 사항

- **자동 Branch 생성, PR 생성, Merge를 포함하지 않는다.**(규칙 6) 이 명령의 어떤 옵션도 `git branch`/`git push`/`gh pr create`/Merge를 실행하지 않는다(`CLAUDE.md` 규칙 21, `DEC-012`, `AUTO_MERGE=false`).
- 한 시점에 Wave 하나, Task 하나만 `in_progress`로 진행한다. 여러 Task를 동시에 구현하지 않는다.
- `/prepare-task`에서 `BLOCKED_*`로 판정된 Task를 강제로 진행하지 않는다.
- 검증이 FAIL한 Task를 완료로 표시하지 않는다.
- Browser Checkpoint를 임의로 건너뛰어 다음 Wave로 진행하지 않는다(규칙 4·5).
- 직전 Wave가 `completed`가 아닌 상태에서 다음 Wave를 시작하지 않는다(규칙 1).
- `WAVE_PLAN.md`를 이 명령이 자동으로 재작성하지 않는다(계획 변경은 사용자 승인을 거친 별도 작업).
