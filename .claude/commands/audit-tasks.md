---
description: scripts/audit_tasks.py를 실행해 TASKS/ Task List·상세 파일·Requirement 커버리지를 감사한다
---

`traveler-project-pipeline` Skill(감사 절 및 §1~12)을 사용해 `python scripts/audit_tasks.py`를 실행하고, `TASKS/TASK_AUDIT_REPORT.md`와 `TASKS/TASK_MANIFEST.csv` 결과를 사용자에게 요약 보고한다. 이 명령은 감사만 수행하며 구현 코드나 Task 파일을 생성/수정하지 않는다.

## 절차

1. `TASKS/00_TASK_LIST.md`가 없으면 "먼저 `/gen-tasklist`를 실행하십시오"라고 안내하고 중단한다.
2. `TASKS/TASK-*.md`가 하나도 없으면 "먼저 `/gen-task-details`를 실행하십시오"라고 안내하고 중단한다.
3. `python scripts/audit_tasks.py`를 실제로 실행한다(결과를 추측하거나 이전 실행 기억으로 대체하지 않는다).
4. 종료 코드가 0이면 18개 검사(1:1 대조, 중복 Task ID 0, Depends On 누락 0, Dependency Cycle 0, Screen 5개 Page Owner 1:1, Route/Page Entry/Expected Files 계약 일치, Component-only Screen 0, SCR-001/003/005 AC, DB 4역할 Task, DB Table 6개 상한, 외부 입력 비저장 AC, Auth·성인·RLS AC, Playwright Chromium Smoke 3종, AWS·EC2·자동 Merge 0, REQ-FUNC 80+REQ-NF 34 전수 커버리지, EXCLUDED 상세 파일 미생성)가 모두 통과했다는 뜻이다. `AUDIT_PASS (18 checks)`와 `TASKS/TASK_AUDIT_REPORT.md`의 PASS 목록을 그대로 보고한다.
5. 종료 코드가 0이 아니면(`AUDIT_FAIL`) **이 실패를 무시하지 않는다.** `TASKS/TASK_AUDIT_REPORT.md`의 FAIL 항목을 원인별로 정리해 보고하고, `TASKS/00_TASK_LIST.md` 또는 어떤 `TASKS/TASK-<ID>.md` 상세 파일을 수정해야 하는지 구체적으로 제안한다. 이 상태를 완료·통과로 보고하지 않으며, 사용자가 명시적으로 재검토를 보류하라고 하지 않는 한 실패 상태로 작업을 종료하지 않는다.
6. WARN 항목(예: DB Table 6개 초과 경고, SCR-003 외부 링크 대체 금지 문구 미확인 등)은 실패로 취급하지 않되, 감사를 통과로 보고하더라도 WARN 목록은 반드시 함께 사용자에게 알려 검토를 유도한다.
7. `TASKS/TASK_MANIFEST.csv`가 갱신되었는지 확인하고, Task 총수·Category별 개수를 함께 보고한다.
8. 이 명령 실행 중에는 `src/`, `supabase/` 등 구현 관련 코드나 설정 파일을 생성·수정하지 않는다. 감사 결과가 실패면 원인 설명과 수정 제안만 제공하고, 실제 수정은 `/gen-tasklist` 또는 `/gen-task-details` 재실행으로 이어지도록 안내한다.
