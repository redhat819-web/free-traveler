# CLAUDE.md — Free Traveler (traveler/app)

이 파일은 이 저장소에서 작업하는 모든 Agent가 따라야 하는 규칙을 직접 기록한다. 다른 Agent 규칙 파일(예: `AGENTS.md`)을 참조하지 않으며, 이 문서 자체가 규칙의 정본이다. `AGENTS.md`는 `next dev`가 자동 생성/재생성하는 Next.js 프레임워크 안내 파일이므로 이 문서의 규칙과 별개로 존재해도 무시한다.

---

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

- 위 8개 값은 이 프로젝트의 고정 설정이다. 코드·스크립트·문서 어디에서도 이 값과 모순되는 내용을 작성하지 않는다.
- `SCREEN_CONTRACT`의 `schema_version`은 반드시 `HARNESS_SCHEMA`(`traveler-screen-route-v1`)와 일치해야 하며, 불일치 시 작업을 진행하지 않고 사용자에게 보고한다.
- `PLAYWRIGHT_SCOPE=chromium-smoke`는 Playwright가 Chromium 프로젝트의 Smoke Test만 다룬다는 뜻이다. 다른 브라우저·회귀 스위트를 추가하지 않는다.
- `AUTO_MERGE=false`, `AWS_ENABLED=false`는 항상 이 값으로 유지한다. 이 값을 `true`로 바꾸는 코드·설정·워크플로를 만들지 않는다.

---

## 정본 문서 (Source of Truth)

| 영역 | 정본 | 비고 |
|---|---|---|
| SRS(요구사항) | `docs/06_SRS_UIUX_REVISED.md` | REQ-FUNC-001~080, REQ-NF-001~034 |
| 구현 범위 분류(IMPLEMENT/EXCLUDED) | `docs/PROJECT_SCOPE.md` | REQ별 처리 방법·확인 방법의 근거 |
| 디자인 토큰·레이아웃 규칙 | `design-reference/D-001/DESIGN.md` | 색상·간격·타이포 등 모든 시각 값의 유일한 출처 |
| Screen/Route/Page Entry 계약 | `design-reference/SCREEN_ROUTE_CONTRACT.json` | `HARNESS_SCHEMA`와 버전 일치 필수 |
| 화면별 Section 구성·Component 매핑 | `design-reference/UI_CONTRACT.md` | Screen별 영역 순서·상태·이동 규칙 |
| 아키텍처 경계 | `docs/ARCHITECTURE.md` | 기술 스택·Server/Client 경계·DB 6-Table |
| 결정 기록 | `docs/DECISION_LOG.md` | DEC-001~014 |
| Task 단위 실행 명세 | `TASKS/00_TASK_LIST.md`, `TASKS/TASK-<ID>.md`, `TASKS/TASK_MANIFEST.csv` | Task별 Expected Files/AC/Forbidden |

`design-reference/vendor/**`(예: Airbnb 디자인 분석본)는 참고 자료일 뿐 정본이 아니다. 시각 값은 항상 `design-reference/D-001/DESIGN.md`에서만 인용한다.

---

## 필수 규칙 (1~23)

