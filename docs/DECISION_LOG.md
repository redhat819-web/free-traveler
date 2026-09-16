# Free Traveler — Decision Log

- **Document ID:** DECLOG-TRAVEL-001
- **작성 기준일:** 2026-09-16
- **문서 목적:** 이 프로젝트의 구현 경계·프로세스에 영향을 주는 결정을 시간순으로 기록한다. 각 결정은 **상태(Status)**, **맥락(Context)**, **결정(Decision)**, **근거(Rationale)**, **영향(Consequence)**, **관련 문서**로 구성한다. 결정을 번복할 때는 기존 항목을 지우지 않고 상태를 `Superseded`로 바꾼 뒤 새 DEC 항목을 추가한다.

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **Status:** Accepted
- **Context:** 저장소 내 여러 경로 후보 중 실제 Next.js 코드베이스가 위치할 루트를 고정해야, 이후 모든 Task의 `Expected Files` 경로(`src/app/...`)가 일관된 기준을 가진다.
- **Decision:** 실제 개발 루트는 `C:\AI_SERVICE\traveler\app`(저장소 내 `traveler/app`)이며, 이 저장소의 `package.json`·`src/app`·`docs`·`TASKS`·`design-reference`는 모두 이 루트 기준 상대 경로다.
- **Rationale:** 여러 앱/문서 후보 디렉터리가 혼재할 경우 Task 파일의 Expected Files 경로가 모호해지고, 잘못된 위치에 코드가 생성될 위험이 있다.
- **Consequence:** 이후 모든 문서(`docs/ARCHITECTURE.md`, `TASKS/*.md`)의 파일 경로는 `traveler/app`을 루트로 하는 상대 경로로 표기한다.
- **관련 문서:** `package.json`, `docs/ARCHITECTURE.md` §1

---

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **Status:** Accepted
- **Context:** `design-reference/SCREEN_ROUTE_CONTRACT.json`에 정의된 Screen 수와 우선순위를 구현 계획의 기준으로 삼을지 확정이 필요했다.
- **Decision:** Screen은 정확히 5개이며, `priority_summary` 기준으로 core 4개(SCR-001 `/`, SCR-003 `/travel-tools`, SCR-004 `/mates`, SCR-005 `/account`) + supporting 1개(SCR-002 `/about`)로 고정한다. 6번째 Screen/Route는 추가하지 않는다.
- **Rationale:** MVP 범위를 넘어서는 Screen 확장을 막고, Page Owner Task를 Screen당 정확히 1개로 유지하기 위함(`completion_criteria.screen_count_equals_5`).
- **Consequence:** 신규 Route 요청이 들어오면 이 결정을 먼저 갱신(Superseded 처리)한 뒤에만 Task List에 반영한다.
- **관련 문서:** `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/UI_CONTRACT.md`, `docs/ARCHITECTURE.md` §2

---

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **Status:** Accepted
- **Context:** 항공 조건 입력, 숙소 조건 입력, 동행 모집글 작성을 별도 Route(`/flights`, `/hotels`, `/mates/new`)로 분리할지, 하나의 Route 내부 탭으로 통합할지 결정이 필요했다.
- **Decision:** 항공편/숙소/동행 구하기 3개 기능을 `/travel-tools` 한 Route 안의 **실제 내부 탭 컴포넌트**(`CMP-SCR003-TABS`)로 조립한다. 탭을 외부 링크 버튼으로 대체하지 않는다(`tabs_replaced_by_external_links` 금지).
- **Rationale:** "통합 여행 준비"라는 단일 사용자 여정으로 묶어 Route 수를 5개로 유지하고, 탭 전환 시 각 폼의 입력 상태가 별도로 보존되도록 하기 위함.
- **Consequence:** SCR-003 Page Owner(`PAGE-SCR003`)는 `CMP-SCR003-FLIGHT-FORM`/`CMP-SCR003-HOTEL-FORM`/`CMP-SCR003-MATE-COMPOSE`를 모두 하위 탭으로 조립해야 하며, 이 중 하나라도 외부 링크로 대체되면 Task 감사(`audit_tasks.py` 검사 9)에서 실패로 처리된다.
- **관련 문서:** `design-reference/UI_CONTRACT.md` SCR-003 절, `TASKS/TASK-PAGE-SCR003.md`, `docs/ARCHITECTURE.md` §2.1

