/**
 * free_traveler 대표 소개 정적 데이터 (SCR-002).
 * Supabase Table을 만들지 않고 이 정적 객체만으로 대표 소개 화면을 구성한다(CLAUDE.md 규칙 16).
 */

export interface RepresentativeStat {
  label: string;
  value: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface VisitedCountry {
  country: string;
  region: string;
}

export interface GalleryPhoto {
  url: string;
  alt: string;
}

export interface MemorableDestination {
  country: string;
  city: string;
  memory: string;
  image: GalleryPhoto;
}

export interface RepresentativeProfile {
  name: string;
  tagline: string;
  heroPhoto: GalleryPhoto;
  stats: RepresentativeStat[];
  introduction: string;
  philosophy: string;
  timeline: TimelineEntry[];
  visitedCountries: VisitedCountry[];
  gallery: GalleryPhoto[];
  memorableDestinations: MemorableDestination[];
}

export const representative: RepresentativeProfile = {
  name: "free_traveler",
  tagline: "50번의 떠남과 30개국의 기록으로, 다음 여행의 지도를 함께 그립니다.",
  heroPhoto: {
    url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
    alt: "배낭을 메고 산길 전망대에서 먼 산맥을 바라보는 free_traveler의 뒷모습",
  },
  stats: [
    { label: "누적 여행 횟수", value: "53회" },
    { label: "방문 국가 수", value: "31개국" },
  ],
  introduction:
    "10년 동안 주말과 연휴, 휴직 기간을 모두 여행에 쏟아부으며 50회 넘게 국내외를 오갔습니다. 처음에는 유명한 명소를 확인하는 여행이었지만, 점차 현지인의 하루를 관찰하고 그 나라의 안전 정보와 생활 물가를 꼼꼼히 기록하는 방식으로 바뀌었습니다. free_traveler는 그렇게 쌓인 경험을 무료로 나누기 위해 만든 이름입니다.",
  philosophy:
    "좋은 여행은 화려한 사진 한 장보다 '무엇을 조심해야 하는지, 무엇을 놓치면 아쉬운지'를 미리 아는 데서 시작한다고 믿습니다. 그래서 이 서비스는 예약이나 결제를 대신하지 않고, 실제로 걸어본 사람만이 줄 수 있는 안전 정보와 동선 조언에만 집중합니다.",
  timeline: [
    {
      year: "2015",
      title: "첫 해외 배낭여행",
      description:
        "일본 오사카·교토를 2주간 혼자 돌아보며 여행 기록을 남기기 시작했습니다.",
    },
    {
      year: "2016",
      title: "동남아시아 6개국 종주",
      description:
        "태국에서 출발해 베트남까지 육로로 이동하며 국경 통과와 현지 안전 수칙을 정리했습니다.",
    },
    {
      year: "2018",
      title: "유럽 3개월 장기 여행",
      description:
        "서유럽과 남유럽 12개 도시를 기차로 이동하며 도시별 소매치기 주의 구역을 직접 조사했습니다.",
    },
    {
      year: "2019",
      title: "여행 정보 블로그 개설",
      description:
        "그동안의 기록을 정리해 개인 블로그에 국가별 안전정보와 여행 동기 테마를 연재했습니다.",
    },
    {
      year: "2021",
      title: "국내 여행지 재발견 프로젝트",
      description:
        "이동이 어려운 시기에 국내 소도시 10여 곳을 다시 찾아 로컬 맛집과 도보 코스를 재정리했습니다.",
    },
    {
      year: "2023",
      title: "중남미·아프리카 첫 도전",
      description:
        "멕시코와 이집트를 방문하며 치안이 까다로운 지역의 실전 대응법을 기록에 추가했습니다.",
    },
    {
      year: "2024",
      title: "누적 방문 30개국 달성",
      description:
        "뉴질랜드 퀸스타운 여행을 끝으로 누적 방문국이 30개국을 넘어섰습니다.",
    },
    {
      year: "2026",
      title: "free_traveler 서비스 오픈",
      description:
        "10년간의 기록을 바탕으로 누구나 무료로 볼 수 있는 여행 정보 서비스를 시작했습니다.",
    },
  ],
  visitedCountries: [
    { country: "대한민국", region: "동아시아" },
    { country: "일본", region: "동아시아" },
    { country: "중국", region: "동아시아" },
    { country: "대만", region: "동아시아" },
    { country: "홍콩", region: "동아시아" },
    { country: "베트남", region: "동남아시아" },
    { country: "태국", region: "동남아시아" },
    { country: "싱가포르", region: "동남아시아" },
    { country: "말레이시아", region: "동남아시아" },
    { country: "필리핀", region: "동남아시아" },
    { country: "인도네시아", region: "동남아시아" },
    { country: "캄보디아", region: "동남아시아" },
    { country: "프랑스", region: "서유럽" },
    { country: "영국", region: "서유럽" },
    { country: "네덜란드", region: "서유럽" },
    { country: "이탈리아", region: "남유럽" },
    { country: "스페인", region: "남유럽" },
    { country: "포르투갈", region: "남유럽" },
    { country: "그리스", region: "남유럽" },
    { country: "독일", region: "중앙유럽" },
    { country: "스위스", region: "중앙유럽" },
    { country: "오스트리아", region: "중앙유럽" },
    { country: "체코", region: "중앙유럽" },
    { country: "튀르키예", region: "서아시아" },
    { country: "아랍에미리트", region: "서아시아" },
    { country: "이집트", region: "북아프리카" },
    { country: "미국", region: "북아메리카" },
    { country: "캐나다", region: "북아메리카" },
    { country: "멕시코", region: "중앙아메리카" },
    { country: "호주", region: "오세아니아" },
    { country: "뉴질랜드", region: "오세아니아" },
  ],
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1499591934245-40b55745b905?auto=format&fit=crop&w=1200&q=80",
      alt: "런던 타워브릿지 앞에서 촬영한 여행 사진",
    },
    {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      alt: "파리 에펠탑 아래에서 촬영한 야경 사진",
    },
    {
      url: "https://images.unsplash.com/photo-1541638832-427e096e4e5d?auto=format&fit=crop&w=1200&q=80",
      alt: "제주 성산일출봉 정상에서 바라본 일출 장면",
    },
    {
      url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
      alt: "방콕 왕궁 사원 앞에서 촬영한 전경",
    },
    {
      url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80",
      alt: "다낭 미케비치의 백사장과 야자수",
    },
    {
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      alt: "산토리니 이아마을의 하얀 건물과 파란 지붕",
    },
    {
      url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
      alt: "뉴욕 타임스퀘어의 화려한 전광판 야경",
    },
    {
      url: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80",
      alt: "뉴질랜드 퀸스타운 와카티푸호수와 산맥",
    },
    {
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      alt: "두바이 부르즈할리파 전망대에서 내려다본 도심",
    },
  ],
  memorableDestinations: [
    {
      country: "그리스",
      city: "산토리니",
      memory:
        "이아마을에서 본 일몰이 지금까지도 가장 선명하게 남아 있는 장면이며, 여행 기록을 본격적으로 시작하게 된 계기가 되었습니다.",
      image: {
        url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80",
        alt: "산토리니 이아마을에서 바라본 에게해 일몰",
      },
    },
    {
      country: "뉴질랜드",
      city: "퀸스타운",
      memory:
        "번지점프에 처음 도전했던 곳으로, 여행이 익숙한 안전지대를 벗어나는 경험이라는 것을 깨닫게 해준 여행지입니다.",
      image: {
        url: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=900&q=80",
        alt: "산맥을 배경으로 한 뉴질랜드 퀸스타운 와카티푸호수",
      },
    },
    {
      country: "베트남",
      city: "호이안",
      memory:
        "보름 등불 축제가 열리던 날 우연히 방문해, 강 위를 떠다니는 등불을 보며 여행지에서의 우연이 가장 큰 선물임을 배웠습니다.",
      image: {
        url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80",
        alt: "노란 등불이 켜진 호이안 구시가지 강변 야경",
      },
    },
    {
      country: "이집트",
      city: "카이로",
      memory:
        "기자 피라미드 앞에 처음 섰을 때의 압도감은 지금도 가장 강렬한 여행 경험으로 남아 있으며, 안전정보의 중요성을 절실히 느낀 곳이기도 합니다.",
      image: {
        url: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=80",
        alt: "사막 위에 우뚝 선 기자의 피라미드와 스핑크스",
      },
    },
  ],
};
