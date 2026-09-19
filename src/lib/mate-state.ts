/**
 * 동행 모집글/참가 요청 상태 전이 규칙(REQ-FUNC-035, 036, 037, 038)을 순수 함수로 분리한 모듈.
 * MatePostList.tsx(isClosed)/JoinRequestForm.tsx(중복 요청 차단)의 인라인 로직과 동일한 규칙을 따른다.
 */

export type MateStatus = "open" | "closed";
export type MateApplicationStatus = "pending" | "accepted" | "rejected";

export interface MateLike {
  status: MateStatus;
  end_date: string;
}

/** 수동 마감(status="closed") 또는 종료일 경과 시 마감으로 계산한다. */
export function isMateClosed(mate: MateLike, todayIso: string): boolean {
  return mate.status === "closed" || mate.end_date < todayIso;
}

export function effectiveMateStatus(
  mate: MateLike,
  todayIso: string,
): MateStatus {
  return isMateClosed(mate, todayIso) ? "closed" : "open";
}

export interface MateApplicationLike {
  requester_id: string;
  status: MateApplicationStatus;
}

/** 동일 사용자가 같은 모집글에 이미 PENDING/ACCEPTED 요청을 갖고 있으면 중복 신청을 차단한다. */
export function hasActiveApplication(
  applications: MateApplicationLike[],
  requesterId: string,
): boolean {
  return applications.some(
    (app) =>
      app.requester_id === requesterId &&
      (app.status === "pending" || app.status === "accepted"),
  );
}

const VALID_TRANSITIONS: Record<
  MateApplicationStatus,
  MateApplicationStatus[]
> = {
  pending: ["accepted", "rejected"],
  accepted: [],
  rejected: [],
};

/** 참가 요청은 PENDING 상태에서만 작성자가 승인/거절로 전이할 수 있다. */
export function canTransitionApplication(
  current: MateApplicationStatus,
  next: MateApplicationStatus,
): boolean {
  return VALID_TRANSITIONS[current].includes(next);
}
