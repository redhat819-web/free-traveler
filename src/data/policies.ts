/**
 * 정책 페이지 정적 데이터(이용약관/개인정보처리방침/동행 안전수칙/콘텐츠 면책 안내).
 * 정책 버전은 CMP-SCR003-MATE-COMPOSE의 안전수칙 동의 시각과 함께 기록되는 기준값이다.
 */

export interface PolicySection {
  heading: string;
  body: string[];
}

export interface Policy {
  id: "terms" | "privacy" | "safety" | "disclaimer";
  title: string;
  version: string;
  effectiveDate: string;
  sections: PolicySection[];
}

export const policies: Policy[] = [
  {
    id: "terms",
    title: "이용약관",
    version: "1.0.0",
    effectiveDate: "2026-09-01",
    sections: [
      {
        heading: "서비스 목적",
        body: [
          "free_traveler는 여행지·안전 정보를 무료로 제공하고, 동행을 찾을 수 있도록 돕는 정보 제공 서비스입니다.",
          "항공권·숙소 예약이나 결제를 대행하지 않으며, 외부 사이트로 안내만 합니다.",
        ],
      },
      {
        heading: "이용자의 의무",
        body: [
          "허위 정보를 등록하거나 다른 이용자에게 피해를 주는 행위를 하지 않습니다.",
          "동행 모집글과 참가 요청 메시지에 공개 연락처를 포함하지 않습니다.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "개인정보 처리방침",
    version: "1.0.0",
    effectiveDate: "2026-09-01",
    sections: [
      {
        heading: "수집 항목",
        body: [
          "이메일, 닉네임, 연령대, 여행 스타일, 성별(선택), 성인 확인 여부·시각을 수집합니다.",
          "정확한 생년월일이나 실명은 저장하지 않습니다.",
        ],
      },
      {
        heading: "보관 및 파기",
        body: [
          "탈퇴 시 계정 정보는 즉시 비식별화 처리합니다.",
          "법령에 따라 보관이 필요한 정보를 제외하고는 지체 없이 삭제합니다.",
        ],
      },
    ],
  },
  {
    id: "safety",
    title: "동행 안전수칙",
    version: "1.0.0",
    effectiveDate: "2026-09-01",
    sections: [
      {
        heading: "연락처 공유",
        body: [
          "연락처는 참가 요청이 승인된 이후에만 별도 채널로 직접 나눠주세요.",
          "모집글이나 참가 요청 메시지에 전화번호·이메일·메신저 ID를 남기지 마세요.",
        ],
      },
      {
        heading: "안전 수칙",
        body: [
          "첫 만남은 공개된 장소에서 갖는 것을 권장합니다.",
          "불편하거나 의심스러운 상대는 즉시 신고하거나 차단하세요.",
        ],
      },
    ],
  },
  {
    id: "disclaimer",
    title: "콘텐츠 면책 고지",
    version: "1.0.0",
    effectiveDate: "2026-09-01",
    sections: [
      {
        heading: "여행지·안전 정보",
        body: [
          "여행지·안전 정보는 작성 시점 기준이며, 실제 현지 상황과 다를 수 있습니다.",
          "최신 정보는 반드시 외교부 등 공식 출처를 통해 다시 확인하세요.",
        ],
      },
      {
        heading: "동행 모집글",
        body: [
          "동행 모집글의 내용은 작성자 개인의 게시물이며, free_traveler가 사실관계를 보증하지 않습니다.",
        ],
      },
    ],
  },
];
