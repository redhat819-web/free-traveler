---
name: Free-Traveler-Design
version: D-001
status: LOCKED
colors:
  bg-canvas: '#FFFFFF'
  bg-soft: '#F7F7F5'
  bg-strong: '#F0F0EE'
  text-primary: '#222222'
  text-secondary: '#5B5B5B'
  text-muted: '#8A8A8A'
  border-hairline: '#E3E3E0'
  border-strong: '#C7C7C3'
  accent-coral: '#FF6B57'
  accent-coral-active: '#E5523F'
  accent-coral-soft: '#FFE4DE'
  semantic-danger: '#C1272D'
  semantic-warning: '#B8590A'
  semantic-success: '#1E7A46'
  semantic-info: '#2457C5'
  focus-ring: '#1F5FD9'
typography:
  display-lg:
    fontFamily: "Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 32px
    fontSizeMobile: 26px
    fontWeight: 700
    lineHeight: 1.25
  display-md:
    fontFamily: "Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 24px
    fontSizeMobile: 20px
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
  micro:
    fontFamily: "Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
rounded:
  sm: 8px
  md: 14px
  pill: 9999px
spacing:
  section-desktop: 64px~96px
  section-mobile: 40px~64px
  container-max: 1200px~1280px
  gutter: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

# Free Traveler Design — D-001 (정본)

이 문서는 Free Traveler 서비스(SCR-001~SCR-005)의 유일한 디자인 정본이다. `design-reference/vendor/airbnb/DESIGN.md`(Cafe Yeonhee 참고본)는 레이아웃 밀도·타이포 위계·카드 리듬 등 **구성 방식만** 참고했으며, 색상 토큰·폰트·상표·문구는 참고본에서 가져오지 않는다. 모든 값은 `docs/04_UIUX_PLAN.md`에서 확정된 Free Traveler 고유 토큰이며, `docs/STITCH_VALIDATION_REPORT.md`에서 발견된 결함(SCR-003 탭 미통합, SCR-003 Mobile 비반응형, SCR-005 Admin 부재, 화면 중복)을 이번 정본에서 규칙으로 명문화해 재발을 방지한다.

## 1. Visual Theme

- 톤: 밝고 사진 중심의 여행 마켓플레이스. 순백(`#FFFFFF`) 캔버스 위에 코랄(`#FF6B57`) 포인트 컬러를 CTA·브랜드 강조에만 배타적으로 사용한다.
- 카드 모서리는 14px 라운드로 따뜻하지만 절제된 인상을 준다. 그림자는 평면 카드에는 쓰지 않고 hairline 테두리로 구획하며, Hover/Drawer/Modal 등 상승 요소에만 얕은 그림자를 쓴다(Airbnb 참고본의 "그림자 절제" 원칙 계승).
- 안전정보·오류·경고는 코랄이 아닌 semantic 컬러로만 표현해 브랜드 강조와 시스템 피드백을 시각적으로 분리한다.
- 상표 요소(Airbnb 로고·문구·Rausch 컬러 `#ff385c`·Cereal 서체 등)는 어떤 화면에도 포함하지 않는다.

## 2. Color Token

| 토큰 | 값 | 용도 |
|---|---|---|
| `color.bg.canvas` | `#FFFFFF` | 전역 배경 |
| `color.bg.soft` | `#F7F7F5` | 카드 구획, Section 배경 교차 |
| `color.bg.strong` | `#F0F0EE` | 비활성 필드, 뱃지 배경 |
| `color.text.primary` | `#222222` | 제목·본문 |
| `color.text.secondary` | `#5B5B5B` | 보조 설명 |
| `color.text.muted` | `#8A8A8A` | 캡션, 메타 정보 |
| `color.border.hairline` | `#E3E3E0` | 카드·구분선 |
| `color.border.strong` | `#C7C7C3` | 비포커스 강조 테두리 |
| `color.accent.coral` | `#FF6B57` | 브랜드 포인트, 주요 CTA |
| `color.accent.coral-active` | `#E5523F` | 포인트 버튼 pressed |
| `color.accent.coral-soft` | `#FFE4DE` | 포인트 배경 tint, 비활성 CTA |
| `color.semantic.danger` | `#C1272D` | 오류, 신고·차단 |
| `color.semantic.warning` | `#B8590A` | 여행경보, stale 배지 |
| `color.semantic.success` | `#1E7A46` | 제출 완료, 승인 상태 |
| `color.semantic.info` | `#2457C5` | 안내 링크, 정보성 배지 |
| `color.focus.ring` | `#1F5FD9` | 키보드 포커스 링(2px, outline-offset 2px) |

