-- Enable UUID OSSP extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop the table if it already exists (optional, but good for resetting)
-- DROP TABLE IF EXISTS public.profiles;

-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,            -- User's Cognito / Auth ID
  email TEXT NOT NULL UNIQUE,
  name TEXT,                               -- From original registration (Amazon Cognito name)
  display_name TEXT,                       -- The display name chosen during onboarding
  role TEXT DEFAULT 'CUSTOMER'::text,      -- ADMIN, MODERATOR, CUSTOMER
  status TEXT DEFAULT 'active'::text,      -- active, banned
  xp_points INT DEFAULT 0,
  platform_preference TEXT DEFAULT 'PC'::text,
  platforms TEXT[] DEFAULT '{}'::text[],   -- Selected platforms array e.g. ["PC", "Xbox"]
  favorite_genres TEXT[] DEFAULT '{}'::text[],
  interests TEXT[] DEFAULT '{}'::text[],   -- Selected interests array e.g. ["Action", "RPG"]
  email_notifications BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (always good practice)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (true); -- Publicly viewable for leaderboard/admin

-- Allow Admins to do everything (adjust logic to use your own JWT)
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (true);

-- Allow inserting profile
CREATE POLICY "Anyone can insert" ON public.profiles FOR INSERT WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true); -- You should scope this to JWT check normally
