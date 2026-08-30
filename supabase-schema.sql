create table if not exists public.users (
  id bigint generated always as identity primary key,
  uid text not null,
  email text,
  profile_image_url text,
  post_type text not null check (post_type in ('lost', 'search')),
  image_url text not null,
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.users
  add column if not exists profile_image_url text,
  add column if not exists post_type text not null default 'lost'
    check (post_type in ('lost', 'search'));

alter table public.users enable row level security;

grant usage on schema public to anon;
grant insert, delete on public.users to anon;
grant usage, select on sequence public.users_id_seq to anon;

drop policy if exists "Allow post creation" on public.users;

create policy "Allow post creation"
on public.users
for insert
to anon
with check (true);

drop policy if exists "Allow post reading" on public.users;

create policy "Allow post reading"
on public.users
for select
to anon
using (true);

drop policy if exists "Allow post deletion" on public.users;

create policy "Allow post deletion"
on public.users
for delete
to anon
using (true);

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.users(id) on delete cascade,
  uid text not null,
  profile_image_url text,
  content text not null check (char_length(content) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

grant select, insert on public.comments to anon;
grant usage, select on sequence public.comments_id_seq to anon;

drop policy if exists "Allow comment reading" on public.comments;
drop policy if exists "Allow comment creation" on public.comments;

create policy "Allow comment reading"
on public.comments
for select
to anon
using (true);

create policy "Allow comment creation"
on public.comments
for insert
to anon
with check (true);

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "Allow image uploads" on storage.objects;

create policy "Allow image uploads"
on storage.objects
for insert
to anon
with check (bucket_id = 'post-images');
