/**
 * 국내·해외 여행지 정적 데이터.
 * REQ-FUNC-001,002,007,008,009,010 / REQ-NF-004,026 대응.
 * Supabase Table을 만들지 않고 이 정적 배열만으로 SCR-001 여행지 섹션을 구성한다(CLAUDE.md 규칙 16).
 */

export type DestinationScope = "domestic" | "overseas";

export interface DestinationImage {
  url: string;
  alt: string;
}

export interface Destination {
  id: string;
  scope: DestinationScope;
  country: string;
  city: string;
  region: string;
  season: string[];
  theme: string[];
  summary: string;
  attractions: string[];
  itinerary1Day: string;
  itinerary3Day: string;
  budgetPerPersonKRW: string;
  transport: string;
  food: string[];
  etiquette: string;
  source: string;
  image: DestinationImage;
}

export const destinations: Destination[] = [
  // ---------------------------------------------------------------------
  // 국내 여행지 10개
  // ---------------------------------------------------------------------
  {
    id: "dom-seoul-bukchon",
    scope: "domestic",
    country: "대한민국",
    city: "서울 북촌한옥마을",
    region: "수도권",
    season: ["봄", "가을"],
    theme: ["도심 산책", "전통문화"],
    summary:
      "경복궁과 창덕궁 사이 언덕에 남아 있는 한옥 마을로, 좁은 골목을 따라 걸으며 서울의 옛 정취를 느낄 수 있다.",
    attractions: [
      "북촌 8경 골목길",
      "가회동 성당",
      "북촌문화센터",
      "한복 체험 거리",
      "삼청동 카페 골목",
    ],
    itinerary1Day:
      "북촌문화센터 관람 → 8경 골목 산책 → 삼청동 카페에서 휴식 → 인사동 저녁 식사",
    itinerary3Day:
      "1일차 북촌·삼청동, 2일차 경복궁·창덕궁, 3일차 인사동 공방 체험과 남산 야경",
    budgetPerPersonKRW: "1일 약 6만원(식사·입장료·교통 포함)",
    transport: "지하철 3호선 안국역 하차 후 도보 10분",
    food: ["삼청동 수제비", "인사동 전통 찻집 떡", "북촌 손만두"],
    etiquette:
      "실제 주민이 거주하는 지역이므로 골목 소음과 사유지 무단 촬영을 자제한다.",
    source: "서울관광재단 공식 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80",
      alt: "기와지붕이 이어진 북촌한옥마을 골목 풍경",
    },
  },
  {
    id: "dom-busan-gamcheon",
    scope: "domestic",
    country: "대한민국",
    city: "부산 감천문화마을",
    region: "영남권",
    season: ["봄", "여름", "가을"],
    theme: ["예술 마을", "바다 전망"],
    summary:
      "산비탈을 따라 알록달록한 집들이 계단식으로 늘어선 마을로, 골목마다 벽화와 조형물이 있어 도보 여행에 알맞다.",
    attractions: [
      "어린왕자 포토존",
      "감내1번길 벽화거리",
      "하늘마루 전망대",
      "감천 파스텔 골목",
      "물고기 조형물 계단",
    ],
    itinerary1Day:
      "마을 입구 안내소에서 지도 수령 → 어린왕자 포토존 → 하늘마루 전망대 → 자갈치시장 저녁",
    itinerary3Day:
      "1일차 감천문화마을·자갈치시장, 2일차 해운대·광안리, 3일차 태종대·용궁사",
    budgetPerPersonKRW: "1일 약 7만원",
    transport: "부산 지하철 1호선 토성역에서 마을버스 서구2·2-2번 환승",
    food: ["부산 밀면", "씨앗호떡", "회국수"],
    etiquette: "실제 거주 가구가 많아 담장 안쪽 촬영과 큰 소음을 피한다.",
    source: "부산광역시 서구청 관광 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=80",
      alt: "산비탈에 파스텔톤 집들이 늘어선 감천문화마을 전경",
    },
  },
  {
    id: "dom-jeju-seongsan",
    scope: "domestic",
    country: "대한민국",
    city: "제주 성산일출봉",
    region: "제주권",
    season: ["봄", "여름", "가을"],
    theme: ["자연 경관", "일출 명소"],
    summary:
      "바다에서 솟아오른 화산 분화구로 유네스코 세계자연유산에 등재되어 있으며, 정상에서 보는 일출이 특히 유명하다.",
    attractions: [
      "성산일출봉 정상 전망대",
      "우도 도항선 선착장",
      "광치기해변",
      "섭지코지",
      "해녀박물관",
    ],
    itinerary1Day:
      "새벽 일출 관람 → 광치기해변 산책 → 섭지코지 → 성산 시내 해산물 식당",
    itinerary3Day:
      "1일차 성산·섭지코지, 2일차 우도 당일 여행, 3일차 한라산 둘레길과 서귀포",
    budgetPerPersonKRW: "1일 약 9만원(렌터카 포함)",
    transport: "제주국제공항에서 렌터카 또는 시외버스로 약 1시간",
    food: ["제주 전복죽", "고등어회", "흑돼지 구이"],
    etiquette: "분화구 보호를 위해 지정된 탐방로 밖으로 벗어나지 않는다.",
    source: "제주특별자치도 관광협회 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1541638832-427e096e4e5d?auto=format&fit=crop&w=1200&q=80",
      alt: "바다 위로 솟은 성산일출봉의 화산 분화구 전경",
    },
  },
  {
    id: "dom-gyeongju-bulguksa",
    scope: "domestic",
    country: "대한민국",
    city: "경주 불국사·석굴암",
    region: "영남권",
    season: ["봄", "가을"],
    theme: ["역사 유적", "사찰 순례"],
    summary:
      "신라 시대 불교 건축의 정수를 보여주는 사찰로, 다보탑과 석가탑, 석굴암 본존불이 유네스코 세계문화유산으로 등재되어 있다.",
    attractions: [
      "불국사 다보탑·석가탑",
      "석굴암 본존불",
      "동궁과 월지 야경",
      "대릉원 고분군",
      "첨성대",
    ],
    itinerary1Day:
      "불국사 관람 → 석굴암 셔틀버스 이동 → 대릉원 고분군 산책 → 동궁과 월지 야경",
    itinerary3Day:
      "1일차 불국사·석굴암, 2일차 대릉원·첨성대·동궁과 월지, 3일차 양동마을과 보문호",
    budgetPerPersonKRW: "1일 약 6만원",
    transport: "경주 시외버스터미널에서 시내버스 10·11번으로 약 30분",
    food: ["경주 황남빵", "쌈밥", "한정식"],
    etiquette:
      "법당 내부 촬영이 금지된 구역이 있으니 안내판을 반드시 확인한다.",
    source: "경주시청 문화관광 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1584971132003-3a1a82762a06?auto=format&fit=crop&w=1200&q=80",
      alt: "다보탑과 대웅전이 보이는 불국사 경내 풍경",
    },
  },
  {
    id: "dom-gangneung-anmok",
    scope: "domestic",
    country: "대한민국",
    city: "강릉 안목해변·경포호",
    region: "강원권",
    season: ["여름", "가을"],
    theme: ["해변 휴식", "커피 거리"],
    summary:
      "커피 거리로 유명한 안목해변과 벚꽃길이 아름다운 경포호가 인접해 있어 바다와 호수를 함께 즐길 수 있다.",
    attractions: [
      "안목해변 커피 거리",
      "경포호 자전거길",
      "오죽헌",
      "강릉 중앙시장",
      "정동진 모래시계공원",
    ],
    itinerary1Day:
      "안목해변 카페 투어 → 경포호 산책 → 중앙시장 저녁 → 정동진 야경",
    itinerary3Day:
      "1일차 안목·경포, 2일차 오죽헌·중앙시장, 3일차 정동진·주문진 항구",
    budgetPerPersonKRW: "1일 약 7만원",
    transport: "KTX 강릉역에서 시내버스 또는 택시로 약 15분",
    food: ["강릉 물회", "초당순두부", "짬뽕순두부"],
    etiquette: "해변 취사와 야간 소음은 금지 구역이 있으니 표지판을 확인한다.",
    source: "강릉시청 관광 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1541445136807-3a2ac91fce80?auto=format&fit=crop&w=1200&q=80",
      alt: "카페들이 늘어선 강릉 안목해변 해안가 풍경",
    },
  },
  {
    id: "dom-jeonju-hanok",
    scope: "domestic",
    country: "대한민국",
    city: "전주한옥마을",
    region: "호남권",
    season: ["봄", "가을", "겨울"],
    theme: ["전통문화", "미식"],
    summary:
      "700여 채의 한옥이 모여 있는 국내 최대 한옥 마을로, 한복을 입고 골목을 걸으며 전통 음식과 공예를 체험할 수 있다.",
    attractions: ["경기전", "전동성당", "오목대", "남부시장 청년몰", "한벽굴"],
    itinerary1Day: "경기전 관람 → 전동성당 → 남부시장 먹거리 → 오목대 야경",
    itinerary3Day:
      "1일차 한옥마을·경기전, 2일차 남부시장·모래내시장, 3일차 덕진공원과 완산칠봉",
    budgetPerPersonKRW: "1일 약 6만원",
    transport: "전주역에서 시내버스 79번 등으로 약 20분",
    food: ["전주비빔밥", "콩나물국밥", "모주"],
    etiquette: "한복 대여 시 골목 계단이나 사찰 문턱에 걸리지 않도록 주의한다.",
    source: "전주시청 문화관광 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=1200&q=80",
      alt: "한복을 입은 방문객들이 걷는 전주한옥마을 골목",
    },
  },
  {
    id: "dom-yeosu-odongdo",
    scope: "domestic",
    country: "대한민국",
    city: "여수 오동도·낭만포차",
    region: "호남권",
    season: ["봄", "여름"],
    theme: ["해양 경관", "야경"],
    summary:
      "동백꽃과 대나무 숲으로 유명한 오동도와 밤바다를 따라 늘어선 낭만포차 거리가 여수의 낭만적인 밤을 완성한다.",
    attractions: [
      "오동도 동백숲",
      "여수해상케이블카",
      "낭만포차 거리",
      "이순신광장",
      "향일암",
    ],
    itinerary1Day:
      "오동도 산책 → 해상케이블카 → 낭만포차에서 저녁 → 이순신광장 야경",
    itinerary3Day:
      "1일차 오동도·케이블카, 2일차 향일암·돌산대교, 3일차 사도·낭만포차",
    budgetPerPersonKRW: "1일 약 8만원",
    transport: "여수엑스포역에서 도보 또는 시내버스로 약 20분",
    food: ["게장백반", "돌산갓김치", "장어탕"],
    etiquette: "낭만포차 야간 이용 시 주변 상권 소음 민원에 유의한다.",
    source: "여수시청 관광 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80",
      alt: "야간 조명이 켜진 여수 밤바다와 케이블카 전경",
    },
  },
  {
    id: "dom-sokcho-seoraksan",
    scope: "domestic",
    country: "대한민국",
    city: "속초 설악산·아바이마을",
    region: "강원권",
    season: ["가을", "겨울"],
    theme: ["산악 트레킹", "실향민 문화"],
    summary:
      "가을 단풍과 겨울 설경이 아름다운 설악산 국립공원과 실향민들이 정착한 아바이마을의 독특한 음식문화를 함께 즐길 수 있다.",
    attractions: [
      "설악산 케이블카",
      "울산바위",
      "아바이마을 갯배",
      "속초해수욕장",
      "영금정",
    ],
    itinerary1Day:
      "설악산 케이블카 → 울산바위 조망 → 아바이마을 갯배 → 속초중앙시장 저녁",
    itinerary3Day:
      "1일차 설악산 케이블카, 2일차 아바이마을·중앙시장, 3일차 속초해수욕장·영금정",
    budgetPerPersonKRW: "1일 약 8만원",
    transport:
      "속초시외버스터미널에서 시내버스 7-1번으로 설악산 입구까지 약 40분",
    food: ["아바이순대", "오징어순대", "속초코다리냉면"],
    etiquette: "설악산 국립공원 지정 등산로 외 출입은 금지되어 있다.",
    source: "국립공원공단·속초시청 관광 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1607604760190-fb2fbe19c440?auto=format&fit=crop&w=1200&q=80",
      alt: "단풍이 든 설악산 능선과 울산바위 전경",
    },
  },
  {
    id: "dom-tongyeong-hansan",
    scope: "domestic",
    country: "대한민국",
    city: "통영 한산도·동피랑",
    region: "영남권",
    season: ["봄", "가을"],
    theme: ["벽화 마을", "해상 역사"],
    summary:
      "이순신 장군의 한산대첩 유적지와 벽화로 유명한 동피랑 마을이 있어 바다와 역사, 예술을 함께 느낄 수 있는 항구 도시다.",
    attractions: [
      "동피랑 벽화마을",
      "한산도 제승당",
      "통영해상케이블카",
      "강구안 문화마당",
      "서피랑 99계단",
    ],
    itinerary1Day:
      "동피랑 벽화 산책 → 강구안 문화마당 → 해상케이블카 → 활어시장 저녁",
    itinerary3Day:
      "1일차 동피랑·강구안, 2일차 한산도 당일 여행, 3일차 케이블카·서피랑",
    budgetPerPersonKRW: "1일 약 7만원",
    transport: "통영종합버스터미널에서 시내버스로 약 20분",
    food: ["충무김밥", "다찌 정식", "굴요리"],
    etiquette:
      "동피랑은 실제 주민 거주지이므로 담벼락 벽화만 촬영하고 사생활을 존중한다.",
    source: "통영시청 관광 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1200&q=80",
      alt: "알록달록한 벽화가 그려진 통영 동피랑 마을 골목",
    },
  },
  {
    id: "dom-damyang-juknokwon",
    scope: "domestic",
    country: "대한민국",
    city: "담양 죽녹원·메타세쿼이아길",
    region: "호남권",
    season: ["봄", "여름", "가을"],
    theme: ["자연 산책", "힐링"],
    summary:
      "울창한 대나무 숲길 죽녹원과 영화 촬영지로 유명한 메타세쿼이아 가로수길이 있어 초록빛 힐링 여행지로 손꼽힌다.",
    attractions: [
      "죽녹원 대나무 숲길",
      "메타세쿼이아 가로수길",
      "관방제림",
      "담양향교",
      "국수거리",
    ],
    itinerary1Day: "죽녹원 산책 → 관방제림 → 메타세쿼이아길 → 국수거리 저녁",
    itinerary3Day:
      "1일차 죽녹원·관방제림, 2일차 메타세쿼이아길·소쇄원, 3일차 담양호 자전거길",
    budgetPerPersonKRW: "1일 약 5만원",
    transport: "담양공용버스터미널에서 시내버스로 약 10분",
    food: ["떡갈비", "죽순 요리", "담양국수"],
    etiquette: "대나무 숲 보호를 위해 지정 산책로를 벗어나지 않는다.",
    source: "담양군청 관광 안내(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1600093463592-8e36ad95580a?auto=format&fit=crop&w=1200&q=80",
      alt: "빽빽한 대나무들이 늘어선 담양 죽녹원 산책로",
    },
  },

  // ---------------------------------------------------------------------
  // 해외 여행지 15개국 30개 도시
  // ---------------------------------------------------------------------
  {
    id: "os-japan-osaka",
    scope: "overseas",
    country: "일본",
    city: "오사카",
    region: "동아시아",
    season: ["봄", "가을"],
    theme: ["미식", "쇼핑"],
    summary:
      "도톤보리 거리와 오사카성을 중심으로 먹거리와 쇼핑을 동시에 즐길 수 있는 일본 대표 관광 도시다.",
    attractions: [
      "오사카성",
      "도톤보리",
      "구로몬시장",
      "우메다 스카이빌딩",
      "신사이바시",
    ],
    itinerary1Day:
      "오사카성 관람 → 구로몬시장 점심 → 신사이바시 쇼핑 → 도톤보리 야경",
    itinerary3Day:
      "1일차 오사카성·시내, 2일차 유니버설스튜디오재팬, 3일차 나라 당일치기",
    budgetPerPersonKRW: "1일 약 15만원(항공 제외)",
    transport: "간사이국제공항에서 난카이 전철 라피트로 난바역까지 약 40분",
    food: ["타코야키", "오코노미야키", "쿠시카츠"],
    etiquette:
      "식당·전철 내 큰 소리 통화는 삼가며, 길거리 흡연은 지정 구역에서만 한다.",
    source: "일본정부관광국(JNTO) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=80",
      alt: "야간 조명이 켜진 오사카 도톤보리 강변 거리",
    },
  },
  {
    id: "os-japan-kyoto",
    scope: "overseas",
    country: "일본",
    city: "교토",
    region: "동아시아",
    season: ["봄", "가을"],
    theme: ["전통문화", "사찰 순례"],
    summary:
      "일본의 옛 수도로 수많은 사찰과 정원, 게이샤 문화가 남아 있는 고즈넉한 도시다.",
    attractions: [
      "후시미이나리 신사",
      "기요미즈데라",
      "아라시야마 대나무숲",
      "기온거리",
      "긴카쿠지",
    ],
    itinerary1Day: "기요미즈데라 → 기온거리 산책 → 후시미이나리 신사",
    itinerary3Day:
      "1일차 기요미즈데라·기온, 2일차 아라시야마, 3일차 긴카쿠지·철학의길",
    budgetPerPersonKRW: "1일 약 14만원",
    transport: "오사카에서 JR 특급으로 약 30분",
    food: ["교토식 가이세키", "니신소바", "말차 디저트"],
    etiquette: "사찰 경내에서는 조용히 관람하고 지정된 곳 외 촬영을 삼간다.",
    source: "일본정부관광국(JNTO) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      alt: "붉은 도리이가 줄지어 선 교토 후시미이나리 신사",
    },
  },
  {
    id: "os-japan-sapporo",
    scope: "overseas",
    country: "일본",
    city: "삿포로",
    region: "동아시아",
    season: ["겨울"],
    theme: ["겨울 스포츠", "미식"],
    summary:
      "매년 열리는 눈꽃축제와 신선한 해산물, 삿포로 맥주로 유명한 홋카이도의 중심 도시다.",
    attractions: [
      "오도리공원",
      "삿포로시계탑",
      "니조시장",
      "삿포로 맥주박물관",
      "모이와산 전망대",
    ],
    itinerary1Day: "오도리공원 → 니조시장 점심 → 삿포로시계탑 → 모이와산 야경",
    itinerary3Day: "1일차 시내, 2일차 오타루 당일치기, 3일차 니세코 스키 체험",
    budgetPerPersonKRW: "1일 약 16만원",
    transport: "신치토세공항에서 JR 쾌속으로 삿포로역까지 약 40분",
    food: ["삿포로 라멘", "게 요리", "수프카레"],
    etiquette:
      "겨울철 빙판길이 많아 지정 보행로를 이용하고 무리한 촬영을 자제한다.",
    source: "일본정부관광국(JNTO) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
      alt: "눈이 쌓인 삿포로 오도리공원의 겨울 풍경",
    },
  },
  {
    id: "os-vietnam-danang",
    scope: "overseas",
    country: "베트남",
    city: "다낭",
    region: "동남아시아",
    season: ["봄", "가을", "겨울"],
    theme: ["해변 휴양", "가족 여행"],
    summary:
      "긴 백사장과 바나힐 테마파크가 있어 가족 단위 휴양 여행지로 인기가 높은 베트남 중부 도시다.",
    attractions: [
      "미케비치",
      "바나힐",
      "골든브릿지",
      "오행산",
      "한강 드래곤브릿지",
    ],
    itinerary1Day: "미케비치 오전 해변 → 오행산 관람 → 한강 드래곤브릿지 야경",
    itinerary3Day:
      "1일차 미케비치, 2일차 바나힐·골든브릿지, 3일차 호이안 당일치기",
    budgetPerPersonKRW: "1일 약 8만원(항공 제외)",
    transport: "다낭국제공항에서 시내까지 택시로 약 15분",
    food: ["미꽝", "반쎄오", "분짜"],
    etiquette: "사찰이나 사원 방문 시 어깨와 무릎을 가리는 복장을 착용한다.",
    source: "베트남국가관광청 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80",
      alt: "미케비치의 긴 백사장과 야자수가 있는 다낭 해안",
    },
  },
  {
    id: "os-vietnam-hoian",
    scope: "overseas",
    country: "베트남",
    city: "호이안",
    region: "동남아시아",
    season: ["봄", "가을"],
    theme: ["고도시 산책", "야경"],
    summary:
      "유네스코 세계문화유산으로 등재된 고도시로, 매달 보름 열리는 등불 축제와 노란 건물이 인상적이다.",
    attractions: [
      "호이안 구시가지",
      "내원교(일본인다리)",
      "떤끼 고가",
      "안방비치",
      "야시장",
    ],
    itinerary1Day: "구시가지 산책 → 내원교 관람 → 야시장 등불 감상",
    itinerary3Day:
      "1일차 구시가지, 2일차 안방비치, 3일차 자전거로 근교 마을 투어",
    budgetPerPersonKRW: "1일 약 7만원",
    transport: "다낭국제공항에서 택시 또는 셔틀버스로 약 45분",
    food: ["까오러우", "화이트로즈", "반미"],
    etiquette:
      "등불 강 유람선 이용 시 뱃사공에게 팁을 강요받지 않도록 사전 요금을 확인한다.",
    source: "베트남국가관광청 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
      alt: "노란 등불이 켜진 호이안 구시가지 강변 야경",
    },
  },
  {
    id: "os-thailand-bangkok",
    scope: "overseas",
    country: "태국",
    city: "방콕",
    region: "동남아시아",
    season: ["겨울"],
    theme: ["사원 문화", "야시장"],
    summary:
      "화려한 왕궁과 사원, 활기찬 야시장이 공존하는 동남아시아의 대표적인 관문 도시다.",
    attractions: [
      "왕궁(그랜드 팰리스)",
      "왓 아룬",
      "카오산로드",
      "짜뚜짝 주말시장",
      "아이콘시암",
    ],
    itinerary1Day: "왕궁 관람 → 왓 아룬 → 카오산로드 저녁",
    itinerary3Day:
      "1일차 왕궁·왓 아룬, 2일차 짜뚜짝 시장·아이콘시암, 3일차 아유타야 당일치기",
    budgetPerPersonKRW: "1일 약 9만원",
    transport: "수완나품국제공항에서 공항철도로 시내까지 약 30분",
    food: ["팟타이", "똠얌꿍", "망고 스티키라이스"],
    etiquette:
      "왕궁·사원 방문 시 반바지·민소매 착용을 금지하니 긴 옷을 준비한다.",
    source: "태국관광청(TAT) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
      alt: "황금빛 첨탑이 있는 방콕 왕궁 사원 전경",
    },
  },
  {
    id: "os-thailand-chiangmai",
    scope: "overseas",
    country: "태국",
    city: "치앙마이",
    region: "동남아시아",
    season: ["겨울"],
    theme: ["산악 자연", "코끼리 보호"],
    summary:
      "북부 산악 지형 속 고즈넉한 사원과 코끼리 보호구역 체험으로 힐링 여행지로 손꼽히는 도시다.",
    attractions: [
      "왓 프라탓 도이수텝",
      "올드시티 사원 거리",
      "님만해민",
      "코끼리 보호구역",
      "선데이 마켓",
    ],
    itinerary1Day: "도이수텝 사원 → 올드시티 사원 투어 → 선데이 마켓",
    itinerary3Day:
      "1일차 올드시티, 2일차 코끼리 보호구역, 3일차 도이인타논 국립공원",
    budgetPerPersonKRW: "1일 약 8만원",
    transport: "치앙마이국제공항에서 시내까지 택시로 약 15분",
    food: ["카오소이", "쏨땀", "북부식 소시지"],
    etiquette:
      "코끼리 체험은 승마 대신 목욕·먹이주기 중심의 보호 프로그램을 선택한다.",
    source: "태국관광청(TAT) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?auto=format&fit=crop&w=1200&q=80",
      alt: "산 중턱에 자리한 치앙마이 도이수텝 사원의 황금 불탑",
    },
  },
  {
    id: "os-france-paris",
    scope: "overseas",
    country: "프랑스",
    city: "파리",
    region: "서유럽",
    season: ["봄", "가을"],
    theme: ["미술관", "낭만 여행"],
    summary:
      "에펠탑과 루브르박물관 등 세계적인 예술과 건축을 품은 프랑스의 수도이자 낭만의 도시다.",
    attractions: [
      "에펠탑",
      "루브르박물관",
      "몽마르트르",
      "노트르담대성당",
      "샹젤리제거리",
    ],
    itinerary1Day: "루브르박물관 → 노트르담대성당 → 에펠탑 야경",
    itinerary3Day:
      "1일차 루브르·시테섬, 2일차 몽마르트르·에펠탑, 3일차 베르사유궁전 당일치기",
    budgetPerPersonKRW: "1일 약 20만원(항공 제외)",
    transport: "샤를 드 골 공항에서 RER B선으로 시내까지 약 40분",
    food: ["크루아상", "에스카르고", "마카롱"],
    etiquette:
      "식당 입장 시 종업원 안내를 기다리는 것이 일반적이며 팁은 서비스 만족 시 소액 추가한다.",
    source: "프랑스관광청(Atout France) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      alt: "센강 너머로 보이는 파리 에펠탑의 야경",
    },
  },
  {
    id: "os-italy-rome",
    scope: "overseas",
    country: "이탈리아",
    city: "로마",
    region: "남유럽",
    season: ["봄", "가을"],
    theme: ["고대 유적", "미식"],
    summary:
      "콜로세움과 트레비 분수 등 고대 로마 제국의 유적이 도시 곳곳에 살아 있는 역사 여행의 정수다.",
    attractions: [
      "콜로세움",
      "트레비분수",
      "판테온",
      "바티칸시국",
      "스페인광장",
    ],
    itinerary1Day: "콜로세움·포로로마노 → 판테온 → 트레비분수",
    itinerary3Day:
      "1일차 콜로세움 일대, 2일차 바티칸시국, 3일차 스페인광장·나보나광장",
    budgetPerPersonKRW: "1일 약 18만원",
    transport:
      "피우미치노공항에서 레오나르도 익스프레스로 테르미니역까지 약 30분",
    food: ["카르보나라", "젤라또", "로마식 피자"],
    etiquette:
      "성당 방문 시 어깨와 무릎을 가리는 복장이 필요하며 소매치기에 유의한다.",
    source: "이탈리아관광청(ENIT) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
      alt: "고대 원형 경기장인 로마 콜로세움의 외벽 전경",
    },
  },
  {
    id: "os-italy-venice",
    scope: "overseas",
    country: "이탈리아",
    city: "베네치아",
    region: "남유럽",
    season: ["봄", "가을"],
    theme: ["수상 도시", "낭만 여행"],
    summary:
      "운하와 곤돌라로 이루어진 물의 도시로, 산마르코광장과 리알토다리가 대표 명소다.",
    attractions: [
      "산마르코광장",
      "리알토다리",
      "두칼레궁전",
      "부라노섬",
      "곤돌라 투어",
    ],
    itinerary1Day: "산마르코광장 → 두칼레궁전 → 리알토다리 곤돌라 투어",
    itinerary3Day:
      "1일차 산마르코 일대, 2일차 부라노·무라노섬, 3일차 골목 산책과 쇼핑",
    budgetPerPersonKRW: "1일 약 19만원",
    transport: "베네치아 마르코폴로공항에서 수상버스로 시내까지 약 1시간",
    food: ["오징어먹물 리소토", "쿠키네 프리트", "티라미수"],
    etiquette:
      "성당·광장에서 비둘기 먹이주기가 금지된 구역이 있으니 안내판을 확인한다.",
    source: "이탈리아관광청(ENIT) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80",
      alt: "운하를 따라 곤돌라가 지나는 베네치아 수상 도시 풍경",
    },
  },
  {
    id: "os-spain-barcelona",
    scope: "overseas",
    country: "스페인",
    city: "바르셀로나",
    region: "남유럽",
    season: ["봄", "가을"],
    theme: ["건축 여행", "해변"],
    summary:
      "가우디의 건축물과 지중해의 해변이 공존하는 스페인 카탈루냐의 중심 도시다.",
    attractions: [
      "사그라다파밀리아",
      "구엘공원",
      "람블라거리",
      "바르셀로네타해변",
      "카사바트요",
    ],
    itinerary1Day: "사그라다파밀리아 → 구엘공원 → 바르셀로네타해변",
    itinerary3Day:
      "1일차 사그라다파밀리아·구엘공원, 2일차 카사바트요·람블라거리, 3일차 몬세라트 당일치기",
    budgetPerPersonKRW: "1일 약 17만원",
    transport: "엘프라트공항에서 공항버스 아에로부스로 시내까지 약 35분",
    food: ["빠에야", "타파스", "판콘토마테"],
    etiquette:
      "관광 명소는 사전 예약이 필수인 경우가 많아 현장 대기 시간을 감안한다.",
    source: "스페인관광청(Turespaña) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
      alt: "첨탑이 우뚝 솟은 바르셀로나 사그라다파밀리아 성당",
    },
  },
  {
    id: "os-germany-berlin",
    scope: "overseas",
    country: "독일",
    city: "베를린",
    region: "중앙유럽",
    season: ["봄", "가을"],
    theme: ["역사 유적", "예술"],
    summary:
      "냉전 시대의 흔적과 현대 예술이 공존하는 도시로, 브란덴부르크문과 베를린 장벽 유적이 상징적이다.",
    attractions: [
      "브란덴부르크문",
      "베를린장벽 이스트사이드갤러리",
      "박물관섬",
      "체크포인트찰리",
      "티어가르텐",
    ],
    itinerary1Day: "브란덴부르크문 → 박물관섬 → 이스트사이드갤러리",
    itinerary3Day:
      "1일차 브란덴부르크문·박물관섬, 2일차 장벽 유적지 투어, 3일차 포츠담 당일치기",
    budgetPerPersonKRW: "1일 약 16만원",
    transport: "베를린 브란덴부르크공항에서 공항철도로 시내까지 약 30분",
    food: ["커리부어스트", "슈니첼", "프레첼"],
    etiquette: "일요일에는 대부분 상점이 휴무이므로 일정을 미리 조정한다.",
    source: "독일관광청(GNTB) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80",
      alt: "웅장한 기둥이 있는 베를린 브란덴부르크문 전경",
    },
  },
  {
    id: "os-uk-london",
    scope: "overseas",
    country: "영국",
    city: "런던",
    region: "서유럽",
    season: ["봄", "가을"],
    theme: ["왕실 문화", "박물관"],
    summary:
      "빅벤과 버킹엄궁전 등 왕실 문화 유산과 다양한 무료 박물관이 있는 영국의 수도다.",
    attractions: [
      "빅벤·국회의사당",
      "버킹엄궁전",
      "대영박물관",
      "타워브릿지",
      "런던아이",
    ],
    itinerary1Day: "버킹엄궁전 근위병 교대식 → 대영박물관 → 타워브릿지 야경",
    itinerary3Day:
      "1일차 웨스트민스터 일대, 2일차 대영박물관·소호, 3일차 그리니치 당일치기",
    budgetPerPersonKRW: "1일 약 19만원",
    transport: "히스로공항에서 히스로 익스프레스로 패딩턴역까지 약 15분",
    food: ["피시앤칩스", "애프터눈티", "잉글리시 브렉퍼스트"],
    etiquette: "지하철 에스컬레이터에서는 우측에 서서 좌측 통행을 비워둔다.",
    source: "영국관광청(VisitBritain) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
      alt: "빅벤과 국회의사당이 보이는 런던 템스강변 풍경",
    },
  },
  {
    id: "os-switzerland-zermatt",
    scope: "overseas",
    country: "스위스",
    city: "체르마트",
    region: "중앙유럽",
    season: ["여름", "겨울"],
    theme: ["산악 트레킹", "설산 전망"],
    summary:
      "마터호른 봉을 바라보며 트레킹과 스키를 즐길 수 있는 스위스 알프스의 대표 산악 마을이다.",
    attractions: [
      "마터호른 전망대",
      "고르너그라트 전망열차",
      "체르마트 마을 산책",
      "리펠제 호수",
      "몬테로사 산장",
    ],
    itinerary1Day: "고르너그라트 전망열차 탑승 → 마터호른 전망대 → 마을 산책",
    itinerary3Day:
      "1일차 고르너그라트, 2일차 리펠제 트레킹, 3일차 마을 주변 케이블카 투어",
    budgetPerPersonKRW: "1일 약 25만원",
    transport:
      "취리히에서 기차로 테쉬역까지 이동 후 체르마트 셔틀열차 환승, 약 3시간 30분",
    food: ["퐁뒤", "라클레트", "뢰스티"],
    etiquette:
      "체르마트 마을은 전기차 외 일반 차량 진입이 금지되어 있으니 사전 확인한다.",
    source: "스위스관광청(Switzerland Tourism) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
      alt: "마터호른 봉이 보이는 체르마트 마을의 설경",
    },
  },
  {
    id: "os-austria-vienna",
    scope: "overseas",
    country: "오스트리아",
    city: "빈",
    region: "중앙유럽",
    season: ["봄", "가을", "겨울"],
    theme: ["클래식 음악", "궁전 문화"],
    summary:
      "모차르트와 베토벤이 활동했던 음악의 도시로, 쇤브룬궁전과 국립오페라극장이 대표 명소다.",
    attractions: [
      "쇤브룬궁전",
      "슈테판대성당",
      "국립오페라극장",
      "벨베데레궁전",
      "프라터 놀이공원",
    ],
    itinerary1Day: "쇤브룬궁전 → 슈테판대성당 → 저녁 오페라 공연",
    itinerary3Day:
      "1일차 쇤브룬궁전, 2일차 벨베데레궁전·미술관, 3일차 시내 카페 투어와 오페라",
    budgetPerPersonKRW: "1일 약 18만원",
    transport: "빈국제공항에서 CAT 고속열차로 시내까지 약 16분",
    food: ["슈니첼", "자허토르테", "아이스바인"],
    etiquette: "오페라극장 관람 시 정장에 가까운 단정한 복장을 권장한다.",
    source: "오스트리아관광청(Austria Tourism) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80",
      alt: "웅장한 정원이 펼쳐진 빈 쇤브룬궁전 전경",
    },
  },
  {
    id: "os-usa-newyork",
    scope: "overseas",
    country: "미국",
    city: "뉴욕",
    region: "북아메리카",
    season: ["가을", "겨울"],
    theme: ["도시 랜드마크", "공연·문화"],
    summary:
      "자유의 여신상과 타임스퀘어, 브로드웨이 공연으로 대표되는 세계적인 대도시다.",
    attractions: [
      "자유의 여신상",
      "타임스퀘어",
      "센트럴파크",
      "메트로폴리탄미술관",
      "브루클린브릿지",
    ],
    itinerary1Day: "타임스퀘어 → 센트럴파크 → 메트로폴리탄미술관",
    itinerary3Day:
      "1일차 맨해튼 도심, 2일차 자유의 여신상·브루클린, 3일차 브로드웨이 공연과 쇼핑",
    budgetPerPersonKRW: "1일 약 25만원",
    transport: "JFK국제공항에서 에어트레인·지하철로 시내까지 약 1시간",
    food: ["뉴욕 피자", "베이글", "치즈케이크"],
    etiquette: "레스토랑 이용 시 15~20% 팁 지불이 일반적이다.",
    source: "미국관광청(Brand USA) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
      alt: "화려한 전광판이 가득한 뉴욕 타임스퀘어 야경",
    },
  },
  {
    id: "os-usa-losangeles",
    scope: "overseas",
    country: "미국",
    city: "로스앤젤레스",
    region: "북아메리카",
    season: ["봄", "가을"],
    theme: ["해변", "테마파크"],
    summary:
      "할리우드와 유니버설스튜디오, 산타모니카 해변까지 즐길거리가 다양한 캘리포니아 대표 도시다.",
    attractions: [
      "할리우드사인",
      "산타모니카비치",
      "유니버설스튜디오할리우드",
      "게티센터",
      "베니스비치",
    ],
    itinerary1Day: "할리우드사인 조망 → 게티센터 → 산타모니카비치 선셋",
    itinerary3Day:
      "1일차 할리우드, 2일차 유니버설스튜디오, 3일차 산타모니카·베니스비치",
    budgetPerPersonKRW: "1일 약 22만원",
    transport: "LA국제공항에서 렌터카 또는 셰어라이드로 시내까지 약 30분",
    food: ["인앤아웃버거", "타코", "팜스프링스 데이트쉐이크"],
    etiquette:
      "대중교통이 제한적이므로 렌터카 이용 시 유료 주차 구역을 사전 확인한다.",
    source: "미국관광청(Brand USA) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1503756234508-e32ff97a2b62?auto=format&fit=crop&w=1200&q=80",
      alt: "언덕 위에 세워진 로스앤젤레스 할리우드사인",
    },
  },
  {
    id: "os-canada-vancouver",
    scope: "overseas",
    country: "캐나다",
    city: "밴쿠버",
    region: "북아메리카",
    season: ["여름", "가을"],
    theme: ["자연 경관", "아웃도어"],
    summary:
      "바다와 산이 도심과 맞닿아 있어 하이킹과 도시 여행을 동시에 즐길 수 있는 캐나다 서부 도시다.",
    attractions: [
      "스탠리공원",
      "그랜빌아일랜드",
      "카필라노 흔들다리",
      "개스타운",
      "휘슬러(근교)",
    ],
    itinerary1Day: "스탠리공원 산책 → 그랜빌아일랜드 → 개스타운 저녁",
    itinerary3Day:
      "1일차 스탠리공원, 2일차 카필라노 흔들다리, 3일차 휘슬러 당일치기",
    budgetPerPersonKRW: "1일 약 20만원",
    transport:
      "밴쿠버국제공항에서 스카이트레인 캐나다라인으로 시내까지 약 25분",
    food: ["연어 요리", "푸틴", "씨투스카이 하이웨이 로컬 커피"],
    etiquette:
      "야외 활동이 많은 도시이므로 곰 출현 지역 안내판을 반드시 따른다.",
    source: "캐나다관광청(Destination Canada) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1560814304-4f05b62af116?auto=format&fit=crop&w=1200&q=80",
      alt: "고층 빌딩과 산이 함께 보이는 밴쿠버 시내 전경",
    },
  },
  {
    id: "os-australia-sydney",
    scope: "overseas",
    country: "호주",
    city: "시드니",
    region: "오세아니아",
    season: ["봄", "가을"],
    theme: ["해변", "랜드마크"],
    summary:
      "오페라하우스와 하버브릿지로 유명한 호주 최대 도시로, 도심 바로 옆에 아름다운 해변이 있다.",
    attractions: [
      "시드니오페라하우스",
      "하버브릿지",
      "본다이비치",
      "달링하버",
      "타롱가동물원",
    ],
    itinerary1Day: "오페라하우스 → 하버브릿지 조망 → 본다이비치",
    itinerary3Day:
      "1일차 오페라하우스·달링하버, 2일차 본다이·쿠지 해안 산책, 3일차 블루마운틴 당일치기",
    budgetPerPersonKRW: "1일 약 21만원",
    transport: "시드니국제공항에서 공항열차로 시내까지 약 15분",
    food: ["플랫화이트 커피", "미트파이", "시푸드 플래터"],
    etiquette:
      "해변 수영 시 지정된 안전요원 구역(레드앤옐로우 플래그) 안에서만 수영한다.",
    source: "호주관광청(Tourism Australia) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
      alt: "하버브릿지와 오페라하우스가 보이는 시드니항 전경",
    },
  },
  {
    id: "os-nz-queenstown",
    scope: "overseas",
    country: "뉴질랜드",
    city: "퀸스타운",
    region: "오세아니아",
    season: ["봄", "가을", "겨울"],
    theme: ["액티비티", "산악 호수"],
    summary:
      "번지점프의 발상지로 유명한 액티비티 천국이며, 와카티푸 호수와 남알프스산맥의 절경이 어우러진다.",
    attractions: [
      "와카티푸호수",
      "스카이라인곤돌라",
      "카와라우다리 번지점프",
      "글렌노키 협곡",
      "밀포드사운드(근교)",
    ],
    itinerary1Day: "스카이라인곤돌라 → 호숫가 산책 → 저녁 퍽퍽버거",
    itinerary3Day:
      "1일차 시내·곤돌라, 2일차 밀포드사운드 당일 투어, 3일차 번지점프 등 액티비티",
    budgetPerPersonKRW: "1일 약 24만원",
    transport: "퀸스타운공항에서 시내까지 셔틀버스로 약 15분",
    food: ["퍽퍽버거", "그린립 홍합", "뉴질랜드산 와인"],
    etiquette: "액티비티 예약 시 취소·환불 규정을 사전에 꼼꼼히 확인한다.",
    source: "뉴질랜드관광청(Tourism New Zealand) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80",
      alt: "산맥을 배경으로 한 뉴질랜드 퀸스타운 와카티푸호수",
    },
  },
  {
    id: "os-turkiye-istanbul",
    scope: "overseas",
    country: "튀르키예",
    city: "이스탄불",
    region: "서아시아",
    season: ["봄", "가을"],
    theme: ["역사 유적", "동서양 문화"],
    summary:
      "아시아와 유럽 대륙에 걸쳐 있는 도시로, 비잔틴·오스만 제국의 유적과 그랜드바자르가 유명하다.",
    attractions: [
      "아야소피아",
      "블루모스크",
      "그랜드바자르",
      "탁심광장",
      "보스포루스해협 크루즈",
    ],
    itinerary1Day: "아야소피아 → 블루모스크 → 그랜드바자르 쇼핑",
    itinerary3Day:
      "1일차 구시가지, 2일차 보스포루스 크루즈·탁심광장, 3일차 카파도키아 당일 투어",
    budgetPerPersonKRW: "1일 약 12만원",
    transport: "이스탄불공항에서 지하철 M11선으로 시내까지 약 40분",
    food: ["케밥", "터키식 아침식사", "바클라바"],
    etiquette:
      "모스크 방문 시 여성은 스카프로 머리를 가리고 신발을 벗어야 한다.",
    source: "튀르키예관광청(Go Türkiye) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80",
      alt: "돔형 지붕이 있는 이스탄불 블루모스크 전경",
    },
  },
  {
    id: "os-uae-dubai",
    scope: "overseas",
    country: "아랍에미리트",
    city: "두바이",
    region: "서아시아",
    season: ["가을", "겨울"],
    theme: ["초고층 도시", "사막 체험"],
    summary:
      "부르즈할리파와 인공섬 등 첨단 건축물과 사막 사파리 체험이 공존하는 중동의 관문 도시다.",
    attractions: [
      "부르즈할리파",
      "두바이몰",
      "팜 주메이라",
      "두바이프레임",
      "사막 사파리",
    ],
    itinerary1Day: "부르즈할리파 전망대 → 두바이몰 → 분수쇼 관람",
    itinerary3Day:
      "1일차 부르즈할리파·다운타운, 2일차 사막 사파리, 3일차 팜 주메이라·해변",
    budgetPerPersonKRW: "1일 약 20만원",
    transport: "두바이국제공항에서 메트로 레드라인으로 시내까지 약 30분",
    food: ["샤와르마", "만사프", "아라비안 커피"],
    etiquette:
      "공공장소에서 과도한 노출 복장은 피하고 라마단 기간에는 낮 시간 취식을 자제한다.",
    source: "두바이관광청(Dubai Tourism) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      alt: "세계 최고층 빌딩인 두바이 부르즈할리파 전경",
    },
  },
  {
    id: "os-egypt-cairo",
    scope: "overseas",
    country: "이집트",
    city: "카이로",
    region: "북아프리카",
    season: ["봄", "가을", "겨울"],
    theme: ["고대 문명", "역사 유적"],
    summary:
      "기자의 피라미드와 스핑크스를 비롯한 고대 문명의 유적이 도심 인근에 남아 있는 역사 여행지다.",
    attractions: [
      "기자 피라미드",
      "스핑크스",
      "이집트박물관",
      "칸 엘 칼릴리 시장",
      "나일강 크루즈",
    ],
    itinerary1Day: "기자 피라미드·스핑크스 → 이집트박물관 → 칸 엘 칼릴리 시장",
    itinerary3Day:
      "1일차 기자 피라미드 일대, 2일차 이집트박물관·나일강 크루즈, 3일차 근교 사카라 유적",
    budgetPerPersonKRW: "1일 약 11만원",
    transport: "카이로국제공항에서 시내까지 택시로 약 40분",
    food: ["코샤리", "타아메야", "이집트식 빵"],
    etiquette:
      "유적지 관람 시 지정 가이드나 표지판을 따르고 문화재 접촉을 자제한다.",
    source: "이집트관광청(Egypt Tourism) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80",
      alt: "사막 위에 우뚝 선 기자의 피라미드와 스핑크스",
    },
  },
  {
    id: "os-portugal-lisbon",
    scope: "overseas",
    country: "포르투갈",
    city: "리스본",
    region: "남유럽",
    season: ["봄", "가을"],
    theme: ["언덕 마을", "미식"],
    summary:
      "언덕과 트램이 어우러진 색채감 있는 도시로, 파스텔 드 나타와 파두 공연이 여행의 즐거움을 더한다.",
    attractions: [
      "벨렝탑",
      "제로니무스 수도원",
      "28번 트램",
      "알파마지구",
      "코메르시우광장",
    ],
    itinerary1Day: "28번 트램 탑승 → 알파마지구 산책 → 벨렝탑",
    itinerary3Day:
      "1일차 시내 트램 투어, 2일차 벨렝지구·제로니무스 수도원, 3일차 신트라 당일치기",
    budgetPerPersonKRW: "1일 약 13만원",
    transport: "리스본공항에서 지하철 레드라인으로 시내까지 약 25분",
    food: ["파스텔 드 나타", "바칼라우 요리", "포트와인"],
    etiquette: "야간 파두 공연장에서는 공연 중 대화를 자제하는 것이 관례다.",
    source: "포르투갈관광청(Turismo de Portugal) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1200&q=80",
      alt: "노란 트램이 지나는 리스본 언덕길 풍경",
    },
  },
  {
    id: "os-greece-santorini",
    scope: "overseas",
    country: "그리스",
    city: "산토리니",
    region: "남유럽",
    season: ["봄", "가을"],
    theme: ["섬 여행", "일몰 명소"],
    summary:
      "하얀 건물과 파란 지붕이 에게해와 어우러진 절경으로 유명한 그리스의 대표 섬 여행지다.",
    attractions: [
      "이아마을 일몰 포인트",
      "피라마을",
      "레드비치",
      "고고학박물관",
      "아크로티리 유적",
    ],
    itinerary1Day: "피라마을 산책 → 레드비치 → 이아마을 일몰 감상",
    itinerary3Day:
      "1일차 피라마을, 2일차 아크로티리 유적·레드비치, 3일차 이아마을 일몰과 와이너리 투어",
    budgetPerPersonKRW: "1일 약 22만원",
    transport: "산토리니공항에서 시내버스 또는 택시로 약 15분",
    food: ["그릭 샐러드", "무사카", "산토리니 와인"],
    etiquette:
      "일몰 명소는 혼잡하니 이른 시간에 자리를 확보하고 새치기를 하지 않는다.",
    source: "그리스관광청(Visit Greece) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      alt: "하얀 건물과 파란 지붕이 어우러진 산토리니 이아마을",
    },
  },
  {
    id: "os-czech-prague",
    scope: "overseas",
    country: "체코",
    city: "프라하",
    region: "중앙유럽",
    season: ["봄", "가을"],
    theme: ["동화 같은 건축", "야경"],
    summary:
      "프라하성과 카를교로 대표되는 중세 건축이 잘 보존되어 동화 속 마을 같은 분위기를 자랑한다.",
    attractions: ["프라하성", "카를교", "구시가지광장", "천문시계", "존레논벽"],
    itinerary1Day: "프라하성 → 카를교 → 구시가지광장 야경",
    itinerary3Day:
      "1일차 프라하성 일대, 2일차 구시가지·유대인지구, 3일차 근교 크루므로프 당일치기",
    budgetPerPersonKRW: "1일 약 12만원",
    transport: "바츨라프하벨공항에서 공항버스로 시내까지 약 30분",
    food: ["굴라시", "트르들로", "체코 맥주"],
    etiquette: "구시가지 야간에는 소매치기가 종종 발생하니 소지품에 유의한다.",
    source: "체코관광청(CzechTourism) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80",
      alt: "블타바강 위 카를교와 프라하성이 보이는 야경",
    },
  },
  {
    id: "os-netherlands-amsterdam",
    scope: "overseas",
    country: "네덜란드",
    city: "암스테르담",
    region: "서유럽",
    season: ["봄"],
    theme: ["운하 도시", "미술관"],
    summary:
      "자전거와 운하가 어우러진 도시로, 봄철 튤립 축제와 반고흐미술관이 대표적인 명소다.",
    attractions: [
      "운하 크루즈",
      "반고흐미술관",
      "안네프랑크의 집",
      "쾨켄호프공원(근교)",
      "담광장",
    ],
    itinerary1Day: "운하 크루즈 → 반고흐미술관 → 담광장",
    itinerary3Day:
      "1일차 시내 운하 투어, 2일차 쾨켄호프공원 당일치기, 3일차 안네프랑크의 집·미술관",
    budgetPerPersonKRW: "1일 약 17만원",
    transport: "스키폴공항에서 기차로 암스테르담 중앙역까지 약 15분",
    food: ["스트룹와플", "치즈", "청어 요리"],
    etiquette:
      "자전거 전용도로가 많아 보행자는 자전거 통행로를 침범하지 않도록 주의한다.",
    source: "네덜란드관광청(Holland.com) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80",
      alt: "운하를 따라 자전거가 지나는 암스테르담 거리 풍경",
    },
  },
  {
    id: "os-singapore-singapore",
    scope: "overseas",
    country: "싱가포르",
    city: "싱가포르",
    region: "동남아시아",
    season: ["봄", "가을", "겨울"],
    theme: ["도시 정원", "가족 여행"],
    summary:
      "가든스바이더베이와 마리나베이샌즈로 대표되는 미래도시 이미지와 다민족 미식 문화가 공존한다.",
    attractions: [
      "마리나베이샌즈",
      "가든스바이더베이",
      "센토사섬",
      "차이나타운",
      "리버사이드 야경",
    ],
    itinerary1Day: "가든스바이더베이 → 마리나베이샌즈 전망대 → 클락키 야경",
    itinerary3Day:
      "1일차 마리나베이 일대, 2일차 센토사섬, 3일차 차이나타운·리틀인디아",
    budgetPerPersonKRW: "1일 약 15만원",
    transport: "창이국제공항에서 MRT로 시내까지 약 30분",
    food: ["칠리크랩", "하이난식 치킨라이스", "락사"],
    etiquette:
      "껌 반입·판매가 법으로 제한되어 있고 대중교통 내 음식물 섭취가 금지된다.",
    source: "싱가포르관광청(STB) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      alt: "야간 조명이 빛나는 싱가포르 가든스바이더베이 슈퍼트리",
    },
  },
  {
    id: "os-malaysia-kualalumpur",
    scope: "overseas",
    country: "말레이시아",
    city: "쿠알라룸푸르",
    region: "동남아시아",
    season: ["가을", "겨울"],
    theme: ["다문화 도시", "미식"],
    summary:
      "페트로나스트윈타워로 상징되는 현대 도시와 다양한 민족 문화가 어우러진 말레이시아의 수도다.",
    attractions: [
      "페트로나스트윈타워",
      "바투동굴",
      "부킷빈탕",
      "차이나타운(페탈링거리)",
      "KL타워",
    ],
    itinerary1Day:
      "페트로나스트윈타워 전망대 → 부킷빈탕 쇼핑 → 페탈링거리 저녁",
    itinerary3Day:
      "1일차 시내 랜드마크, 2일차 바투동굴·근교, 3일차 KL타워·나이트마켓",
    budgetPerPersonKRW: "1일 약 10만원",
    transport: "쿠알라룸푸르국제공항에서 KLIA 익스프레스로 시내까지 약 28분",
    food: ["나시르막", "바쿠테", "로티차나이"],
    etiquette: "모스크나 힌두 사원 방문 시 신발을 벗고 복장 규정을 확인한다.",
    source: "말레이시아관광청(Tourism Malaysia) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      alt: "야경 속에 우뚝 선 쿠알라룸푸르 페트로나스트윈타워",
    },
  },
  {
    id: "os-philippines-cebu",
    scope: "overseas",
    country: "필리핀",
    city: "세부",
    region: "동남아시아",
    season: ["봄", "가을", "겨울"],
    theme: ["해양 스포츠", "휴양"],
    summary:
      "에메랄드빛 바다와 산호초로 유명한 휴양 섬으로 스노클링과 다이빙 명소가 많다.",
    attractions: [
      "막탄섬 해변",
      "오슬롭 고래상어 투어",
      "카완칸 캐년",
      "산토니뇨성당",
      "탑스힐 전망대",
    ],
    itinerary1Day: "막탄섬 해변 → 스노클링 투어 → 탑스힐 야경",
    itinerary3Day:
      "1일차 막탄섬, 2일차 오슬롭 고래상어·카완칸캐년, 3일차 세부 시티투어",
    budgetPerPersonKRW: "1일 약 12만원",
    transport: "막탄세부국제공항에서 리조트 지역까지 택시로 약 20분",
    food: ["레촌", "시니강", "할로할로"],
    etiquette:
      "고래상어 투어 시 자외선 차단제 사용을 자제하고 지정 가이드 지침을 따른다.",
    source: "필리핀관광청(DOT) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
      alt: "에메랄드빛 바다가 펼쳐진 세부 막탄섬 해변",
    },
  },
  {
    id: "os-indonesia-bali",
    scope: "overseas",
    country: "인도네시아",
    city: "발리",
    region: "동남아시아",
    season: ["봄", "가을", "겨울"],
    theme: ["힐링 리조트", "사원 문화"],
    summary:
      "우붓의 논밭 경관과 해변 리조트가 공존하는 인도네시아의 대표 휴양 섬이다.",
    attractions: [
      "우붓 왕궁",
      "테갈라랑 계단식 논",
      "울루와뚜사원",
      "스미냑비치",
      "따나롯사원",
    ],
    itinerary1Day: "우붓 왕궁 → 테갈라랑 계단식 논 → 울루와뚜사원 일몰",
    itinerary3Day:
      "1일차 우붓, 2일차 울루와뚜·스미냑비치, 3일차 따나롯사원과 시장",
    budgetPerPersonKRW: "1일 약 11만원",
    transport: "응우라라이국제공항에서 우붓까지 차량으로 약 1시간",
    food: ["나시고랭", "사테", "바비굴링"],
    etiquette: "사원 방문 시 전통 천(사룽)을 허리에 두르는 복장 규정을 따른다.",
    source: "인도네시아관광청(Wonderful Indonesia) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      alt: "초록빛 계단식 논이 펼쳐진 발리 테갈라랑 풍경",
    },
  },
  {
    id: "os-china-shanghai",
    scope: "overseas",
    country: "중국",
    city: "상하이",
    region: "동아시아",
    season: ["봄", "가을"],
    theme: ["근대 건축", "야경"],
    summary:
      "와이탄 강변의 근대 건축과 푸동지구의 초고층 스카이라인이 대비를 이루는 중국 최대 경제 도시다.",
    attractions: ["와이탄", "동방명주타워", "위위안정원", "신천지", "난징루"],
    itinerary1Day: "와이탄 산책 → 위위안정원 → 동방명주타워 야경",
    itinerary3Day:
      "1일차 와이탄·푸동, 2일차 위위안정원·신천지, 3일차 난징루 쇼핑과 근교 수향마을",
    budgetPerPersonKRW: "1일 약 13만원",
    transport: "상하이 푸동국제공항에서 마그레브고속열차로 시내까지 약 8분",
    food: ["샤오롱바오", "생옌더우장", "홍샤오러우"],
    etiquette:
      "대중교통 이용 시 실명 등록이 필요한 교통카드가 있으니 사전 확인한다.",
    source: "중국국가여유국 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=1200&q=80",
      alt: "와이탄 강변에서 바라본 상하이 푸동지구 야경",
    },
  },
  {
    id: "os-taiwan-taipei",
    scope: "overseas",
    country: "대만",
    city: "타이베이",
    region: "동아시아",
    season: ["봄", "가을", "겨울"],
    theme: ["야시장", "온천"],
    summary:
      "타이베이101과 야시장 먹거리, 근교 온천까지 짧은 일정으로 다양한 매력을 즐길 수 있는 도시다.",
    attractions: [
      "타이베이101",
      "스린야시장",
      "지우펀",
      "국립고궁박물원",
      "단수이",
    ],
    itinerary1Day: "타이베이101 전망대 → 국립고궁박물원 → 스린야시장",
    itinerary3Day:
      "1일차 시내 랜드마크, 2일차 지우펀·핑시 당일치기, 3일차 베이터우 온천",
    budgetPerPersonKRW: "1일 약 9만원",
    transport: "타오위안국제공항에서 공항철도로 타이베이역까지 약 35분",
    food: ["딘타이펑 딤섬", "루러우판", "버블티"],
    etiquette: "야시장 노점 이용 시 현금을 소액 단위로 준비하는 것이 편리하다.",
    source: "대만관광청(Taiwan Tourism) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=1200&q=80",
      alt: "고층 빌딩 타이베이101이 보이는 타이베이 시내 전경",
    },
  },
  {
    id: "os-hongkong-hongkong",
    scope: "overseas",
    country: "홍콩",
    city: "홍콩",
    region: "동아시아",
    season: ["가을", "겨울"],
    theme: ["야경", "미식"],
    summary: "빅토리아항의 스카이라인 야경과 딤섬으로 유명한 국제 금융 도시다.",
    attractions: [
      "빅토리아피크",
      "심포니오브라이츠",
      "몽콕 야시장",
      "홍콩디즈니랜드",
      "스탠리마켓",
    ],
    itinerary1Day: "빅토리아피크 전망 → 스탠리마켓 → 심포니오브라이츠 야경",
    itinerary3Day:
      "1일차 빅토리아피크·센트럴, 2일차 홍콩디즈니랜드, 3일차 몽콕·야우마테이 시장",
    budgetPerPersonKRW: "1일 약 14만원",
    transport: "홍콩국제공항에서 공항철도로 센트럴까지 약 24분",
    food: ["딤섬", "완탕면", "에그타르트"],
    etiquette: "트램·지하철에서는 새치기 없이 줄서기 문화를 지킨다.",
    source: "홍콩관광청(Hong Kong Tourism Board) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80",
      alt: "빅토리아항 너머로 보이는 홍콩 도심 야경",
    },
  },
  {
    id: "os-mexico-cancun",
    scope: "overseas",
    country: "멕시코",
    city: "칸쿤",
    region: "중앙아메리카",
    season: ["봄", "가을", "겨울"],
    theme: ["카리브해 휴양", "고대 유적"],
    summary:
      "카리브해의 에메랄드빛 바다와 마야 문명 유적을 함께 즐길 수 있는 멕시코의 대표 휴양지다.",
    attractions: [
      "칸쿤해변",
      "치첸이트사 유적",
      "이슬라무헤레스",
      "세노테",
      "엑스카렛공원",
    ],
    itinerary1Day: "칸쿤해변 오전 → 세노테 스노클링 → 시내 저녁 식사",
    itinerary3Day:
      "1일차 칸쿤해변, 2일차 치첸이트사 당일치기, 3일차 이슬라무헤레스 보트투어",
    budgetPerPersonKRW: "1일 약 16만원",
    transport: "칸쿤국제공항에서 호텔존까지 셔틀버스로 약 30분",
    food: ["타코 알 파스토르", "세비체", "구아카몰레"],
    etiquette:
      "세노테 등 자연 수영 구역에서는 화학 성분 없는 자외선 차단제만 허용된다.",
    source: "멕시코관광청(Visit Mexico) 공식 자료(2025년 기준)",
    image: {
      url: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1200&q=80",
      alt: "에메랄드빛 바다와 백사장이 펼쳐진 칸쿤 해변",
    },
  },
];
