-- PetID MVP: esquema inicial propuesto para Supabase/PostgreSQL.
create extension if not exists pgcrypto;

create type public.pet_status as enum ('activa','inactiva','extraviada','recuperada');
create type public.payment_status as enum ('pendiente','verificando','pagado','rechazado','reembolsado');
create type public.production_status as enum ('solicitud_recibida','en_diseno','propuesta_enviada','correccion_solicitada','aprobada','en_produccion','enviada','entregada','finalizada');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'owner' check (role in ('owner','operator','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.owners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text,
  whatsapp text,
  email text,
  city text,
  alternative_contact_name text,
  alternative_contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text not null unique,
  owner_id uuid references public.owners(id) on delete set null,
  source text not null default 'portal_publico',
  product_type text not null,
  delivery_type text,
  preferred_templates text[] not null default '{}',
  pet_payload jsonb not null default '{}'::jsonb,
  privacy_payload jsonb not null default '{}'::jsonb,
  photo_path text,
  payment_status public.payment_status not null default 'pendiente',
  production_status public.production_status not null default 'solicitud_recibida',
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owners(id) on delete restrict,
  request_id uuid references public.customer_requests(id) on delete set null,
  petid_code text not null unique,
  public_slug text not null unique check (char_length(public_slug) >= 10),
  name text not null,
  species text not null,
  sex text,
  breed text,
  birth_date date,
  approximate_age text,
  color_description text,
  photo_path text,
  medical_notes text,
  behavior_notes text,
  internal_notes text,
  credential_template text not null default 'guardian',
  credential_title text,
  photo_fit text not null default 'cover',
  photo_position_x numeric not null default 50 check (photo_position_x between 0 and 100),
  photo_position_y numeric not null default 50 check (photo_position_y between 0 and 100),
  photo_scale numeric not null default 1.05 check (photo_scale between .8 and 2),
  photo_brightness numeric not null default 1.1 check (photo_brightness between .7 and 1.6),
  status public.pet_status not null default 'activa',
  is_public boolean not null default true,
  is_lost boolean not null default false,
  lost_since date,
  last_seen_location text,
  lost_message text,
  reward_text text,
  show_owner_name boolean not null default false,
  show_phone boolean not null default true,
  show_whatsapp boolean not null default true,
  show_email boolean not null default false,
  show_city boolean not null default true,
  show_medical_notes boolean not null default true,
  show_behavior_notes boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pet_status_history (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  previous_status public.pet_status,
  new_status public.pet_status not null,
  changed_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table public.design_proposals (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.customer_requests(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  template_id text not null,
  configuration jsonb not null default '{}'::jsonb,
  preview_path text,
  final_file_path text,
  status text not null default 'borrador' check (status in ('borrador','enviada','aprobada','rechazada')),
  customer_comment text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.finder_messages (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  finder_name text,
  finder_phone text,
  message text not null check (char_length(message) between 2 and 500),
  status text not null default 'nuevo' check (status in ('nuevo','revisado','cerrado','spam')),
  created_at timestamptz not null default now()
);

create table public.qr_scans (
  id bigint generated by default as identity primary key,
  pet_id uuid not null references public.pets(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  user_agent text,
  referrer text
);

create index pets_public_slug_idx on public.pets(public_slug);
create index pets_owner_id_idx on public.pets(owner_id);
create index customer_requests_status_idx on public.customer_requests(payment_status, production_status);
create index finder_messages_pet_id_idx on public.finder_messages(pet_id, created_at desc);

create or replace function public.is_petid_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('operator','admin')
  );
$$;

create or replace function public.get_public_pet_profile(p_public_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'petId', p.petid_code,
    'publicSlug', p.public_slug,
    'name', p.name,
    'petType', p.species,
    'sex', p.sex,
    'breed', p.breed,
    'birth', p.birth_date,
    'photoPath', p.photo_path,
    'isLost', p.is_lost,
    'status', p.status,
    'lostSince', p.lost_since,
    'lastSeenLocation', p.last_seen_location,
    'lostMessage', p.lost_message,
    'rewardText', p.reward_text,
    'owner', case when p.show_owner_name then o.full_name else null end,
    'phone', case when p.show_phone then o.phone else null end,
    'whatsapp', case when p.show_whatsapp then o.whatsapp else null end,
    'email', case when p.show_email then o.email else null end,
    'city', case when p.show_city then o.city else null end,
    'medicalNotes', case when p.show_medical_notes then p.medical_notes else null end,
    'behaviorNotes', case when p.show_behavior_notes then p.behavior_notes else null end
  )
  from public.pets p
  join public.owners o on o.id = p.owner_id
  where p.public_slug = p_public_slug and p.is_public = true
  limit 1;
$$;

revoke all on function public.get_public_pet_profile(text) from public;
grant execute on function public.get_public_pet_profile(text) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.owners enable row level security;
alter table public.customer_requests enable row level security;
alter table public.pets enable row level security;
alter table public.pet_status_history enable row level security;
alter table public.design_proposals enable row level security;
alter table public.finder_messages enable row level security;
alter table public.qr_scans enable row level security;

create policy profiles_self_select on public.profiles for select to authenticated using (id = auth.uid() or public.is_petid_admin());
create policy profiles_self_update on public.profiles for update to authenticated using (id = auth.uid() or public.is_petid_admin()) with check (id = auth.uid() or public.is_petid_admin());

create policy owners_self_select on public.owners for select to authenticated using (user_id = auth.uid() or public.is_petid_admin());
create policy owners_self_update on public.owners for update to authenticated using (user_id = auth.uid() or public.is_petid_admin()) with check (user_id = auth.uid() or public.is_petid_admin());
create policy owners_admin_insert on public.owners for insert to authenticated with check (public.is_petid_admin() or user_id = auth.uid());

create policy requests_admin_all on public.customer_requests for all to authenticated using (public.is_petid_admin()) with check (public.is_petid_admin());
create policy pets_owner_select on public.pets for select to authenticated using (public.is_petid_admin() or exists (select 1 from public.owners o where o.id = owner_id and o.user_id = auth.uid()));
create policy pets_admin_all on public.pets for all to authenticated using (public.is_petid_admin()) with check (public.is_petid_admin());
create policy status_admin_all on public.pet_status_history for all to authenticated using (public.is_petid_admin()) with check (public.is_petid_admin());
create policy proposals_admin_all on public.design_proposals for all to authenticated using (public.is_petid_admin()) with check (public.is_petid_admin());
create policy finder_admin_select on public.finder_messages for select to authenticated using (public.is_petid_admin());
create policy finder_anon_insert on public.finder_messages for insert to anon, authenticated with check (char_length(message) between 2 and 500);
create policy scans_admin_select on public.qr_scans for select to authenticated using (public.is_petid_admin());

-- El INSERT público de solicitudes debe implementarse mediante una función o endpoint
-- con validación, rate limiting y CAPTCHA/Turnstile. No se habilita aquí de forma abierta.
