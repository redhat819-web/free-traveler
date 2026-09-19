"use server";

import { createClient } from "./server-client";
import { requireTrimmed } from "./validate";
import type { MemberProfile } from "./types";

export async function getMyProfile(): Promise<MemberProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data as MemberProfile | null;
}

export async function createMyProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const nickname = requireTrimmed(formData.get("nickname"), "닉네임", 30);
  const ageGroup = requireTrimmed(formData.get("age_group"), "연령대", 10);

  const { error } = await supabase.from("member_profiles").insert({
    id: user.id,
    nickname,
    age_group: ageGroup,
  });

  if (error) throw error;
}

export async function updateMyProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const nickname = requireTrimmed(formData.get("nickname"), "닉네임", 30);

  const { error } = await supabase
    .from("member_profiles")
    .update({ nickname })
    .eq("id", user.id);

  if (error) throw error;
}

export async function markAdultVerified(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase
    .from("member_profiles")
    .update({ is_adult: true, adult_verified_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) throw error;
}
