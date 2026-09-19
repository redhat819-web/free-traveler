-- Free Traveler — Row Level Security 정책 (DB-RLS-BASE)
--
-- 이 파일은 supabase/schema.sql의 6개 Table에 대한 RLS만 정의한다(docs/ARCHITECTURE.md §6.4).
-- 권한 등급은 "본인 / 작성자 / Admin" 3단계로 단순화한다(그 이상의 세분화된 Role Table을 만들지 않는다).
--
-- Admin 판별: member_profiles.role = 'admin'인 본인 행이 있는지 확인한다(REQ-FUNC-044, REQ-NF-013).

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.member_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =============================================================================
-- 1. member_profiles — 본인 데이터만 조회·수정
-- =============================================================================
alter table public.member_profiles enable row level security;

create policy member_profiles_select_own
  on public.member_profiles for select
  using (auth.uid() = id or public.is_admin());

create policy member_profiles_insert_own
  on public.member_profiles for insert
  with check (auth.uid() = id);

create policy member_profiles_update_own
  on public.member_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =============================================================================
-- 2. mates — 공개 조회, 작성자만 수정·마감·삭제
-- =============================================================================
alter table public.mates enable row level security;

create policy mates_select_public
  on public.mates for select
  using (true);

create policy mates_insert_own
  on public.mates for insert
  with check (auth.uid() = author_id);

create policy mates_update_own
  on public.mates for update
  using (auth.uid() = author_id or public.is_admin())
  with check (auth.uid() = author_id or public.is_admin());

create policy mates_delete_own
  on public.mates for delete
  using (auth.uid() = author_id or public.is_admin());

-- =============================================================================
-- 3. mate_applications — 신청자 본인 또는 모집글 작성자만 조회, 신청자만 생성,
--    작성자만 승인/거절(update)
-- =============================================================================
alter table public.mate_applications enable row level security;

create policy mate_applications_select_related
  on public.mate_applications for select
  using (
    auth.uid() = requester_id
    or auth.uid() = (select author_id from public.mates where id = mate_id)
    or public.is_admin()
  );

create policy mate_applications_insert_own
  on public.mate_applications for insert
  with check (auth.uid() = requester_id);

create policy mate_applications_update_author
  on public.mate_applications for update
  using (
    auth.uid() = (select author_id from public.mates where id = mate_id)
    or public.is_admin()
  )
  with check (
    auth.uid() = (select author_id from public.mates where id = mate_id)
    or public.is_admin()
  );

-- =============================================================================
-- 4. mate_blocks — 본인이 생성한 차단만 조회·생성·삭제
-- =============================================================================
alter table public.mate_blocks enable row level security;

create policy mate_blocks_select_own
  on public.mate_blocks for select
  using (auth.uid() = blocker_id or public.is_admin());

create policy mate_blocks_insert_own
  on public.mate_blocks for insert
  with check (auth.uid() = blocker_id);

create policy mate_blocks_delete_own
  on public.mate_blocks for delete
  using (auth.uid() = blocker_id);

-- =============================================================================
-- 5. mate_reports — 신고자 본인은 자기 신고만 조회·생성, 상태 변경은 Admin만
-- =============================================================================
alter table public.mate_reports enable row level security;

create policy mate_reports_select_own_or_admin
  on public.mate_reports for select
  using (auth.uid() = reporter_id or public.is_admin());

create policy mate_reports_insert_own
  on public.mate_reports for insert
  with check (auth.uid() = reporter_id);

create policy mate_reports_update_admin_only
  on public.mate_reports for update
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 6. outbound_url_settings — 누구나 조회(공개 URL), 수정은 Admin만
-- =============================================================================
alter table public.outbound_url_settings enable row level security;

create policy outbound_url_settings_select_public
  on public.outbound_url_settings for select
  using (true);

create policy outbound_url_settings_upsert_admin_only
  on public.outbound_url_settings for insert
  with check (public.is_admin());

create policy outbound_url_settings_update_admin_only
  on public.outbound_url_settings for update
  using (public.is_admin())
  with check (public.is_admin());
