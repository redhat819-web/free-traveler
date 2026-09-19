/**
 * Supabase 환경변수 접근 헬퍼.
 * 값이 없을 때 개발 중 원인을 바로 알 수 있도록 안내 메시지를 던진다(Service Role Key는 여기서 다루지 않는다).
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다. .env.local에 Supabase 프로젝트 URL을 추가하세요.",
    );
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다. .env.local에 Supabase anon key를 추가하세요.",
    );
  }
  return key;
}
