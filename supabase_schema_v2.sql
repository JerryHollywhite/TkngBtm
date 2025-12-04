-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. WORKERS TABLE (Updated)
create table public.workers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  category text not null,
  rating float default 5.0,
  jobs_completed int default 0,
  price_range text,
  bio text,
  location text,
  skills text[],
  image_url text,
  balance decimal default 0,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. BOOKINGS TABLE (New)
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references auth.users not null,
  worker_id uuid references public.workers(id) not null,
  service_category text not null,
  description text,
  location text not null,
  scheduled_at timestamp with time zone,
  status text default 'pending', -- pending, accepted, working, done, cancelled
  progress_percentage int default 0,
  total_price decimal,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BOOKING PROGRESS TABLE (New - for timeline & updates)
create table public.booking_progress (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) not null,
  percentage int not null,
  description text,
  photo_url text,
  is_rejected boolean default false,
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.workers enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_progress enable row level security;

-- Policies (Simplified for Dev)
create policy "Public read workers" on public.workers for select using (true);
create policy "Users can read own bookings" on public.bookings for select using (auth.uid() = customer_id or auth.uid() = worker_id);
create policy "Users can insert bookings" on public.bookings for insert with check (auth.uid() = customer_id);
create policy "Workers can update bookings" on public.bookings for update using (auth.uid() = worker_id);
create policy "Read progress" on public.booking_progress for select using (true);
create policy "Insert progress" on public.booking_progress for insert with check (true);

-- MOCK DATA
insert into public.workers (full_name, category, rating, jobs_completed, price_range, bio, location, skills, image_url, balance)
values 
  ('Budi Santoso', 'Service AC', 4.8, 120, 'Rp 75rb - 150rb', 'Ahli AC.', 'Batam Center', ARRAY['Cuci AC'], 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400', 500000),
  ('Ahmad Dani', 'Listrik', 4.9, 85, 'Rp 50rb - 200rb', 'Ahli Listrik.', 'Nagoya', ARRAY['Instalasi'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 750000);
