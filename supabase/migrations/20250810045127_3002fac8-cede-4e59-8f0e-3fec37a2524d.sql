-- Create bookings table for service appointments
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  service_name text not null,
  additional_services text[] not null default '{}',
  price numeric(10,2) not null default 0,
  location text,
  status text not null default 'confirmed',
  scheduled_date date not null,
  scheduled_time text not null,
  vehicle_make text,
  vehicle_model text,
  vehicle_year int,
  license_plate text,
  vin text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.bookings enable row level security;

-- Policies
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bookings"
  on public.bookings for delete
  using (auth.uid() = user_id);

-- Trigger to auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_bookings_updated_at
before update on public.bookings
for each row execute function public.update_updated_at_column();

-- Helpful indexes
create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_scheduled on public.bookings(scheduled_date);
