# Free Traveler — Task List (00)

- **Document ID:** TASKLIST-TRAVEL-001
- **기반 문서:** `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/06_SRS_UIUX_REVISED.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, 실제 `src/app` 파일 트리, `package.json`
- **작성 기준일:** 2026-09-15
- **선행 검사:** `python scripts/validate_inputs.py` — **PASS** (HARNESS_SCHEMA `traveler-screen-route-v1` 일치, Screen 5개, Requirement 114개, IMPLEMENT 94 / EXCLUDED 20 확인). 실패 시 이 문서를 작성하지 않는 규칙에 따라, PASS를 확인한 뒤에만 아래 내용을 작성했다.
- **이 문서는 계획 문서다.** 구현 코드, Git Branch, Commit, Issue를 만들지 않았다.

---

## 0. 요약

### 0.1 Task 총수 및 Category별 집계

| Category | 설명 | Task 수 |
|---|---:|---:|
| PAGE_OWNER | Screen 전체 조립(정확히 5개, Screen당 1개) | 5 |
| COMPONENT | 화면 내 개별 UI 조각 | 31 |
| AUTH | 인증(로그인/가입/재설정/성인확인/탈퇴) | 1 |
| DATA | 정적 데이터(`src/data/**`) 및 검증 스크립트 | 4 |
| DB | Supabase 스키마·RLS·접근 계층·시드 | 4 |
| GLOBAL | 전역 레이아웃·SEO·접근성·오류 화면·성능·Toast | 7 |
| CI | 빌드 전 lint/typecheck/unit 파이프라인 | 1 |
| UNIT_TEST | 단위 테스트(날짜 검증·연락처 탐지·상태 전이) | 3 |
| INTEGRATION_TEST | RLS 권한 통합 테스트 | 1 |
| E2E_TEST | Playwright Chromium 흐름 테스트(3개 Task, 5~7개 흐름 묶음) | 3 |
| MANUAL_CHECK | 브라우저 수동 확인(성능/SEO, 접근성, 반응형, 클라이언트 상태) | 4 |
| RELEASE_CHECK | Vercel/Supabase 배포·환경변수·TLS 확인 | 1 |
| **합계** | | **65** |

> 개수는 권장 범위(45~65개) 상단에 위치하나, 규칙 9·10·11(SCR-003/004/005 세부 영역 분리)과 규칙 12(DB Task 분리)을 지키기 위해 Component/DB Task를 세분화한 결과이며, **개수 자체는 완료 조건이 아니다.** 완료 조건은 §4 Requirement 커버리지(누락 0건)와 각 규칙 준수 여부다. (`TASKS/TASK_MANIFEST.csv` 실측 65건과 일치 — 2026-09-16 감사에서 기존 `34/67` 표기 오류를 수정함.)

### 0.2 Requirement 커버리지 요약

| 구분 | 건수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |
| IMPLEMENT (구현 Task + Test Task 연결) | 94 |
| EXCLUDED (§5 NON_IMPLEMENTATION 표에 근거·후속 방향 기록) | 20 |
| **누락된 Requirement ID** | **0건 — §6 Requirement Coverage Index에서 114건 전수 확인** |

---

## 1. Task List 열 정의

`Seq, Task ID, 제목, Category, Implementation Status, Requirement Ref, Screen, Route, Page Entry, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Verify, Priority`

- **Implementation Status**: `IMPLEMENT` 또는 EXCLUDED Task는 이 표에 없음(§5 참조).
- **Expected Files**: 실제 `src/app` 트리 확인 결과에 근거한다. 현재 존재하는 파일은 `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/favicon.ico`뿐이며, `about/`, `travel-tools/`, `mates/`, `account/` 디렉터리는 아직 없다(`replace_starter`/`create`로 구분 표기). Component 파일 경로는 아직 존재하지 않는 신규 생성 대상이다(`create`).
- **Verify**: Unit/Integration/E2E Test Task ID, Manual Check Task ID, Release Check Task ID, 또는 자체 스크립트 실행을 가리킨다.
- **Priority**: P0(핵심 경로, 다른 다수 Task가 의존) / P1(핵심 기능이나 의존 적음) / P2(수동 확인·릴리스 게이트·부가 기능).

---

## 2. Page Owner Task (5개, Screen당 정확히 1개)

| Seq | Task ID | 제목 | Category | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PAGE-SCR001 | 메인 화면 조립 | PAGE_OWNER | (조립 Task, §6에서 하위 Component가 개별 REQ 보유) | SCR-001 | `/` | `src/app/page.tsx` | CMP-SCR001-SEARCH-HERO, CMP-SCR001-DESTINATION-GRID, CMP-SCR001-DESTINATION-DRAWER, CMP-SCR001-SAFETY-PANEL, CMP-SCR001-RECENT-MATES, CMP-SCR001-FAVORITES, CMP-SCR001-SHARE, DATA-DESTINATIONS, DATA-SAFETY, GLOBAL-NAV-FOOTER, GLOBAL-TOAST | `src/app/page.tsx` (replace_starter) | P0 |
| 2 | PAGE-SCR002 | 대표 소개 화면 조립 | PAGE_OWNER | (조립) | SCR-002 | `/about` | `src/app/about/page.tsx` | CMP-SCR002-PROFILE-HERO, CMP-SCR002-STATS, CMP-SCR002-PHILOSOPHY, CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRY-CHIPS, CMP-SCR002-GALLERY, CMP-SCR002-MEMORABLE-CTA, DATA-REPRESENTATIVE, GLOBAL-NAV-FOOTER | `src/app/about/page.tsx` (create) | P0 |
| 3 | PAGE-SCR003 | 통합 여행 준비 화면 조립 | PAGE_OWNER | (조립) | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | CMP-SCR003-INTRO, CMP-SCR003-TABS, CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM, CMP-SCR003-MATE-COMPOSE, CMP-SCR003-TIPS, CMP-SCR005-AUTH, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST | `src/app/travel-tools/page.tsx` (create) | P0 |
| 4 | PAGE-SCR004 | 동행 조회 화면 조립 | PAGE_OWNER | (조립) | SCR-004 | `/mates` | `src/app/mates/page.tsx` | CMP-SCR004-INTRO, CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-DETAIL, CMP-SCR004-JOIN-REQUEST, CMP-SCR004-REPORT, CMP-SCR004-BLOCK, CMP-SCR005-AUTH, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST | `src/app/mates/page.tsx` (create) | P0 |
| 5 | PAGE-SCR005 | 계정·관리 화면 조립 | PAGE_OWNER | (조립) | SCR-005 | `/account` | `src/app/account/page.tsx` | CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-ADMIN, CMP-SCR005-POLICY-PAGES, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST | `src/app/account/page.tsx` (create) | P0 |

각 Page Owner는 여러 Page Entry를 동시에 소유하지 않는다(규칙 16) — 1 Task = 1 `page_entry`.

### 2.1 Page Owner Acceptance Criteria (Section 순서·데이터 출처·최소 콘텐츠 수·밀도·Empty State/Placeholder 금지)

#### PAGE-SCR001

**Functional AC (Section 순서 · 데이터 출처)**
1. Hero(검색 입력, `CMP-SCR001-SEARCH-HERO`, 정적 카피)
2. 국내 여행지 6개(`CMP-SCR001-DESTINATION-GRID`, 데이터 출처: `DATA-DESTINATIONS` `scope=DOMESTIC`)
3. 해외 여행지 6개(`CMP-SCR001-DESTINATION-GRID`, 데이터 출처: `DATA-DESTINATIONS` `scope=OVERSEAS`)
4. 여행 동기 6개(`CMP-SCR001-DESTINATION-GRID` 내 테마 Chip, 데이터 출처: `DATA-DESTINATIONS.themes`)
5. 국가별 주의사항 6개(`CMP-SCR001-SAFETY-PANEL`, 데이터 출처: `DATA-SAFETY`)
6. 최근 동행글 3개 또는 완성형 Empty State(`CMP-SCR001-RECENT-MATES`, 데이터 출처: `DB-ACCESS`의 mates 조회)
7. free_traveler 소개 요약(`CMP-SCR001-DESTINATION-DRAWER`가 아닌 별도 CTA 배너, 데이터 출처: `DATA-REPRESENTATIVE`)

**Visual AC (최소 콘텐츠 수 · 밀도 · Empty State/Placeholder 금지)**
- Card 최소 개수: 국내 6 / 해외 6 / 테마 Chip 6 / 안전정보 6 / 최근 동행 3(또는 Empty State).
- Desktop 3×2 Card 그리드, Mobile 1열 — 반응형 콘텐츠 밀도는 `D-001/DESIGN.md` §15·§16 토큰(Section padding 64~96px/40~64px, 콘텐츠 최대 폭 1200~1280px) 그대로 적용.
- Hero 아래에서 다음 Section 제목·카드 상단 일부가 보여야 하며(Hero 높이 뷰포트 60~70%), 큰 빈 영역을 만들지 않는다.
- Lorem ipsum, "준비 중", "정보 확인 필요", 내용 없는 Card를 어디에도 두지 않는다.
- Section 6(최근 동행글)에 데이터가 없으면 "아직 등록된 동행 모집글이 없습니다" 안내 문장 + 이용 방법 2줄 + "동행 글 작성하기" CTA로 구성된 완성형 Empty State를 표시한다(빈 화면처럼 보이지 않게).
- Section 6(최근 동행글, `DB-ACCESS` 조회)이 로딩 중인 동안에는 실제 Card와 동일한 크기·개수(3개)의 Skeleton을 표시한다(빈 화면·레이아웃 이동 금지). 로딩 실패 시 "동행 글을 불러오지 못했습니다" 안내 + 다시 시도 버튼을 표시한다.

#### PAGE-SCR002

**Functional AC**
1. Profile Hero(대표 이미지 1장 + 한 문장, 데이터 출처: `DATA-REPRESENTATIVE.hero`)
2. 여행 지표(`50+ Trips`, `30+ Countries`, 데이터 출처: `DATA-REPRESENTATIVE.stats`)
3. 소개·철학(좌우 분할, 데이터 출처: `DATA-REPRESENTATIVE.philosophy`)
4. Timeline 6개 이상(데이터 출처: `DATA-REPRESENTATIVE.timeline`)
5. 방문 국가 30개(권역별 Chip, 데이터 출처: `DATA-REPRESENTATIVE.countries`)
6. Gallery 8개 이상(데이터 출처: `DATA-REPRESENTATIVE.gallery`)
7. 기억에 남는 여행지 4개 + CTA(데이터 출처: `DATA-REPRESENTATIVE.memorable` + `DATA-DESTINATIONS` 상세 연결)

**Visual AC**
- 최소 콘텐츠 수: Timeline 6개 이상 / 방문 국가 30개 / Gallery 이미지 8장 이상 / 기억에 남는 여행지 4개.
- Desktop 좌우 분할·Gallery 4×2, Mobile 세로 스택·Gallery 1~2열.
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지. 정적 콘텐츠 상시 존재이므로 Empty State는 정의하지 않되, 이미지 로드 실패 시 alt 텍스트 유지 대체 플레이스홀더를 사용한다.
- 이 화면은 정적 데이터만 사용하는 Server Component로 렌더되므로 별도의 클라이언트 Loading 상태를 두지 않는다(비동기 DB 조회 없음).

#### PAGE-SCR003

**Functional AC**
1. Intro(이용 순서 3단계, 정적 카피)
2. 탭(항공편/숙소/동행 구하기, `CMP-SCR003-TABS`가 `CMP-SCR003-FLIGHT-FORM`/`CMP-SCR003-HOTEL-FORM`/`CMP-SCR003-MATE-COMPOSE`를 실제 내부 컴포넌트로 조립 — 외부 링크 버튼으로 대체 금지)
3. 여행정보 Form(항공/숙소 공통 구조: 국가·지역·시작일·종료일, 데이터 출처: `DATA-DESTINATIONS`의 국가/지역 목록)
4. 입력 요약 + 외부 이동(좌우 분할, 비전달 고지 포함)
5. 찾기 Tip 3개(정적 카피)
6. 동행 작성 Form(로그인·성인 확인 완료 시, 데이터 출처: `CMP-SCR005-AUTH` 세션 상태) 또는 로그인/성인 확인 안내 + 안전 안내

**Visual AC**
- 탭별 폼 상태(미입력/검증 오류/요약)는 다른 탭으로 전환해도 유지된다.
- Tip Card 3개, 요약 Action Card 좌우 분할은 Mobile에서 세로 스택.
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지. 동행 탭 비로그인 상태는 "로그인/성인 확인이 필요합니다" 안내 + `/account` 이동 CTA로 구성된 완성형 상태로 표시한다(빈 폼만 노출 금지).
- 동행 탭은 `CMP-SCR005-AUTH` 세션 상태를 확인하는 동안 Skeleton(폼 영역과 동일 크기)을 표시하고, 로그인 상태 미확정 상태에서 UI를 깜빡이며 전환하지 않는다. 세션 확인 실패 시 안내 + 다시 시도 버튼을 표시한다.

#### PAGE-SCR004

**Functional AC**
1. Intro(제목 + 설명 2문장 + "새 동행 글 작성하기" CTA)
2. Filter + 결과 요약(`CMP-SCR004-FILTER`, 데이터 출처: `DB-ACCESS`의 mates 쿼리)
3. 동행 목록(`CMP-SCR004-LIST`, 최대 8개 우선 노출, 데이터 출처: `DB-ACCESS`)
4. 상세(`CMP-SCR004-DETAIL`, Desktop 좌우 분할 / Mobile Drawer, 참가·신고·차단 진입점 포함)
5. 신청 방법 3단계(정적 카피)
6. 안전·신고·차단 안내 + CTA 배너

**Visual AC**
- 목록 Card 최대 8개 우선 노출(그 이상 "더 보기"), 목록과 상세 중 하나만 존재하는 레이아웃 금지.
- 검색 결과 0건이면 "조건에 맞는 모집글이 아직 없습니다" 안내 + 검색 조건 초기화 버튼 + "동행 글 작성하기" CTA + 참가 요청 이용 방법 3줄 요약으로 구성된 완성형 Empty State를 Section 3 자리에 표시한다.
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지.
- Section 2~4(모두 `DB-ACCESS` 조회)가 로딩 중인 동안에는 실제 목록·상세와 동일한 레이아웃의 Skeleton을 표시한다. 조회 실패 시 안내 + 다시 시도 버튼을 표시하고, 빈 결과(0건)와 로딩 실패를 서로 다른 문구로 구분한다.

#### PAGE-SCR005

**Functional AC**
1. 현재 역할(Guest/Member/Admin)의 Intro(역할별 안내 카피, 데이터 출처: `CMP-SCR005-AUTH` 세션·역할 상태)
2. 핵심 작업(Guest: 로그인/가입/재설정 Card 3개 — `CMP-SCR005-AUTH`; Member: 프로필·내 글·참가 요청·차단 — `CMP-SCR005-PROFILE`/`CMP-SCR005-MY-ACTIVITY`; Admin: 신고 처리·외부 URL 설정 — `CMP-SCR005-ADMIN`)
3. 도움말 또는 다음 행동(보안 안내, Empty 지점 CTA, 정책 링크 — `CMP-SCR005-POLICY-PAGES`)
- 역할에 없는 관리 영역(Admin 탭 등)은 **렌더링하지 않는다**(구조는 코드에 존재하되 조건부 렌더링으로 숨김).

**Visual AC**
- Member 탭 "내 글 없음" 등 데이터 없는 지점은 안내 문장 + 이용 방법 + "동행 글 작성하기" CTA로 구성된 완성형 Empty State를 표시한다.
- Desktop 3-Card 가로 배치, Mobile 세로 스택.
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지.
- `CMP-SCR005-AUTH` 세션·역할(Guest/Member/Admin) 확인이 끝나기 전에는 Skeleton을 표시하고, Guest UI가 먼저 보였다가 Member/Admin UI로 바뀌는 깜빡임을 만들지 않는다. 세션 확인 실패 시 안내 + 다시 시도 버튼을 표시한다.

**Security/Privacy AC(5개 Page Owner 공통)**
- Airbnb 상표 요소, 구매·예약·결제 UI, 실시간 항공권/호텔 가격, 광고, 별점을 어디에도 포함하지 않는다(`SCREEN_ROUTE_CONTRACT.json` `prohibited_features`/`global_prohibitions`).
- 로그인이 필요한 동작(즐겨찾기 관리, 참가 요청, 신고·차단, 동행 작성)은 비로그인 상태에서 `/account`로 안전하게 안내한다.

**Verify:** `E2E-PUBLIC-SMOKE`(SCR-001/002/004 열람), `E2E-TRAVEL-TOOLS`(SCR-003), `E2E-MATE-AUTH`(SCR-003 동행 탭/SCR-004 참가·신고·차단/SCR-005), `MANUAL-CHECK-RESPONSIVE`, `MANUAL-CHECK-A11Y`(5개 Page Owner 공통)

---

## 3. Component / Data / DB / Global / CI / Test / Manual / Release Task

### 3.1 SCR-001 Component

| Seq | Task ID | 제목 | Category | Requirement Ref | Screen | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | CMP-SCR001-SEARCH-HERO | 검색 Hero | COMPONENT | REQ-FUNC-003, 067 | SCR-001 | DATA-DESTINATIONS | `src/components/home/SearchHero.tsx` (create) | 키워드 부분 일치 검색, 여행지/국가/테마 통합 검색 | Hero 높이 뷰포트 60~70%, 제목+설명 2문장+보조 CTA | 검색 입력에 실행 코드 삽입 방지(입력 이스케이프) | E2E-PUBLIC-SMOKE | P0 |
| 7 | CMP-SCR001-DESTINATION-GRID | 국내/해외 여행지 Card Grid + 필터 | COMPONENT | REQ-FUNC-001, 002, 005, 010; REQ-NF-004 | SCR-001 | DATA-DESTINATIONS | `src/components/home/DestinationGrid.tsx` (create) | 국내/해외 탭 전환, 국가·도시·계절·테마·기간 AND 필터, URL query 상태 반영 | Desktop 3×2/Mobile 1열, 각 6개 이상, 결과 0건 시 조건 완화 안내+초기화 버튼(완성형) | 허용 필터 키만 파싱(임의 query 주입 방지) | E2E-PUBLIC-SMOKE | P0 |
| 8 | CMP-SCR001-DESTINATION-DRAWER | 여행지 상세 Drawer(+ 안전정보 전환) | COMPONENT | REQ-FUNC-004, 006, 009 | SCR-001 | DATA-DESTINATIONS, DATA-SAFETY | `src/components/home/DestinationDrawer.tsx` (create) | 소개·명소 5+·일정·예산·교통·음식 3+·에티켓·출처, 관련 여행지 최대 6개, "국가 안전정보 보기" 내부 전환 | Desktop 우측 40% 슬라이드/Mobile 하단 풀시트, 그림자는 Drawer에만 적용 | 비공개/현재 여행지 추천 제외 | E2E-PUBLIC-SMOKE | P0 |
| 9 | CMP-SCR001-SAFETY-PANEL | 국가 안전정보 패널 | COMPONENT | REQ-FUNC-047~054; REQ-NF-028 | SCR-001 | DATA-SAFETY | `src/components/home/SafetyPanel.tsx` (create) | 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리, 출처·확인일, 외교부 원문 링크(`noopener,noreferrer`), 중대 경보 텍스트 라벨, 국가/지역 범위 구분 | 7일 초과 시 stale 배지(색상+텍스트 병행) | 안전정보 면책 고지 상시 노출 | E2E-PUBLIC-SMOKE | P1 |
| 10 | CMP-SCR001-RECENT-MATES | 최근 동행 이야기 미리보기 | COMPONENT | (Empty State 규칙 적용, §2.1 참조) | SCR-001 | DB-ACCESS | `src/components/home/RecentMatesPreview.tsx` (create) | 모집중 동행글 3개 미리보기 또는 완성형 Empty State | Card 3개 또는 안내+이용방법+CTA 3요소 | 공개 연락처 미노출 | E2E-PUBLIC-SMOKE | P1 |
| 11 | CMP-SCR001-FAVORITES | 즐겨찾기 토글 | COMPONENT | REQ-FUNC-068 | SCR-001 | (없음) | `src/lib/favorites.ts`, `src/components/home/FavoriteButton.tsx` (create) | `localStorage` 추가/해제/조회, 중복 방지 | 44×44px 이상 터치 영역 | 서버 저장 없음(로컬 전용) | MANUAL-CHECK-CLIENT-STATE | P2 |
| 12 | CMP-SCR001-SHARE | 공유 버튼 | COMPONENT | REQ-FUNC-069 | SCR-001 | (없음) | `src/components/shared/ShareButton.tsx` (create) | Web Share API 시도 후 실패 시 URL 복사 폴백 | 44×44px 이상 터치 영역 | — | MANUAL-CHECK-CLIENT-STATE | P2 |

### 3.2 SCR-002 Component

| Seq | Task ID | 제목 | Category | Requirement Ref | Screen | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 13 | CMP-SCR002-PROFILE-HERO | 대표 Hero | COMPONENT | (Hero 이미지·소개문) | SCR-002 | DATA-REPRESENTATIVE | `src/components/about/ProfileHero.tsx` (create) | 대표 이미지 1장 + 한 문장 | alt에 실제 상황 설명 | 이미지 출처·라이선스 메타 표시 | E2E-PUBLIC-SMOKE | P1 |
| 14 | CMP-SCR002-STATS | 여행 지표 카드 | COMPONENT | REQ-FUNC-057 | SCR-002 | DATA-REPRESENTATIVE | `src/components/about/TravelStats.tsx` (create) | `50+ Trips`, `30+ Countries` 좌우 2분할 + 1줄 설명 | 전역 대표명·수치 일치 | — | E2E-PUBLIC-SMOKE | P1 |
| 15 | CMP-SCR002-PHILOSOPHY | 소개·철학 | COMPONENT | REQ-FUNC-058 | SCR-002 | DATA-REPRESENTATIVE | `src/components/about/Philosophy.tsx` (create) | 자기소개·시작 이유·철학 2~4개 문단 | Desktop 좌우 분할/Mobile 세로 스택 | — | E2E-PUBLIC-SMOKE | P1 |
| 16 | CMP-SCR002-TIMELINE | 여행 타임라인 | COMPONENT | REQ-FUNC-060 | SCR-002 | DATA-REPRESENTATIVE | `src/components/about/TravelTimeline.tsx` (create) | 연도·장소·한 줄 요약 6개 이상 | 세로 타임라인 | — | E2E-PUBLIC-SMOKE | P1 |
| 17 | CMP-SCR002-COUNTRY-CHIPS | 방문 국가 Chip | COMPONENT | REQ-FUNC-059 | SCR-002 | DATA-REPRESENTATIVE | `src/components/about/VisitedCountryChips.tsx` (create) | 30개국, 권역별 그룹 | Chip 목록, 44×44px 터치 영역 | — | E2E-PUBLIC-SMOKE | P2 |
| 18 | CMP-SCR002-GALLERY | 여행 사진 Gallery | COMPONENT | REQ-FUNC-061 | SCR-002 | DATA-REPRESENTATIVE | `src/components/about/PhotoGallery.tsx` (create) | 서로 다른 장소 8장 이상, alt에 장소·상황 설명 | Desktop 4×2/Mobile 1~2열, lazy load | 이미지 로드 실패 시 alt 유지 대체 플레이스홀더 | E2E-PUBLIC-SMOKE | P1 |
| 19 | CMP-SCR002-MEMORABLE-CTA | 기억에 남는 여행지 + CTA | COMPONENT | REQ-FUNC-062, 063 | SCR-002 | DATA-REPRESENTATIVE | `src/components/about/MemorableDestinations.tsx` (create) | 4개 Card + 문의/SNS 링크(빈 값 미표시, 허용 프로토콜만) + `/travel-tools`·`/mates` CTA 2개 | 비공개 여행지 자동 제외 | 허용 프로토콜(https/mailto)만 렌더링 | E2E-PUBLIC-SMOKE | P1 |

### 3.3 SCR-003 Component

| Seq | Task ID | 제목 | Category | Requirement Ref | Screen | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 20 | CMP-SCR003-INTRO | Intro(축소형 Hero) | COMPONENT | (이용 순서 3단계) | SCR-003 | (없음) | `src/components/travel-tools/ToolsIntro.tsx` (create) | 제목 + 이용 순서 3단계 요약 | 축소형 Hero, 다음 Section 즉시 노출 | — | E2E-TRAVEL-TOOLS | P0 |
| 21 | CMP-SCR003-TABS | 항공/숙소/동행 탭 셸 | COMPONENT | (규칙 8·9: 실제 내부 탭 조립) | SCR-003 | CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM, CMP-SCR003-MATE-COMPOSE | `src/components/travel-tools/ToolTabs.tsx` (create) | 항공편/숙소/동행 구하기 3탭, 탭별 폼 상태 분리 유지, 외부 링크로 대체 금지 | 선택 탭 코랄 인디케이터, 비선택 회색 | — | E2E-TRAVEL-TOOLS | P0 |
| 22 | CMP-SCR003-FLIGHT-FORM | 항공 조건 Form + 요약 + 외부 이동 | COMPONENT | REQ-FUNC-011~018; REQ-NF-005, 017 | SCR-003 | (없음) | `src/components/travel-tools/FlightForm.tsx` (create) | 국가/지역/출발일/귀국일 필수, 국가→지역 종속, 날짜 검증, 요약 표시, 비전달 고지, 외부 URL `noopener,noreferrer` 새 탭 이동, URL 오류 시 재시도 | 검증 오류 인라인 표시 | **입력값(국가·지역·날짜)을 서버·DB·분석 이벤트·외부 URL query에 절대 전달하지 않는다(브라우저 state 전용)** | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS | P0 |
| 23 | CMP-SCR003-HOTEL-FORM | 숙박 조건 Form + 요약 + 외부 이동 | COMPONENT | REQ-FUNC-019~026; REQ-NF-005, 017 | SCR-003 | (없음) | `src/components/travel-tools/HotelForm.tsx` (create) | 국가/지역/체크인/체크아웃 필수, 국가→지역 종속, 날짜 검증, 요약 표시, 비전달 고지, 외부 URL `noopener,noreferrer` 새 탭 이동, URL 오류 시 재시도 | 검증 오류 인라인 표시 | **입력값을 서버·DB·분석 이벤트·외부 URL query에 절대 전달하지 않는다** | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS | P0 |
| 24 | CMP-SCR003-MATE-COMPOSE | 동행 모집글 작성 Form | COMPONENT | REQ-FUNC-031, 032, 080 | SCR-003 | CMP-SCR005-AUTH, DB-ACCESS | `src/components/travel-tools/MateComposeForm.tsx` (create) | 제목·국가·지역·기간·인원·스타일·설명·안전수칙 동의, 날짜 역전/과거 종료일 차단, 전화번호/이메일/메신저 ID 패턴 탐지 시 제출 차단 | 안전수칙 동의 체크박스 시각적 강조 | 공개 연락처 패턴 탐지율 95%+, 정책 버전·동의 시각 저장 | UNIT-CONTACT-DETECTION, E2E-MATE-AUTH | P0 |
| 25 | CMP-SCR003-TIPS | 비전달 고지 + 찾기 Tip | COMPONENT | REQ-FUNC-015, 023 | SCR-003 | (없음) | `src/components/travel-tools/SearchTips.tsx` (create) | "입력값은 외부 사이트로 전달되지 않습니다" 고지 + Tip 3개(가격 비교/날짜 유연화/왕복·편도) | Tip Card 3개 | — | E2E-TRAVEL-TOOLS | P1 |

### 3.4 SCR-004 Component

| Seq | Task ID | 제목 | Category | Requirement Ref | Screen | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 26 | CMP-SCR004-INTRO | Intro(축소형 Hero) | COMPONENT | (제목+설명 2문장+CTA) | SCR-004 | (없음) | `src/components/mates/MatesIntro.tsx` (create) | "믿을 수 있는 동행을 찾아보세요" + "새 동행 글 작성하기" CTA | 축소형 Hero | — | E2E-PUBLIC-SMOKE | P1 |
| 27 | CMP-SCR004-FILTER | 검색 Filter + 결과 요약 | COMPONENT | REQ-FUNC-030; REQ-NF-004 | SCR-004 | DB-ACCESS | `src/components/mates/MateFilterBar.tsx` (create) | 국가·지역·기간 겹침·연령대·성별·스타일·모집상태 필터, "조건에 맞는 모집글 N건" | Chip/Form 혼합, 44×44px 터치 영역 | 차단 사용자 글 결과 제외 | E2E-PUBLIC-SMOKE | P0 |
| 28 | CMP-SCR004-LIST | 동행글 목록 | COMPONENT | REQ-FUNC-037 | SCR-004 | DB-ACCESS, CMP-SCR004-FILTER | `src/components/mates/MatePostList.tsx` (create) | 최대 8개 우선 노출, 종료일 경과 시 CLOSED로 표시(조회 시점 계산) | Card 최대 8개, 그 이상 "더 보기" | — | E2E-PUBLIC-SMOKE | P0 |
| 29 | CMP-SCR004-DETAIL | 목록+상세 분할/Drawer | COMPONENT | REQ-FUNC-033, 037 | SCR-004 | DB-ACCESS, CMP-SCR004-LIST | `src/components/mates/MateDetailPanel.tsx` (create) | 작성자·상태·조건·설명 표시, 이메일/연락처 미노출 | Desktop 좌40/우60 분할, Mobile 하단 풀시트 Drawer | HTML/JSON 응답에 이메일·전화번호 필드 제외 | UNIT-MATE-STATE, E2E-PUBLIC-SMOKE | P0 |
| 30 | CMP-SCR004-JOIN-REQUEST | 참가 요청 Form | COMPONENT | REQ-FUNC-034, 035, 036; REQ-NF-005 | SCR-004 | CMP-SCR005-AUTH, DB-ACCESS, CMP-SCR004-DETAIL | `src/components/mates/JoinRequestForm.tsx` (create) | 500자 이내 비공개 메시지, PENDING 저장, 동일 글 중복 PENDING/ACCEPTED 차단, 작성자 승인/거절 | 상태 배지(대기/승인/거절) | 비작성자 상태 변경 403 | UNIT-MATE-STATE, E2E-MATE-AUTH | P0 |
| 31 | CMP-SCR004-REPORT | 신고 버튼/폼 | COMPONENT | REQ-FUNC-039, 041, 042; REQ-NF-005, 019 | SCR-004 | CMP-SCR005-AUTH, DB-ACCESS, CMP-SCR004-DETAIL | `src/components/mates/ReportForm.tsx` (create) | 사유 코드+설명, 신고 ID 즉시 표시(3초 이내), Admin 신고 큐 OPEN/REVIEWING/RESOLVED/DISMISSED 상태 처리 | 신고 접수 완료 Toast | 사유·처리 시각 기록 | E2E-MATE-AUTH | P1 |
| 32 | CMP-SCR004-BLOCK | 차단 버튼 | COMPONENT | REQ-FUNC-040 | SCR-004 | CMP-SCR005-AUTH, DB-ACCESS | `src/components/mates/BlockButton.tsx` (create) | 사용자 차단, 차단 후 상호 글·프로필·요청 비노출 | 차단 확인 Modal | RLS로 차단 관계 서버 검증 | E2E-MATE-AUTH | P1 |

### 3.5 SCR-005 Component

| Seq | Task ID | 제목 | Category | Requirement Ref | Screen | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 33 | CMP-SCR005-AUTH | Guest 인증(로그인/가입/재설정/성인확인/탈퇴) | AUTH | REQ-FUNC-027, 028, 045, 066; REQ-NF-018 | SCR-005 | DB-SCHEMA-BASE, DB-RLS-BASE | `src/components/account/AuthPanel.tsx`, `src/app/auth/callback/route.ts` (create) | 이메일 가입·인증·로그인·로그아웃·재설정, 성인 확인은 `is_adult`/`adult_verified_at`만 저장(생년월일 미저장), 탈퇴 시 즉시 비식별화 | Guest 3-Card(로그인/가입/재설정) Desktop 가로/Mobile 세로 | 미인증 이메일은 동행 쓰기 권한 없음, 삭제 감사 기록 | E2E-MATE-AUTH | P0 |
| 34 | CMP-SCR005-PROFILE | Member 프로필 | COMPONENT | REQ-FUNC-029 | SCR-005 | CMP-SCR005-AUTH, DB-ACCESS | `src/components/account/ProfileForm.tsx` (create) | 닉네임·연령대·여행 스타일 필수, 성별 선택 | — | — | E2E-MATE-AUTH | P1 |
| 35 | CMP-SCR005-MY-ACTIVITY | 내 활동(내 글/참가요청/차단 관리) | COMPONENT | REQ-FUNC-036, 038, 040 | SCR-005 | CMP-SCR005-AUTH, DB-ACCESS | `src/components/account/MyActivity.tsx` (create) | 내 글 수정/마감/삭제, 참가 요청 승인/거절, 차단 목록·해제 | 목록 없음 시 완성형 Empty State("아직 작성한 동행 글이 없습니다"+이용 방법+CTA) | 승인 요청자 있을 시 중요 일정 변경 전 경고 | UNIT-MATE-STATE, E2E-MATE-AUTH | P0 |
| 36 | CMP-SCR005-ADMIN | Admin(신고 처리/외부 URL 설정) | COMPONENT | REQ-FUNC-041, 042, 077 | SCR-005 | CMP-SCR005-AUTH, DB-ACCESS | `src/components/account/AdminPanel.tsx` (create) | 신고 큐 상태 필터/변경, 항공·호텔 외부 URL HTTPS 허용목록 설정 | Admin이 아니면 탭 자체 미렌더링 | HTTP/javascript/data URL 저장 차단 | TEST-RLS-BASIC, E2E-MATE-AUTH | P1 |
| 37 | CMP-SCR005-POLICY-PAGES | 정책 페이지(약관/개인정보/안전수칙/면책) | COMPONENT | REQ-FUNC-080 | SCR-005 | (없음) | `src/components/account/PolicyPages.tsx`, `src/data/policies.ts` (create) | 이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책 안내, 정책 버전 기록 | — | 동행 작성 시 동의 시각 저장(§3.3 CMP-SCR003-MATE-COMPOSE와 연동) | E2E-PUBLIC-SMOKE | P1 |

### 3.6 Data / DB Task

| Seq | Task ID | 제목 | Category | Requirement Ref | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 38 | DATA-DESTINATIONS | 국내·해외 여행지 정적 데이터 | DATA | REQ-FUNC-001, 002, 007, 008, 009, 010; REQ-NF-004, 026 | (없음) | `src/data/destinations.ts` (create) | 국내 10개 이상, 해외 15개국 30개 도시 이상, 각 항목에 소개·명소 5+·1일/3일 일정·예산·교통·음식 3+·에티켓·출처 필드 | — | 이미지 alt·출처 URL 필수 | DATA-VALIDATION-SCRIPT, E2E-PUBLIC-SMOKE | P0 |
| 39 | DATA-SAFETY | 국가별 안전정보 정적 데이터 | DATA | REQ-FUNC-046; REQ-NF-027 | (없음) | `src/data/safety.ts` (create) | 소개된 해외 국가 전원 안전정보 보유, 8개 카테고리 필드 강제 | — | 출처명·URL·최종 확인일·편집자 필수 | DATA-VALIDATION-SCRIPT, E2E-PUBLIC-SMOKE | P0 |
| 40 | DATA-REPRESENTATIVE | 대표 소개 정적 데이터 | DATA | (SCR-002 전 Component 데이터 출처) | (없음) | `src/data/representative.ts` (create) | 대표명·수치·소개문·철학·타임라인·방문국가·갤러리·추천 여행지 | — | 이미지 alt·출처 URL 필수 | DATA-VALIDATION-SCRIPT, E2E-PUBLIC-SMOKE | P0 |
| 41 | DATA-VALIDATION-SCRIPT | 정적 데이터 필수 필드 검증 스크립트 | DATA | REQ-FUNC-074 | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | `scripts/validate_content.py` (create) | 여행지/안전/대표 데이터의 필수 필드 누락을 CI/로컬에서 검출, 실패 시 게시 차단 | — | — | (스크립트 자체 실행 결과) | P1 |
| 42 | DB-SCHEMA-BASE | Supabase 스키마(6테이블 제한) | DB | (027~045, 077의 기반 인프라) | (없음) | `supabase/schema.sql` (create) | 테이블 6개만 선언: `member_profiles`, `mates`, `mate_applications`, `mate_blocks`, `mate_reports`, `outbound_url_settings` | — | 개인정보 최소 컬럼(정확한 생년월일 컬럼 없음) | TEST-RLS-BASIC | P0 |
| 43 | DB-RLS-BASE | Row Level Security 정책 | DB | REQ-FUNC-044; REQ-NF-013 | DB-SCHEMA-BASE | `supabase/rls_policies.sql` (create) | 본인 글/요청, 요청 대상 작성자, Moderator/Admin만 비공개 데이터 열람 | — | 권한별 부정 접근 테스트 전부 403/빈 결과 | TEST-RLS-BASIC | P0 |
| 44 | DB-ACCESS | 서버 액션/쿼리 접근 계층 | DB | REQ-NF-014, 015 | DB-SCHEMA-BASE, DB-RLS-BASE | `src/lib/db/*.ts` (create) | mates/applications/blocks/reports/profiles/outbound_url_settings CRUD 서버 액션 | — | CSRF/SameSite 쿠키, 입력 검증·이스케이프로 저장 XSS 차단 | TEST-RLS-BASIC, E2E-MATE-AUTH | P0 |
| 45 | DB-SEED-BASE | 데모/테스트 시드 데이터 | DB | (E2E 테스트 지원, 직접 REQ 없음) | DB-SCHEMA-BASE | `supabase/seed.sql` (create) | 동행 글·프로필 샘플 데이터로 E2E 흐름 재현 가능 | — | 시드 데이터에 실제 개인정보 미포함 | E2E-MATE-AUTH | P1 |

### 3.7 Global / CI Task

| Seq | Task ID | 제목 | Category | Requirement Ref | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 46 | GLOBAL-NAV-FOOTER | 전역 내비게이션/Footer | GLOBAL | REQ-FUNC-064 | (없음) | `src/app/layout.tsx` (modify) | 5개 Screen 공통 Header(워드마크/내비/계정)·Footer(3열/1열) | Mobile 햄버거 시트 | 포커스 순서 로고→내비→계정 | E2E-PUBLIC-SMOKE | P0 |
| 47 | GLOBAL-RESPONSIVE | 반응형 레이아웃 기반 | GLOBAL | REQ-FUNC-065; REQ-NF-003 | (없음) | `src/app/globals.css` (modify) | 320px~Desktop 가로 스크롤·겹침 없음; D-001 색상·폰트·간격·radius 토큰을 CSS 변수로 정의해 스타터 기본값 대체 | Card 1열(Mobile)/그리드(Desktop); body 배경·기본 글자색·기본 폰트가 D-001 토큰 사용 | — | MANUAL-CHECK-RESPONSIVE | P0 |
| 48 | GLOBAL-SEO-META | SEO 메타데이터 | GLOBAL | REQ-FUNC-070; REQ-NF-030 | (없음) | `src/app/**/layout.tsx` 또는 `metadata` export (modify) | title/description/canonical/OG/구조화 데이터 5개 Route 전부 | — | — | MANUAL-CHECK-PERF-SEO | P1 |
| 49 | GLOBAL-A11Y | 접근성 기본기 | GLOBAL | REQ-FUNC-079; REQ-NF-023 | (없음) | `src/components/**/*.tsx` (전역 적용, modify) | 폼·모달·탭·알림 시맨틱 HTML + ARIA 상태 | 포커스 링 `color.focus.ring` 2px | — | MANUAL-CHECK-A11Y | P1 |
| 50 | GLOBAL-ERROR-PAGES | 404/500/권한없음/외부연결실패 | GLOBAL | REQ-FUNC-078 | GLOBAL-NAV-FOOTER | `src/app/not-found.tsx`, `src/app/error.tsx` (create) | 각 화면에 홈·이전·재시도 중 1개 이상 복구 행동 | — | — | E2E-PUBLIC-SMOKE | P1 |
| 51 | GLOBAL-PERF | 성능 최적화(LCP/INP/CLS/이미지) | GLOBAL | REQ-NF-001, 002, 006 | (없음) | `next.config.ts`, 이미지 사용처 전반 (modify) | `next/image` 반응형+lazy, 서버 컴포넌트 우선 | 이미지 크기 고정으로 레이아웃 이동 최소화 | — | MANUAL-CHECK-PERF-SEO | P1 |
| 52 | GLOBAL-TOAST | Toast/상태 배지 알림 시스템 | GLOBAL | REQ-FUNC-043 | (없음) | `src/components/shared/Toast.tsx` (create) | 참가요청/승인/거절/신고 처리 결과를 인앱 Toast로 안내(이메일 미발송) | 3~5초 자동 소멸 + 수동 닫기 | — | MANUAL-CHECK-CLIENT-STATE | P1 |
| 53 | CI-PIPELINE | Lint/Typecheck/Unit 파이프라인 | CI | REQ-NF-031 | (없음) | `package.json` scripts, CI 설정 (modify) | `next lint`, `tsc --noEmit`, unit test가 main 병합 전 통과 | — | — | (CI 실행 로그 자체) | P1 |

### 3.8 Unit / Integration / E2E Test Task

| Seq | Task ID | 제목 | Category | Requirement Ref | Depends On | Expected Files | Functional AC | Priority |
|---|---|---|---|---|---|---|---|---|
| 54 | UNIT-TRAVEL-DATES | 날짜 검증 단위 테스트 | UNIT_TEST | REQ-FUNC-013, 021 | CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM | `src/lib/date-validation.test.ts` (create) | 과거 출발일/체크인, 역전 날짜, 경계값(당일/전날) 케이스 전부 검증 | P0 |
| 55 | UNIT-CONTACT-DETECTION | 연락처 패턴 탐지 단위 테스트 | UNIT_TEST | REQ-FUNC-032 | CMP-SCR003-MATE-COMPOSE | `src/lib/contact-detection.test.ts` (create) | 전화번호/이메일/메신저 ID 패턴 기준 테스트셋 탐지율 95%+, 오탐 5% 이하 | P0 |
| 56 | UNIT-MATE-STATE | 모집글/참가요청 상태 전이 단위 테스트 | UNIT_TEST | REQ-FUNC-035, 036, 037, 038 | CMP-SCR004-JOIN-REQUEST, CMP-SCR004-DETAIL, CMP-SCR005-MY-ACTIVITY | `src/lib/mate-state.test.ts` (create) | 중복 PENDING/ACCEPTED 차단, 승인/거절 전이, 종료일 경과 시 CLOSED 계산, 수동 마감 | P0 |
| 57 | TEST-RLS-BASIC | RLS 권한 통합 테스트 | INTEGRATION_TEST | REQ-FUNC-044; REQ-NF-013 | DB-RLS-BASE, DB-ACCESS | `tests/rls/basic.test.ts` (create) | 본인/타인/Moderator/Admin 각 역할의 비공개 데이터 접근 시도가 전부 403 또는 빈 결과로 처리됨을 검증 | P0 |
| 58 | E2E-PUBLIC-SMOKE | 공개 흐름 Smoke(홈→상세→안전정보, About, 동행 열람) | E2E_TEST | (SCR-001/002/004 공개 열람 다수 REQ의 통합 검증) | PAGE-SCR001, PAGE-SCR002, PAGE-SCR004, GLOBAL-ERROR-PAGES | `tests/e2e/public-smoke.spec.ts` (create) | Playwright **Chromium 프로젝트만**: 홈 진입→국내/해외 탭→여행지 상세 Drawer→안전정보 전환, About 페이지 렌더, 동행 목록 비로그인 열람, 404 라우트 확인 | P0 |
| 59 | E2E-TRAVEL-TOOLS | 통합 여행 준비 Smoke(항공/숙소/탭) | E2E_TEST | (SCR-003 항공·숙소 흐름 통합 검증) | PAGE-SCR003 | `tests/e2e/travel-tools.spec.ts` (create) | Playwright **Chromium 프로젝트만**: 탭 전환 상태 유지, 항공/숙소 입력→검증 오류→요약→외부 이동 버튼 속성(`target=_blank`, `rel=noopener noreferrer`) 확인 | P0 |
| 60 | E2E-MATE-AUTH | 인증·동행 전 흐름 Smoke(가입/로그인/작성/참가/승인/신고/차단) | E2E_TEST | (SCR-003 동행 탭/SCR-004/SCR-005 인증 흐름 통합 검증) | PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, DB-SEED-BASE | `tests/e2e/mate-auth.spec.ts` (create) | Playwright **Chromium 프로젝트만**: 회원가입→로그인→성인확인→동행글 작성→참가 요청→승인/거절→신고 접수까지 1회 전체 경로 | P0 |

### 3.9 Manual Check / Release Check Task

| Seq | Task ID | 제목 | Category | Requirement Ref | Depends On | Functional AC | Priority |
|---|---|---|---|---|---|---|---|
| 61 | MANUAL-CHECK-PERF-SEO | 성능·SEO 수동 확인 | MANUAL_CHECK | REQ-NF-001, 002, 003, 006, 030; REQ-FUNC-070 | GLOBAL-PERF, GLOBAL-SEO-META | 브라우저 개발자 도구로 LCP/INP/CLS 중급 모바일 4G 조건 확인, 5개 Route의 페이지 소스에서 메타 태그 확인 | P2 |
| 62 | MANUAL-CHECK-A11Y | 접근성 수동 확인 | MANUAL_CHECK | REQ-NF-023 | GLOBAL-A11Y | 키보드만으로 5개 핵심 흐름(탐색/필터/폼 제출/Drawer 열고 닫기/탭 전환) 조작 가능 여부 확인 | P2 |
| 63 | MANUAL-CHECK-RESPONSIVE | 반응형 수동 확인 | MANUAL_CHECK | REQ-FUNC-065; REQ-NF-003 | GLOBAL-RESPONSIVE | 320px~1440px 뷰포트 리사이즈로 가로 스크롤·겹침·SCR-001/003 Mobile 변형 레이아웃 확인 | P2 |
| 64 | MANUAL-CHECK-CLIENT-STATE | 클라이언트 상태 수동 확인(즐겨찾기/공유/Toast) | MANUAL_CHECK | REQ-FUNC-068, 069, 043 | CMP-SCR001-FAVORITES, CMP-SCR001-SHARE, GLOBAL-TOAST | `localStorage` 즐겨찾기 추가/해제 지속성, Web Share 실패 시 URL 복사 폴백, Toast 자동 소멸·수동 닫기 확인 | P2 |
| 65 | RELEASE-CHECK-VERCEL-SUPABASE | Vercel/Supabase 배포·환경변수·TLS 확인 | RELEASE_CHECK | REQ-NF-012, 016, 034 | PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005, CI-PIPELINE | Vercel 환경변수(외부 URL, Supabase 키) 설정 확인, TLS 1.2+ 기본 적용 확인, 배포 후 5개 Route 재확인, 월 인프라 비용 목표 대비 확인 | P2 |

---

## 4. Playwright 범위 확인 (규칙 13·14)

- Playwright Task는 `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` **3개**뿐이며, 각각 Chromium 프로젝트만 사용한다(크로스 브라우저 매트릭스·시각 회귀·전체 회귀 스위트 없음).
- 3개 Task가 커버하는 핵심 흐름은 총 6개(공개 열람/상세/안전정보, 항공·숙소 조건 입력, 동행 인증·작성·참가·승인·신고 전 과정 — SRS §7 "검증 요약"과 동일 범위)로 규칙 14의 "5~7개 흐름을 2~3개 Task로 묶는다"를 충족한다.
- 자동 Merge Runner, EC2, AWS Task는 어디에도 없다(`scripts/audit_tasks.py`의 forbidden-keyword 체크와 동일한 금지어를 적용해 본 문서 작성 시 재확인함).

---

## 5. NON_IMPLEMENTATION (EXCLUDED, 20건 — 추적표에서 삭제하지 않음)

| Requirement | 제목 요약 | EXCLUDED 근거 | 후속 방향 |
|---|---|---|---|
| REQ-FUNC-055 | 안전 콘텐츠 Editor/Admin 작성·검수·게시 관리자 화면 | 안전 콘텐츠는 코드 저장소의 정적 데이터 파일(`DATA-SAFETY`)로 작성·검수하며 별도 CMS를 구축하지 않음 | 콘텐츠 편집자 수가 늘어나 코드 리뷰 방식이 병목이 되면 후속 버전에서 경량 Admin 편집 화면 검토 |
| REQ-FUNC-056 | 안전정보 변경 이력(이전값/새값/사유/담당자/시각) DB 보존 | 범용 감사 로그에 해당해 제외, 변경 이력은 Git 커밋 이력으로 대체 | 규제·감사 요건이 생기면 별도 이력 테이블 추가 검토 |
| REQ-FUNC-071 | 행동 분석 이벤트 수집 파이프라인 | 별도 분석 파이프라인 없이 화면 상태·수동 확인으로 운영 지표 대체 | 사용자 증가 시 익명 이벤트 로깅 도입 검토 |
| REQ-FUNC-072 | 여행지 콘텐츠 CRUD Admin 화면 | 콘텐츠는 `DATA-DESTINATIONS` 정적 파일로 관리해 CRUD 화면 불필요 | 콘텐츠 규모가 커지면 Headless CMS 연동 검토 |
| REQ-FUNC-073 | 미디어 업로드 시 출처·라이선스 필수 입력 워크플로 | 이미지는 외부 URL을 직접 참조하므로 업로드·심사 절차 불필요 | 자체 이미지 호스팅 전환 시 업로드 워크플로 재검토 |
| REQ-FUNC-075 | 안전정보 stale 현황 대시보드 | 관리자 기능이 신고·외부 URL로 한정, 개별 페이지 stale 표시(`CMP-SCR001-SAFETY-PANEL`)로 충족 | 안전정보 국가 수가 늘어나면 별도 대시보드 검토 |
| REQ-FUNC-076 | 관리자 변경·신고 처리·권한 변경 범용 감사 로그 | 관리자 기능이 신고 상태·외부 URL 설정으로 한정되어 범용 감사 로그 체계 불필요 | 관리자 수·권한 단계가 늘어나면 감사 로그 도입 검토 |
| REQ-NF-007 | Lighthouse 성능 게이트(CI) | CI 인프라 확장이 필요해 제외, 배포 전 수동 확인(`MANUAL-CHECK-PERF-SEO`)으로 대체 | CI 예산 확보 시 Lighthouse CI 게이트 추가 검토 |
| REQ-NF-008 | 월간 서비스 가용성 모니터링(≥99.5%) | 별도 가용성 모니터링 체계 없이 Vercel/Supabase 기본 가용성에 의존 | 트래픽 증가 시 Uptime 모니터링 도입 검토 |
| REQ-NF-009 | 내부 API 5xx 비율 모니터링 | 5xx 비율 대시보드 미구축 | 오류율 이슈 발생 시 모니터링 도구 도입 검토 |
| REQ-NF-010 | DB 백업 RPO/RTO 정책 | 자동 백업·RPO/RTO 정책 제외, Supabase 기본 백업에 의존 | 데이터 중요도 상승 시 별도 백업 정책 수립 검토 |
| REQ-NF-011 | 외부 링크(항공/호텔/공식출처) 주간 자동 점검 | 자동 점검·알림 제외, 배포 전 수동 점검으로 대체 | 링크 깨짐 빈도가 높아지면 자동 점검 스크립트 도입 검토 |
| REQ-NF-020 | 신고 1차 검토 24시간 SLA 측정 | 24시간 SLA 측정·모니터링 체계 제외, 관리자 탭 수동 처리만 지원 | 신고 물량 증가 시 SLA 대시보드 도입 검토 |
| REQ-NF-021 | 글·요청·신고 속도 제한(rate limit) | 별도 rate limit 인프라 제외, 중복 요청 방지(`REQ-FUNC-035`)만으로 대체 | 어뷰징 발생 시 rate limiting 미들웨어 도입 검토 |
| REQ-NF-022 | Moderator 조치 추적 범용 감사 로그 | 범용 감사 로그 제외, 신고 상태 필드만 기록(`REQ-FUNC-042`) | 운영 인력 증가 시 감사 로그 도입 검토 |
| REQ-NF-024 | 자동 접근성 검사 도구(axe 등) | 자동 검사 도구 도입 제외, `E2E-*`의 핵심 흐름 통과로만 검증 | 접근성 요건 강화 시 axe-core CI 통합 검토 |
| REQ-NF-025 | 정식 스크린리더 전수 QA | 전수 QA 프로세스 제외, 핵심 화면만 `MANUAL-CHECK-A11Y`로 표본 확인 | 접근성 인증이 필요해지면 전문 QA 프로세스 도입 검토 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 관리 워크플로 | 출처 URL과 alt 텍스트만 관리하고 라이선스 메타데이터 워크플로 제외 | 저작권 리스크 상승 시 라이선스 필드 추가 검토 |
| REQ-NF-032 | 구조화 로그(request_id/actor/action/result) | 모니터링 인프라 확장이 필요해 제외 | 운영 규모 확대 시 구조화 로깅 도입 검토 |
| REQ-NF-033 | 5xx/외부 링크 실패 자동 알림(5분 이내) | 장애 알림 인프라에 해당해 제외 | 장애 대응 체계 구축 시 알림 연동 검토 |

---

## 6. Requirement Coverage Index (114건 전수 확인)

범례: **T**=Task ID(구현), **V**=Verify(검증). `EXCLUDED`는 §5 참조, Task/Verify 없음.

### 6.1 REQ-FUNC-001~080

| REQ | Status | Task(T) | Verify(V) |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID | E2E-PUBLIC-SMOKE |
| REQ-FUNC-002 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID | E2E-PUBLIC-SMOKE |
| REQ-FUNC-003 | IMPLEMENT | CMP-SCR001-SEARCH-HERO | E2E-PUBLIC-SMOKE |
| REQ-FUNC-004 | IMPLEMENT | CMP-SCR001-DESTINATION-DRAWER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-005 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID | E2E-PUBLIC-SMOKE |
| REQ-FUNC-006 | IMPLEMENT | CMP-SCR001-DESTINATION-DRAWER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-007 | IMPLEMENT | DATA-DESTINATIONS | DATA-VALIDATION-SCRIPT |
| REQ-FUNC-008 | IMPLEMENT | DATA-DESTINATIONS | DATA-VALIDATION-SCRIPT |
| REQ-FUNC-009 | IMPLEMENT | CMP-SCR001-DESTINATION-DRAWER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-010 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID | E2E-PUBLIC-SMOKE |
| REQ-FUNC-011 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS |
| REQ-FUNC-012 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-013 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM | UNIT-TRAVEL-DATES |
| REQ-FUNC-014 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-015 | IMPLEMENT | CMP-SCR003-TIPS | E2E-TRAVEL-TOOLS |
| REQ-FUNC-016 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-017 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-018 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-019 | IMPLEMENT | CMP-SCR003-HOTEL-FORM | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS |
| REQ-FUNC-020 | IMPLEMENT | CMP-SCR003-HOTEL-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-021 | IMPLEMENT | CMP-SCR003-HOTEL-FORM | UNIT-TRAVEL-DATES |
| REQ-FUNC-022 | IMPLEMENT | CMP-SCR003-HOTEL-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-023 | IMPLEMENT | CMP-SCR003-TIPS | E2E-TRAVEL-TOOLS |
| REQ-FUNC-024 | IMPLEMENT | CMP-SCR003-HOTEL-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-025 | IMPLEMENT | CMP-SCR003-HOTEL-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-026 | IMPLEMENT | CMP-SCR003-HOTEL-FORM | E2E-TRAVEL-TOOLS |
| REQ-FUNC-027 | IMPLEMENT | CMP-SCR005-AUTH | E2E-MATE-AUTH |
| REQ-FUNC-028 | IMPLEMENT | CMP-SCR005-AUTH | E2E-MATE-AUTH |
| REQ-FUNC-029 | IMPLEMENT | CMP-SCR005-PROFILE | E2E-MATE-AUTH |
| REQ-FUNC-030 | IMPLEMENT | CMP-SCR004-FILTER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-031 | IMPLEMENT | CMP-SCR003-MATE-COMPOSE | E2E-MATE-AUTH |
| REQ-FUNC-032 | IMPLEMENT | CMP-SCR003-MATE-COMPOSE | UNIT-CONTACT-DETECTION |
| REQ-FUNC-033 | IMPLEMENT | CMP-SCR004-DETAIL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-034 | IMPLEMENT | CMP-SCR004-JOIN-REQUEST | E2E-MATE-AUTH |
| REQ-FUNC-035 | IMPLEMENT | CMP-SCR004-JOIN-REQUEST | UNIT-MATE-STATE |
| REQ-FUNC-036 | IMPLEMENT | CMP-SCR005-MY-ACTIVITY | UNIT-MATE-STATE, E2E-MATE-AUTH |
| REQ-FUNC-037 | IMPLEMENT | CMP-SCR004-LIST | UNIT-MATE-STATE |
| REQ-FUNC-038 | IMPLEMENT | CMP-SCR005-MY-ACTIVITY | UNIT-MATE-STATE |
| REQ-FUNC-039 | IMPLEMENT | CMP-SCR004-REPORT | E2E-MATE-AUTH |
| REQ-FUNC-040 | IMPLEMENT | CMP-SCR004-BLOCK (실행) / CMP-SCR005-MY-ACTIVITY (관리) | E2E-MATE-AUTH |
| REQ-FUNC-041 | IMPLEMENT | CMP-SCR005-ADMIN | E2E-MATE-AUTH |
| REQ-FUNC-042 | IMPLEMENT | CMP-SCR005-ADMIN | E2E-MATE-AUTH |
| REQ-FUNC-043 | IMPLEMENT | GLOBAL-TOAST | MANUAL-CHECK-CLIENT-STATE |
| REQ-FUNC-044 | IMPLEMENT | DB-RLS-BASE | TEST-RLS-BASIC |
| REQ-FUNC-045 | IMPLEMENT | CMP-SCR005-AUTH | E2E-MATE-AUTH |
| REQ-FUNC-046 | IMPLEMENT | DATA-SAFETY | DATA-VALIDATION-SCRIPT |
| REQ-FUNC-047 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-048 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-049 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-050 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-051 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-052 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-053 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-054 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-055 | EXCLUDED | — | — |
| REQ-FUNC-056 | EXCLUDED | — | — |
| REQ-FUNC-057 | IMPLEMENT | CMP-SCR002-STATS | E2E-PUBLIC-SMOKE |
| REQ-FUNC-058 | IMPLEMENT | CMP-SCR002-PHILOSOPHY | E2E-PUBLIC-SMOKE |
| REQ-FUNC-059 | IMPLEMENT | CMP-SCR002-COUNTRY-CHIPS | E2E-PUBLIC-SMOKE |
| REQ-FUNC-060 | IMPLEMENT | CMP-SCR002-TIMELINE | E2E-PUBLIC-SMOKE |
| REQ-FUNC-061 | IMPLEMENT | CMP-SCR002-GALLERY | E2E-PUBLIC-SMOKE |
| REQ-FUNC-062 | IMPLEMENT | CMP-SCR002-MEMORABLE-CTA | E2E-PUBLIC-SMOKE |
| REQ-FUNC-063 | IMPLEMENT | CMP-SCR002-MEMORABLE-CTA | E2E-PUBLIC-SMOKE |
| REQ-FUNC-064 | IMPLEMENT | GLOBAL-NAV-FOOTER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-065 | IMPLEMENT | GLOBAL-RESPONSIVE | MANUAL-CHECK-RESPONSIVE |
| REQ-FUNC-066 | IMPLEMENT | CMP-SCR005-AUTH | E2E-MATE-AUTH |
| REQ-FUNC-067 | IMPLEMENT | CMP-SCR001-SEARCH-HERO | E2E-PUBLIC-SMOKE |
| REQ-FUNC-068 | IMPLEMENT | CMP-SCR001-FAVORITES | MANUAL-CHECK-CLIENT-STATE |
| REQ-FUNC-069 | IMPLEMENT | CMP-SCR001-SHARE | MANUAL-CHECK-CLIENT-STATE |
| REQ-FUNC-070 | IMPLEMENT | GLOBAL-SEO-META | MANUAL-CHECK-PERF-SEO |
| REQ-FUNC-071 | EXCLUDED | — | — |
| REQ-FUNC-072 | EXCLUDED | — | — |
| REQ-FUNC-073 | EXCLUDED | — | — |
| REQ-FUNC-074 | IMPLEMENT | DATA-VALIDATION-SCRIPT | (스크립트 자체) |
| REQ-FUNC-075 | EXCLUDED | — | — |
| REQ-FUNC-076 | EXCLUDED | — | — |
| REQ-FUNC-077 | IMPLEMENT | CMP-SCR005-ADMIN | E2E-MATE-AUTH |
| REQ-FUNC-078 | IMPLEMENT | GLOBAL-ERROR-PAGES | E2E-PUBLIC-SMOKE |
| REQ-FUNC-079 | IMPLEMENT | GLOBAL-A11Y | MANUAL-CHECK-A11Y |
| REQ-FUNC-080 | IMPLEMENT | CMP-SCR005-POLICY-PAGES (정책 본문) / CMP-SCR003-MATE-COMPOSE (동의 기록) | E2E-MATE-AUTH |

### 6.2 REQ-NF-001~034

| REQ | Status | Task(T) | Verify(V) |
|---|---|---|---|
| REQ-NF-001 | IMPLEMENT | GLOBAL-PERF | MANUAL-CHECK-PERF-SEO |
| REQ-NF-002 | IMPLEMENT | GLOBAL-PERF | MANUAL-CHECK-PERF-SEO |
| REQ-NF-003 | IMPLEMENT | GLOBAL-PERF, GLOBAL-RESPONSIVE | MANUAL-CHECK-PERF-SEO, MANUAL-CHECK-RESPONSIVE |
| REQ-NF-004 | IMPLEMENT | CMP-SCR001-DESTINATION-GRID, CMP-SCR004-FILTER | E2E-PUBLIC-SMOKE |
| REQ-NF-005 | IMPLEMENT | CMP-SCR003-MATE-COMPOSE, CMP-SCR004-JOIN-REQUEST, CMP-SCR004-REPORT | E2E-MATE-AUTH |
| REQ-NF-006 | IMPLEMENT | GLOBAL-PERF | MANUAL-CHECK-PERF-SEO |
| REQ-NF-007 | EXCLUDED | — | — |
| REQ-NF-008 | EXCLUDED | — | — |
| REQ-NF-009 | EXCLUDED | — | — |
| REQ-NF-010 | EXCLUDED | — | — |
| REQ-NF-011 | EXCLUDED | — | — |
| REQ-NF-012 | IMPLEMENT | RELEASE-CHECK-VERCEL-SUPABASE | (배포 후 수동 확인) |
| REQ-NF-013 | IMPLEMENT | DB-RLS-BASE | TEST-RLS-BASIC |
| REQ-NF-014 | IMPLEMENT | DB-ACCESS | TEST-RLS-BASIC |
| REQ-NF-015 | IMPLEMENT | DB-ACCESS | TEST-RLS-BASIC |
| REQ-NF-016 | IMPLEMENT | RELEASE-CHECK-VERCEL-SUPABASE | (배포 후 수동 확인) |
| REQ-NF-017 | IMPLEMENT | CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM | E2E-TRAVEL-TOOLS |
| REQ-NF-018 | IMPLEMENT | CMP-SCR005-AUTH | E2E-MATE-AUTH |
| REQ-NF-019 | IMPLEMENT | CMP-SCR004-REPORT | E2E-MATE-AUTH |
| REQ-NF-020 | EXCLUDED | — | — |
| REQ-NF-021 | EXCLUDED | — | — |
| REQ-NF-022 | EXCLUDED | — | — |
| REQ-NF-023 | IMPLEMENT | GLOBAL-A11Y | MANUAL-CHECK-A11Y |
| REQ-NF-024 | EXCLUDED | — | — |
| REQ-NF-025 | EXCLUDED | — | — |
| REQ-NF-026 | IMPLEMENT | DATA-DESTINATIONS | DATA-VALIDATION-SCRIPT |
| REQ-NF-027 | IMPLEMENT | DATA-SAFETY | DATA-VALIDATION-SCRIPT |
| REQ-NF-028 | IMPLEMENT | CMP-SCR001-SAFETY-PANEL | E2E-PUBLIC-SMOKE |
| REQ-NF-029 | EXCLUDED | — | — |
| REQ-NF-030 | IMPLEMENT | GLOBAL-SEO-META | MANUAL-CHECK-PERF-SEO |
| REQ-NF-031 | IMPLEMENT | CI-PIPELINE | (CI 실행 로그 자체) |
| REQ-NF-032 | EXCLUDED | — | — |
| REQ-NF-033 | EXCLUDED | — | — |
| REQ-NF-034 | IMPLEMENT | RELEASE-CHECK-VERCEL-SUPABASE | (배포 후 수동 확인) |

**확인 결과: REQ-FUNC-001~080(80건), REQ-NF-001~034(34건), 합계 114건 전부 위 표에 존재하며 누락된 Requirement ID는 없다.** IMPLEMENT 94건은 모두 Task(T)와 Verify(V)가 채워져 있고, EXCLUDED 20건은 Task/Verify 없이 §5 NON_IMPLEMENTATION 표에 근거·후속 방향이 기록되어 있다.
