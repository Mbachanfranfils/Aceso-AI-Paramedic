
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.sessions enable row level security;
create policy "anyone can create sessions" on public.sessions for insert to anon, authenticated with check (true);
create policy "anyone can read sessions" on public.sessions for select to anon, authenticated using (true);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  is_emergency boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "anyone can read messages" on public.messages for select to anon, authenticated using (true);
create policy "anyone can insert messages" on public.messages for insert to anon, authenticated with check (true);
create index on public.messages (session_id, created_at);
