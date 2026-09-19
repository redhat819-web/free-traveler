"use server";

import { createClient } from "./server-client";
import { optionalTrimmed } from "./validate";
import type { MateApplication, MateApplicationStatus } from "./types";

export async function listApplicationsForMate(mateId: string): Promise<MateApplication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_applications")
    .select("*")
    .eq("mate_id", mateId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as MateApplication[];
}

export async function createApplication(mateId: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const message = optionalTrimmed(formData.get("message"), 500);

  const { error } = await supabase.from("mate_applications").insert({
    mate_id: mateId,
    requester_id: user.id,
    message,
  });

  if (error) throw error;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: MateApplicationStatus,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("mate_applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) throw error;
}
