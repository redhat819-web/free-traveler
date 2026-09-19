"use server";

import { createClient } from "./server-client";
import { requireTrimmed } from "./validate";
import type { Mate } from "./types";

export async function listOpenMates(): Promise<Mate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mates")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Mate[];
}

export async function getMateById(id: string): Promise<Mate | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Mate | null;
}

export async function createMate(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const title = requireTrimmed(formData.get("title"), "제목", 100);
  const country = requireTrimmed(formData.get("country"), "국가", 50);
  const region = requireTrimmed(formData.get("region"), "지역", 50);
  const description = requireTrimmed(formData.get("description"), "소개", 2000);
  const startDate = requireTrimmed(formData.get("start_date"), "시작일", 10);
  const endDate = requireTrimmed(formData.get("end_date"), "종료일", 10);
  const capacity = Number(formData.get("capacity"));

  if (!Number.isInteger(capacity) || capacity < 2) {
    throw new Error("모집 인원은 2명 이상의 정수여야 합니다.");
  }

  const { error } = await supabase.from("mates").insert({
    author_id: user.id,
    title,
    country,
    region,
    description,
    start_date: startDate,
    end_date: endDate,
    capacity,
  });

  if (error) throw error;
}

export async function updateMate(mateId: string, formData: FormData): Promise<void> {
  const supabase = await createClient();

  const title = requireTrimmed(formData.get("title"), "제목", 100);
  const description = requireTrimmed(formData.get("description"), "소개", 2000);

  const { error } = await supabase
    .from("mates")
    .update({ title, description })
    .eq("id", mateId);

  if (error) throw error;
}

export async function closeMate(mateId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("mates")
    .update({ status: "closed" })
    .eq("id", mateId);

  if (error) throw error;
}

export async function deleteMate(mateId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("mates").delete().eq("id", mateId);
  if (error) throw error;
}
