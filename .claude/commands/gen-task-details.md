---
description: TASKS/00_TASK_LIST.md의 각 Task에 대해 상세 파일(TASKS/TASK-<ID>.md)을 1:1로 생성하고 scripts/audit_tasks.py를 실행한다
argument-hint: "[TASK_ID|all]"
---

`traveler-project-pipeline` Skill(특히 §1 입력 문서, §4 Task List·상세 Task 형식, §5 Page Owner/Component 분리, §11 EXCLUDED 보호)을 사용해 Task 상세 파일을 생성한다. 인자가 없거나 `all`이면 `TASKS/00_TASK_LIST.md`의 모든 구현 Task를 대상으로 한다. 특정 `TASK_ID`가 주어지면 그 Task 하나만 생성/갱신한다. 이 명령은 **구현 코드를 만들지 않는다** — 산출물은 명세 문서(`TASKS/TASK-<ID>.md`)뿐이다.

## 절차

1. `TASKS/00_TASK_LIST.md`가 없으면 "먼저 `/gen-tasklist`를 실행하십시오"라고 안내하고 중단한다.
2. `TASKS/00_TASK_LIST.md`를 실제로 읽어 대상 Task ID를 Seq 순서로 추출한다. 이때 중복 Task ID, 빈 필수 열, 존재하지 않는 `Depends On` 참조가 없는지 먼저 검사한다 — 문제가 있으면 상세 파일을 만들기 전에 원인을 보고한다.
3. 대상 Task마다 이미 `TASKS/TASK-<ID>.md`가 존재하면 **재생성하지 않는다**(중복 파일 생성 금지). 존재하지 않을 때만 새로 만든다.
4. `docs/PROJECT_SCOPE.md` §5 NON_IMPLEMENTATION(EXCLUDED) 표를 실제로 읽는다. EXCLUDED Requirement에 대해서는 상세 구현 파일을 만들지 않는다(Skill §11).
5. Page Owner Task는 Skill §5에 따라 **하위 Component를 새로 만드는 범위가 아니라, 실제 Route Page 조립만** 범위로 상세화한다.
6. DB Task는 Skill §6에 따라 정의된 6개 Table(`member_profiles`, `mates`, `mate_applications`, `mate_blocks`, `mate_reports`, `outbound_url_settings`) 범위를 넘지 않게 상세화한다.
7. 각 상세 파일은 `TASKS/TASK-<ID>.md`에 아래 13개 절을 이 순서로 포함한다(Skill §4와 동일).

   ```markdown
   # <TASK_ID> — <제목>

   - Task ID / 제목 / Category / Type / Priority / Screen·Route·Page Entry

   ## Context
   ## Project Scope
   ## Requirement Ref
   ## Screen / Route / Page Entry
   ## Design Ref
   ## Depends On
   ## Expected Files
   ## Functional AC
   ## Visual AC
   ## Security/Privacy AC
   ## Test Cases
   ## Verify
   ## Definition of Done
   ## Forbidden
   ```

   - **Expected Files**는 실제 `src/app`/`src/data`/`supabase` 트리를 Glob/Read로 확인한 결과에 근거하며, Expected Files 밖 파일은 수정하지 않는다는 점을 명시한다.
   - **Security/Privacy AC**: 항공·숙소 입력 관련 Task는 "입력값을 서버·DB·외부 URL·로그로 전달하지 않는다"(Skill §7)를, Auth/RLS 관련 Task는 성인 확인·RLS 3단계 원칙(Skill §8)을 명시한다.
   - **Forbidden**: `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `global_prohibitions` + 해당 Screen의 `prohibited_features`, Expected Files 밖 수정 금지, 이 단계에서 구현 코드·Branch·Commit을 만들지 않는다는 점을 포함한다.
8. 이미 구현된 것처럼 "완료" 표시를 하지 않는다. 상세 파일은 구현 이전 단계의 명세이며, Definition of Done 체크박스는 모두 미체크 상태로 생성한다.
9. 모든 대상 Task의 상세 파일 생성을 마치면 Task List 구현 ID와 `TASKS/TASK-*.md` 파일명을 1:1 대조한다.
10. `python scripts/audit_tasks.py`를 실행한다.
11. 종료 코드가 0이 아니면(즉 `AUDIT_FAIL`이면) **이 Task Audit 실패를 무시하지 않는다** — `TASKS/TASK_AUDIT_REPORT.md`의 FAIL 원인을 Task List 또는 상세 파일에 반영해 수정하고, 10번을 재실행한다. 통과(`AUDIT_PASS`)할 때까지 이 명령을 완료로 보고하지 않는다.
