# Free Traveler — Architecture

- **Document ID:** ARCH-TRAVEL-001
- **기반 문서:** `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`
- **작성 기준일:** 2026-09-16
- **문서 목적:** 이 문서는 Free Traveler MVP의 **구현 경계**(무엇을 어디에 어떻게 구현하고, 무엇을 구현하지 않는지)를 고정한다. 기능 요구사항의 구현 방식/제외 근거는 `docs/PROJECT_SCOPE.md`가, 화면별 Section 구성은 `design-reference/UI_CONTRACT.md`가 원본이며, 이 문서는 그 위에서 코드 구조·기술 스택 경계만 정의한다.

---

## 1. 기술 스택

`package.json` 기준 확정 스택:

| 영역 | 기술 | 버전 |
|---|---|---|
| 프레임워크 | Next.js **App Router** | `16.3.4` |
| 언어 | **TypeScript** (`strict: true`) | `^5` |
| UI 런타임 | React / React DOM | `19.2.8` |
| 스타일 | Tailwind CSS (PostCSS 플러그인) | `^4` |
| 린트 | ESLint (`eslint-config-next`) | `^9` |

- 라우팅은 전부 `src/app` 디렉터리 기반 App Router를 사용한다. Pages Router(`pages/`)는 사용하지 않는다.
- `tsconfig.json`의 경로 별칭은 `@/*` → `./src/*` 하나만 존재한다. 신규 별칭을 추가하지 않는다.
- 스타일은 Tailwind 유틸리티 클래스만 사용하며, `design-reference/D-001/DESIGN.md`의 디자인 토큰(색상·간격·타이포) 밖의 임의 값을 하드코딩하지 않는다.

---

## 2. Screen / Route 경계

`design-reference/SCREEN_ROUTE_CONTRACT.json` 기준으로 **정확히 5개 Screen**만 존재한다. 6번째 Route를 추가하지 않는다.

### 2.1 핵심 화면 4개 (core)

| Screen | Route | Page Entry |
|---|---|---|
| SCR-001 메인 | `/` | `src/app/page.tsx` |
| SCR-003 통합 여행 준비 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 동행 조회 | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 계정·관리 | `/account` | `src/app/account/page.tsx` |

### 2.2 보조 화면 1개 (supporting)

| Screen | Route | Page Entry |
|---|---|---|
| SCR-002 대표 소개 | `/about` | `src/app/about/page.tsx` |

### 2.3 Screen 수에 포함되지 않는 기술 라우트

`SCREEN_ROUTE_CONTRACT.json`의 `technical_routes`에 정의된 아래 4개는 Screen이 아니며, 5개 카운트에 포함하지 않는다.

- `src/app/auth/callback/route.ts` — Supabase 인증 콜백
- `src/app/api/**/route.ts` — 동행 CRUD·참가 요청·신고·관리자 처리용 서버 API
- `src/app/not-found.tsx` — 전역 404
- `src/app/error.tsx` — 전역 500/런타임 오류

각 Page Owner Task(`TASKS/TASK_MANIFEST.csv`의 `category=PAGE_OWNER` 행)는 위 5개 Page Entry 중 정확히 1개만 소유하며, 하위 Component를 새로 만들지 않고 이미 만들어진 Component를 조립하는 것만 범위로 한다.

---

## 3. Server Component / Client Component 경계

Next.js App Router의 기본값은 **Server Component**다. 아래 원칙을 코드 전반에 적용한다.

### 3.1 Server Component(기본값)를 사용하는 경우

- 5개 Page Entry(`page.tsx`) 자체와 정적 데이터를 읽어 렌더링만 하는 Section 컴포넌트(여행지 Card Grid, 안전정보 패널, 대표 소개 Section 등).
- `src/data/**` 정적 데이터를 import해서 그대로 렌더링하는 컴포넌트.
- Supabase에서 공개 데이터(동행글 목록 등)를 읽기만 하는 초기 렌더 구간.
- `src/app/layout.tsx`(전역 내비게이션/푸터의 정적 마크업 부분).

