/**
 * 국가별 안전정보 정적 데이터 (REQ-FUNC-046/047/050/052/053, REQ-NF-027).
 * destinations.ts에 소개된 해외 국가 전원을 커버한다(29개국).
 * Supabase Table을 만들지 않고 이 정적 배열만으로 SCR-001 안전정보 섹션을 구성한다(CLAUDE.md 규칙 16).
 */

export interface SafetySource {
  name: string;
  url: string;
  lastVerified: string;
  editor: string;
}

export interface CountrySafety {
  id: string;
  country: string;
  security: string;
  scam: string;
  law: string;
  traffic: string;
  disaster: string;
  health: string;
  culture: string;
  emergencyContacts: string;
  source: SafetySource;
}

const editor = "free_traveler 편집팀";

export const countrySafety: CountrySafety[] = [
  {
    id: "safety-japan",
    country: "일본",
    security:
      "전반적으로 치안이 우수하지만 대도시 유흥가에서는 바가지 요금 유도에 주의한다.",
    scam: "호객꾼이 저렴한 술집으로 유인해 과도한 요금을 청구하는 '캬쿠비키' 사기에 주의한다.",
    law: "대마초는 소량 소지도 강력하게 처벌되며, 길거리 흡연은 지정 구역에서만 허용된다.",
    traffic:
      "차량은 좌측 주행이며, 자전거도 원칙적으로 차도 좌측을 이용해야 한다.",
    disaster:
      "지진 발생 빈도가 높아 숙소의 대피 경로를 미리 확인하고 긴급 재난 알림을 켜둔다.",
    health:
      "여행자 보험 가입을 권장하며, 응급실 이용 시 통역 서비스가 제한적일 수 있다.",
    culture: "대중교통·식당에서 큰 소리로 통화하는 것은 실례로 여겨진다.",
    emergencyContacts:
      "경찰 110 / 구급·화재 119 / 관광안내 다국어 지원 050-3816-2787",
    source: {
      name: "일본정부관광국(JNTO) 안전정보",
      url: "https://www.jnto.go.jp/emergency/",
      lastVerified: "2025-12-01",
      editor,
    },
  },
  {
    id: "safety-vietnam",
    country: "베트남",
    security:
      "관광지 소매치기와 오토바이 날치기가 빈번해 가방을 몸 앞쪽으로 착용한다.",
    scam: "환전 시 위조지폐 확인이 필요하며, 택시는 미터기 확인 후 탑승한다.",
    law: "오토바이 탑승 시 헬멧 미착용은 벌금 대상이며, 야간 유흥가 마약 소지는 중형에 처해진다.",
    traffic:
      "오토바이 통행량이 많아 무단횡단보다 신호가 있는 횡단보도 이용을 권장한다.",
    disaster: "우기(5~10월)에는 홍수와 태풍 경보를 수시로 확인한다.",
    health: "길거리 음식 이용 시 끓인 물과 위생 상태를 확인한다.",
    culture: "사원·사찰 방문 시 어깨와 무릎을 가리는 복장을 갖춘다.",
    emergencyContacts: "경찰 113 / 화재 114 / 구급 115",
    source: {
      name: "베트남국가관광청(VNAT) 여행자 안내",
      url: "https://vietnam.travel/",
      lastVerified: "2025-11-15",
      editor,
    },
  },
  {
    id: "safety-thailand",
    country: "태국",
    security:
      "관광지 인근 바가지 요금과 소액 사기가 흔해 사전 가격 협상이 필요하다.",
    scam: "보석 사기와 관광 상품 강매에 주의하고, 사원 앞 무료 가이드 자처 인물을 경계한다.",
    law: "왕실을 모독하는 언행은 형사 처벌 대상이며, 전자담배 소지도 불법이다.",
    traffic:
      "툭툭·오토바이 택시 이용 시 안전모 착용을 확인하고 사고 시 대응이 늦을 수 있다.",
    disaster:
      "우기(7~10월)에는 방콕 일부 지역이 침수될 수 있어 이동 경로를 확인한다.",
    health: "뎅기열 발생 지역이 있어 모기 기피제를 준비한다.",
    culture: "사원 방문 시 신발을 벗고 승려에게 신체 접촉을 피한다.",
    emergencyContacts: "관광경찰(영어) 1155 / 구급 1669 / 화재 199",
    source: {
      name: "태국관광청(TAT) 여행자 안전 안내",
      url: "https://www.tourismthailand.org/",
      lastVerified: "2025-11-20",
      editor,
    },
  },
  {
    id: "safety-france",
    country: "프랑스",
    security: "파리 지하철·관광지 소매치기가 잦아 소지품을 몸 앞쪽에 보관한다.",
    scam: "서명 청원 사기(가짜 서명판)와 팔찌 강매에 응하지 않는다.",
    law: "공공장소 음주는 일부 구역에서 제한되며, 대중교통 무임승차 단속이 엄격하다.",
    traffic:
      "파리 시내는 자전거·전동스쿠터 이용자가 많아 보행 시 주의가 필요하다.",
    disaster: "폭염 경보 발생 시 야외 활동을 자제하고 수분을 자주 섭취한다.",
    health:
      "여행자 보험 필수이며, 약국(Pharmacie) 초록 십자가 표시를 확인한다.",
    culture: "상점·식당 입장 시 인사를 건네는 것이 기본 예의다.",
    emergencyContacts: "통합 응급 112 / 경찰 17 / 구급 15",
    source: {
      name: "프랑스 외교부 여행자 안전 정보",
      url: "https://www.diplomatie.gouv.fr/",
      lastVerified: "2025-11-10",
      editor,
    },
  },
  {
    id: "safety-italy",
    country: "이탈리아",
    security:
      "로마·나폴리 등 관광지에서 소매치기와 오토바이 날치기가 빈번하다.",
    scam: "관광지 인근 레스토랑의 자릿세(coperto) 미고지 청구를 사전에 메뉴에서 확인한다.",
    law: "유적지 내 음식물 섭취나 분수대 물놀이는 벌금 대상이다.",
    traffic:
      "구시가지는 차량 제한구역(ZTL)이 많아 렌터카 이용 시 사전 확인이 필요하다.",
    disaster:
      "일부 지역은 지진 위험 지대이니 오래된 건물 숙박 시 대피로를 확인한다.",
    health: "여름철 폭염 시 오후 야외 관광을 피하고 물을 충분히 섭취한다.",
    culture: "성당 방문 시 노출이 심한 옷은 입장이 제한된다.",
    emergencyContacts: "통합 응급 112 / 관광경찰 1518",
    source: {
      name: "이탈리아 외교부 여행 정보",
      url: "https://www.viaggiaresicuri.it/",
      lastVerified: "2025-11-05",
      editor,
    },
  },
  {
    id: "safety-spain",
    country: "스페인",
    security:
      "바르셀로나·마드리드 도심에서 소매치기 신고가 많아 대중교통에서 소지품에 유의한다.",
    scam: "길거리 카드 게임(야바위)과 팔찌 강매는 응하지 않고 자리를 피한다.",
    law: "공공장소 음주 및 투우 관련 동물보호 규정을 준수한다.",
    traffic: "구시가지 좁은 골목은 차량과 보행자가 혼재되어 있어 주의한다.",
    disaster: "여름철 폭염과 산불 경보 시 야외 일정을 조정한다.",
    health: "낮 시간대 강한 자외선에 대비해 자외선 차단제를 준비한다.",
    culture:
      "식사 시간이 늦은 편(저녁 21시 이후)이라 미리 식당 영업시간을 확인한다.",
    emergencyContacts: "통합 응급 112",
    source: {
      name: "스페인 관광청 여행자 안전 정보",
      url: "https://www.spain.info/",
      lastVerified: "2025-10-28",
      editor,
    },
  },
  {
    id: "safety-germany",
    country: "독일",
    security: "대체로 안전하지만 대도시 중앙역 주변 소매치기에 유의한다.",
    scam: "가짜 자선단체 서명 요청이나 즉석 기부 강요에 응하지 않는다.",
    law: "나치 관련 상징물 착용·전시는 형사 처벌 대상이다.",
    traffic:
      "고속도로(아우토반) 일부 구간은 속도 무제한이라 렌터카 이용 시 각별히 주의한다.",
    disaster: "겨울철 폭설로 인한 철도 지연이 흔해 여유 있는 일정을 계획한다.",
    health:
      "약국(Apotheke) 붉은 A 표시를 확인하고, 처방전 없이 구매 가능한 약이 제한적이다.",
    culture: "일요일에는 대부분 상점이 휴무이므로 사전에 식료품을 준비한다.",
    emergencyContacts: "통합 응급 112 / 경찰 110",
    source: {
      name: "독일 외교부 여행자 안전 정보",
      url: "https://www.germany.travel/",
      lastVerified: "2025-10-20",
      editor,
    },
  },
  {
    id: "safety-uk",
    country: "영국",
    security: "런던 지하철·관광지 소매치기와 스마트폰 날치기에 주의한다.",
    scam: "가짜 티켓 판매(암표) 사기가 있어 공식 채널로만 티켓을 구매한다.",
    law: "공공장소 음주는 특정 구역에서 제한되며, 흡연 구역 표시를 확인한다.",
    traffic: "차량이 좌측 주행이라 횡단보도에서 양방향을 재차 확인한다.",
    disaster: "겨울철 폭풍으로 항공·철도 일정이 지연될 수 있다.",
    health:
      "긴급하지 않은 진료는 대기시간이 길 수 있어 여행자 보험 가입이 권장된다.",
    culture: "줄서기 문화가 엄격하니 새치기를 하지 않는다.",
    emergencyContacts: "통합 응급 999 / 비긴급 신고 101",
    source: {
      name: "영국 정부 여행자 안전 정보",
      url: "https://www.gov.uk/foreign-travel-advice",
      lastVerified: "2025-10-15",
      editor,
    },
  },
  {
    id: "safety-switzerland",
    country: "스위스",
    security:
      "치안이 매우 우수하나 관광 성수기 열차 내 소지품 도난에 주의한다.",
    scam: "산악 지역 사설 가이드 요금 분쟁이 있을 수 있어 공식 여행사만 이용한다.",
    law: "국립공원 내 캠핑·취사는 지정 구역 외 금지된다.",
    traffic: "산악 도로는 급커브가 많아 렌터카 이용 시 충분한 휴식을 취한다.",
    disaster: "여름철 산사태·낙석, 겨울철 눈사태 경보를 수시로 확인한다.",
    health: "고산 지역에서는 고도 적응을 위해 무리한 일정을 피한다.",
    culture: "대중교통·마을에서는 정숙한 분위기를 유지하는 것이 일반적이다.",
    emergencyContacts: "통합 응급 112 / 산악 구조 1414",
    source: {
      name: "스위스관광청 안전 정보",
      url: "https://www.myswitzerland.com/",
      lastVerified: "2025-10-10",
      editor,
    },
  },
  {
    id: "safety-austria",
    country: "오스트리아",
    security: "빈 도심은 안전한 편이나 관광지 소매치기는 여전히 발생한다.",
    scam: "길거리 오페라 티켓 판매원의 고가 판매에 주의하고 공식 매표소를 이용한다.",
    law: "대중교통 무임승차 단속이 상시 진행되며 벌금이 높다.",
    traffic: "트램 승하차 시 반대 차선 차량에 주의한다.",
    disaster: "겨울철 산악 지역 폭설로 도로가 통제될 수 있다.",
    health: "약국은 저녁·주말 운영시간이 제한적이니 사전 확인한다.",
    culture: "공연장 관람 시 정숙한 복장과 태도를 갖춘다.",
    emergencyContacts: "통합 응급 112 / 경찰 133",
    source: {
      name: "오스트리아관광청 안전 정보",
      url: "https://www.austria.info/",
      lastVerified: "2025-10-05",
      editor,
    },
  },
  {
    id: "safety-usa",
    country: "미국",
    security:
      "도시별로 치안 수준 차이가 크므로 야간에는 번화가 중심으로 이동한다.",
    scam: "가짜 경찰·공무원 사칭 전화 사기와 렌터카 보험 강매에 주의한다.",
    law: "주(state)마다 법규가 달라 음주 가능 연령, 총기 관련 규정을 사전에 확인한다.",
    traffic:
      "우측 주행이며 대도시 외 지역은 대중교통이 제한적이라 렌터카가 필요하다.",
    disaster:
      "지역에 따라 허리케인·토네이도·지진 경보가 다르니 여행 지역별로 확인한다.",
    health: "의료비가 매우 높아 여행자 보험 가입이 필수적이다.",
    culture: "레스토랑 이용 시 15~20% 팁 지불이 일반적이다.",
    emergencyContacts: "통합 응급 911",
    source: {
      name: "미국 국무부 여행자 안전 정보",
      url: "https://travel.state.gov/",
      lastVerified: "2025-09-30",
      editor,
    },
  },
  {
    id: "safety-canada",
    country: "캐나다",
    security: "대도시는 전반적으로 안전하나 야간 일부 지역은 우회를 권장한다.",
    scam: "온라인 숙소 예약 사기가 있어 공식 플랫폼으로만 결제한다.",
    law: "주류 구매·음주 가능 연령이 주(province)별로 다르다.",
    traffic:
      "겨울철 도로 결빙이 흔해 렌터카 이용 시 스노타이어 장착 여부를 확인한다.",
    disaster: "산악·숲 지역에서는 산불 경보와 곰 출현 안내를 확인한다.",
    health: "비거주자는 의료비가 전액 자비 부담이라 여행자 보험이 필수다.",
    culture: "야외 활동 시 자연보호 구역 규정을 준수한다.",
    emergencyContacts: "통합 응급 911",
    source: {
      name: "캐나다 정부 여행자 안전 정보",
      url: "https://travel.gc.ca/",
      lastVerified: "2025-09-25",
      editor,
    },
  },
  {
    id: "safety-australia",
    country: "호주",
    security: "치안이 우수하나 해변에서는 소지품 무인 방치를 피한다.",
    scam: "가짜 투어 예약 사이트를 통한 결제 사기에 주의한다.",
    law: "해변별로 음주 금지 구역이 있으니 표지판을 확인한다.",
    traffic:
      "좌측 주행이며 장거리 렌터카 이용 시 로드트레인(대형 화물차) 추월에 주의한다.",
    disaster: "여름철 산불과 상어 출현 경보를 수시로 확인한다.",
    health:
      "강한 자외선으로 인한 피부 화상에 대비해 자외선 차단제를 자주 덧바른다.",
    culture: "해변 안전요원 깃발(레드앤옐로우) 구역 안에서만 수영한다.",
    emergencyContacts: "통합 응급 000",
    source: {
      name: "호주 정부 여행자 안전 정보",
      url: "https://www.smartraveller.gov.au/",
      lastVerified: "2025-09-20",
      editor,
    },
  },
  {
    id: "safety-newzealand",
    country: "뉴질랜드",
    security: "치안이 매우 우수하나 렌터카 차량털이 사고가 종종 발생한다.",
    scam: "액티비티 예약 사이트 중 비공식 대행사의 환불 거부 사례가 있다.",
    law: "국립공원 내 생물 반입 규정이 엄격해 신발·장비 세척이 요구된다.",
    traffic: "좌측 주행이며 산악 도로는 좁고 급커브가 많아 서행이 필요하다.",
    disaster: "지진·화산 활동 지역이 있어 대피 안내를 확인한다.",
    health: "야외 활동 중 저체온증 예방을 위해 방수 방한 장비를 준비한다.",
    culture: "마오리 전통 문화 공간 방문 시 안내자의 설명과 규칙을 따른다.",
    emergencyContacts: "통합 응급 111",
    source: {
      name: "뉴질랜드관광청 안전 정보",
      url: "https://www.newzealand.com/",
      lastVerified: "2025-09-15",
      editor,
    },
  },
  {
    id: "safety-turkiye",
    country: "튀르키예",
    security: "이스탄불 관광지 소매치기와 불법 환전상 접근에 주의한다.",
    scam: "구두닦이의 동전 떨어뜨리기 수법이나 과도한 환전 수수료에 유의한다.",
    law: "이슬람 사원 방문 시 복장 규정을 준수해야 하며 위반 시 입장이 제한된다.",
    traffic: "대도시 교통 혼잡이 심해 대중교통(트램·페리) 이용을 권장한다.",
    disaster: "지진 발생 빈도가 높은 지역이 있어 숙소 대피로를 확인한다.",
    health: "수돗물 대신 병에 든 생수를 마시는 것이 안전하다.",
    culture: "모스크 방문 시 여성은 스카프로 머리를 가리고 신발을 벗는다.",
    emergencyContacts: "통합 응급 112",
    source: {
      name: "튀르키예관광청 안전 정보",
      url: "https://www.goturkiye.com/",
      lastVerified: "2025-09-10",
      editor,
    },
  },
  {
    id: "safety-uae",
    country: "아랍에미리트",
    security:
      "치안이 매우 우수하나 외국인 밀집 지역 소지품 관리는 기본을 지킨다.",
    scam: "비공식 투어 판매업체의 과대 광고성 상품에 주의한다.",
    law: "공공장소 음주, 과도한 신체 노출, 라마단 기간 낮 시간 취식은 법적 제재 대상이다.",
    traffic: "고속도로 속도 단속이 엄격하며 과속 벌금이 매우 높다.",
    disaster: "여름철 폭염(45도 이상) 시 낮 시간 외부 활동을 최소화한다.",
    health: "실외 활동은 이른 아침이나 저녁 시간에 계획하는 것이 안전하다.",
    culture: "사진 촬영 시 현지인, 특히 여성을 동의 없이 촬영하지 않는다.",
    emergencyContacts: "경찰 999 / 구급 998 / 화재 997",
    source: {
      name: "두바이관광청 안전 정보",
      url: "https://www.visitdubai.com/",
      lastVerified: "2025-09-05",
      editor,
    },
  },
  {
    id: "safety-egypt",
    country: "이집트",
    security: "유적지 인근 강매와 호객이 심해 명확한 거부 표현이 필요하다.",
    scam: "가짜 가이드가 입장료 대납을 요구하거나 사진 촬영 후 팁을 강요하는 경우가 있다.",
    law: "고고학 유적 반출은 국제적으로 엄격히 처벌되며, 드론 촬영은 사전 허가가 필요하다.",
    traffic: "차량 운행이 무질서한 편이라 도보 이동 시 각별히 주의한다.",
    disaster: "사막 지역은 낮과 밤의 기온차가 크므로 체온 관리에 유의한다.",
    health: "생수만 마시고 길거리 음식은 위생 상태를 확인한 뒤 섭취한다.",
    culture: "유적지·사원 방문 시 지정 가이드나 안내판의 지시를 따른다.",
    emergencyContacts: "관광경찰 126 / 구급 123",
    source: {
      name: "이집트관광청 안전 정보",
      url: "https://www.egypt.travel/",
      lastVerified: "2025-08-28",
      editor,
    },
  },
  {
    id: "safety-portugal",
    country: "포르투갈",
    security:
      "리스본 트램·관광지 소매치기가 발생하며 특히 28번 트램에서 주의한다.",
    scam: "길거리 마약 판매 접근을 단호히 거절하고 자리를 피한다.",
    law: "해변 지정 흡연 구역 외 흡연은 벌금 대상이다.",
    traffic: "언덕 지형이 많아 도보 이동 시 미끄러운 돌바닥에 주의한다.",
    disaster: "여름철 산불 경보가 발생할 수 있어 근교 이동 시 확인한다.",
    health: "여름철 강한 햇볕에 대비해 수분 보충을 자주 한다.",
    culture:
      "식당에서 제공되는 기본 빵·올리브는 유료인 경우가 많아 주문 전 확인한다.",
    emergencyContacts: "통합 응급 112",
    source: {
      name: "포르투갈관광청 안전 정보",
      url: "https://www.visitportugal.com/",
      lastVerified: "2025-08-20",
      editor,
    },
  },
  {
    id: "safety-greece",
    country: "그리스",
    security: "섬 지역은 안전한 편이나 아테네 시내 소매치기에 주의한다.",
    scam: "페리 티켓 재판매 사기가 있어 공식 선사 홈페이지에서 예매한다.",
    law: "고대 유적 훼손·낙서는 강력히 처벌된다.",
    traffic:
      "섬 간 이동은 페리 일정이 기상에 따라 변경될 수 있어 여유 시간을 둔다.",
    disaster: "여름철 산불이 자주 발생해 관련 뉴스를 수시로 확인한다.",
    health: "여름철 폭염 시 낮 시간 야외 유적 관람을 피한다.",
    culture: "교회·수도원 방문 시 어깨와 무릎을 가리는 복장이 필요하다.",
    emergencyContacts: "통합 응급 112 / 관광경찰 171",
    source: {
      name: "그리스관광청 안전 정보",
      url: "https://www.visitgreece.gr/",
      lastVerified: "2025-08-15",
      editor,
    },
  },
  {
    id: "safety-czech",
    country: "체코",
    security: "프라하 구시가지는 관광객을 노린 소매치기와 환전 사기가 흔하다.",
    scam: "거리 환전소의 불리한 환율 대신 은행이나 ATM 이용을 권장한다.",
    law: "대중교통 무임승차 단속이 상시 이루어지며 현장 벌금이 부과된다.",
    traffic: "자갈길이 많아 미끄러짐에 주의하고 트램 진입로를 확인한다.",
    disaster: "봄철 강 유역 저지대에서 홍수 경보가 발생할 수 있다.",
    health:
      "야간 유흥가에서는 음료에 이물질 투입 사례가 있어 잔을 방치하지 않는다.",
    culture: "레스토랑 착석 후 종업원 안내를 기다리는 것이 일반적이다.",
    emergencyContacts: "통합 응급 112",
    source: {
      name: "체코관광청 안전 정보",
      url: "https://www.czechtourism.com/",
      lastVerified: "2025-08-10",
      editor,
    },
  },
  {
    id: "safety-netherlands",
    country: "네덜란드",
    security: "암스테르담 중앙역·홍등가 주변 소지품 도난에 주의한다.",
    scam: "자전거 대여 시 파손 책임을 과도하게 요구하는 업체가 있어 계약서를 확인한다.",
    law: "대마 판매점(커피숍) 외 장소에서의 사용은 불법이다.",
    traffic: "자전거 통행량이 많아 보행자는 자전거 전용도로를 침범하지 않는다.",
    disaster: "해수면보다 낮은 지역이 많아 기상 특보 발생 시 이동을 자제한다.",
    health: "자전거 이용 시 헬멧 착용이 의무는 아니지만 착용을 권장한다.",
    culture: "약속 시간과 계산은 정확하게 나누는 문화(더치페이)가 일반적이다.",
    emergencyContacts: "통합 응급 112",
    source: {
      name: "네덜란드관광청 안전 정보",
      url: "https://www.holland.com/",
      lastVerified: "2025-08-05",
      editor,
    },
  },
  {
    id: "safety-singapore",
    country: "싱가포르",
    security: "치안이 매우 우수하지만 법규 위반에 대한 처벌이 강력하다.",
    scam: "온라인 중고거래 사기 신고가 늘고 있어 직거래 시 안전한 장소를 이용한다.",
    law: "껌 반입·판매, 대중교통 내 음식물 섭취, 무단횡단은 벌금 대상이다.",
    traffic: "대중교통이 매우 편리해 렌터카보다 지하철(MRT) 이용을 권장한다.",
    disaster: "우기(11~1월)에는 갑작스런 폭우로 도로가 일시 침수될 수 있다.",
    health: "무더운 날씨로 인한 탈수에 대비해 수분을 자주 섭취한다.",
    culture: "다민족 국가로 종교시설 방문 시 각 종교의 복장 규정을 따른다.",
    emergencyContacts: "경찰 999 / 구급·화재 995",
    source: {
      name: "싱가포르관광청 안전 정보",
      url: "https://www.visitsingapore.com/",
      lastVerified: "2025-07-30",
      editor,
    },
  },
  {
    id: "safety-malaysia",
    country: "말레이시아",
    security: "쿠알라룸푸르 야시장·대중교통에서 소매치기에 주의한다.",
    scam: "가짜 여행사 패키지 결제 사기가 있어 공식 등록 업체인지 확인한다.",
    law: "마약 관련 범죄는 사형을 포함한 매우 강력한 처벌 대상이다.",
    traffic: "좌측 주행이며 오토바이가 많아 차선 변경 시 각별히 주의한다.",
    disaster: "우기에는 일부 저지대에서 홍수 경보가 발생할 수 있다.",
    health: "열대 지역 특성상 모기 매개 감염병 예방을 위해 기피제를 사용한다.",
    culture: "모스크·힌두 사원 방문 시 신발을 벗고 복장 규정을 확인한다.",
    emergencyContacts: "통합 응급 999",
    source: {
      name: "말레이시아관광청 안전 정보",
      url: "https://www.tourism.gov.my/",
      lastVerified: "2025-07-25",
      editor,
    },
  },
  {
    id: "safety-philippines",
    country: "필리핀",
    security:
      "마닐라 등 대도시는 야간 치안이 취약한 구역이 있어 숙소 주변 정보를 사전에 확인한다.",
    scam: "택시 미터기 조작이나 관광 상품 과대 청구에 주의하고 사전 요금을 확인한다.",
    law: "마약 관련 범죄에 대한 처벌이 매우 강력하다.",
    traffic:
      "지프니·트라이시클 등 현지 교통수단은 안전벨트가 없는 경우가 많아 주의한다.",
    disaster:
      "태풍 경로에 위치해 우기(6~11월)에는 기상 특보를 수시로 확인한다.",
    health: "생수 이용을 권장하며 뎅기열 예방을 위해 모기 기피제를 준비한다.",
    culture:
      "고래상어 투어 등 해양 액티비티는 보호 규정을 준수하는 업체를 선택한다.",
    emergencyContacts: "통합 응급 911",
    source: {
      name: "필리핀관광청(DOT) 안전 정보",
      url: "https://www.tourism.gov.ph/",
      lastVerified: "2025-07-20",
      editor,
    },
  },
  {
    id: "safety-indonesia",
    country: "인도네시아",
    security: "발리 관광지에서 오토바이 날치기와 소매치기가 발생할 수 있다.",
    scam: "환전상의 눈속임 계산이나 렌터 오토바이의 과도한 파손 배상 요구에 주의한다.",
    law: "마약 소지에 대한 처벌이 매우 강력하며 일부는 사형까지 가능하다.",
    traffic: "오토바이 대여 시 국제운전면허증이 필요하며 헬멧 착용이 의무다.",
    disaster: "화산·지진 활동이 활발한 지역이라 여행 전 경보 수준을 확인한다.",
    health: "여행자 설사 예방을 위해 생수와 익힌 음식을 우선 섭취한다.",
    culture: "사원 방문 시 전통 천(사룽)을 허리에 두르는 복장 규정을 따른다.",
    emergencyContacts: "통합 응급 112 / 경찰 110",
    source: {
      name: "인도네시아관광청 안전 정보",
      url: "https://www.indonesia.travel/",
      lastVerified: "2025-07-15",
      editor,
    },
  },
  {
    id: "safety-china",
    country: "중국",
    security: "대도시 치안은 양호하나 관광지 주변 소매치기와 사기에 주의한다.",
    scam: "예술품·차 판매 사기(찻집 사기)가 있어 과도한 호의를 베푸는 낯선 사람을 경계한다.",
    law: "일부 해외 인터넷 서비스 접속이 제한되며, VPN 사용에 관한 규정이 수시로 변경된다.",
    traffic:
      "대도시는 대중교통이 편리하나 실명 등록 교통카드가 필요한 경우가 있다.",
    disaster: "일부 지역은 지진·홍수 위험이 있어 지역별 기상 정보를 확인한다.",
    health: "수돗물 대신 끓인 물이나 병에 든 생수를 마신다.",
    culture: "공공장소에서 정치적으로 민감한 발언이나 촬영은 자제한다.",
    emergencyContacts: "경찰 110 / 구급 120 / 화재 119",
    source: {
      name: "중국국가여유국 안전 정보",
      url: "http://www.cnta.gov.cn/",
      lastVerified: "2025-07-10",
      editor,
    },
  },
  {
    id: "safety-taiwan",
    country: "대만",
    security:
      "치안이 매우 우수하며 야시장에서도 비교적 안전하게 이동할 수 있다.",
    scam: "온라인 숙소 예약 사기가 드물게 있어 공식 플랫폼을 이용한다.",
    law: "오토바이 2인 탑승 시 반드시 헬멧을 착용해야 한다.",
    traffic: "스쿠터 통행량이 많아 보행 시 골목에서도 좌우를 확인한다.",
    disaster: "태풍과 지진이 잦은 지역으로 기상 특보를 수시로 확인한다.",
    health:
      "야시장 음식은 위생적으로 관리되는 편이나 해산물은 신선도를 확인한다.",
    culture: "사찰 방문 시 향을 피우는 방향과 순서에 대한 안내를 따른다.",
    emergencyContacts: "경찰 110 / 구급·화재 119",
    source: {
      name: "대만관광청 안전 정보",
      url: "https://www.taiwan.net.tw/",
      lastVerified: "2025-07-05",
      editor,
    },
  },
  {
    id: "safety-hongkong",
    country: "홍콩",
    security: "치안이 우수하나 관광 성수기 시장 지역 소매치기에 주의한다.",
    scam: "전자제품 상점의 모델 바꿔치기 사기가 있어 영수증과 제품을 즉시 확인한다.",
    law: "대중교통 내 음식물 섭취는 금지되며 무단횡단 벌금이 있다.",
    traffic: "차량이 좌측 주행이며 트램·지하철 등 대중교통이 매우 편리하다.",
    disaster:
      "여름철 태풍 시즌에는 태풍 신호 등급에 따라 운영이 중단될 수 있다.",
    health: "습하고 무더운 날씨로 인한 열탈진에 유의해 수분을 자주 섭취한다.",
    culture: "지하철·트램에서는 줄서기 문화를 지키고 새치기를 하지 않는다.",
    emergencyContacts: "통합 응급 999",
    source: {
      name: "홍콩관광청 안전 정보",
      url: "https://www.discoverhongkong.com/",
      lastVerified: "2025-06-30",
      editor,
    },
  },
  {
    id: "safety-mexico",
    country: "멕시코",
    security:
      "칸쿤 등 관광지구는 비교적 안전하나 심야 이동은 지정 교통편을 이용한다.",
    scam: "환전상의 눈속임 계산과 미터기 없는 택시의 과도한 요금 청구에 주의한다.",
    law: "일부 주에서는 공공장소 음주가 제한되니 지역 규정을 확인한다.",
    traffic: "렌터카 이용 시 야간 장거리 운전을 피하고 공식 주차장을 이용한다.",
    disaster: "허리케인 시즌(6~11월)에는 기상 특보를 수시로 확인한다.",
    health:
      "생수 이용을 권장하며 세노테 등 자연 수영 구역은 화학 성분 없는 자외선 차단제만 허용된다.",
    culture: "현지인과 협상 시 정중한 태도를 유지하는 것이 일반적이다.",
    emergencyContacts: "통합 응급 911",
    source: {
      name: "멕시코관광청 안전 정보",
      url: "https://www.visitmexico.com/",
      lastVerified: "2025-06-25",
      editor,
    },
  },
];
