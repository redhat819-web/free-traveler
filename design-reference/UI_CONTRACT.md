# Free Traveler — UI Contract (SCR-001~005 → Next.js App Router)

- **Document ID:** UI-CONTRACT-TRAVEL-001
- **기반 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
- **현재 `src/app` 구조:** `layout.tsx`, `page.tsx`(starter, 교체 대상), `globals.css`, `favicon.ico`만 존재. `about/`, `travel-tools/`, `mates/`, `account/` 라우트는 아직 생성되지 않음.
- **핵심/보조 구분:** 핵심 4개 — SCR-001(`/`), SCR-003(`/travel-tools`), SCR-004(`/mates`), SCR-005(`/account`) / 보조 1개 — SCR-002(`/about`)

이 문서는 승인된 5개 Stitch Screen(SCR-001~005, `STITCH_VALIDATION_REPORT.md` 기준 승인 상태)을 Next.js App Router 구현 계약으로 고정한다. 시각 규칙은 `design-reference/D-001/DESIGN.md`를 그대로 따르며, 이 문서는 그 규칙이 **어느 라우트·컴포넌트·상태**로 매핑되는지만 정의한다.

---

## SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-001 |
| **Route** | `/` |
| **Page Entry** | `src/app/page.tsx` |
| **영역 순서** | 1) 여행지 검색 Hero → 2) 국내 인기 여행지 Card Grid(6개) → 3) 해외 인기 여행지 Card Grid(6개) → 4) 여행 동기·테마 Chip 목록(6개) → 5) 국가별 주의사항 Card(6개국) → 6) 최근 동행 이야기 Card(3개) 또는 완성형 Empty State → 7) free_traveler 요약 CTA Banner |
| **주요 Component** | `SearchHero`, `DestinationCardGrid`(국내/해외 공용), `ThemeChipList`, `SafetyNoticeCardGrid`, `SafetyDrawer`, `DestinationDrawer`, `RecentMatePreview`(Empty State 포함), `AboutSummaryBanner` |
| **상태** | Loading(Card Grid 스켈레톤 6개), Success, Empty(Section 6 전용), Error(Section 단위 인라인 + 다시 시도), Drawer 열림/닫힘, 안전정보 stale/최신 배지 |
| **사용자 행동** | 키워드 검색 입력, 테마 Chip 선택(필터링), 여행지 Card 클릭 → Drawer 오픈, Drawer 내 "국가 안전정보 보기" 클릭 → 같은 Drawer 내부에서 안전정보 뷰로 전환, 즐겨찾기 토글, 공유 버튼 |
| **다른 화면으로의 이동** | Drawer "여행 조건부터 정리하기" CTA → SCR-003, Section 6 "동행 글 작성하기"/"전체 동행 보기" → SCR-003(동행 탭) 또는 SCR-004, Section 7 "대표 소개 보러가기" → SCR-002, 비로그인 상태에서 즐겨찾기·계정 진입 시도 → SCR-005 |
| **Desktop·Mobile 규칙** | Desktop: Hero 높이 뷰포트 60~70%, Card Grid 3×2, Drawer 우측 40% 슬라이드. Mobile(390px): Card Grid 1열, Drawer 하단 풀시트. 공통: Section 상하 padding Desktop 64~96px / Mobile 40~64px, 콘텐츠 최대 폭 1200~1280px |
| **금지 기능** | 예약·결제 UI, 실시간 항공권/호텔 가격, 광고, 별점, Airbnb 상표 요소, `starter_template_forbidden`(Next.js 기본 스타터 콘텐츠 잔존 금지) |

---

## SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-002 |
| **Route** | `/about` |
| **Page Entry** | `src/app/about/page.tsx` |
| **영역 순서** | 1) Hero(대표 이미지 1장 + 한 문장) → 2) 여행 지표(수치 카드 2개) → 3) 소개·철학(좌우 분할) → 4) 여행 타임라인(6개 이상) → 5) 방문 국가 Chip(30개국, 권역별) → 6) 여행 사진 Gallery(8장 이상) → 7) 기억에 남는 여행지 Card(4개) + CTA Banner |
| **주요 Component** | `AboutHero`, `TravelStatCard`, `PhilosophySplit`, `TravelTimeline`, `VisitedCountryChipGroup`, `PhotoGallery`, `MemorableDestinationCardGrid`, `CtaBanner` |
| **상태** | Loading(Hero·Gallery 스켈레톤), Success(정적 콘텐츠, 단일 상태 위주), Error(이미지 로드 실패 시 alt 유지 대체 플레이스홀더) — Empty 상태 없음(정적 콘텐츠 상시 존재) |
| **사용자 행동** | 여행 타임라인/Gallery 스크롤 열람, 방문 국가 Chip 열람(비필터형, 정보 제공용), CTA 클릭 |
| **다른 화면으로의 이동** | Section 7 CTA → SCR-003(`/travel-tools`), SCR-004(`/mates`), 기억에 남는 여행지 Card 클릭 → SCR-001의 해당 여행지 상세 Drawer 오픈 |
| **Desktop·Mobile 규칙** | Desktop: 소개·철학 좌우 분할, Gallery 4×2 그리드. Mobile: 좌우 분할 → 세로 스택, Gallery 1~2열. 공통 Section padding/최대 폭은 SCR-001과 동일 토큰 |
| **금지 기능** | 예약·결제 UI, 광고, 별점, 실시간 가격, Airbnb 상표 요소 |

