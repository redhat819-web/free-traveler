import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/server-client";

/**
 * Supabase Auth 이메일 확인/비밀번호 재설정 링크가 돌아오는 콜백.
 * PKCE code를 세션으로 교환한 뒤 /account로 돌려보낸다.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account?auth_error=1`);
}
