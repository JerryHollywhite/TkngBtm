-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Workers Table
create table public.workers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  category text not null,
  rating float default 0,
  jobs_completed int default 0,
  price_range text,
  bio text,
  location text,
  skills text[],
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.workers enable row level security;

-- Create Policy: Everyone can view workers
create policy "Workers are viewable by everyone"
  on public.workers for select
  using ( true );

-- Insert Mock Data (Optional, for testing)
insert into public.workers (full_name, category, rating, jobs_completed, price_range, bio, location, skills, image_url)
values 
  ('Budi Santoso', 'Service AC', 4.8, 120, 'Rp 75rb - 150rb', 'Ahli perbaikan AC berpengalaman 10 tahun.', 'Batam Center', ARRAY['Cuci AC', 'Isi Freon', 'Bongkar Pasang'], 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'),
  ('Ahmad Dani', 'Kelistrikan', 4.9, 85, 'Rp 50rb - 200rb', 'Spesialis instalasi listrik rumah dan gedung.', 'Nagoya', ARRAY['Instalasi', 'Korsleting', 'Panel'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'),
  ('Siti Aminah', 'Kebersihan', 4.7, 210, 'Rp 40rb/jam', 'Jasa bersih rumah harian dan bulanan.', 'Sekupang', ARRAY['Sapu/Pel', 'Setrika', 'Cuci Piring'], 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400');
