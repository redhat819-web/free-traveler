---
description: WAVE_ID/TASK_ID로 지정된 Task의 착수 가능 여부를 8개 항목으로 검사하고 READY_TO_IMPLEMENT 여부를 판정한다(코드 수정 없음)
argument-hint: "WAVE_ID TASK_ID"
---

`WAVE_ID`와 `TASK_ID`를 입력받아, 해당 Task를 실제로 구현(`/run-wave` 등)하기 **전에** 착수 가능 상태인지 8개 항목으로 검사한다. 이 명령은 **어떤 코드·문서도 수정하지 않는다** — 오직 실제 파일을 읽고 판정 결과만 출력한다.

## 입력

- `WAVE_ID` — 사용자가 정의한 Wave 식별자(예: `W01`). 이 명령은 Wave 정의를 새로 만들지 않으며, 기존에 사용자가 명시한 Wave↔Task 매핑(대화 중 지시, 또는 Wave 계획 문서가 있다면 그 문서)을 그대로 읽어 사용한다.
- `TASK_ID` — `TASKS/00_TASK_LIST.md`의 Task ID(예: `CMP-SCR003-FLIGHT-FORM`).
- 선택된 상세 Task 파일 — `TASKS/TASK-<TASK_ID>.md`.

인자가 부족하거나 `TASK_ID`가 `TASKS/00_TASK_LIST.md`에 존재하지 않으면 즉시 `BLOCKED_INPUT`을 출력하고 중단한다.

## 검사 절차

이 순서대로 실제 파일을 읽어 검사한다. 하나라도 실패하면 그 시점에서 해당하는 `BLOCKED_*` 출력을 내고 이후 검사는 생략해도 된다(단, 이미 확인한 항목은 보고에 함께 남긴다).

1. **Working Tree 상태** — `git status --porcelain`을 실행한다. 추적되지 않은 파일이나 커밋되지 않은 변경이 남아 있으면(특히 `TASKS/`, `src/` 하위) 원인을 기록한다. 이전 Task의 미완료 변경이 남아 있으면 착수 불가로 판단한다(`BLOCKED_DIRTY_TREE`).
2. **Wave 포함 여부** — `TASK_ID`가 `WAVE_ID`에 실제로 포함되는지 확인한다. Wave 정의를 어디서도 찾을 수 없거나(Wave 계획 문서 부재, 대화 중 명시 없음) `TASK_ID`가 해당 Wave 목록에 없으면 착수 불가로 판단한다(`BLOCKED_INPUT`, 사유: Wave 정의 부재 또는 Wave-Task 불일치).
3. **Depends On 완료 여부** — `TASKS/TASK-<TASK_ID>.md`의 "Depends On" 절과 `TASKS/TASK_MANIFEST.csv`의 `depends_on` 열을 읽는다. 각 선행 Task에 대해 실제 `Expected Files`가 파일 트리에 존재하는지(Glob/Read) 확인한다. 선행 Task 중 산출물이 없는 것이 하나라도 있으면 착수 불가로 판단한다(`BLOCKED_DEPENDENCY`, 목록 포함).
4. **Expected Files** — 상세 Task 파일의 "Expected Files" 절을 읽는다. 대상 경로가 이미 존재하면 `action`(create/replace_starter/modify)과 실제 파일 상태가 일치하는지, 대상 디렉터리가 존재하는지(예: `src/app/travel-tools/`)를 확인한다. Expected Files가 비어 있거나 `TASKS/00_TASK_LIST.md`의 표기와 상세 파일 표기가 다르면 `BLOCKED_INPUT`으로 판단한다.
5. **SRS·Scope·Design·Screen Ref 확인** — 상세 Task 파일의 Requirement Ref·Design Ref·Screen/Route/Page Entry 절이 아래 정본과 실제로 일치하는지 대조한다.
   - `docs/06_SRS_UIUX_REVISED.md` (해당 REQ-FUNC/REQ-NF 존재 여부)
   - `docs/PROJECT_SCOPE.md` (해당 REQ가 IMPLEMENT로 분류되어 있는지)
   - `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md` (Design Ref 절)
   - `design-reference/SCREEN_ROUTE_CONTRACT.json` (Screen/Route/Page Entry 일치)
   불일치가 있으면 `BLOCKED_INPUT`으로 판단하고 구체적 불일치 내용을 기록한다.
