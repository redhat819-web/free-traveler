# Free Traveler — UI/UX Plan (04)

- **Document ID:** UIUX-TRAVEL-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/vendor/airbnb/DESIGN-airbnb.md`
- **작성 기준일:** 2026-09-10
- **범위:** SCR-001~SCR-005 5개 화면의 Section 구성, 상태, 반응형 기준, 디자인 토큰

Airbnb 참고본은 레이아웃 밀도·타이포 위계·둥근 모서리·그림자 절제 등 **구성 방식**만 참고하며, Rausch 컬러(`#ff385c`), Cereal 서체, Airbnb 로고·상표·문구는 사용하지 않는다. Free Traveler는 코랄 포인트 컬러를 독자적으로 정의하고, 브랜드명·문구는 전부 자체 콘텐츠를 사용한다.

---

## 1. 디자인 토큰

### 1.1 컬러

| 토큰 | 값 | 용도 |
|---|---|---|
| `color.bg.canvas` | `#FFFFFF` | 전역 배경 |
| `color.bg.soft` | `#F7F7F5` | 카드 구획, Section 배경 교차 |
| `color.bg.strong` | `#F0F0EE` | 비활성 필드, 뱃지 배경 |
| `color.text.primary` | `#222222` | 제목·본문 짙은 회색(근흑색) |
| `color.text.secondary` | `#5B5B5B` | 보조 설명 |
| `color.text.muted` | `#8A8A8A` | 캡션, 메타 정보 |
| `color.border.hairline` | `#E3E3E0` | 카드·구분선 |
| `color.border.strong` | `#C7C7C3` | 포커스 아닌 강조 테두리 |
| `color.accent.coral` | `#FF6B57` | 브랜드 포인트, 주요 CTA |
| `color.accent.coral-active` | `#E5523F` | 포인트 버튼 pressed |
| `color.accent.coral-soft` | `#FFE4DE` | 포인트 배경 tint, 비활성 CTA |
| `color.semantic.danger` | `#C1272D` | 오류, 신고·차단, 공개연락처 차단 안내 |
| `color.semantic.warning` | `#B8590A` | 여행경보 상단 경고, stale 배지 |
| `color.semantic.success` | `#1E7A46` | 제출 완료, 승인 상태 |
| `color.semantic.info` | `#2457C5` | 안내 링크, 정보성 배지 |
| `color.focus.ring` | `#1F5FD9` | 키보드 포커스 링(2px, outline-offset 2px) |

코랄은 CTA·브랜드 강조 전용이며, 오류·경고·안전정보는 위 semantic 컬러로만 표현해 코랄과 시각적으로 구분한다(공통 디자인 규칙 준수).

### 1.2 타이포그래피

| 토큰 | 폰트 | 크기/행간 | 굵기 | 용도 |
|---|---|---|---|---|
| `type.display.lg` | Inter, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif | 32px/1.25 (Mobile 26px/1.3) | 700 | Hero 제목 |
| `type.display.md` | 상동 | 24px/1.3 (Mobile 20px/1.35) | 700 | Section 제목 |
| `type.title` | 상동 | 18px/1.4 | 600 | 카드 제목, 탭 라벨 |
| `type.body` | 상동 | 16px/1.6 | 400 | 본문 |
| `type.body-sm` | 상동 | 14px/1.5 | 400 | 메타, 캡션 |
| `type.button` | 상동 | 16px/1.25 | 600 | 버튼 라벨 |
| `type.micro` | 상동 | 12px/1.3 | 600 | 뱃지, 태그 |

한글 본문은 `Inter`를 1순위로 지정하되 한글 글리프가 없으므로 시스템 한글 폰트(`Apple SD Gothic Neo`, `Malgun Gothic`, `sans-serif`)로 자연 폴백되도록 `font-family` 스택을 그대로 유지한다.

### 1.3 형태·그림자·간격

