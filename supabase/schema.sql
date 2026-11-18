-- Run this in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.omens (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  title text not null check (char_length(title) between 2 and 80),
  prophecy text not null check (char_length(prophecy) between 10 and 500),
  classification text not null, validity text not null, mood text not null,
  reactions integer not null default 0 check (reactions >= 0), created_at timestamptz not null default now()
);
create index if not exists omens_created_at_idx on public.omens (created_at desc);
alter table public.omens enable row level security;
drop policy if exists "Anyone can read omens" on public.omens;
create policy "Anyone can read omens" on public.omens for select to anon, authenticated using (true);
drop policy if exists "Anyone can submit omens" on public.omens;
create policy "Anyone can submit omens" on public.omens for insert to anon, authenticated with check (true);
create or replace function public.increment_omen_reactions(omen_slug text)
returns integer language plpgsql security definer set search_path = public as $$
declare new_count integer;
begin
 update public.omens set reactions = reactions + 1 where slug = omen_slug returning reactions into new_count;
 if new_count is null then raise exception 'Omen not found'; end if;
 return new_count;
end; $$;
grant execute on function public.increment_omen_reactions(text) to anon, authenticated;

-- Extended Oracle features: subject targeting, generation source and analytics.
alter table public.omens add column if not exists subject_name text;
alter table public.omens add column if not exists subject_relation text;
alter table public.omens add column if not exists generation_source text not null default 'local';
create index if not exists omens_mood_idx on public.omens (mood);
