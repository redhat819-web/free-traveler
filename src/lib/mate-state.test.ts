import { describe, expect, it } from "vitest";
import {
  canTransitionApplication,
  effectiveMateStatus,
  hasActiveApplication,
  isMateClosed,
} from "./mate-state";

const TODAY = "2026-09-19";

// effectiveMateStatus: 현재 어떤 실제 코드 경로에서도 호출되지 않는다(테스트 전용).
// 이 테스트의 통과가 앱 동작을 보증하지 않는다. TASKS/TASK-REFACTOR-UNUSED-LIB-FUNCTIONS.md 참조.
describe("isMateClosed / effectiveMateStatus", () => {
  it("status가 closed면 종료일과 무관하게 마감으로 계산한다(수동 마감)", () => {
    expect(isMateClosed({ status: "closed", end_date: "2026-12-31" }, TODAY)).toBe(true);
    expect(effectiveMateStatus({ status: "closed", end_date: "2026-12-31" }, TODAY)).toBe(
      "closed",
    );
  });

  it("종료일이 조회 시점보다 지났으면 status가 open이어도 마감으로 계산한다", () => {
    expect(isMateClosed({ status: "open", end_date: "2026-09-18" }, TODAY)).toBe(true);
  });

  it("종료일이 조회 당일이면 아직 모집중으로 계산한다(경계값)", () => {
    expect(isMateClosed({ status: "open", end_date: TODAY }, TODAY)).toBe(false);
  });

  it("종료일이 미래이고 status가 open이면 모집중으로 계산한다", () => {
    expect(effectiveMateStatus({ status: "open", end_date: "2026-09-20" }, TODAY)).toBe("open");
  });
});

describe("hasActiveApplication", () => {
  const applications = [
    { requester_id: "user-a", status: "pending" as const },
    { requester_id: "user-b", status: "rejected" as const },
    { requester_id: "user-c", status: "accepted" as const },
  ];

  it("PENDING 요청이 있으면 중복으로 판단한다", () => {
    expect(hasActiveApplication(applications, "user-a")).toBe(true);
  });

  it("ACCEPTED 요청이 있으면 중복으로 판단한다", () => {
    expect(hasActiveApplication(applications, "user-c")).toBe(true);
  });

  it("REJECTED만 있으면 재신청을 허용한다(중복 아님)", () => {
    expect(hasActiveApplication(applications, "user-b")).toBe(false);
  });

  it("요청 이력이 없으면 신청을 허용한다", () => {
    expect(hasActiveApplication(applications, "user-d")).toBe(false);
  });
});

describe("canTransitionApplication", () => {
  it("PENDING → ACCEPTED 전이를 허용한다(승인)", () => {
    expect(canTransitionApplication("pending", "accepted")).toBe(true);
  });

  it("PENDING → REJECTED 전이를 허용한다(거절)", () => {
    expect(canTransitionApplication("pending", "rejected")).toBe(true);
  });

  it("이미 ACCEPTED인 요청은 다시 전이할 수 없다", () => {
    expect(canTransitionApplication("accepted", "rejected")).toBe(false);
    expect(canTransitionApplication("accepted", "pending")).toBe(false);
  });

  it("이미 REJECTED인 요청은 다시 전이할 수 없다", () => {
    expect(canTransitionApplication("rejected", "accepted")).toBe(false);
  });
});