**규칙**: 이 표에 없는 색상은 어떤 화면·컴포넌트에도 임의로 추가하지 않는다. 새 색상이 필요하면 이 문서를 개정(D-002 등)해 토큰으로 등록한 뒤에만 사용한다.

## 3. Typography

- 서체: `Inter`를 1순위로 지정하되 한글 글리프가 없어 시스템 한글 폰트(`Apple SD Gothic Neo`, `Malgun Gothic`, `sans-serif`)로 자연 폴백되는 스택만 사용한다. Proprietary 폰트 파일(자체 호스팅 웹폰트, 라이선스 폰트)은 추가하지 않는다.
- 계층: `display-lg`(Hero 제목, Mobile 26px) → `display-md`(Section 제목, Mobile 20px) → `title`(카드 제목·탭 라벨) → `body`(본문) → `body-sm`(메타·캡션) → `button` → `micro`(뱃지·태그).
- 굵기는 700(Hero/Section 제목), 600(타이틀·버튼·micro), 400(본문)만 사용해 Airbnb 참고본처럼 위계가 과도하게 세분화되지 않도록 절제한다.

## 4. Spacing

| 토큰 | 값 |
|---|---|
| `space.section.desktop` | 64~96px (Section 상하 padding) |
| `space.section.mobile` | 40~64px (Section 상하 padding) |
| `container.max` | 1200~1280px, 1440px 기준 화면에서 좌우 여백 자동 확보 |
| `space.gutter` | 1.5rem(24px) |
| `space.xs/sm/md/lg/xl` | 4 / 8 / 16 / 24 / 40px |

## 5. Radius

| 토큰 | 값 | 적용 |
|---|---|---|
| `radius.sm` | 8px | 버튼, 입력 필드 |
| `radius.md` | 14px | 카드(Destination, Mate Post) |
| `radius.pill` | 9999px | Chip, 탭 필터, Badge |

## 6. Shadow

| 토큰 | 값 | 적용 |
|---|---|---|
| `shadow.card` | `0 1px 2px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.06)` | Hover, Drawer, Modal에만 사용 |
| 평면 카드 | 그림자 없음 + `color.border.hairline` 1px | Destination Card, Mate Post Card 기본 상태 |

## 7. Header · Footer

### Header (전 화면 공통, REQ-FUNC-064)
- 좌측: Free Traveler 워드마크(텍스트 로고, `type.title` + 코랄 점 1개, 이미지·상표 요소 없음)
- 중앙(Desktop만): 여행지 / 여행 준비(`/travel-tools`) / 동행 찾기(`/mates`) / 대표 소개(`/about`)
- 우측: 로그인/계정(`/account`) 진입 — 로그인 시 닉네임 또는 아바타 이니셜
- Mobile(390px): 워드마크 + 햄버거. 햄버거는 전체 높이 시트로 4개 내비게이션 + 계정 링크를 세로 목록 제공
- 포커스 순서: 로고 → 내비게이션 → 계정 버튼

### Footer (전 화면 공통)
- 3열(Desktop) / 1열(Mobile)
  - 1열: 소개 한 줄 + `/about`
  - 2열: 서비스 링크(여행지, 여행 준비, 동행 찾기, 국가별 주의사항)
  - 3열: 정책 링크(이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내)
- 하단 legal band: 저작권 문구 + "안전정보는 참고용이며 공식 출처를 직접 확인하세요" 고지

## 8. Search · Filter

- 검색 입력(SCR-001 Hero): pill 형태(`radius.pill`), 키워드 1개 입력창 + 보조 CTA 버튼 조합.
- 필터(SCR-004): 국가·지역·기간·모집 상태를 Chip/Form 혼합으로 배치하고, 결과 요약 텍스트("조건에 맞는 모집글 N건")를 필터 바로 아래 즉시 노출한다.
- 필터·Chip 선택 상태는 `color.accent.coral-soft` 배경 + `color.text.primary` 텍스트로 표시하고, 미선택은 `color.bg.strong` 배경을 사용한다.
- 모든 필터 컨트롤은 `touch.min` 44×44px 이상을 확보한다.

## 9. Destination Card

- 구성: 대표 이미지(실제 장소를 설명하는 alt 텍스트 필수) → 테마 태그(Chip) → 제목(`type.title`) → 한 줄 소개(`type.body-sm`).
- 배치: Desktop 3×2 그리드, Mobile 1열. Section당 최소 6개.
- 상호작용: 클릭 시 같은 화면 Drawer(Desktop 우측 40%, Mobile 하단 풀시트)로 상세(소개·명소·일정·예산·교통·음식·에티켓·출처 + "국가 안전정보 보기" 링크) 오픈. 페이지 이동 없음.
- 카드 자체에는 그림자 없이 hairline 테두리만 사용, 예약·가격·별점 요소는 절대 포함하지 않는다.

