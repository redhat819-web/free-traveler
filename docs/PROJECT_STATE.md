# Free Traveler — Project State

- **Document ID:** STATE-TRAVEL-001
- **갱신 기준일:** 2026-09-16
- **문서 목적:** 이 문서는 프로젝트의 **현재 실행 상태**를 한 화면에서 확인하기 위한 살아있는(live) 상태 문서다. 계획·규칙 문서(`docs/ARCHITECTURE.md`, `docs/DECISION_LOG.md`, `CLAUDE.md`, `.claude/skills/traveler-project-pipeline/SKILL.md`)와 달리, 이 문서는 Wave/Task가 진행될 때마다(`/run-wave`, `/prepare-task`, `/implement-task`, `/release-check` 실행 후) 갱신된다. 갱신 시 각 필드는 실제 파일(`TASKS/WAVE_STATE.json`, `TASKS/TASK_MANIFEST.csv`, `supabase/`, `.github/workflows/`, CI/Playwright 실행 로그)을 근거로만 채운다 — 추측으로 채우지 않는다.

---

## Harness Schema

- `traveler-screen-route-v1`
- 근거: `design-reference/SCREEN_ROUTE_CONTRACT.json` `schema_version`, `CLAUDE.md`의 `HARNESS_SCHEMA`

## Design Version

- `D-001`
- 근거: `design-reference/D-001/DESIGN.md`(정본). `design-reference/vendor/**`는 참고 자료이며 버전으로 취급하지 않는다(`DEC-008`).

## Scope Mode

- `MVP-IMPLEMENT/EXCLUDED (114 requirements: 80 IMPLEMENT-capable FUNC + 34 NF, 94 IMPLEMENT / 20 EXCLUDED)`
- 근거: `docs/PROJECT_SCOPE.md`, `TASKS/00_TASK_LIST.md` §0.2·§5·§6

## Current Wave

- `NONE — WAVE_PLAN 미작성`
- 근거: `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`이 아직 존재하지 않음(확인: 2026-09-16). Wave 실행은 `/run-wave`가 두 파일을 전제로 하며, 이 문서 갱신 시점 기준으로 아직 Wave 계획이 수립되지 않았다.

## Current Task

- `NONE`
- 근거: `/prepare-task`·`/implement-task`가 실행된 이력 없음. 구현 코드(`src/data`, `src/components`, `supabase/`)가 아직 생성되지 않았다.

## Completed Tasks

- `0 / 65`
- 근거: `TASKS/TASK_MANIFEST.csv`(65개 구현 Task) 전 항목의 Definition of Done 체크박스가 전부 미체크 상태(`TASKS/TASK-<ID>.md` 생성 시 규칙상 미체크로 생성됨, 이후 갱신 이력 없음).

## Blocked Tasks

- `0 / 65 (BLOCKED 판정 이력 없음)`
- 근거: `/prepare-task` 실행 이력이 없어 `BLOCKED_*` 판정 자체가 아직 없음. 착수 전 공통 차단 요인은 `docs/ARCHITECTURE.md` §9(착수 차단)에 기록되어 있다: Supabase/Vitest/Playwright 패키지 미설치, `.env.local` 없음, `supabase/` 디렉터리 없음, `src/data/` 빈 디렉터리, `.github/workflows/` 없음.

## Latest CI

- `NOT_CONFIGURED`
- 근거: `.github/workflows/` 디렉터리 없음(확인: 2026-09-16). `CI-PIPELINE` Task(`TASKS/TASK-CI-PIPELINE.md`) 미착수. `package.json`에 `vitest` 의존성 없음.

## Supabase State

- `NOT_PROVISIONED`
- 근거: `supabase/` 디렉터리(`schema.sql`, `rls_policies.sql`, `seed.sql`) 없음. `package.json`에 `@supabase/supabase-js`/`@supabase/ssr` 없음. `DB-SCHEMA-BASE`/`DB-RLS-BASE`/`DB-ACCESS`/`DB-SEED-BASE` Task 미착수. 목표 Table 6개(`member_profiles`, `mates`, `mate_applications`, `mate_blocks`, `mate_reports`, `outbound_url_settings`)는 아직 생성되지 않았다.

## Vercel Preview URL