---

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **Status:** Accepted
- **Context:** 여행지 가이드, 국가 안전정보, 대표(`free_traveler`) 소개 콘텐츠를 DB/CMS로 관리할지, 코드 저장소 내 정적 데이터로 관리할지 결정이 필요했다.
- **Decision:** 세 콘텐츠 영역 모두 `src/data/**`의 정적 TypeScript 데이터 파일(`destinations.ts`, `safety.ts`, `representative.ts`)로 관리하며, 런타임 CMS·Admin CRUD 화면을 만들지 않는다.
- **Rationale:** MVP 단계에서 콘텐츠 편집자 수가 적고, 코드 리뷰(PR)로 콘텐츠 변경 이력을 대체할 수 있어 별도 CMS 인프라가 불필요하다.
- **Consequence:** 콘텐츠 변경은 반드시 Git PR을 통해서만 이루어지며, 필수 필드 검증은 `scripts/validate_content.py`(`DATA-VALIDATION-SCRIPT`)로 대체한다. 편집자가 늘어나면 이 결정을 재검토한다.
- **관련 문서:** `docs/PROJECT_SCOPE.md` §3·§4, `docs/ARCHITECTURE.md` §5

---

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **Status:** Accepted
- **Context:** Supabase를 프로젝트 전 영역(콘텐츠 포함)에 사용할지, 특정 영역으로 한정할지 결정이 필요했다.
- **Decision:** Supabase는 **Auth**(이메일 가입/로그인/성인 확인/탈퇴)와 **동행(Mate) 기능**(모집글·참가 요청·차단·신고·관리자 처리)에만 사용한다. 여행지·안전·대표 콘텐츠는 Supabase에 저장하지 않는다(DEC-004).
- **Rationale:** DB 접근이 필요한 영역(사용자 인증·상호작용 데이터)과 정적 콘텐츠 영역을 분리해 스키마를 단순하게 유지한다.
- **Consequence:** 새로운 기능이 "콘텐츠 읽기"인지 "사용자 상호작용"인지에 따라 정적 데이터 vs Supabase 사용 여부가 자동으로 결정된다.
- **관련 문서:** `docs/PROJECT_SCOPE.md` §2, `docs/ARCHITECTURE.md` §6.1

---

## DEC-006 — DB는 6개 Table로 제한

- **Status:** Accepted
- **Context:** 동행 기능(모집글·참가·차단·신고)과 프로필·관리자 설정을 몇 개의 Table로 나눌지 결정이 필요했다.
- **Decision:** DB Table을 `member_profiles`, `mates`, `mate_applications`, `mate_blocks`, `mate_reports`, `outbound_url_settings` **정확히 6개**로 제한한다. 범용 감사 로그 등 7번째 Table을 추가하지 않는다.
- **Rationale:** RLS 정책과 서버 접근 계층을 단순하게 유지하고, MVP 범위를 벗어나는 이력 관리(REQ-FUNC-056/REQ-NF-022 EXCLUDED)를 원천적으로 차단하기 위함.
- **Consequence:** `DB-SCHEMA-BASE` Task와 `scripts/audit_tasks.py` 검사 12가 이 상한을 강제한다(6개 초과 시 경고, 8개 초과 시 감사 실패).
- **관련 문서:** `TASKS/TASK-DB-SCHEMA-BASE.md`, `docs/ARCHITECTURE.md` §6.2

---

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **Status:** Accepted
- **Context:** 항공/숙소 조건 입력값(국가·지역·날짜)을 서버에 저장해 이력·추천에 활용할지, 브라우저에서만 유지할지 결정이 필요했다.
- **Decision:** 항공/숙소 입력값은 Client Component의 React 상태(브라우저 메모리)로만 유지한다. 서버 액션·API Route·DB·외부 URL query·로그/분석 이벤트 어디로도 전송하지 않는다.
- **Rationale:** 여행 계획 데이터는 민감 정보로 간주될 수 있고, MVP는 단순 "조건 정리 후 외부 사이트로 안내"만 제공하므로 서버 보관이 불필요하다.
- **Consequence:** 새로고침 시 입력값이 사라지는 것을 정상 동작으로 간주한다. 코드 리뷰에서 이 두 컴포넌트의 `fetch`/서버 호출 코드는 기본적으로 반려 대상이다.
- **관련 문서:** `docs/PROJECT_SCOPE.md` REQ-FUNC-017/025, REQ-NF-017, `docs/ARCHITECTURE.md` §4

