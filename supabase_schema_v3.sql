-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMs for strict status control (Handle if exists)
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'pending',
        'accepted',
        'on_the_way',
        'working',
        'review',
        'completed',
        'cancelled',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Create Tables First
-- Workers Table (Enhanced)
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    category TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    price_range TEXT,
    location TEXT,
    image_url TEXT,
    bio TEXT,
    skills TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    balance DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure new columns exist if table already existed
DO $$ BEGIN
    ALTER TABLE public.workers ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
    ALTER TABLE public.workers ADD COLUMN IF NOT EXISTS bio TEXT;
    ALTER TABLE public.workers ADD COLUMN IF NOT EXISTS skills TEXT[];
    ALTER TABLE public.workers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.workers ADD COLUMN IF NOT EXISTS balance DECIMAL(12, 2) DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Bookings Table (Strict Workflow)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL, -- References auth.users
    worker_id UUID REFERENCES public.workers(id),
    service_category TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status DEFAULT 'pending',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    total_price DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking Progress Table (Validation & History)
CREATE TABLE IF NOT EXISTS public.booking_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    description TEXT,
    photo_url TEXT, -- Mandatory for validation in app logic
    is_rejected BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Drop existing policies to avoid conflicts (Now safe because tables exist)
DROP POLICY IF EXISTS "Workers are viewable by everyone" ON public.workers;
DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Progress viewable by authenticated" ON public.booking_progress;
DROP POLICY IF EXISTS "Workers can update progress" ON public.booking_progress;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_progress ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Workers: Public read, Admin write (simulated)
CREATE POLICY "Workers are viewable by everyone" 
ON public.workers FOR SELECT USING (true);

-- Bookings: 
-- Customers can see their own bookings
CREATE POLICY "Customers can view own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = customer_id);

-- Customers can insert their own bookings
CREATE POLICY "Customers can create bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Workers can view assigned bookings (Simulated: assuming worker_id matches auth.uid() or public for demo)
-- For this demo, we'll allow authenticated users to view bookings to simulate worker/customer interaction easily
CREATE POLICY "Authenticated users can view bookings" 
ON public.bookings FOR SELECT 
USING (auth.role() = 'authenticated');

-- Booking Progress:
-- Viewable by involved parties
CREATE POLICY "Progress viewable by authenticated" 
ON public.booking_progress FOR SELECT 
USING (auth.role() = 'authenticated');

-- Insertable by authenticated (Workers update progress)
CREATE POLICY "Workers can update progress" 
ON public.booking_progress FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 5. Mock Data for Workers (Only insert if empty to avoid duplicates)
INSERT INTO public.workers (full_name, category, rating, reviews_count, price_range, location, image_url, bio, skills, is_verified)
SELECT 'Pak Budi Santoso', 'Service AC', 4.8, 124, 'Rp 50rb - 150rb', 'Batam Center', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400', 'Ahli service AC berpengalaman 10 tahun.', ARRAY['Cuci AC', 'Isi Freon', 'Bongkar Pasang'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.workers WHERE full_name = 'Pak Budi Santoso');

INSERT INTO public.workers (full_name, category, rating, reviews_count, price_range, location, image_url, bio, skills, is_verified)
SELECT 'Kang Asep', 'Listrik', 4.9, 89, 'Rp 75rb - 200rb', 'Nagoya', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400', 'Spesialis instalasi listrik rumah dan gedung.', ARRAY['Instalasi', 'Korsleting', 'Tambah Daya'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.workers WHERE full_name = 'Kang Asep');

INSERT INTO public.workers (full_name, category, rating, reviews_count, price_range, location, image_url, bio, skills, is_verified)
SELECT 'Mas Joko', 'Renovasi', 4.7, 56, 'Survey Gratis', 'Sekupang', 'https://images.unsplash.com/photo-1581578731117-104f8a746956?w=400', 'Tukang bangunan serba bisa.', ARRAY['Cat Dinding', 'Keramik', 'Atap Bocor'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.workers WHERE full_name = 'Mas Joko');
