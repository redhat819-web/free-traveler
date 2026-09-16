---
description: Traveler 5-Screen Task List(TASKS/00_TASK_LIST.md) 생성 및 갱신
---

`traveler-project-pipeline` Skill(§1~12)을 사용해 Task List를 생성/갱신한다. 이 명령은 Task **목록**(`TASKS/00_TASK_LIST.md`)만 만든다 — 구현 코드는 만들지 않으며, Task별 상세 파일은 `/gen-task-details`가 만든다.

## 절차

1. **Skill 로드** — `traveler-project-pipeline` Skill을 사용한다. Skill §1(입력 문서 목록)에 정의된 문서를 이 순서대로 실제로 읽는다: `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/UI_CONTRACT.md`, `design-reference/D-001/DESIGN.md`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`. 어떤 문서 내용도 추측하지 않는다.
2. `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `schema_version`이 `traveler-screen-route-v1`(`CLAUDE.md`의 `HARNESS_SCHEMA`)과 일치하는지 확인한다. 불일치 시 중단하고 보고한다.
3. Glob/Read로 **실제 파일 트리**를 확인한다(`src/app/**`, `src/data/**`, `package.json`). 이미 존재하는 파일과 없는 파일을 정확히 구분해 각 Task의 `Expected Files`에 반영한다(`create` / `replace_starter` / `modify`). 확인하지 않은 경로를 추측해서 적지 않는다.
4. Skill §2에 따라 **Page Owner Task 5개**(Screen당 정확히 1개)를 만든다. 각 Page Owner Task의 Requirement Ref/AC 초안에는 Skill §5의 SCR-001(스타터 제거)·SCR-003(3탭 조립)·SCR-005(Guest/Member/Admin 조립) 특례를 반영한다.
5. Skill §5에 따라 Screen별 **Component Task**를 만든다. Page Owner Task의 `Depends On`은 같은 Screen의 Component/Data/DB/Global Task로만 구성한다.
6. Skill §6에 따라 **정적 데이터 Task**(여행지·안전정보·대표 소개·검증 스크립트, `src/data/**`)를 만든다. Admin CRUD/CMS Task는 만들지 않는다.
7. Skill §6·§8에 따라 **DB Task**(Schema/RLS/Access/Seed 4종, 6개 Table 상한)와 **Auth Task**(이메일 인증·성인 확인)를 만든다.
8. **Global/CI Task**(전역 내비게이션·Footer, 반응형, SEO, 접근성, 오류 화면, Toast, CI 파이프라인)를 만든다.
9. Skill §7에 따라 항공·숙소 조건 입력 Component Task에는 "입력값을 서버·DB·외부 URL·로그로 전달하지 않는다"를 Functional/Security AC 초안에 명시한다.
10. Skill §9에 따라 **Playwright Chromium Smoke Task 3개만**(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`) 만든다. 이 외 Unit/Integration/Manual/Release Task도 함께 정리하되 Chromium 외 브라우저·회귀·시각 회귀 Task는 만들지 않는다.
11. Skill §12에 따라 AWS·EC2·자동 Merge Runner 관련 Task를 만들지 않는다.
12. Skill §3에 따라 114개 Requirement(`REQ-FUNC-001~080`, `REQ-NF-001~034`) 전부에 IMPLEMENT 또는 EXCLUDED 상태를 부여한다. IMPLEMENT는 최소 1개 Task에 매핑하고, EXCLUDED는 어떤 Task에도 매핑하지 않는다(§11 EXCLUDED 보호).
13. 결과를 `TASKS/00_TASK_LIST.md` 한 문서에 기록한다(요약 집계, Page Owner AC, Screen별 Component/Data/DB/Global/CI/Test/Manual/Release Task 표, §5 NON_IMPLEMENTATION(EXCLUDED) 표, §6 Requirement Coverage Index 114건 전수 확인). 이 문서는 계획 문서이며, 이 단계에서 구현 코드·Git Branch·Commit을 만들지 않는다.
14. Task 개수는 참고용으로 보고하되(예: 60~70개), 개수 자체를 성공/실패 기준으로 삼지 않는다. 통과 기준은 Skill의 12개 규칙과 `scripts/audit_tasks.py`의 18개 검사다.
15. 이 시점에는 `TASKS/TASK-<ID>.md` 상세 파일을 만들지 않는다 — 다음 단계는 `/gen-task-details`다.