### 3.2 Client Component(`"use client"`)로 명시해야 하는 경우

- 사용자 입력을 받는 모든 Form: 항공/숙소 조건 입력 폼, 동행 모집글 작성 폼, 참가 요청 폼, 로그인/가입/재설정 폼, 프로필 폼.
- 탭 전환(SCR-003 항공/숙소/동행 탭), Drawer 열고 닫기(여행지 상세, 동행 상세), 필터 상태 조작.
- `localStorage` 기반 즐겨찾기 토글, Web Share API 공유 버튼.
- Toast/배지 등 브라우저 이벤트에 반응하는 알림 UI.
- Supabase 클라이언트 세션을 구독하거나 로그인 상태에 따라 즉시 리렌더링해야 하는 컴포넌트.

### 3.3 원칙

- 상위 `page.tsx`는 Server Component로 유지하고, 상호작용이 필요한 최소 단위의 하위 컴포넌트만 `"use client"`로 분리한다("Client 경계를 최대한 아래로 내린다").
- Server Component 안에서 브라우저 전용 API(`window`, `localStorage`, `navigator.share`)를 호출하지 않는다.

---

## 4. 항공·숙소 입력 폼 — 브라우저 일시 상태 전용

`REQ-FUNC-011~026`, `REQ-NF-005`, `REQ-NF-017`을 코드 구조로 고정한다.

- `CMP-SCR003-FLIGHT-FORM`, `CMP-SCR003-HOTEL-FORM`은 **Client Component**이며, 입력값(국가·지역·출발일/체크인·귀국일/체크아웃)은 오직 React 컴포넌트의 `useState`/`useReducer` 같은 **일시 상태(transient state)**로만 유지한다.
- 아래 대상으로는 입력값을 **절대 전달하지 않는다**:
  - 서버 액션 / API Route(`src/app/api/**`)
  - Supabase DB(6개 Table 중 어느 것에도 저장하지 않는다)
  - 외부 이동 URL의 query string(항공/호텔 사이트로 이동하는 링크는 관리자가 설정한 고정 URL만 사용하며, 사용자가 입력한 국가·지역·날짜를 URL에 붙이지 않는다)
  - 분석/로깅 이벤트(콘솔 로그, 애널리틱스 이벤트 페이로드 등 어디에도 기록하지 않는다)
- 입력 요약 화면과 "외부 사이트로 이동" 버튼은 같은 페이지의 React state를 그대로 재사용하며, 새로고침 시 값이 사라지는 것을 정상 동작으로 간주한다(영속화하지 않음).
- 외부 이동 링크는 `target="_blank" rel="noopener noreferrer"`를 사용한다.
- 코드 리뷰 체크포인트: 이 두 컴포넌트의 `fetch`/`useEffect` 내부에서 위 입력값을 인자로 사용하는 코드가 있으면 즉시 반려한다.

---

## 5. 정적 데이터 (`src/data`)

`REQ-FUNC-001~010`(여행지), `REQ-FUNC-046~054`(안전정보), `REQ-FUNC-057~063`(대표 소개)는 별도 CMS나 관리자 CRUD 화면 없이 **코드 저장소 내 정적 데이터 파일**로 관리한다.

| 데이터 | 파일(계획) | 담당 Task |
|---|---|---|
| 여행지(국내/해외) | `src/data/destinations.ts` | `DATA-DESTINATIONS` |
| 국가별 안전정보 | `src/data/safety.ts` | `DATA-SAFETY` |
| 대표(`free_traveler`) 소개 | `src/data/representative.ts` | `DATA-REPRESENTATIVE` |
| 정책 페이지(약관/개인정보/안전수칙/면책) | `src/data/policies.ts` | `CMP-SCR005-POLICY-PAGES` |