6. **필요한 환경변수 이름 확인** — 상세 Task 파일과 `docs/ARCHITECTURE.md` §9를 근거로, 이 Task 구현에 필요한 환경변수 이름만 나열한다(예: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). 이 검사는 **값의 존재 여부(실제 시크릿)를 확인하거나 출력하지 않는다** — 필요한 이름 목록만 보고하며, `.env.local`/`.env.example`에 해당 이름이 정의되어 있는지 정도만 파일 존재로 확인한다. 이름 목록을 산출하지 못하면(Task 성격상 불필요하면) "해당 없음"으로 명시한다.
7. **Secret 하드코딩 위험 검사** — Expected Files 대상 경로가 이미 부분적으로 존재하면, 해당 파일에 API 키·토큰처럼 보이는 하드코딩 패턴(`sk-`, `SUPABASE_SERVICE_ROLE`, 긴 base64/hex 문자열이 문자열 리터럴로 직접 대입된 경우 등)이 있는지 Grep으로 점검한다. 아직 파일이 없으면 "신규 생성 예정 — 해당 없음"으로 기록한다. 위험이 발견되면 `BLOCKED_INPUT`으로 판단한다.
8. **EXCLUDED 범위 침범 여부** — `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md` §5 NON_IMPLEMENTATION 표를 읽는다. 이 Task의 Requirement Ref, Functional AC, Expected Files 중 어느 것도 EXCLUDED로 분류된 Requirement나 기능(전체 콘텐츠 CMS, 범용 감사 로그, 자동 백업/알림, 외부 이메일 사업자 연동, axe 자동 접근성 검사 등)을 구현하려 하지 않는지 확인한다. EXCLUDED 범위를 침범하면 착수 불가로 판단한다(`BLOCKED_SCOPE`).

## 출력

검사를 마치면 아래 5개 값 중 정확히 하나를 최종 판정으로 출력한다. 여러 항목이 동시에 실패해도 판정은 하나만 낸다(아래 우선순위 순서로 첫 번째로 해당하는 것을 채택).

1. `BLOCKED_DIRTY_TREE` — 검사 1 실패(Working Tree가 깨끗하지 않음)
2. `BLOCKED_DEPENDENCY` — 검사 3 실패(선행 Task 미완료)
3. `BLOCKED_SCOPE` — 검사 8 실패(EXCLUDED 범위 침범)
4. `BLOCKED_INPUT` — 검사 2·4·5·6·7 중 하나라도 실패(Wave 불포함, Expected Files 불명확, Ref 불일치, 환경변수/Secret 문제)
5. `READY_TO_IMPLEMENT` — 8개 검사 전부 통과

출력 형식:

```
RESULT: <위 5개 값 중 하나>
WAVE_ID: <입력값>
TASK_ID: <입력값>

## 검사 결과
1. Working Tree: <PASS|FAIL + 근거>
2. Wave 포함 여부: <PASS|FAIL + 근거>
3. Depends On 완료: <PASS|FAIL + 미완료 목록>
4. Expected Files: <PASS|FAIL + 근거>
5. SRS/Scope/Design/Screen Ref: <PASS|FAIL + 근거>
6. 필요한 환경변수: <목록 또는 해당 없음>
7. Secret 하드코딩 위험: <PASS|FAIL + 근거>
8. EXCLUDED 범위 침범: <PASS|FAIL + 근거>

## 다음 조치
<RESULT가 READY_TO_IMPLEMENT가 아니면, 무엇을 먼저 해결해야 하는지 구체적으로 제시>
```

## 금지 사항

- 이 명령은 어떤 소스 코드·설정 파일·`TASKS/*.md`·`docs/*.md`도 생성·수정하지 않는다. 순수 판독 전용(read-only) 명령이다.
- `git add`, `git commit`, `git stash` 등 Working Tree 상태를 변경하는 명령을 실행하지 않는다(검사 1은 `git status`로 상태만 읽는다).
- 환경변수 값(Secret 실제 내용)을 조회하거나 출력하지 않는다 — 이름만 보고한다.
- `READY_TO_IMPLEMENT`가 아닌 상태를 임의로 `READY_TO_IMPLEMENT`로 보고하지 않는다.
