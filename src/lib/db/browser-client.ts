"use client";

/**
 * Client Component 전용 Supabase 클라이언트.
 * Server 전용 코드(Service Role Key 등)는 여기서 절대 import하지 않는다(CLAUDE.md 규칙 15).
 */

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
