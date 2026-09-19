# GAP-E2E-MATE-COMPOSE-LOGIN-PROMPT — 비로그인 동행 작성 안내 커버리지 공백 (기록용, 미착수)

- **Task ID:** `GAP-E2E-MATE-COMPOSE-LOGIN-PROMPT`
- **Category:** E2E_TEST
- **Status:** NOT_STARTED — 착수 금지, 기록만
- **기록일:** 2026-09-19 (`E2E-PUBLIC-SMOKE` 재작성 중 발견)

## 배경

`tests/e2e/public-smoke.spec.ts`(Expected File: `E2E-PUBLIC-SMOKE`)의 기존 내용에
"비로그인 상태로 `/travel-tools` 동행 탭 진입 시 로그인 안내가 뜬다"는 시나리오
(`E2E-005`)가 있었다. 이번에 `E2E-PUBLIC-SMOKE`를 Functional AC(`docs/06_SRS_UIUX_REVISED.md`
기준 홈→탭→Drawer→안전정보, About 렌더, `/mates` 비로그인 열람, 404)에 맞춰 재작성하면서
이 시나리오를 제외했다.

## 문제

- `/travel-tools`(SCR-003) 동행 탭의 로그인 안내는 `E2E-PUBLIC-SMOKE`의 Expected Files
  범위(`tests/e2e/public-smoke.spec.ts` 1개)가 아니라 성격상 `E2E-TRAVEL-TOOLS`
  (`tests/e2e/travel-tools.spec.ts`)에 속한다.
- `TASKS/TASK-E2E-TRAVEL-TOOLS.md`의 Expected Files도 `tests/e2e/travel-tools.spec.ts`
  1개로 한정되어 있어, 이번 Task(`E2E-PUBLIC-SMOKE`) 범위 안에서 그 파일을 수정할 수
  없었다(CLAUDE.md 규칙 8 — 현재 Task의 Expected Files 밖 파일 수정 금지).
- 결과적으로 "비로그인 동행 작성 시도 시 로그인 안내" 시나리오가 현재 어떤 Playwright
  스펙에도 없다(커버리지 공백).

## 검토 필요

1. 이 시나리오를 `E2E-TRAVEL-TOOLS`(`tests/e2e/travel-tools.spec.ts`)에 추가하는 것이
   맞는지 확인한다(Screen 기준으로는 SCR-003에 속함).
2. 맞다면 `TASK-E2E-TRAVEL-TOOLS.md`를 갱신하거나 별도 후속 Task로 착수해 추가한다.

## 참고

- 제외된 원문 시나리오(재작성 전 `public-smoke.spec.ts`의 `E2E-005`):
  `/travel-tools` 이동 → "동행" 탭 클릭 → "로그인" 또는 "성인 확인" 관련 안내/heading
  노출 확인, "로그인/계정" 링크 노출 확인.