| 항목 | 값 |
|---|---|
| `radius.sm` | 8px (버튼, 입력) |
| `radius.md` | 14px (카드) |
| `radius.pill` | 9999px (Chip, 탭 필터) |
| `shadow.card` | `0 1px 2px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.06)` (Hover/Drawer에만 사용, 평면 카드는 무그림자 + hairline 테두리) |
| `space.section.desktop` | 64~96px (상하 padding) |
| `space.section.mobile` | 40~64px (상하 padding) |
| `container.max` | 1200~1280px (Desktop 콘텐츠 폭), 1440px 기준 화면에서 좌우 여백 자동 확보 |
| `breakpoint.desktop` | 1440px 기준 설계 |
| `breakpoint.mobile` | 390px 기준 설계 |
| `touch.min` | 44×44px 이상 (버튼, 아이콘 버튼, Chip) |
| `focus.style` | 2px solid `color.focus.ring`, outline-offset 2px, 색상 단독 구분 금지(라벨 병기) |

---

## 2. 전역 레이아웃: Header / Footer

SCR-001~SCR-005 5개 화면에 동일한 Header/Footer를 사용한다(REQ-FUNC-064).

### 2.1 Header

- 좌측: Free Traveler 워드마크(텍스트 로고, 이미지·상표 요소 없이 `type.title` + 코랄 포인트 점 1개)
- 중앙(Desktop만): 주요 내비게이션 — 여행지(`/` 내 여행지 섹션 앵커), 여행 준비(`/travel-tools`), 동행 찾기(`/mates`), 대표 소개(`/about`)
- 우측: 로그인/계정(`/account`) 진입 버튼. 로그인 상태면 닉네임 또는 아바타 이니셜 표시
- Mobile(390px): 워드마크 + 햄버거 메뉴. 햄버거는 전체 높이 시트로 열리며 4개 내비게이션 + 계정 링크를 세로 목록으로 제공
- 포커스 이동은 로고 → 내비게이션 → 계정 버튼 순서로 키보드 tab 순서를 보장

### 2.2 Footer

- 3열(Desktop) / 1열(Mobile) 구조
  - 1열: Free Traveler 소개 한 줄 + `/about` 링크
  - 2열: 서비스 링크(여행지, 여행 준비, 동행 찾기, 국가별 주의사항 — `/` 내 안전정보 섹션 앵커)
  - 3열: 정책 링크(이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내 — REQ-FUNC-080)
- 하단 legal band: 저작권 문구 + "안전정보는 참고용이며 공식 출처를 직접 확인하세요" 고지(REQ-FUNC-054 연계 고지 반복 노출)

---

## 3. 화면별 상세

### 3.1 SCR-001 `/` 메인 (Section 7개)

**목표:** 여행지를 탐색하고, 상세·안전정보를 같은 화면에서 확인하며, 다른 화면으로 자연스럽게 이동한다.

레이아웃 원칙: Hero는 화면 전체 높이를 차지하지 않으며, 1440px 데스크톱 기준 Hero 하단에서 Section 2(국내 인기 여행지)의 제목과 카드 상단 일부가 보이도록 Hero 높이를 뷰포트의 60~70% 수준으로 제한한다.

| # | Section | 유형 | 내용 |
|---|---|---|---|
| 1 | 여행지 검색 Hero | Hero | 제목 "어디로 떠날지 아직 정하지 못하셨나요?" + 설명 2문장 + 키워드 검색 입력(REQ-FUNC-003, 067) + `/travel-tools` 이동 보조 CTA "여행 조건부터 정리하기" |
| 2 | 국내 인기 여행지 | Card Grid | 서울·부산·제주 등 6개 Card(Desktop 3×2, Mobile 1열). 각 Card는 대표 이미지(실제 장소 alt), 테마 태그, 한 줄 소개. 클릭 시 Drawer 오픈 |
| 3 | 해외 인기 여행지 | Card Grid | 도쿄·방콕·파리 등 6개 Card. 구성은 Section 2와 동일하되 국가명 표기 |
| 4 | 여행 동기·테마 | Chip 목록 | "휴양", "도심 탐방", "미식", "액티비티", "가족 여행", "혼자 떠나는 여행" 등 6개 Chip. Chip 선택 시 Section 2·3 목록이 필터링(REQ-FUNC-002) |
| 5 | 국가별 주의사항 | Card + Drawer | 해외 15개국 중 6개국 요약 Card(경보 단계 라벨, 최종 확인일). 선택 시 같은 화면에서 안전정보 Drawer 오픈(REQ-FUNC-047~054) |
| 6 | 최근 동행 이야기 | Card 3개 또는 Empty State | 데이터 있으면 모집중 동행글 3개 미리보기 Card. 없으면 "아직 등록된 동행 모집글이 없습니다" 안내 + 이용 방법 2줄 + "동행 글 작성하기"(`/travel-tools` 동행 탭) CTA |
| 7 | free_traveler 요약 | CTA Banner | 대표 한 줄 소개 + `50+ Trips`, `30+ Countries` 수치 + "대표 소개 보러가기"(`/about`) CTA |

