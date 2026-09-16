---
description: prepare-task가 READY_TO_IMPLEMENT로 판정한 Task 1개를 Expected Files 범위 안에서 구현한다(기본적으로 Commit/Push/PR 없음)
argument-hint: "WAVE_ID TASK_ID"
---

`WAVE_ID`와 `TASK_ID`로 지정된 Task **하나만** 구현한다. `/prepare-task`를 거치지 않았거나 그 판정이 `READY_TO_IMPLEMENT`가 아니면 구현을 시작하지 않는다. `CLAUDE.md`의 "Task 완료 순서" 7단계(Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고)를 그대로 따른다.

## 절차

1. **선행 판정 확인** — `/prepare-task WAVE_ID TASK_ID`를 실행했거나 그 결과를 이미 가지고 있는지 확인한다. 결과가 없으면 먼저 `/prepare-task`를 실행한다. 판정이 `READY_TO_IMPLEMENT`가 아니면(즉 `BLOCKED_*`) **구현을 시작하지 않고** 해당 `BLOCKED_*` 사유를 그대로 보고한 뒤 중단한다. 같은 Wave/시점에 두 번째 `TASK_ID`를 동시에 구현하지 않는다(`CLAUDE.md` 규칙 7 — 한 번에 하나만).
2. **Task 읽기** — `TASKS/TASK-<TASK_ID>.md`의 Context, Project Scope, Requirement Ref, Screen/Route/Page Entry, Design Ref, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Test Cases, Verify, Forbidden을 전부 읽는다.
3. **입력 확인** — Design Ref(`design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`)와 선행 Task 산출물을 실제로 읽어 확인한다.
4. **구현** — `Expected Files` 목록에 있는 파일만 생성·수정한다. 그 밖의 파일은 건드리지 않는다.
   - **Functional AC**를 전부 충족하도록 동작을 구현한다.
   - **Visual AC**를 전부 충족하도록 레이아웃·반응형·Empty State·Lorem ipsum/"준비 중" 금지 등을 반영한다.
   - **Security/Privacy AC**를 전부 충족한다(특히 항공·숙소 입력값은 서버·DB·URL·로그로 전달하지 않는다, RLS 우회 금지, Service Role Key는 Server 전용).
   - Task Type이 **Page Owner**이면 새 Component를 만들지 않고, 실제 Page Entry(`page.tsx`)에서 이미 존재하는 Component를 조립하는 것만 수행한다. SCR-001이면 Next.js 기본 스타터 콘텐츠를 완전히 제거하고, SCR-003이면 항공/숙소/동행 3탭을 실제로 조립하며, SCR-005이면 Guest/Member/Admin 3역할을 실제로 조립한다.
5. **관련 Unit Test 실행** — Task 상세 파일의 "Test Cases"/"Verify"에 연결된 Vitest 단위 테스트(예: `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`)가 있으면 실행한다. 필요하면 이 Task 범위에 해당하는 신규/수정 단위 테스트도 Expected Files 안에서 함께 작성한다. 관련 Unit Test가 없는 Task 유형(예: 순수 정적 데이터)은 이 단계를 생략하되 그 사실을 완료 보고에 기록한다.
6. **필요 시에만 Playwright 실행** — 이 Task가 **Page Owner Task**이거나 **E2E Task**(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`) 자체일 때만 관련 Playwright Chromium Smoke를 실행한다. 그 외 Component/Data/DB/Global/Auth Task 구현만으로는 Playwright를 실행하지 않는다(불필요한 실행 금지).
7. **금지 기능 확인** — 구현 중 AWS·EC2·Prisma 등 ORM·자동 Merge(무인 Merge Runner) 관련 코드·설정·의존성을 추가하지 않는다. `package.json`에 이런 의존성이 새로 추가되지 않았는지 확인한다.
8. **Diff 확인** — `git status`/`git diff`로 실제 변경 파일이 Expected Files와 정확히 일치하는지, Forbidden 항목이 포함되지 않았는지 확인한다. Expected Files 밖 변경이 있으면 되돌리거나 사용자에게 보고하고 확인을 받는다.
9. **완료 보고** — 아래 3가지를 반드시 보고한다.
   - **변경 파일** — 실제로 생성/수정된 파일 목록(Expected Files와 대조 결과 포함).
   - **검증 결과** — 실행한 lint/typecheck/Unit Test/Playwright(해당 시)의 통과·실패 여부.
   - **남은 제약사항** — 이 Task 범위에서 의도적으로 다루지 않은 것, 후속 Task가 필요한 부분, AC 중 검증하지 못한 항목이 있다면 명시.

## Commit/Push/PR 정책

- 이 명령은 **기본적으로 Commit, Push, PR 생성을 자동으로 수행하지 않는다**(`CLAUDE.md` 규칙 21, `DEC-012`). 구현과 검증까지만 수행하고 Working Tree는 변경된 상태(unstaged 또는 사용자 확인 대기)로 남긴다.
- **사용자가 명시적으로 요청한 경우에 한해** 이 Task 단위로 **Commit까지만** 수행할 수 있다. 이때도:
  - 해당 Task의 Expected Files만 `git add`한다(`git add -A`/`git add .` 금지).
  - 커밋 메시지는 이 Task(`TASK_ID`)의 변경만 설명한다(여러 Task를 한 커밋에 묶지 않는다).
  - Push, PR 생성, Merge는 사용자가 별도로 명시적으로 요청하지 않는 한 수행하지 않는다.
  - destructive Git 명령(`git reset --hard`, `git clean -f`, force push 등)은 이 명령의 범위가 아니며 사용하지 않는다.

## 금지 사항

- `/prepare-task` 없이, 또는 `BLOCKED_*` 판정 상태에서 구현을 시작하지 않는다.
- 한 번의 실행에서 여러 `TASK_ID`를 동시에 구현하지 않는다.
- Expected Files 밖 파일을 생성·수정하지 않는다.
- EXCLUDED로 분류된 기능을 임의로 구현하지 않는다(`CLAUDE.md` 규칙 19).
- AWS·EC2·ORM(Prisma 등)·자동 Merge 관련 코드·의존성·워크플로를 추가하지 않는다.
- 사용자 요청 없이는 Commit도 만들지 않으며, 어떤 경우에도 Push·PR·Merge를 자동으로 수행하지 않는다.
