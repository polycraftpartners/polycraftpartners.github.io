-- Founder Growth Benchmark — Supabase Migration
-- Run this entire file in the Supabase SQL Editor on a new project.
-- Project: founder-growth-benchmark

-- ============================================================
-- TABLE 1: founder_assessments
-- ============================================================

create table if not exists founder_assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Profile section (P1–P4)
  industry text not null,
  company_size text not null,
  growth_objective text not null,
  founder_involvement text not null,

  -- Diagnostic answers (D1–D15), each scored 1 to 4
  d1 smallint not null check (d1 between 1 and 4),
  d2 smallint not null check (d2 between 1 and 4),
  d3 smallint not null check (d3 between 1 and 4),
  d4 smallint not null check (d4 between 1 and 4),
  d5 smallint not null check (d5 between 1 and 4),
  d6 smallint not null check (d6 between 1 and 4),
  d7 smallint not null check (d7 between 1 and 4),
  d8 smallint not null check (d8 between 1 and 4),
  d9 smallint not null check (d9 between 1 and 4),
  d10 smallint not null check (d10 between 1 and 4),
  d11 smallint not null check (d11 between 1 and 4),
  d12 smallint not null check (d12 between 1 and 4),
  d13 smallint not null check (d13 between 1 and 4),
  d14 smallint not null check (d14 between 1 and 4),
  d15 smallint not null check (d15 between 1 and 4),

  -- Open question
  open_response text,
  response_tags text[] default '{}',

  -- Contact
  name text not null,
  company text not null,
  email text not null,
  country text not null,

  -- Tracking
  source text not null default 'direct',

  -- Computed scores (calculated app-side at submission, stored here)
  score_opportunity smallint not null,
  score_consistency smallint not null,
  score_independence smallint not null,
  score_visibility smallint not null,
  score_readiness smallint not null,
  total_score smallint not null,
  growth_score smallint not null,
  classification text not null check (classification in ('Critical','Developing','Functional','Strong','Exceptional')),

  -- Flags and tagging
  critical_flag boolean not null default false,
  flagged_dimension text,
  prospect_tag text not null check (prospect_tag in ('Hot','Warm','Watch')),

  -- GDPR consent
  consent_data boolean not null default false,
  consent_email boolean not null default false
);

create index if not exists idx_founder_assessments_created_at on founder_assessments (created_at desc);
create index if not exists idx_founder_assessments_prospect_tag on founder_assessments (prospect_tag);
create index if not exists idx_founder_assessments_classification on founder_assessments (classification);

-- ============================================================
-- TABLE 2: assessment_settings
-- ============================================================

create table if not exists assessment_settings (
  id integer primary key default 1,
  use_live_benchmarks boolean not null default false,
  live_benchmark_threshold integer not null default 50,
  seeded_avg_opportunity numeric(4,2) not null default 6.5,
  seeded_avg_consistency numeric(4,2) not null default 5.8,
  seeded_avg_independence numeric(4,2) not null default 5.2,
  seeded_avg_visibility numeric(4,2) not null default 5.5,
  seeded_avg_readiness numeric(4,2) not null default 6.0,
  constraint single_row check (id = 1)
);

insert into assessment_settings (id)
values (1)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table founder_assessments enable row level security;
alter table assessment_settings enable row level security;

-- Public (anon) can INSERT a new assessment submission only.
-- No public SELECT, UPDATE, or DELETE on founder_assessments.
create policy "Public can insert assessments"
  on founder_assessments
  for insert
  to anon
  with check (true);

-- Public (anon) can read aggregate-safe settings (needed for live benchmark switch
-- and participation counter logic on the client).
create policy "Public can read settings"
  on assessment_settings
  for select
  to anon
  using (true);

-- ============================================================
-- ADMIN READ ACCESS — SIMPLE PATH (chosen deliberately for v1)
-- ============================================================
-- This grants the anon key SELECT access on founder_assessments, gated in
-- the application only by a client-side password check (see AdminPage.tsx).
--
-- This is the deliberately simple option, not the hardened one. The real
-- security boundary here is "the admin URL and password are not shared,"
-- not Postgres-level access control. Anyone with the anon key AND the
-- admin password can read all participant data, including emails and
-- open-text responses.
--
-- If this assessment scales, gathers sensitive responses at volume, or the
-- admin URL risks wider exposure, upgrade to one of:
--   1. A server-side API route using the service role key (service role
--      already bypasses RLS — no policy needed, just don't expose that
--      key to the client), or
--   2. Supabase Auth restricted to your email, with a SELECT policy
--      scoped to auth.uid() instead of "to anon".
-- Both are described in the project README.
create policy "Admin can read all assessments (simple v1 gate)"
  on founder_assessments
  for select
  to anon
  using (true);

-- ============================================================
-- PARTICIPATION COUNTER FUNCTION
-- ============================================================
-- Exposed via RPC so the client can get a count without any SELECT access to row data.

create or replace function get_participation_count()
returns integer
language sql
security definer
as $$
  select count(*)::integer from founder_assessments;
$$;

grant execute on function get_participation_count() to anon;