---

## DEC-008 — Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본

- **Status:** Accepted
- **Context:** `design-reference/vendor/airbnb/DESIGN.md`(Airbnb 디자인 분석 원본)와 `design-reference/D-001/DESIGN.md`(이 프로젝트용으로 확정된 디자인 토큰 문서)가 둘 다 저장소에 존재해 어느 쪽을 구현 기준으로 삼을지 혼동 여지가 있었다.
- **Decision:** `design-reference/vendor/airbnb/**`는 스타일 벤치마킹을 위한 **참고 자료**로만 취급하고, 실제 구현의 **정본(source of truth)**은 `design-reference/D-001/DESIGN.md`로 고정한다.
- **Rationale:** Airbnb 상표 요소·고유 폰트·가격/별점 UI 등은 `global_prohibitions`로 명시적으로 금지되어 있어, vendor 원본을 그대로 구현에 반영하면 금지 규칙을 위반한다.
- **Consequence:** 색상·타이포·간격 등 시각 토큰 값은 항상 `D-001/DESIGN.md`에서만 인용하며, vendor 파일의 수치(예: Airbnb Rausch `#ff385c`)를 코드에 직접 사용하지 않는다.
- **관련 문서:** `design-reference/D-001/DESIGN.md`, `design-reference/vendor/airbnb/DESIGN.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` `global_prohibitions`

---

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **Status:** Accepted
- **Context:** E2E 테스트 범위를 크로스 브라우저 회귀 스위트로 확장할지, 최소 Smoke Test로 한정할지 결정이 필요했다.
- **Decision:** Playwright는 **Chromium 프로젝트만** 사용하며, 필수 E2E Task는 `E2E-PUBLIC-SMOKE`·`E2E-TRAVEL-TOOLS`·`E2E-MATE-AUTH` 3개로 제한한다. Firefox/WebKit 매트릭스, 시각 회귀, 전체 회귀 스위트는 만들지 않는다.
- **Rationale:** MVP 단계에서 CI 실행 시간과 유지보수 비용을 최소화하면서, 핵심 사용자 여정(공개 열람/여행 준비/인증·동행)만 자동 검증하면 충분하다.
- **Consequence:** `scripts/audit_tasks.py` 검사 15가 3개 Task의 존재와 Chromium 명시를 강제한다. 새 브라우저 커버리지가 필요하면 이 결정을 먼저 갱신한다.
- **관련 문서:** `docs/PROJECT_SCOPE.md` §2, `docs/ARCHITECTURE.md` §7.2

---

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **Status:** Accepted
- **Context:** 65개 구현 Task(`TASKS/TASK_MANIFEST.csv`)를 사용자가 어떤 단위로 착수·검토할지 결정이 필요했다.
- **Decision:** 사용자는 Task를 개별적으로가 아니라 **Wave**(관련 Task를 묶은 실행 단위, 예: "SCR-001 관련 Data+Component+Page Owner") 단위로 착수·검토한다.
- **Rationale:** Task 간 `Depends On` 관계가 많아(예: Page Owner는 다수 Component에 의존) 개별 Task 단위 착수는 빈번한 중단·재개를 유발한다. Wave 단위로 묶으면 의존성이 해소된 상태에서 한 번에 검토할 수 있다.
- **Consequence:** Wave의 구체적 분할 기준(Screen 단위/Category 단위 등)은 이 결정 이후 별도로 정의하며, `TASKS/TASK_MANIFEST.csv`의 `depends_on` 열을 Wave 편성의 입력으로 사용한다.
- **관련 문서:** `TASKS/TASK_MANIFEST.csv`, `TASKS/00_TASK_LIST.md`