## 10. Form · Tabs

- **Form**(SCR-003 조건 입력, SCR-003 동행글 작성, SCR-005 로그인/가입): 국가·지역·날짜 등은 인셋 스타일 입력(`color.bg.soft` 배경, `color.border.hairline` 리스팅 보더), 포커스 시 `color.focus.ring` 2px 링 + 보더 컬러 전환. 실시간 검증 오류는 `color.semantic.danger` 텍스트 + 아이콘으로 입력 필드 하단에 표시한다.
- **Tabs**(SCR-003 항공편/숙소/동행 구하기, SCR-005 Guest/Member/Admin): 탭은 **같은 화면 안에서 콘텐츠를 전환하는 내부 컴포넌트**로만 구현하며, 외부 사이트로 직접 이동하는 링크형 버튼을 탭으로 대체해서는 안 된다(STITCH_VALIDATION_REPORT SCR-003 NEEDS_REVISION 근거 반영). 탭별 입력·검증·완료 상태는 서로 분리되어 다른 탭으로 전환해도 유지된다. 외부 사이트 이동(항공편/숙소 보러가기)은 탭 내부의 "입력 요약 + 외부 이동 Action Card" Section에서만 제공하고, 새 탭 이동 시 `noopener,noreferrer`를 적용한다.
- 탭 라벨은 `type.title`, 선택 탭은 `color.accent.coral` 하단 인디케이터 + `color.text.primary`, 비선택 탭은 `color.text.secondary`.

## 11. Mate Post Card

- 구성: 제목(`type.title`) → 국가/지역·기간 메타(`type.body-sm`, `color.text.muted`) → 모집 상태 배지(`color.semantic.info`/`success`/`warning` 중 상태에 맞게, 텍스트 라벨 병기) → 한 줄 요약.
- 배치: Card Grid 최대 8개 우선 노출(그 이상은 더 보기).
- 목록·상세 관계: Desktop은 좌측 목록 40% / 우측 상세 60% 좌우 분할, Mobile은 목록에서 Card 선택 시 하단 풀시트 Drawer로 상세(참가 요청 폼, 신고·차단 버튼) 노출. 목록과 상세 중 한쪽만 존재하는 레이아웃은 허용하지 않는다.
- 예약·결제·가격 요소는 포함하지 않으며, 참가 요청·신고·차단만 인터랙션으로 허용한다.

## 12. Drawer · Modal

- Drawer: Desktop 우측(또는 목록형 화면은 우측 60%) 슬라이드 패널, Mobile 하단 풀시트. 열림 시 포커스를 Drawer 내부 첫 포커스 가능 요소로 이동, `Esc` 및 닫기 버튼으로 닫기 가능.
- Modal: 확인/경고성 액션(신고 제출 확인 등)에 한해 사용, 배경 스크림 + 중앙 정렬, `shadow.card` 상승 그림자 적용.
- 둘 다 열림/닫힘 트랜지션은 200~250ms ease-out, 배경 스크롤은 잠금 처리한다.

## 13. Alert · Toast

- Alert(인라인, Section 내부): 오류(`color.semantic.danger`), 경고(`color.semantic.warning`), 성공(`color.semantic.success`), 안내(`color.semantic.info`) 4종. 배경은 각 색상의 10~15% tint, 텍스트는 원색 유지, 아이콘 + 텍스트 라벨을 항상 함께 표시(색상 단독 구분 금지).
- Toast(일시적 피드백: 제출 완료, 참가 요청 발송 등): 화면 하단 중앙(Mobile) / 우측 하단(Desktop), `color.semantic.success` 또는 `info` 배경, 3~5초 후 자동 소멸 + 수동 닫기 버튼 제공.

## 14. Loading · Empty · Error 상태

