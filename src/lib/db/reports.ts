"use server";

import { createClient } from "./server-client";
import { optionalTrimmed, requireTrimmed } from "./validate";
import type { MateReport, MateReportStatus } from "./types";

export async function listReports(): Promise<MateReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as MateReport[];
}

export async function createReport(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const reasonCode = requireTrimmed(formData.get("reason_code"), "신고 사유", 50);
  const description = optionalTrimmed(formData.get("description"), 1000);
  const targetMateId = optionalTrimmed(formData.get("target_mate_id"), 100);
  const targetMemberId = optionalTrimmed(formData.get("target_member_id"), 100);

  if (!targetMateId && !targetMemberId) {
    throw new Error("신고 대상(모집글 또는 사용자)이 필요합니다.");
  }

  const { error } = await supabase.from("mate_reports").insert({
    reporter_id: user.id,
    target_mate_id: targetMateId,
    target_member_id: targetMemberId,
    reason_code: reasonCode,
    description,
  });

  if (error) throw error;
}

export async function updateReportStatus(
  reportId: string,
  status: MateReportStatus,
): Promise<void> {
  const supabase = await createClient();
  const resolvedAt = status === "resolved" || status === "dismissed" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("mate_reports")
    .update({ status, resolved_at: resolvedAt })
    .eq("id", reportId);

  if (error) throw error;
}