**Card 선택 동작:** 여행지 Card 클릭 시 같은 화면에서 우측/하단 Drawer(Desktop: 우측 40% 폭 슬라이드 패널, Mobile: 하단 풀시트)를 열어 상세(소개·명소·일정·예산·교통·음식·에티켓·출처)와 "국가 안전정보 보기" 링크를 표시한다. 이 링크 선택 시 Drawer 내부 콘텐츠가 안전정보 뷰로 전환된다(별도 페이지 이동 없음).

**상태**
- Loading: Card Grid 스켈레톤(6개 placeholder)
- Success: 정상 목록·Drawer 노출
- Empty: Section 6에 한해 정의(콘텐츠 데이터는 시드 보장되어 Section 2·3·5는 Empty 없음)
- Error: 데이터 로드 실패 시 Section 단위 인라인 오류 + "다시 시도" 버튼
- Unauthorized: 해당 없음(전체 Public)

### 3.2 SCR-002 `/about` 대표 소개 (Section 7개)

| # | Section | 유형 | 내용 |
|---|---|---|---|
| 1 | free_traveler Hero | Hero | 대표 이미지 1장(실제 여행지 배경, alt에 장소 설명) + 한 문장 소개 |
| 2 | 여행 지표 | 좌우 분할(수치 2개) | `50+ Trips`, `30+ Countries`를 좌우 2분할 카드로 제시, 각 수치 옆 1줄 설명 |
| 3 | 소개·철학 | 좌우 분할(텍스트) | 자기소개, 여행을 시작한 이유, 여행 철학을 2~4개 문단으로 좌측 텍스트 + 우측 보조 이미지 배치 |
| 4 | 여행 타임라인 | 3단계 안내형 목록(6개 이상 시점) | 연도·장소·한 줄 요약을 세로 타임라인으로 6개 이상 나열 |
| 5 | 방문 국가 | Chip 목록 | 30개국을 아시아/유럽/북미/오세아니아 등 권역별로 묶은 Chip 그룹 |
| 6 | 여행 사진 Gallery | Card Grid(8개 이상) | 서로 다른 장소의 사진 8장 이상, Masonry 또는 4×2 그리드, 각 alt에 장소·상황 설명 |
| 7 | 기억에 남는 여행지 | Card Grid + CTA Banner | 4개 Card(장소명 + 한 줄 이유) + 하단 `/travel-tools`, `/mates` 이동 CTA 2개 |

**상태**
- Loading: Hero·Gallery 스켈레톤
- Success: 정적 콘텐츠 정상 노출(단일 상태 위주)
- Empty: 해당 없음(정적 콘텐츠 상시 존재)
- Error: 이미지 로드 실패 시 대체 플레이스홀더 + alt 텍스트 유지
- Unauthorized: 해당 없음(Public)

### 3.3 SCR-003 `/travel-tools` 통합 여행 준비 (Section 6개)

| # | Section | 유형 | 내용 |
|---|---|---|---|
| 1 | Intro | Hero(축소형) | "항공·숙소를 알아보기 전에 여행 조건부터 정리해보세요" 제목 + 이용 순서 3단계 요약(조건 입력 → 요약 확인 → 외부 이동/동행 작성) |
| 2 | 탭 전환 | 탭 | 항공편 / 숙소 / 동행 구하기 3개 탭(REQ-FUNC-011, 019, 031). 탭별 입력·검증·완료 상태는 서로 분리되어 다른 탭 전환 시 유지됨 |
| 3 | 조건 입력 Form | Form | (항공/숙소 탭 공통 구조) 국가·지역·출발일(체크인)·귀국일(체크아웃) 입력, 실시간 검증 오류 표시(REQ-FUNC-012~013, 020~021) |
| 4 | 입력 요약 + 외부 이동 Action Card | 좌우 분할 | 좌측 입력 요약 텍스트, 우측 "항공편 보러 가기"/"숙소 보러 가기" Action Card(새 탭 이동 버튼, `noopener,noreferrer`) |
| 5 | 비전달 고지 + Tip 3개 | 안내 + Chip/Card | "입력한 여행 조건은 외부 사이트로 전달되지 않습니다" 고지(REQ-FUNC-015, 023) + 항공·숙소 찾기 Tip 3개(가격 비교 방법, 날짜 유연화, 왕복/편도 비교) |
| 6 | 동행 탭 전용: 로그인 안내 또는 작성 Form | Form 또는 안내 Card | 비로그인·성인 미확인 시 "로그인/성인 확인이 필요합니다" 안내 + `/account` 이동 CTA. 로그인·성인 확인 완료 시 모집글 작성 Form(제목·국가·지역·기간·모집 인원·여행 스타일·설명·공개연락처 탐지·안전수칙 동의) 표시 |