- **Loading**: Card Grid/목록은 실제 카드와 동일한 치수의 스켈레톤(SCR-001 §2·3·6, SCR-004 §3 최대 8개, SCR-002 Hero·Gallery, SCR-005 탭별 목록)을 사용한다. 정적 폼(SCR-003 §3)은 즉시 표시하며 스켈레톤을 두지 않는다.
- **Empty**: 데이터가 없는 모든 지점(SCR-001 §6 최근 동행 이야기, SCR-004 §3 검색 결과 0건, SCR-005 Member 탭 내 글/참가 요청/신고 큐)은 반드시 "① 안내 문장 + ② 이용 방법 + ③ 다음 행동 CTA" 3요소를 함께 표시해 빈 화면처럼 보이지 않게 한다. 이것이 완성형 Empty State이며, 단순 아이콘+한 줄 문구만 있는 상태는 금지한다.
- **Error**: 필드 단위(실시간 검증), Section 단위(목록 로드 실패 + "다시 시도" 버튼), 제출 단위(중복 요청·URL 검증 실패 등) 오류를 구분해 표시하고, 모두 `color.semantic.danger`로 통일한다.

## 15. Desktop · Mobile 규칙

- Desktop 기준 뷰포트: 1440px. Mobile 기준 뷰포트: 390px.
- Container: Desktop 콘텐츠 최대 폭 1200~1280px(좌우 여백 자동 확보), Mobile은 여백만 확보하고 콘텐츠 폭은 뷰포트 전체.
- Card 배치: Desktop 3×2(또는 좌우 40/60 분할), Mobile 1열 스택.
- 터치 영역: 모든 CTA·아이콘 버튼·Chip 44×44px 이상.
- **Mobile 변형 정의**: "Mobile 변형"이란 실제 `viewport` meta와 390px 기준 반응형 스택 레이아웃을 갖춘 별도 화면을 뜻하며, 데스크톱 폭(2560px 등)을 그대로 두고 제목만 "Mobile"로 바꾼 화면은 유효한 Mobile 변형으로 인정하지 않는다(STITCH_VALIDATION_REPORT SCR-003 Mobile 결함 반영). SCR-001, SCR-003의 Mobile 변형은 이 기준을 만족해야 승인된다.

## 16. Page Section 최대 폭과 Desktop·Mobile 상하 여백

| 항목 | Desktop | Mobile |
|---|---|---|
| Section 콘텐츠 최대 폭 | 1200~1280px | 뷰포트 전체(좌우 여백만 확보) |
| Section 상하 padding | 64~96px | 40~64px |
| Section 간 배경 교차 | `color.bg.canvas` ↔ `color.bg.soft` 번갈아 사용해 리듬 부여 | 동일 |

## 17. Hero 높이와 첫 화면에서 다음 Section을 보여주는 규칙

- Hero는 화면 전체 높이(100vh)를 차지하지 않는다. 1440px Desktop 기준 Hero 높이는 뷰포트의 60~70%로 제한해, 스크롤 없이도 Hero 하단에서 다음 Section의 제목과 카드 상단 일부가 보이도록 한다.
- 축소형 Hero(SCR-002~004의 Intro Hero)는 제목 + 설명 2문장 + CTA 1~2개로 구성하며 더 낮은 높이를 사용해 바로 다음 핵심 Section(탭, 필터, 목록 등)이 첫 화면에 보이게 한다.
- 이 규칙을 지키지 않아 Hero 아래 긴 빈 공간이 생기는 구현은 NEEDS_REVISION 대상이다.

## 18. Section별 제목·설명·본문·CTA 계층과 시각적 리듬

- 모든 Section은 예외 없이 "제목(`type.display-md`) → 설명(`type.body`, 1~2문장) → 본문(Card Grid/Form/Chip 등) → CTA(선택, `type.button`)" 4단 계층을 따른다. CTA가 없는 순수 정보 Section은 본문까지만 필수이며, 제목·설명·본문 중 하나라도 비어 있으면 NEEDS_REVISION이다.
- 시각적 리듬은 `color.bg.canvas`와 `color.bg.soft` 배경을 Section마다 교차시키고, Section 간 간격은 `space.section.desktop/mobile` 토큰을 균일하게 적용해 화면을 스캔할 때 일정한 박자를 유지한다.
- 같은 Card 유형은 한 화면당 최대 2회를 넘지 않도록 배치한다(04_UIUX_PLAN.md §4 교차 사용 원칙 계승).

## 19. 화면별 Section 순서와 Card·Timeline·Gallery 최소 콘텐츠 수

### SCR-001 `/` 메인 (7 Section)
1. 여행지 검색 Hero
2. 국내 인기 여행지 — Destination Card 최소 6개
3. 해외 인기 여행지 — Destination Card 최소 6개
4. 여행 동기·테마 — Chip 최소 6개
5. 국가별 주의사항 — Card 최소 6개국
6. 최근 동행 이야기 — Mate Post Card 3개 또는 완성형 Empty State
7. free_traveler 요약 CTA Banner