---

## SCR-003 `/travel-tools` 통합 여행 준비

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-003 |
| **Route** | `/travel-tools` |
| **Page Entry** | `src/app/travel-tools/page.tsx` |
| **영역 순서** | 1) Intro Hero(축소형, 이용 순서 3단계) → 2) 탭 전환(항공편/숙소/동행 구하기 — 화면 내부 컴포넌트) → 3) 조건 입력 Form(항공/숙소 탭 공통 구조) → 4) 입력 요약 + 외부 이동 Action Card(좌우 분할) → 5) 비전달 고지 + Tip 3개 → 6) 동행 탭 전용: 로그인 안내 또는 작성 Form |
| **주요 Component** | `TravelToolsIntro`, `TravelToolTabs`(내부 탭, 외부 링크 대체 금지), `ConditionForm`(국가→지역 종속, 날짜 검증), `SummaryActionCard`, `NonTransferNotice`, `SearchTipList`, `MateComposeForm`(공개연락처 탐지, 안전수칙 동의), `LoginRequiredNotice` |
| **상태** | 탭별 미입력/검증 오류/요약 확인(탭 전환 시 상태 유지), 외부 URL 이동 오류(재시도), 동행 탭: 비로그인·성인 미확인 시 안내 / 로그인·성인 확인 완료 시 작성 Form, 제출 완료 배지 |
| **사용자 행동** | 탭 전환, 국가/지역/날짜 입력, "항공편/숙소 보러 가기" 클릭(새 탭, `noopener,noreferrer`), 동행 모집글 작성 제출, 안전수칙 동의 체크 |
| **다른 화면으로의 이동** | 외부 항공/호텔 사이트(새 탭 이동), 동행 탭 비로그인 시 "로그인/성인 확인" CTA → SCR-005, 동행 작성 완료 후 → SCR-004(작성한 모집글 상세) |
| **Desktop·Mobile 규칙** | Desktop: Section 4 좌우 분할(입력 요약/Action Card). Mobile: 좌우 분할 → 세로 스택, 탭은 가로 스크롤 가능한 pill 탭으로 축소. 정적 Form은 스켈레톤 없이 즉시 렌더 |
| **금지 기능** | 항공/숙소 실시간 가격 표시·예약·결제 UI(외부 이동만 허용), 광고, 별점, 항공편/숙소 탭을 단순 외부 링크 버튼으로 대체하는 구현(D-001 §10 위반), Airbnb 상표 요소 |

---

## SCR-004 `/mates` 동행 조회

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-004 |
| **Route** | `/mates` |
| **Page Entry** | `src/app/mates/page.tsx` |
| **영역 순서** | 1) Intro Hero(축소형) → 2) 검색 Filter + 결과 요약 → 3) 동행글 목록 Card Grid(최대 8개 우선 노출) → 4) 목록+상세 좌우 분할(Desktop) / Drawer(Mobile) → 5) 동행 신청 방법 안내(3단계) → 6) 안전 안내 + CTA Banner |
| **주요 Component** | `MatesIntro`, `MateFilterBar`, `MatePostCardGrid`, `MateListDetailSplit`(Desktop), `MateDetailDrawer`(Mobile), `JoinRequestForm`, `ReportBlockButtons`, `HowToJoinSteps`, `SafetyCtaBanner` |
| **상태** | Loading(목록 Card 스켈레톤 최대 8개), Success(목록·상세 정상, 참가 요청 제출 완료 배지), Empty(검색 결과 0건 — 완성형 3요소 안내), Error(목록 로드 실패, 참가 요청 중복 등 인라인 오류), Unauthorized(참가 요청·신고·차단 시도 시 로그인 필요 안내; 열람은 비로그인도 가능) |
| **사용자 행동** | 국가·지역·기간·모집상태 필터링, 목록에서 Card 선택(목록+상세 동시 표시 또는 Drawer 오픈), 참가 요청 제출, 신고·차단 버튼 클릭 |
| **다른 화면으로의 이동** | "새 동행 글 작성하기" → SCR-003(동행 탭), 비로그인 상태에서 참가 요청/신고/차단 시도 → SCR-005, 요청·차단 관리 상세 → SCR-005(내 활동 탭) |
| **Desktop·Mobile 규칙** | Desktop: 좌측 목록 40% / 우측 상세 60% 좌우 분할. Mobile: 목록 1열, Card 선택 시 하단 풀시트 Drawer로 상세 전환. 목록과 상세 중 하나만 존재하는 레이아웃 금지(D-001 §11) |
| **금지 기능** | 예약·결제 UI, 실시간 가격, 광고, 별점, 상세 패널 내 연락처 직접 노출(공개연락처는 참가 요청 승인 후 별도 채널로만), Airbnb 상표 요소 |

