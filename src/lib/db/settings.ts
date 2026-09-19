"use server";

import { createClient } from "./server-client";
import { requireHttpsUrl } from "./validate";
import type { OutboundUrlId, OutboundUrlSetting } from "./types";

export async function listOutboundUrlSettings(): Promise<OutboundUrlSetting[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("outbound_url_settings").select("*");

  if (error) throw error;
  return (data ?? []) as OutboundUrlSetting[];
}

export async function updateOutboundUrlSetting(
  id: OutboundUrlId,
  formData: FormData,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const url = requireHttpsUrl(formData.get("url"), "외부 URL");

  const { error } = await supabase
    .from("outbound_url_settings")
    .update({ url, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}