### SCR-002 `/about` 대표 소개 (7 Section)
1. Hero(대표 이미지 1장 + 한 문장)
2. 여행 지표(수치 카드 2개)
3. 소개·철학(좌우 분할 텍스트)
4. 여행 타임라인 — Timeline 항목 최소 6개
5. 방문 국가 — Chip(30개국, 권역별 그룹)
6. 여행 사진 Gallery — 이미지 최소 8장
7. 기억에 남는 여행지 — Card 4개 + CTA Banner

### SCR-003 `/travel-tools` 통합 여행 준비 (6 Section)
1. Intro Hero(축소형, 이용 순서 3단계)
2. 탭 전환(항공편/숙소/동행 구하기 — 내부 탭, §10 규칙 준수)
3. 조건 입력 Form
4. 입력 요약 + 외부 이동 Action Card(좌우 분할)
5. 비전달 고지 + Tip 3개
6. 동행 탭 전용: 로그인 안내 또는 작성 Form

### SCR-004 `/mates` 동행 조회 (6 Section)
1. Intro Hero(축소형)
2. 검색 Filter + 결과 요약
3. 동행글 목록 — Mate Post Card 최대 8개 우선 노출
4. 목록+상세 분할(Desktop) / Drawer(Mobile) — 목록과 상세 둘 다 필수
5. 동행 신청 방법 안내(3단계)
6. 안전 안내 + CTA Banner

### SCR-005 `/account` 계정·관리 (Guest/Member/Admin 배타적 탭)
- Guest: 계정 기능 Intro → 로그인·가입·비밀번호 재설정 Card 3개 → 로그인 후 가능 기능 목록 → 보안 안내
- Member: 프로필·성인 확인 요약 → 내 글 목록 → 참가 요청 관리 → 차단 목록 → 새 동행글 작성 CTA
- Admin: 관리 Intro → 신고 상태 변경(큐 목록 + 상태 변경) → 항공·숙소 외부 URL 설정
- **필수 규칙**: SCR-005는 로그인 화면 단독으로 완성될 수 없으며 Guest/Member/Admin 3개 탭 구조를 모두 갖춰야 승인된다(STITCH_VALIDATION_REPORT SCR-005 NEEDS_REVISION 근거 반영). 역할에 없는 탭은 렌더링하지 않되, 구조 자체는 3탭 모두 정의되어 있어야 한다.

## 20. 완성형 Empty State와 Placeholder 문구 금지 규칙

- 금지 문구: "Lorem ipsum", "준비 중", "정보 확인 필요", 그 외 의미 없는 채움 텍스트.
- 빈 Card(이미지·텍스트 없이 틀만 있는 카드)는 어떤 상태에서도 노출 금지.
- 완성형 Empty State 3요소: ① 상황을 설명하는 안내 문장, ② 이용 방법 요약, ③ 다음 행동 CTA. 이 3요소가 모두 없는 Empty 화면은 NEEDS_REVISION.
- 이미지 로드 실패 시에도 alt 텍스트가 있는 대체 플레이스홀더를 사용하며, 빈 사각형만 남기지 않는다.

## 21. Do / Do Not

**Do**
- §2 Color Token, §3 Typography 표에 정의된 값만 사용한다.
- 탭(SCR-003, SCR-005)은 같은 화면 내부 콘텐츠 전환 컴포넌트로 구현한다.
- SCR-001·SCR-003 Mobile 변형은 실제 390px 반응형 레이아웃으로 별도 제작한다.
- 모든 Empty 지점에 안내+방법+CTA 3요소를 채운다.
- 안전정보·오류·경고는 semantic 컬러 + 텍스트 라벨을 함께 표시한다.
- 동일 SCR 화면은 프로젝트 내 1개만 유지한다(중복 화면 생성 금지).

**Do Not**
- Airbnb 상표 요소(로고, 워드마크, Rausch 컬러 `#ff385c`, Cereal 서체 등)를 어떤 형태로도 포함하지 않는다.
- 구매·예약·결제 UI(가격 표시, 결제 버튼, 예약 확정 흐름)를 추가하지 않는다.
- Proprietary Font 파일을 프로젝트에 반입하지 않는다(시스템 폰트 폴백 스택만 사용).
- §2에 없는 임의 색상을 추가하지 않는다.
- 광고, 별점, 실시간 항공권/호텔 가격 위젯을 추가하지 않는다.
- 항공편/숙소 외부 이동 링크를 탭 자체로 위장하지 않는다.
- Hero를 100vh로 채워 다음 Section이 첫 화면에서 보이지 않게 만들지 않는다.
