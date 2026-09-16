---
description: Task/Wave 상태, Page Owner 5개, CI, Playwright Smoke, DB, Preview, EXCLUDED를 검사해 RELEASE_READY/RELEASE_BLOCKED를 판정한다(읽기 전용)
---

배포(Vercel 프로덕션 반영·사용자에게 "완료"로 보고) 직전에, 실제 상태를 근거로 릴리스 가능 여부를 판정한다. 이 명령은 **읽기 전용**이다 — 코드·Task 파일·WAVE_STATE·Git 상태를 수정하지 않으며, 부족한 부분을 스스로 고치지 않고 보고만 한다.

## 검사 절차

아래 7개 항목을 이 순서대로 실제로 확인한다. 각 항목은 "확인한 파일/명령"과 "근거"를 함께 기록한다 — 추측이나 이전 대화 기억으로 대체하지 않는다.

1. **Task·Wave 상태**
   - `TASKS/WAVE_STATE.json`(있으면)과 `TASKS/WAVE_PLAN.md`를 읽어 모든 Wave의 모든 Task가 `DONE`인지 확인한다.
   - `TASKS/WAVE_STATE.json`이 없으면(Wave 파이프라인을 아직 쓰지 않은 경우) 대신 `TASKS/TASK_MANIFEST.csv`와 `TASKS/TASK-<ID>.md`의 Definition of Done 체크박스를 근거로 삼되, 이 경우 "Wave 상태 파일 부재 — Task 상세 파일의 Definition of Done으로 대체 확인"이라고 명시한다.
   - `IN_PROGRESS`/`BLOCKED`/미체크 Task가 하나라도 있으면 이 항목은 FAIL이다.

2. **5개 Page Owner DONE**
   - `TASKS/TASK_MANIFEST.csv`에서 `category=PAGE_OWNER`인 5개 Task(`PAGE-SCR001~005`)를 찾는다.
   - 각각 WAVE_STATE(또는 Definition of Done)상 완료 상태인지, 그리고 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 5개 Screen과 1:1로 대응하는지 확인한다.
   - 5개 중 하나라도 미완료면 FAIL이다.

3. **CI PASS**
   - `.github/workflows/`의 CI 정의(`CI-PIPELINE` Task 산출물)가 존재하는지 확인하고, 가능하면 최근 실행 결과(로컬에서는 `npm run lint`, `tsc --noEmit`, Vitest 단위 테스트를 직접 실행)를 근거로 확인한다.
   - CI 설정 자체가 없거나, 실행한 lint/typecheck/단위 테스트 중 하나라도 실패하면 FAIL이다.