**상태**
- Loading: 폼 초기 렌더 스켈레톤 없음(정적 폼, 즉시 표시)
- Success: 유효 입력 → 요약 표시, 동행 제출 → 완료 배지 + `/mates` 이동 안내
- Empty: 해당 없음(입력 대기 상태는 Loading/Success 사이 기본 폼 상태로 처리)
- Error: 필수값 누락/날짜 역전 오류, 공개연락처 탐지 오류, 외부 URL 오류(재시도 제공)
- Unauthorized: 동행 탭에서 비로그인·성인 미확인 시 작성 Form 대신 안내 표시

### 3.4 SCR-004 `/mates` 동행 조회 (Section 6개)

| # | Section | 유형 | 내용 |
|---|---|---|---|
| 1 | Intro | Hero(축소형) | "믿을 수 있는 동행을 찾아보세요" 제목 + 설명 2문장 + "새 동행 글 작성하기"(`/travel-tools` 동행 탭) CTA |
| 2 | 검색 Filter + 결과 요약 | Chip/Form 혼합 | 국가·지역·기간·모집 상태 필터(REQ-FUNC-030) + "조건에 맞는 모집글 N건" 결과 요약 텍스트 |
| 3 | 동행글 목록 | Card Grid(최대 8개 우선 노출) | 데이터 있으면 제목·국가/지역·기간·모집상태 배지 Card 최대 8개, 그 이상은 더 보기 |
| 4 | 목록+상세 분할 / Drawer | 좌우 분할(Desktop) / Drawer(Mobile) | Desktop: 좌측 목록 40%, 우측 상세 60% 분할. Mobile: 목록에서 Card 선택 시 하단 풀시트 Drawer로 상세(참가 요청 폼, 신고·차단 버튼) 노출 |
| 5 | 동행 신청 방법 안내 | 3단계 안내 | 1) 조건 확인 2) 참가 메시지 제출 3) 작성자 승인 대기, 각 단계 1문장 설명 |
| 6 | 안전 안내 + CTA | CTA Banner | 안전한 만남 수칙, 신고·차단 방법 안내 + `/travel-tools` 이동 CTA |

**Empty State(검색 결과 0건):** Section 3 자리에 "조건에 맞는 모집글이 아직 없습니다" 안내 + 검색 조건 초기화 버튼 + "동행 글 작성하기" CTA + 참가 요청 이용 방법 3줄 요약을 함께 표시해 빈 화면처럼 보이지 않게 한다.

**상태**
- Loading: 목록 Card 스켈레톤(최대 8개 placeholder)
- Success: 목록·상세 정상 노출, 참가 요청 제출 완료 배지
- Empty: 위 Empty State 정의대로 표시
- Error: 목록 로드 실패, 참가 요청 제출 실패(중복 요청 등) 인라인 오류
- Unauthorized: 참가 요청·신고·차단 시도 시 로그인 필요 안내(비로그인은 목록·상세 열람은 가능)

### 3.5 SCR-005 `/account` 계정·관리

역할별 탭 구성이며, 역할에 없는 탭은 렌더링하지 않는다(Guest/Member/Admin 배타적 구성).

#### Guest 탭 구성

1. 계정 기능 Intro — "로그인하면 이런 것을 할 수 있어요" + 로그인 후 가능한 기능 요약(동행 글 작성, 참가 요청, 즐겨찾기)
2. 로그인·가입·비밀번호 재설정 Card 3개(좌우 분할 또는 3-Card 배치)
3. 로그인 후 가능한 기능 목록(Chip 또는 3단계 안내)
4. 보안 안내(개인정보 최소 수집 원칙, 성인 확인 절차 안내)