- 콘텐츠 변경은 코드 리뷰 + PR로만 이루어지며, 런타임 Admin 편집 화면을 만들지 않는다(제외 근거: `docs/PROJECT_SCOPE.md` §4).
- 이미지에는 `alt` 텍스트와 출처 URL만 데이터 필드로 기록한다. 업로드·라이선스 승인 워크플로는 만들지 않는다.
- 필수 필드 누락은 런타임 화면이 아니라 `scripts/validate_content.py`(`DATA-VALIDATION-SCRIPT`)가 검증한다.
- `src/data`는 현재 빈 디렉터리이며(`src/app`만 존재), 위 4개 파일은 아직 생성되지 않았다 — §9 참조.

---

## 6. Supabase — Auth와 동행(Mate) 기능 중심

Supabase는 **Auth**와 **동행(Mate) 관련 기능**에만 사용하며, 여행지/안전/대표 콘텐츠에는 사용하지 않는다.

### 6.1 사용 범위

- **Auth**: 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정, 성인 확인(`is_adult`, `adult_verified_at`만 저장, 생년월일은 저장하지 않음), 탈퇴 시 즉시 비식별화.
- **동행(Mate)**: 모집글 작성·조회·수정·마감, 참가 요청·승인/거절, 차단, 신고, 관리자의 신고 처리·외부 URL 설정.

### 6.2 DB Table — 정확히 6개

`TASKS/TASK_MANIFEST.csv`의 `DB-SCHEMA-BASE` Task 기준으로, 아래 6개 Table **범위를 넘지 않는다**. 7번째 Table을 추가하지 않는다.

1. `member_profiles` — 닉네임, 연령대, 여행 스타일, 성별(선택), `is_adult`, `adult_verified_at`
2. `mates` — 동행 모집글(제목·국가·지역·기간·인원·스타일·설명·상태)
3. `mate_applications` — 참가 요청(PENDING/ACCEPTED/REJECTED, 500자 이내 비공개 메시지)
4. `mate_blocks` — 사용자 간 차단 관계
5. `mate_reports` — 신고(사유 코드, 설명, 상태 OPEN/REVIEWING/RESOLVED/DISMISSED)
6. `outbound_url_settings` — 관리자가 설정하는 항공/호텔 외부 URL(HTTPS 허용목록)

- 정확한 생년월일을 저장하는 컬럼을 어떤 테이블에도 두지 않는다.
- 범용 감사 로그(모든 변경 이력) 테이블은 만들지 않는다 — 신고 처리 상태와 처리 시각만 `mate_reports`에 기록한다(`REQ-FUNC-042`, `REQ-NF-022` 제외 근거와 동일).

### 6.3 Browser Client / Server Client 구분

- **Browser Supabase Client** (`@supabase/ssr`의 브라우저용 클라이언트): Client Component 안에서 세션 상태 구독, 로그인/가입/로그아웃, 클라이언트발 단순 조회에 사용한다.
- **Server Supabase Client** (`@supabase/ssr`의 서버용 클라이언트, 쿠키 기반): Server Component의 초기 데이터 조회, Server Action, `src/app/api/**/route.ts`, `src/app/auth/callback/route.ts`에서 사용한다.
- 두 클라이언트는 별도 유틸 파일(`src/lib/db/*.ts`, `DB-ACCESS` Task 범위)로 분리하고, Client Component에서 Server 전용 Supabase 클라이언트를 import하지 않는다(서비스 키가 클라이언트 번들에 포함되는 것을 방지).

### 6.4 간단한 RLS 원칙