4. **Playwright Smoke PASS**
   - `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 3개 Task가 모두 존재하고 Chromium 프로젝트로 실행 가능한 상태인지 확인한다(`playwright.config.ts` 및 `tests/e2e/*.spec.ts` 실존 확인).
   - 가능하면 실제로 실행해 3개 모두 PASS인지 확인한다. 실행 환경이 없어 직접 실행할 수 없는 경우, 그 사실과 함께 "직접 실행 불가 — 최근 CI 실행 결과로 대체 확인 필요"를 명시하고, 이 경우 이 항목을 PASS로 자동 간주하지 않는다.
   - 3개 중 하나라도 FAIL이거나 실행 여부를 확인할 수 없으면 FAIL이다.

5. **Supabase 6개 Table·기본 RLS 확인 기록**
   - `supabase/schema.sql`을 읽어 선언된 테이블이 `member_profiles`, `mates`, `mate_applications`, `mate_blocks`, `mate_reports`, `outbound_url_settings` 정확히 6개인지 확인한다(7번째 테이블 존재 시 FAIL).
   - `supabase/rls_policies.sql`을 읽어 §"간단한 RLS 원칙"(본인 데이터 / 작성자 우선 / Admin 전용, `docs/ARCHITECTURE.md` §6.4)에 대응하는 정책이 6개 테이블 모두에 존재하는지 확인한다.
   - `TEST-RLS-BASIC`(`tests/rls/basic.test.ts`)의 실행 기록(또는 직접 실행 결과)이 있는지 확인한다.
   - 스키마 파일이 없거나, 테이블 수가 6개가 아니거나, RLS 정책이 누락되거나, RLS 통합 테스트 실행 기록이 없으면 FAIL이다.

6. **Vercel Preview Checkpoint**
   - `CLAUDE.md` 규칙 22(사람의 Preview 확인 후 다음 화면 Wave로 진행)에 따라, 각 Screen Wave에 대해 사람이 Preview를 확인했다는 근거(WAVE_PLAN/WAVE_STATE의 Preview Checkpoint 기록, 또는 사용자의 명시적 확인 발언)가 있는지 확인한다.
   - `RELEASE-CHECK-VERCEL-SUPABASE` Task(`TASKS/TASK-RELEASE-CHECK-VERCEL-SUPABASE.md`)의 Definition of Done이 충족되었는지도 함께 확인한다.
   - 5개 Screen 중 하나라도 사람 Preview 확인 근거가 없으면 FAIL이다.

7. **EXCLUDED 목록**
   - `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md` §5 NON_IMPLEMENTATION 표를 읽는다.
   - EXCLUDED로 분류된 Requirement가 실수로 구현되지 않았는지(즉 EXCLUDED Requirement에 대응하는 `TASKS/TASK-<ID>.md` 상세 파일이나 코드가 새로 생기지 않았는지) 확인한다.
   - 반대로 IMPLEMENT로 분류된 Requirement가 빠짐없이 Task에 매핑되어 있는지도 함께 확인한다(REQ-FUNC 80개 + REQ-NF 34개 전수).
   - `python scripts/audit_tasks.py`를 실행해 검사 17(Requirement 전수 커버리지)·18(EXCLUDED 상세 파일 미생성)이 PASS인지 확인한다. `AUDIT_FAIL`이면 이 항목은 FAIL이다.

## 판정

- 1~7번 검사가 **전부 PASS**일 때만 **`RELEASE_READY`**로 판정한다.
- 하나라도 FAIL이면 **`RELEASE_BLOCKED`**로 판정한다. 일부 항목만 통과했다고 부분적으로 "거의 준비됨"처럼 보고하지 않는다 — 판정은 이 두 값 중 하나만 출력한다.

## 출력 형식

```
RESULT: <RELEASE_READY | RELEASE_BLOCKED>

## 검사 결과
1. Task·Wave 상태: <PASS|FAIL + 근거>
2. 5개 Page Owner DONE: <PASS|FAIL + 근거>
3. CI PASS: <PASS|FAIL + 근거>
4. Playwright Smoke PASS: <PASS|FAIL + 근거>
5. Supabase 6개 Table·기본 RLS: <PASS|FAIL + 근거>
6. Vercel Preview Checkpoint: <PASS|FAIL + 근거>
7. EXCLUDED 목록: <PASS|FAIL + 근거>

## RELEASE_BLOCKED인 경우 — 해결해야 할 항목
<FAIL 항목별로 무엇을 먼저 해결해야 하는지 구체적으로 나열>
```

## 금지 사항

- 이 명령은 코드·Task 파일·WAVE_STATE·`docs/PROJECT_SCOPE.md`·Git 상태를 수정하지 않는다. 순수 판독·판정 전용이다.
- 검사를 직접 실행할 수 없는 항목(예: Playwright를 실행할 브라우저 환경이 없음)을 임의로 PASS로 간주하지 않는다 — "확인 불가"로 기록하고 해당 항목은 FAIL로 처리한다.
- `RELEASE_BLOCKED` 상태를 `RELEASE_READY`로 보고하지 않으며, 일부 예외를 허용하는 절충 판정("조건부 READY" 등)을 만들지 않는다.
- 이 명령 실행 중 `git push`, `gh pr create`, Vercel 배포 트리거 등 실제 배포 행위를 수행하지 않는다 — 판정만 제공한다.
