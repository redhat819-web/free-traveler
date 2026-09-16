---
description: Wave 단위로 Task를 prepare-task → implement-task 순서에 따라 하나씩 순차 구현한다(자동 Branch/PR/Merge 없음)
argument-hint: "W03 | status | resume | dry-run W03"
---

이 명령은 `WAVE_PLAN`(Wave가 어떤 Task로 구성되는지)과 `WAVE_STATE`(각 Task의 진행 상태)를 읽어, 하나의 Wave 내부 Task를 `Depends On` 순서로 **한 번에 하나씩** 구현한다(`CLAUDE.md` 규칙 6·7, `DEC-010`·`DEC-011`). `/prepare-task`와 `/implement-task`의 규칙을 그대로 사용하며, 이 명령 자체가 별도의 구현/검사 로직을 새로 만들지 않는다.

## WAVE_PLAN / WAVE_STATE

- **WAVE_PLAN**: `TASKS/WAVE_PLAN.md` — Wave ID(`W01`, `W02`, ...)별로 어떤 `TASK_ID` 목록이 포함되는지 정의한 문서. 사용자가 사전에 작성/승인한다. 이 명령은 WAVE_PLAN을 자동으로 생성하지 않는다 — 없으면 §"입력 부재 처리"를 따른다.
- **WAVE_STATE**: `TASKS/WAVE_STATE.json` — 각 `TASK_ID`의 현재 상태(`READY` | `IN_PROGRESS` | `DONE` | `BLOCKED`)와 마지막 갱신 시각을 기록한 상태 파일. 최초 실행 시 없으면 WAVE_PLAN 기준으로 전체 Task를 `READY`로 초기화해 생성한다(단, `Depends On`이 아직 `DONE`이 아닌 Task는 `BLOCKED`로 표시).
- 두 파일 모두 실제로 Read해서 사용하며, 내용을 추측하지 않는다.

### 입력 부재 처리

- `TASKS/WAVE_PLAN.md`가 없으면: 어떤 하위 명령(`W03`/`status`/`resume`/`dry-run`)이든 구현을 진행하지 않고, "WAVE_PLAN이 없어 Wave를 실행할 수 없습니다 — 먼저 Wave 계획을 작성/승인하십시오"를 보고한 뒤 중단한다.
- 지정한 `WAVE_ID`가 WAVE_PLAN에 없으면: `/prepare-task`의 `BLOCKED_INPUT`과 동일한 취지로 중단하고 사유를 보고한다.

## 지원 명령

### `/run-wave W03` — 지정 Wave 실행

1. **WAVE_PLAN·WAVE_STATE 읽기** — `TASKS/WAVE_PLAN.md`에서 `W03`에 포함된 `TASK_ID` 목록을 읽고, `TASKS/WAVE_STATE.json`에서 각 Task의 현재 상태를 읽는다.
2. **READY Task 1개 선택** — `W03`에 속한 Task 중 상태가 `READY`인 것을 `TASKS/TASK_MANIFEST.csv`/`TASKS/TASK-<ID>.md`의 `Depends On`을 기준으로 위상 정렬(topological order)해 **가장 먼저 실행 가능한 1개**만 선택한다. `READY` Task가 없으면 6·7·8번으로 진행해 종료 조건을 판단한다.
3. **prepare-task 규칙으로 검사** — 선택된 Task에 대해 `/prepare-task W03 <TASK_ID>`와 동일한 8개 검사(Working Tree, Wave 포함 여부, Depends On 완료, Expected Files, SRS/Scope/Design/Screen Ref, 필요 환경변수, Secret 하드코딩 위험, EXCLUDED 범위)를 실행한다.
   - 판정이 `READY_TO_IMPLEMENT`가 아니면: 해당 Task의 WAVE_STATE를 `BLOCKED`로 갱신하고 사유를 기록한 뒤, 같은 Wave의 다른 `READY` Task가 있으면 2번으로 돌아간다. 없으면 실행을 멈추고 `BLOCKED_*` 사유와 함께 종료한다(자동으로 Wave를 건너뛰거나 임의로 재시도하지 않는다).