---

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **Status:** Accepted
- **Context:** Wave 내부의 여러 Task를 여러 Agent가 병렬로 수행할지, 하나의 Agent가 순차로 수행할지 결정이 필요했다.
- **Decision:** 하나의 Wave 내부 Task는 **Single Agent**가 `Depends On` 순서를 따라 **순차적으로** 수행한다. Wave 내부에서 다중 Agent 병렬 수행을 기본값으로 사용하지 않는다.
- **Rationale:** Page Owner → Component → Data/DB 사이의 의존 관계와 "Expected Files 밖 수정 금지" 원칙을 지키려면, 동시에 여러 Agent가 겹치는 파일을 건드릴 위험을 없애는 것이 우선이다.
- **Consequence:** Wave 계획 시 Task 순서는 항상 `Depends On` 그래프의 위상 정렬(topological order)을 따른다. 병렬 수행이 필요한 경우는 이 결정을 갱신한 뒤 별도로 범위·조건을 정의한다.
- **관련 문서:** `TASKS/TASK_MANIFEST.csv`(`depends_on` 열), DEC-010

---

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **Status:** Accepted
- **Context:** Task 완료 후 PR 생성과 병합을 자동화할지, 사용자가 직접 수행할지 결정이 필요했다.
- **Decision:** Git PR 생성과 Merge는 **사용자가 수동으로 수행**한다. 어떤 Agent/CI도 자동으로 PR을 병합하지 않는다.
- **Rationale:** 코드 변경의 최종 검토·품질 책임을 사용자에게 유지하고, DEC-014의 무인 자동 Merge 금지 원칙과 일관성을 맞추기 위함.
- **Consequence:** GitHub Actions(`CI-PIPELINE`)는 lint/typecheck/test 실행까지만 담당하며, 검사 통과가 자동 병합으로 이어지지 않는다.
- **관련 문서:** `docs/ARCHITECTURE.md` §8, DEC-013, DEC-014

---

## DEC-013 — EC2·AWS는 사용하지 않음

- **Status:** Accepted
- **Context:** 배포·인프라를 Vercel/Supabase 관리형 서비스로 한정할지, AWS(EC2 등) 자체 인프라를 병행할지 결정이 필요했다.
- **Decision:** 인프라는 **Vercel(호스팅) + Supabase(DB/Auth) 관리형 서비스만** 사용한다. EC2·AWS 어떤 서비스도 도입하지 않는다.
- **Rationale:** MVP 운영 인프라를 최소화하고, 별도 서버 운영·보안 패치·오토스케일링 관리 부담을 없애기 위함.
- **Consequence:** `scripts/audit_tasks.py`는 Task 콘텐츠에 `aws`/`ec2` 키워드가 등장하면 감사 실패(검사 16)로 처리한다.
- **관련 문서:** `docs/PROJECT_SCOPE.md` §4, `docs/ARCHITECTURE.md` §8

---

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **Status:** Accepted
- **Context:** 114개 요구사항(`REQ-FUNC-001~080`, `REQ-NF-001~034`) 중 MVP에서 구현하지 않는 항목을 어떻게 추적할지 결정이 필요했다.
- **Decision:** 구현하지 않는 요구사항은 삭제하지 않고, `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md` §5의 **NON_IMPLEMENTATION(EXCLUDED) 표**에 근거·후속 방향과 함께 기록해 계속 추적한다.
- **Rationale:** 요구사항을 조용히 누락시키면 추적표 감사(커버리지 검증)에서 미기재로 판정되고, 향후 재검토 근거도 사라진다. EXCLUDED로 명시하면 "왜 안 만들었는지"와 "언제 재검토할지"가 문서에 남는다.
- **Consequence:** `scripts/audit_tasks.py` 검사 17·18이 이를 강제한다 — 모든 REQ-FUNC/REQ-NF는 Task 또는 EXCLUDED 표 중 하나에만 존재해야 하며(둘 다 존재 시 모순으로 실패), EXCLUDED 항목에는 상세 구현 파일(`TASKS/TASK-<ID>.md`)을 만들지 않는다.
- **관련 문서:** `docs/PROJECT_SCOPE.md` §4·§5·§6, `TASKS/00_TASK_LIST.md` §5, `scripts/audit_tasks.py`

---

## 변경 이력

| 날짜 | 변경 |
|---|---|
| 2026-09-16 | DEC-001~014 최초 작성 |