#### Member 탭 구성

1. 프로필·성인 확인 요약 (닉네임, 연령대, 성인 확인 상태 배지)
2. 내 글(작성한 동행글 목록 + 수정/마감/삭제)
3. 참가 요청 관리(보낸 요청 상태, 받은 요청 승인/거절)
4. 차단 목록(차단 해제 기능)
5. 새 동행글 작성 CTA(`/travel-tools` 동행 탭 이동)

목록 데이터가 없으면(예: 작성한 글 없음) "아직 작성한 동행 글이 없습니다" 안내 + 이용 방법 + "동행 글 작성하기" CTA를 표시한다.

#### Admin 탭 구성

1. 관리 Intro — 관리자 역할과 처리 범위 설명
2. 신고 상태 변경(신고 큐 목록 + OPEN/REVIEWING/RESOLVED/DISMISSED 상태 변경)
3. 항공·숙소 외부 URL 설정(HTTPS 허용목록 검증)

**상태**
- Loading: 탭별 목록 스켈레톤
- Success: 탭별 데이터 정상 노출
- Empty: 내 글·참가 요청·신고 큐가 비어 있을 때 안내 문장 + 다음 행동 CTA 표시
- Error: 로그인 실패, 성인 확인 실패, 신고 상태 변경 실패 등 인라인 오류
- Unauthorized: 비로그인 상태에서 Member/Admin 탭 접근 시 Guest 탭으로 리다이렉트, Admin이 아닌 Member가 관리 탭에 접근 시 해당 탭 자체를 렌더링하지 않음

---

## 4. Section 유형 교차 사용 점검

| Section 유형 | 사용 화면 |
|---|---|
| Hero | SCR-001 §1, SCR-002 §1, SCR-003 §1, SCR-004 §1 |
| Card Grid | SCR-001 §2·3·6, SCR-002 §6·7, SCR-004 §3 |
| 좌우 분할 | SCR-002 §2·3, SCR-003 §4 |
| Chip 목록 | SCR-001 §4, SCR-002 §5, SCR-004 §2 |
| 3단계 안내 | SCR-002 §4(타임라인 변형), SCR-004 §5 |
| CTA Banner | SCR-001 §7, SCR-002 §7, SCR-004 §6 |
| 탭 | SCR-003 §2, SCR-005(Guest/Member/Admin 내부 탭) |
| Form | SCR-003 §3·6, SCR-005 Guest 로그인 Card |

같은 Card 유형이 화면당 최대 2회를 넘지 않도록 배치했으며, Hero·Card Grid·좌우 분할·Chip·3단계 안내·CTA Banner가 화면별로 교차 사용된다.

---

## 5. 빈 데이터·자리채움 방지 원칙

- Lorem ipsum, "준비 중", "정보 확인 필요" 문구를 사용하지 않는다.
- DB/입력 데이터가 없는 모든 지점(SCR-001 §6, SCR-004 §3, SCR-005 Member 탭)은 안내 문장 + 이용 방법 + 다음 행동 CTA 3요소를 함께 표시한다.
- 인터넷 사진은 실제 장소를 설명하는 alt 텍스트를 붙인다(예: "제주 성산일출봉 해안 절벽과 유채꽃밭").

---

## 6. 접근성·반응형 체크리스트

- 모든 CTA·아이콘 버튼·Chip은 44×44px 이상 터치 영역을 확보한다.
- 키보드 포커스는 `color.focus.ring` 2px 링으로 표시하고 Tab 순서는 Header → Section 콘텐츠 → Footer 순으로 유지한다.
- Drawer/모달은 열림 시 포커스를 이동시키고, `Esc` 및 닫기 버튼으로 키보드만으로 닫을 수 있다.
- 경보·상태 배지는 색상과 텍스트 라벨을 함께 표시한다(예: 코랄이 아닌 `color.semantic.warning` 바탕에 "여행경보 3단계 철수권고" 텍스트).
- Mobile(390px) 기준 Section 상하 여백 40~64px, Card는 1열 배치, Desktop(1440px) 기준 콘텐츠 최대 폭 1200~1280px을 유지한다.
