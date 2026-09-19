/**
 * Server Component / Server Action / Route Handler 전용 Supabase 클라이언트.
 * "use client" 컴포넌트에서 import하지 않는다(Client 번들에 next/headers가 포함되면 빌드가 실패한다).
 * 쿠키 기반 세션을 사용하며, anon key로 동작한다(RLS가 실제 권한을 강제한다).
 * Service Role Key는 이 파일에서도 사용하지 않는다 — RLS 우회 조회를 만들지 않는다(CLAUDE.md 규칙 14).
 */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component에서 호출된 경우 쿠키 쓰기가 무시된다.
          // 미들웨어/Route Handler에서 세션 갱신 시 정상적으로 반영된다.
        }
      },
    },
  });
}
