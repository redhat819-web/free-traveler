-- Free Traveler — 데모/테스트 시드 데이터 (DB-SEED-BASE)
--
-- 실제 개인정보를 포함하지 않는다. auth.users는 Supabase Auth 가입 흐름으로 생성되므로
-- 이 파일은 auth.users에 의존하지 않는 outbound_url_settings 기본값만 시딩한다.
-- member_profiles/mates 등 회원 연계 데모 데이터는 실제 가입 흐름(E2E-MATE-AUTH)에서 생성한다.

insert into public.outbound_url_settings (id, url)
values
  ('flight', 'https://www.google.com/travel/flights'),
  ('hotel', 'https://www.booking.com')
on conflict (id) do update
  set url = excluded.url,
      updated_at = now();
