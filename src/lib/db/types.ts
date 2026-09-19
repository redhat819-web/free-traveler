/**
 * supabase/schema.sql의 6개 Table에 대응하는 타입.
 * ORM을 사용하지 않으므로(CLAUDE.md 규칙 17) 이 파일의 타입을 수기로 스키마와 동기화한다.
 */

export type AgeGroup = "10s" | "20s" | "30s" | "40s" | "50s" | "60_plus";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type MemberRole = "member" | "admin";

export interface MemberProfile {
  id: string;
  nickname: string;
  age_group: AgeGroup;
  travel_style: string[];
  gender: Gender | null;
  is_adult: boolean;
  adult_verified_at: string | null;
  role: MemberRole;
  created_at: string;
  updated_at: string;
}

export type MateStatus = "open" | "closed";

export interface Mate {
  id: string;
  author_id: string;
  title: string;
  country: string;
  region: string;
  start_date: string;
  end_date: string;
  capacity: number;
  description: string;
  status: MateStatus;
  created_at: string;
  updated_at: string;
}

export type MateApplicationStatus = "pending" | "accepted" | "rejected";

export interface MateApplication {
  id: string;
  mate_id: string;
  requester_id: string;
  message: string | null;
  status: MateApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface MateBlock {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export type MateReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface MateReport {
  id: string;
  reporter_id: string;
  target_mate_id: string | null;
  target_member_id: string | null;
  reason_code: string;
  description: string | null;
  status: MateReportStatus;
  resolved_at: string | null;
  created_at: string;
}

export type OutboundUrlId = "flight" | "hotel";

export interface OutboundUrlSetting {
  id: OutboundUrlId;
  url: string;
  updated_by: string | null;
  updated_at: string;
}