- **본인 데이터**: `member_profiles`, `mate_applications`, `mate_blocks`는 본인이 작성/관련된 행만 조회·수정 가능하다.
- **작성자 우선**: `mates`는 누구나 조회 가능(공개 목록/상세)하지만, 수정·마감·삭제는 작성자만 가능하다.
- **요청 대상자 확인**: `mate_applications`의 승인/거절은 해당 모집글의 작성자만 가능하다.
- **Admin/Moderator만**: `mate_reports` 상태 변경, `outbound_url_settings` 수정은 Admin 역할만 가능하다.
- 위 4개 원칙을 넘어서는 세분화된 권한 등급(Moderator 이상 다단계 등)은 만들지 않는다 — RLS는 "본인 / 작성자 / Admin" 3단계로 단순화한다.
- 정책 예시(개념 수준, 실제 SQL은 `DB-RLS-BASE` Task에서 작성):
  - `mates`: `select` — `true`(공개) / `update`, `delete` — `auth.uid() = author_id`
  - `mate_applications`: `select` — `auth.uid() = requester_id OR auth.uid() = (select author_id from mates where id = mate_id)` / `insert` — `auth.uid() = requester_id`
  - `mate_reports`, `outbound_url_settings`: 모든 조작 — `auth.jwt() ->> 'role' = 'admin'`

### 6.5 ORM 미사용

- **Prisma·기타 ORM을 사용하지 않는다.** Supabase JS 클라이언트(`@supabase/supabase-js` / `@supabase/ssr`)의 쿼리 빌더를 직접 사용한다.
- 스키마 정의는 순수 SQL(`supabase/schema.sql`, `supabase/rls_policies.sql`)로 관리하며, ORM 마이그레이션 도구를 도입하지 않는다.

---

## 7. 테스트

### 7.1 Vitest — 단위 테스트

- 날짜 검증(`src/lib/date-validation.test.ts`), 연락처 패턴 탐지(`src/lib/contact-detection.test.ts`), 모집글/참가요청 상태 전이(`src/lib/mate-state.test.ts`)를 Vitest 단위 테스트로 커버한다.
- Supabase 실 연결 없이 순수 함수 단위로 테스트한다(RLS는 §7.2의 통합 테스트에서 별도로 검증).

### 7.2 Playwright — Chromium Smoke만

- **Chromium 프로젝트만** 사용한다. 크로스 브라우저 매트릭스(Firefox/WebKit), 시각 회귀, 전체 회귀 스위트는 만들지 않는다.
- Smoke Test는 정확히 3개로 제한한다:
  1. `E2E-PUBLIC-SMOKE` — 홈→여행지 상세→안전정보, About, 동행 목록 비로그인 열람, 404
  2. `E2E-TRAVEL-TOOLS` — 탭 전환 상태 유지, 항공/숙소 입력→검증→요약→외부 이동 버튼 속성
  3. `E2E-MATE-AUTH` — 가입→로그인→성인확인→동행글 작성→참가 요청→승인/거절→신고
- RLS 권한 통합 테스트(`TEST-RLS-BASIC`)는 Playwright가 아닌 별도 통합 테스트(`tests/rls/basic.test.ts`)로 수행한다.

---

## 8. CI/CD

- **GitHub Actions**로 `next lint`, `tsc --noEmit`, Vitest 단위 테스트를 PR/병합 전에 실행한다(`CI-PIPELINE` Task).
- **Vercel Preview**로 PR마다 프리뷰 배포를 생성해 수동 확인에 사용하고, `main` 병합 시 프로덕션 배포한다.
- Lighthouse CI 게이트, 구조화 로그, 5xx 자동 알림 등은 만들지 않는다(`docs/PROJECT_SCOPE.md` §4/§6 EXCLUDED 항목과 동일 근거).
- **AWS·EC2는 사용하지 않는다.** 인프라는 Vercel(호스팅)과 Supabase(DB/Auth) 관리형 서비스로만 구성한다.
- **자동 Merge(무인 Merge Runner)는 사용하지 않는다.** PR 병합은 수동 검토를 거친다. GitHub Actions는 검사(lint/typecheck/test) 실행까지만 담당하며, 검사 통과가 자동 병합으로 이어지지 않는다.

---