4. **implement-task 규칙으로 구현** — `READY_TO_IMPLEMENT`로 확인된 Task 1개에 대해서만 `/implement-task W03 <TASK_ID>`와 동일한 절차(Expected Files 범위 구현 → Functional/Visual/Security AC 충족 → Page Owner 조립 규칙 → 관련 Unit Test → 필요 시 Playwright → 금지 기능 확인 → Diff 확인)를 수행한다. 이 단계 전에 WAVE_STATE의 해당 Task를 `IN_PROGRESS`로 갱신한다.
5. **검증 PASS 시 DONE 갱신** — Task의 lint/typecheck/Unit Test(및 해당 시 Playwright)가 모두 PASS하면 WAVE_STATE의 해당 Task를 `DONE`으로 갱신하고, 변경 파일·검증 결과를 보고한다. 하나라도 FAIL하면 `IN_PROGRESS` 또는 `BLOCKED`로 유지하고 원인을 보고한 뒤 **다음 Task로 넘어가지 않고 중단**한다(실패를 무시하고 진행하지 않는다).
6. **다음 READY Task 계속 처리** — 5번이 DONE으로 끝났으면, 같은 Wave에 남은 `READY`(의존성이 이제 해소되어 새로 `READY`가 된 Task 포함) Task가 있는지 다시 확인하고 2번부터 반복한다.
7. **Wave 전체 완료 시 종료** — `W03`의 모든 Task가 `DONE`이면 반복을 멈추고 Wave 완료를 보고한다(변경 파일 누적 목록, 각 Task 검증 결과 요약).
8. **Preview Checkpoint 시 대기 종료** — WAVE_PLAN에 이 Wave에 대한 "사람 Preview Checkpoint"가 정의되어 있고 그 지점에 도달했다면(예: 해당 Screen의 Page Owner Task가 DONE이 되어 화면 단위 확인이 필요한 시점, `CLAUDE.md` 규칙 22), 남은 Task가 있더라도 더 진행하지 않고 **`WAITING_FOR_PREVIEW`**로 종료한다. 이 상태에서는 사람이 Preview(Vercel Preview 또는 로컬 `next dev`)를 확인하기 전까지 같은 Wave를 자동으로 재개하지 않는다.

### `/run-wave status` — 현재 상태 조회

- `TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`을 읽어, Wave별 Task 총수와 `READY`/`IN_PROGRESS`/`DONE`/`BLOCKED` 개수를 표로 보고한다.
- 코드나 상태 파일을 수정하지 않는다(읽기 전용).
- WAVE_PLAN/WAVE_STATE가 없으면 그 사실만 보고한다.

### `/run-wave resume` — 중단된 Wave 재개

- `TASKS/WAVE_STATE.json`에서 `IN_PROGRESS` 또는 `BLOCKED` 상태인 Task가 속한 Wave를 찾는다.
- `IN_PROGRESS`로 남아 있던 Task가 있으면, 먼저 `/prepare-task`의 검사 1(Working Tree)부터 다시 실행해 이전 세션이 남긴 미완료 변경이 있는지 확인한다. 있으면 그 상태를 그대로 보고하고 사용자 판단을 먼저 구한다(임의로 되돌리거나 커밋하지 않는다).
- 이후 해당 Wave에 대해 `/run-wave <WAVE_ID>`와 동일한 절차(2~8단계)를 이어서 실행한다.
- 재개할 `IN_PROGRESS`/`BLOCKED` Task가 없으면 "재개할 Wave가 없습니다"를 보고한다.

### `/run-wave dry-run W03` — 실행 없이 계획만 출력

- WAVE_PLAN·WAVE_STATE를 읽고, `W03`의 Task를 `Depends On` 기준 위상 정렬해 **실행될 순서**를 미리 보여준다.
- 각 Task에 대해 `/prepare-task`의 8개 검사를 실제로 실행해 현재 시점 판정(`READY_TO_IMPLEMENT` 또는 `BLOCKED_*`)만 보고한다.
- **구현(`/implement-task`)은 절대 실행하지 않는다.** 코드·문서·WAVE_STATE 어느 것도 수정하지 않는 순수 시뮬레이션이다.

## 금지 사항

- **자동 Branch 생성, PR 생성, Merge를 포함하지 않는다.** 이 명령의 어떤 하위 명령도 `git branch`/`git push`/`gh pr create`/Merge를 실행하지 않는다(`CLAUDE.md` 규칙 21, `DEC-012`, `AUTO_MERGE=false`).
- 한 시점에 Wave 하나, Task 하나만 `IN_PROGRESS`로 진행한다. 여러 Task를 동시에 구현하지 않는다.
- `/prepare-task`에서 `BLOCKED_*`로 판정된 Task를 강제로 진행하지 않는다.
- 검증이 FAIL한 Task를 DONE으로 표시하지 않는다.
- Preview Checkpoint를 임의로 건너뛰어 다음 Wave로 진행하지 않는다.
- WAVE_PLAN을 이 명령이 자동으로 재작성하지 않는다(계획 변경은 사용자 승인을 거친 별도 작업).
