"use server";

import { createClient } from "./server-client";
import type { MateBlock } from "./types";

export async function listMyBlocks(): Promise<MateBlock[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("mate_blocks")
    .select("*")
    .eq("blocker_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as MateBlock[];
}

export async function createBlock(blockedId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase.from("mate_blocks").insert({
    blocker_id: user.id,
    blocked_id: blockedId,
  });

  if (error) throw error;
}

export async function deleteBlock(blockId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("mate_blocks").delete().eq("id", blockId);
  if (error) throw error;
}