## 9. 착수 차단 (Blocking) — 실제 파일/환경변수 부재

아래 항목은 코드베이스를 실제로 열어 확인한 현재 부재 상태이며, 각 Task 착수 전에 준비되어야 한다. 추측이나 일반론은 포함하지 않는다.

| 구분 | 부재 항목 | 필요한 이유 | 관련 Task |
|---|---|---|---|
| 패키지 | `package.json`에 `@supabase/supabase-js`/`@supabase/ssr` 없음 | Browser/Server Supabase Client 구현에 필요 | `DB-ACCESS`, `CMP-SCR005-AUTH` |
| 패키지 | `package.json`에 `vitest` 없음 | §7.1 단위 테스트 실행에 필요 | `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE` |
| 패키지 | `package.json`에 `@playwright/test` 없음 | §7.2 Chromium Smoke 실행에 필요 | `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` |
| 환경변수 | `.env.local`/`.env.example` 파일 없음 — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 미정의 | Server/Browser Supabase Client 초기화에 필요 | `DB-ACCESS`, `CMP-SCR005-AUTH` |
| 인프라 파일 | `supabase/` 디렉터리 없음(`schema.sql`, `rls_policies.sql`, `seed.sql`) | §6.2/§6.4 DB 스키마·RLS·시드 정의에 필요 | `DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-SEED-BASE` |
| 데이터 파일 | `src/data/` 디렉터리가 비어 있음(§5의 4개 파일 없음) | 5개 Screen 전부가 이 데이터를 렌더링 소스로 사용 | `DATA-DESTINATIONS`, `DATA-SAFETY`, `DATA-REPRESENTATIVE` |
| CI 설정 | `.github/workflows/` 없음 | §8 GitHub Actions 파이프라인 구성에 필요 | `CI-PIPELINE` |
| Vercel 설정 | 프로젝트-Vercel 연결 여부 미확인(로컬에서 확인 불가) | §8 Preview/프로덕션 배포에 필요 | `RELEASE-CHECK-VERCEL-SUPABASE` |

### 9.1 명시적 범위 제외 (착수 차단 아님)

아래는 "누락"이 아니라 **프로젝트 범위에서 의도적으로 제외**한 것이므로, 향후에도 파일/설정을 준비할 필요가 없다.

- **CMS**: 여행지·안전정보·대표 소개용 별도 콘텐츠 관리 시스템(Headless CMS 등)을 도입하지 않는다. 콘텐츠는 §5의 `src/data/**` 정적 파일로만 관리한다.
- **외부 Email 공급자**: 회원가입 인증 메일은 Supabase Auth 기본 메일 발송을 사용하며, SendGrid 등 별도 트랜잭션 메일 공급자를 연동하지 않는다. 참가 요청/승인/신고 알림도 이메일이 아닌 Toast/화면 상태로 대체한다(`REQ-FUNC-043`).
- **Monitoring**: Datadog/Sentry 등 별도 모니터링·오류 추적 서비스를 연동하지 않는다. 성능/오류 확인은 배포 전후 수동 확인으로 대체한다(`MANUAL-CHECK-PERF-SEO`, `RELEASE-CHECK-VERCEL-SUPABASE`).

---

## 10. 변경 시 확인 순서

이 문서와 실제 구현이 어긋나면 다음 우선순위로 재확인한다.

1. `design-reference/SCREEN_ROUTE_CONTRACT.json` (Screen/Route/Page Entry/금지 기능의 최종 근거)
2. `docs/PROJECT_SCOPE.md` (Requirement별 IMPLEMENT/EXCLUDED 판정 근거)
3. `TASKS/TASK_MANIFEST.csv` + `TASKS/TASK-<ID>.md` (Task 단위 Expected Files/AC)
4. 이 문서(`docs/ARCHITECTURE.md`)는 위 3개 문서의 요약이며, 충돌 시 원본 문서가 우선한다.