1. 작업 전 `package.json`과 현재 설치된 Next.js 버전의 공식 문서(`node_modules/next/dist/docs/`)를 확인한다. 훈련 데이터의 기억에 의존해 구버전 API를 사용하지 않는다.
2. SRS 정본은 `docs/06_SRS_UIUX_REVISED.md`다. 요구사항 내용이 다른 문서와 다르면 이 파일을 기준으로 한다.
3. Scope 분류 정본은 `docs/PROJECT_SCOPE.md`다. 어떤 REQ를 구현할지/제외할지는 이 문서의 IMPLEMENT/EXCLUDED 판정을 따른다.
4. 디자인 정본은 `design-reference/D-001/DESIGN.md`다. 색상·간격·타이포 등 임의의 값을 새로 만들지 않는다.
5. Screen 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다. Screen 수(5개)·Route·Page Entry·금지 기능은 이 파일을 따른다.
6. `/run-wave WXX`를 표준 개발 명령으로 사용한다. Wave 단위가 아닌 임의의 Task 묶음으로 개발을 진행하지 않는다.
7. Wave 내부 Task는 `Depends On` 순서를 따라 **한 번에 하나만** 구현한다. 여러 Task를 동시에 병렬로 건드리지 않는다.
8. 현재 진행 중인 Task의 `Expected Files` 목록 밖에 있는 파일은 수정하지 않는다.
9. Page Owner Task는 새 Component를 만들지 않고, 해당 Page Entry(`page.tsx`)에서 이미 만들어진 Component를 실제로 조립하는 것만 수행한다.
10. SCR-001(`/`) 완료 시 Next.js 기본 스타터 콘텐츠(로고·카드·기본 문구 등)를 완전히 제거한다.
11. SCR-003(`/travel-tools`)은 항공·숙소·동행 3개 탭을 모두 실제 내부 컴포넌트로 조립한다. 외부 링크 버튼으로 대체하지 않는다.
12. 항공·숙소 입력값은 서버·DB·URL(query 등)·로그·분석 이벤트 어디로도 전송하지 않는다. Client Component의 React 상태로만 유지한다.
13. Supabase에 대한 쓰기(insert/update/delete)는 Auth·동행(Mate)·신고·외부 URL 설정 범위로 제한한다. 여행지·안전·대표 콘텐츠는 Supabase에 쓰지 않는다(정적 데이터로만 관리).
14. RLS(Row Level Security)를 우회하는 Client 코드(예: Service Role Key를 이용한 우회 조회, RLS 미적용 테이블 직접 접근)를 작성하지 않는다.
15. Service Role Key를 Client 번들에 포함하거나 Client Component에서 사용하지 않는다. Server 전용 코드에서만 사용한다.
16. 여행지·안전정보·대표(`free_traveler`) 소개 콘텐츠는 `src/data/**`의 정적 데이터를 사용한다. 이 콘텐츠를 위한 DB Table이나 CMS를 새로 만들지 않는다.
17. Prisma·기타 ORM·AWS·EC2를 프로젝트에 추가하지 않는다. Supabase 클라이언트를 직접 사용하고, 인프라는 Vercel + Supabase로 한정한다.
18. Playwright는 핵심 Smoke Test만 작성한다(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 3개, Chromium만). 크로스 브라우저·시각 회귀·전체 회귀 스위트를 추가하지 않는다.
19. `docs/PROJECT_SCOPE.md`·`TASKS/00_TASK_LIST.md` §5에서 EXCLUDED로 분류된 기능을 임의로 구현하지 않는다. 구현이 필요하다고 판단되면 먼저 사용자에게 결정을 요청한다(DEC 문서 갱신 선행).
20. `git reset --hard`, `git clean -f`, `git checkout -- .`, force push 등 destructive Git 명령을 사용자 승인 없이 임의로 사용하지 않는다.
21. 자동 PR 생성·자동 Merge를 실행하지 않는다(`AUTO_MERGE=false`). PR 생성과 Merge는 사람이 수동으로 수행한다.
22. 화면 단위 작업이 끝나면 사람이 Preview(Vercel Preview 또는 로컬 `next dev`)를 확인할 때까지 기다리고, 확인 후에만 다음 화면 Wave로 진행한다.
23. 작업 완료 시 다음 3가지를 반드시 보고한다: (1) 변경한 파일 목록, (2) 검증 결과(lint/typecheck/unit test/Playwright 등 실행 결과), (3) 남아 있는 제한사항·미해결 이슈.

---

## Task 완료 순서

Wave 내부 각 Task는 아래 7단계를 **이 순서 그대로** 따른다. 단계를 건너뛰거나 순서를 바꾸지 않는다.

1. **Task 읽기** — `TASKS/TASK-<ID>.md`의 Context, Requirement Ref, Expected Files, Functional/Visual/Security AC, Forbidden을 전부 읽는다.
2. **입력 확인** — Depends On으로 명시된 선행 Task 산출물, 정본 문서(위 표), 현재 파일 트리 상태를 확인한다.
3. **구현** — Expected Files 목록에 있는 파일만 생성/수정한다.
4. **관련 포맷·Unit Test** — 변경 범위에 해당하는 lint(`npm run lint`), 타입 체크(`tsc --noEmit`), 관련 Vitest 단위 테스트를 실행한다.
5. **필요 시 Playwright** — 해당 Task가 `E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 중 하나에 연결된 경우에만 관련 Chromium Smoke를 실행한다. 불필요한 Playwright 실행을 추가하지 않는다.
6. **Diff 확인** — `git status`/`git diff`로 Expected Files 밖 변경이 없는지, Forbidden 항목이 포함되지 않았는지 확인한다.
7. **완료 보고** — 규칙 23에 따라 변경 파일·검증 결과·남은 제한사항을 보고한다.