- `NONE`
- 근거: 저장소에 Vercel 연동 설정(예: `.vercel/`)이 없으며, 배포 이력을 확인할 수 있는 로컬 근거가 없다. 배포 후 이 필드는 실제 Preview URL 또는 `PRODUCTION: <url>`로 갱신한다.

## Screen Checkpoints

| Screen | Route | 상태 |
|---|---|---|
| SCR-001 | `/` | `PENDING` |
| SCR-002 | `/about` | `PENDING` |
| SCR-003 | `/travel-tools` | `PENDING` |
| SCR-004 | `/mates` | `PENDING` |
| SCR-005 | `/account` | `PENDING` |
| FINAL | — | `PENDING` |

- 상태 값: `PENDING`(미착수) → `IN_PROGRESS`(해당 Screen Wave 진행 중) → `WAITING_FOR_PREVIEW`(Page Owner 등 구현 완료, 사람 Preview 확인 대기, `CLAUDE.md` 규칙 22) → `CONFIRMED`(사람이 Preview 확인 완료).
- `FINAL`은 5개 Screen이 모두 `CONFIRMED`이고 `/release-check`가 `RELEASE_READY`를 반환한 뒤에만 `CONFIRMED`로 갱신한다.

## Playwright State

- `NOT_RUN`
- 근거: `tests/e2e/*.spec.ts`, `playwright.config.ts` 없음. `package.json`에 `@playwright/test` 없음. `E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 3개 Task 모두 미착수.

## Deferred Items

- 이 필드는 **EXCLUDED로 확정된 요구사항**(향후 재검토 대상)만 기록한다. 구현 누락이 아니라 의도적 범위 제외이며, 세부 근거는 `TASKS/00_TASK_LIST.md` §5, `docs/PROJECT_SCOPE.md` §4/§6에 있다.

| Requirement | 요약 | 후속 재검토 조건 |
|---|---|---|
| REQ-FUNC-055, 056, 072, 075, 076 | 콘텐츠/이력 관련 Admin CMS·범용 감사 로그·stale 대시보드 | 콘텐츠 편집자·관리자 수 증가, 감사 요건 발생 |
| REQ-FUNC-071 | 행동 분석 이벤트 수집 파이프라인 | 사용자 증가로 운영 지표 고도화 필요 |
| REQ-FUNC-073 | 미디어 업로드 출처·라이선스 워크플로 | 외부 URL 참조 방식에서 자체 이미지 호스팅으로 전환 시 |
| REQ-NF-007~011 | Lighthouse CI 게이트, 가용성/5xx 모니터링, 자동 백업, 외부 링크 자동 점검 | CI/모니터링 인프라 예산 확보 시 |
| REQ-NF-020~022 | 신고 SLA 측정, Rate Limiting, Moderator 감사 로그 | 신고 물량·어뷰징 증가 시 |
| REQ-NF-024, 025, 029 | 자동 접근성 검사 도구, 전수 스크린리더 QA, 미디어 라이선스 메타데이터 워크플로 | 접근성 인증·저작권 리스크 요건 발생 시 |
| REQ-NF-032, 033 | 구조화 로그, 5xx/외부 링크 실패 자동 알림 | 운영 규모 확대, 장애 대응 체계 구축 시 |

- 총 20건(전체 목록은 `TASKS/00_TASK_LIST.md` §5 참조). 이 표는 요약이며, 개별 항목의 전체 근거·후속 방향은 원본 표가 정본이다.

## Next Action

- `WAVE_PLAN 작성 — 65개 구현 Task(TASKS/TASK_MANIFEST.csv)를 Wave 단위로 편성해 TASKS/WAVE_PLAN.md를 만든다(DEC-010). 이후 W01부터 /run-wave로 순차 착수한다.`
- 근거: Current Wave/Current Task가 모두 `NONE`이며, `docs/ARCHITECTURE.md` §9의 착수 차단 항목(패키지·환경변수·`supabase/`·CI 설정 부재)이 아직 해소되지 않았다. Wave 편성 이전에 최소 첫 Wave가 의존하는 착수 차단 항목부터 해결해야 한다.

---

## 갱신 이력

| 날짜 | 변경 |
|---|---|
| 2026-09-16 | 최초 작성. 모든 필드가 초기 상태(구현 미착수)를 반영. |
