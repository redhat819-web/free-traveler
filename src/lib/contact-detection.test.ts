import { describe, expect, it } from "vitest";
import { containsContactInfo } from "./contact-detection";

const POSITIVE_SAMPLES = [
  // 휴대폰 번호
  "연락은 010-1234-5678 로 주세요",
  "01012345678",
  "010.1234.5678",
  "011 234 5678",
  // 이메일
  "메일 주세요 traveler@example.com",
  "contact.me+trip@sub.domain.co.kr",
  // 카카오톡
  "카톡 아이디: happy_trip",
  "카카오톡 ID happytrip123",
  "kakaotalk id: trip.mate",
  // 인스타그램
  "인스타 아이디 @trip_mate",
  "instagram id trip_mate_2024",
  "인스타: mate.trip",
  // 라인
  "라인 아이디 line_trip",
  "line id: trip123",
];

const NEGATIVE_SAMPLES = [
  "제주도 3박 4일 같이 가실 분 구합니다.",
  "예산은 1인당 50만원 정도로 생각하고 있어요.",
  "사진 찍는 걸 좋아하는 동행을 찾습니다.",
  "아침 일찍 출발해서 저녁에 숙소로 돌아올 예정입니다.",
  "맛집 위주로 다닐 계획이라 식비 비중이 높습니다.",
  "성별 무관하며 20대~30대 선호합니다.",
  "숙소는 게스트하우스로 예약할 예정입니다.",
  "배낭여행 경험 있으신 분이면 더 좋아요.",
  "일정은 유동적으로 조율 가능합니다.",
  "궁금한 점은 참가 요청 메시지로 남겨주세요.",
];

describe("containsContactInfo", () => {
  it.each(POSITIVE_SAMPLES)("공개 연락처로 탐지한다: %s", (sample) => {
    expect(containsContactInfo(sample)).toBe(true);
  });

  it.each(NEGATIVE_SAMPLES)("일반 문장은 오탐하지 않는다: %s", (sample) => {
    expect(containsContactInfo(sample)).toBe(false);
  });

  it("탐지율 95% 이상, 오탐률 5% 이하를 만족한다", () => {
    const detectedCount = POSITIVE_SAMPLES.filter(containsContactInfo).length;
    const falsePositiveCount =
      NEGATIVE_SAMPLES.filter(containsContactInfo).length;

    const detectionRate = detectedCount / POSITIVE_SAMPLES.length;
    const falsePositiveRate = falsePositiveCount / NEGATIVE_SAMPLES.length;

    expect(detectionRate).toBeGreaterThanOrEqual(0.95);
    expect(falsePositiveRate).toBeLessThanOrEqual(0.05);
  });
});
