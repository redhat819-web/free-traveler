-- Free Traveler — Supabase 스키마 (DB-SCHEMA-BASE)
--
-- 이 파일은 정확히 6개 Table만 선언한다(docs/ARCHITECTURE.md §6.2, CLAUDE.md 규칙 13).
-- member_profiles, mates, mate_applications, mate_blocks, mate_reports, outbound_url_settings
--
-- 범위 제한:
-- - 여행지·안전정보·대표 소개 콘텐츠는 이 스키마에 포함하지 않는다(src/data/**의 정적 데이터로만 관리).
-- - 정확한 생년월일 컬럼은 어떤 테이블에도 두지 않는다(is_adult, adult_verified_at만 저장).
-- - 범용 감사 로그 테이블은 만들지 않는다.
-- - RLS 정책은 이 파일이 아닌 supabase/rls_policies.sql(DB-RLS-BASE Task)에서 정의한다.

-- =============================================================================
-- 1. member_profiles — auth.users와 1:1 연결되는 회원 프로필
-- =============================================================================
create table if not exists public.member_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null,
  age_group text not null check (
    age_group in ('10s', '20s', '30s', '40s', '50s', '60_plus')
  ),
  travel_style text[] not null default '{}',
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  is_adult boolean not null default false,
  adult_verified_at timestamptz,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.member_profiles is
  '회원 프로필. 정확한 생년월일은 저장하지 않으며 age_group/is_adult만 저장한다.';

-- =============================================================================
-- 2. mates — 동행 모집글
-- =============================================================================
create table if not exists public.mates (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.member_profiles (id) on delete cascade,
  title text not null,
  country text not null,
  region text not null,
  start_date date not null,
  end_date date not null,
  capacity integer not null check (capacity >= 2),
  description text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mates_date_range_check check (end_date >= start_date)
);

comment on table public.mates is
  '동행 모집글. 누구나 조회 가능(공개), 수정·마감·삭제는 작성자만 가능하다.';

create index if not exists mates_author_id_idx on public.mates (author_id);
create index if not exists mates_status_idx on public.mates (status);

-- =============================================================================
-- 3. mate_applications — 참가 요청
-- =============================================================================
create table if not exists public.mate_applications (
  id uuid primary key default gen_random_uuid(),
  mate_id uuid not null references public.mates (id) on delete cascade,
  requester_id uuid not null references public.member_profiles (id) on delete cascade,
  message text check (char_length(message) <= 500),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mate_applications_unique_request unique (mate_id, requester_id)
);

comment on table public.mate_applications is
  '동행 모집글 참가 요청. 승인/거절은 해당 모집글의 작성자만 가능하다.';

create index if not exists mate_applications_mate_id_idx on public.mate_applications (mate_id);
create index if not exists mate_applications_requester_id_idx on public.mate_applications (requester_id);

-- =============================================================================
-- 4. mate_blocks — 사용자 간 차단 관계
-- =============================================================================
create table if not exists public.mate_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.member_profiles (id) on delete cascade,
  blocked_id uuid not null references public.member_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint mate_blocks_no_self_block check (blocker_id <> blocked_id),
  constraint mate_blocks_unique_pair unique (blocker_id, blocked_id)
);

comment on table public.mate_blocks is
  '사용자 간 차단 관계. 본인이 생성한 차단만 조회·삭제 가능하다.';

-- =============================================================================
-- 5. mate_reports — 신고
-- =============================================================================
create table if not exists public.mate_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.member_profiles (id) on delete cascade,
  target_mate_id uuid references public.mates (id) on delete cascade,
  target_member_id uuid references public.member_profiles (id) on delete cascade,
  reason_code text not null,
  description text,
  status text not null default 'open' check (
    status in ('open', 'reviewing', 'resolved', 'dismissed')
  ),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint mate_reports_target_check check (
    target_mate_id is not null or target_member_id is not null
  )
);

comment on table public.mate_reports is
  '신고. 신고 처리 상태와 처리 시각만 기록하며, 범용 감사 로그는 두지 않는다. 상태 변경은 Admin만 가능하다.';

-- =============================================================================
-- 6. outbound_url_settings — 항공/숙소 외부 URL 설정
-- =============================================================================
create table if not exists public.outbound_url_settings (
  id text primary key check (id in ('flight', 'hotel')),
  url text not null check (url like 'https://%'),
  updated_by uuid references public.member_profiles (id),
  updated_at timestamptz not null default now()
);

comment on table public.outbound_url_settings is
  '항공/호텔 외부 이동 URL(HTTPS 허용목록). 수정은 Admin만 가능하다.';

-- =============================================================================
-- updated_at 자동 갱신 트리거
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.member_profiles;
create trigger set_updated_at
  before update on public.member_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.mates;
create trigger set_updated_at
  before update on public.mates
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.mate_applications;
create trigger set_updated_at
  before update on public.mate_applications
  for each row execute function public.set_updated_at();