---

## SCR-005 `/account` 계정·관리

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-005 |
| **Route** | `/account` |
| **Page Entry** | `src/app/account/page.tsx` |
| **영역 순서** | Guest/Member/Admin 배타적 탭(역할에 없는 탭은 렌더링하지 않음). **Guest**: 계정 기능 Intro → 로그인·가입·비밀번호 재설정 Card(3개) → 로그인 후 가능 기능 목록 → 보안 안내. **Member**: 프로필·성인 확인 요약 → 내 글 목록 → 참가 요청 관리 → 차단 목록 → 새 동행글 작성 CTA. **Admin**: 관리 Intro → 신고 상태 변경(큐+상태 변경) → 항공·숙소 외부 URL 설정 |
| **주요 Component** | `AccountTabs`(Guest/Member/Admin), `GuestIntro`, `AuthCardGroup`(로그인/가입/재설정), `SecurityNotice`, `ProfileSummaryCard`, `MyPostList`, `JoinRequestManager`, `BlockList`, `AdminIntro`, `ReportQueueTable`, `ExternalUrlAllowlistForm` |
| **상태** | Loading(탭별 목록 스켈레톤), Success(탭별 데이터 정상), Empty(내 글/참가 요청/신고 큐 없음 — 완성형 3요소 안내), Error(로그인 실패, 성인 확인 실패, 신고 상태 변경 실패 인라인 오류), Unauthorized(비로그인 시 Member/Admin 탭 접근 → Guest로 리다이렉트, 비관리자는 Admin 탭 자체 미렌더링) |
| **사용자 행동** | 로그인/가입/비밀번호 재설정 제출, 성인 확인 절차 진행, 프로필 편집, 내 글 수정/마감/삭제, 참가 요청 승인/거절, 차단 해제, 관리자: 신고 상태 변경, 외부 URL 허용목록 등록 |
| **다른 화면으로의 이동** | 내 글/참가 요청 항목 클릭 → SCR-004(해당 모집글 상세), 즐겨찾기 항목 클릭 → SCR-001(해당 여행지 상세 Drawer), "새 동행글 작성" CTA → SCR-003(동행 탭) |
| **Desktop·Mobile 규칙** | Desktop·Mobile 공통: 상단 탭(로그인/가입/재설정)에서 선택한 카드 1개만 표시(탭 선택형, 2026-09-19 결정으로 Desktop 3-Card 동시 노출에서 변경). 탭은 Desktop 가로 나열, Mobile 상단 가로 스크롤 pill. 공통: Section padding/최대 폭 토큰 동일 적용 |
| **금지 기능** | 예약·결제 UI, 광고, 별점, 실시간 가격, 단순 로그인 화면만으로 SCR-005를 완성하는 구현(Member/Admin 탭 구조 누락 금지, D-001 §19 위반), Airbnb 상표 요소 |

---

## 공통 규칙 (전 화면)

- Header/Footer는 `src/app/layout.tsx`의 전역 레이아웃에서 1회만 정의하고 5개 Page Entry 모두 이를 공유한다(개별 페이지에서 재구현 금지).
- 모든 Page Entry는 `page_owner_task_required=true`, `preview_required=true`(브라우저 실행 확인 없이 완료 보고 금지)를 만족해야 한다.
- SCR-001은 `starter_template_forbidden=true` — 현재 `src/app/page.tsx`의 Next.js 기본 스타터 콘텐츠를 전량 교체해야 하며 잔존 시 완료로 인정하지 않는다.
- API Route(`src/app/api/**`), 인증 콜백(`src/app/auth/callback` 등), `not-found`/오류 처리 라우트는 기술 Route로 취급하며 5개 Screen 수에 포함하지 않는다.
- 모든 화면의 색상·타이포·간격·라운드·그림자 값은 `design-reference/D-001/DESIGN.md` 토큰만 사용한다.
