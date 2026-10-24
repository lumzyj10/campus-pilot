-- ============================================================================
-- CAMPUSPILOT DATABASE SCHEMA (PostgreSQL / Supabase)
-- Timezone aware: Africa/Lagos (West Africa Time, UTC+1)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE (Mirrors Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    university TEXT DEFAULT 'University of Lagos (UNILAG)',
    faculty TEXT DEFAULT 'Faculty of Science',
    department TEXT DEFAULT 'Computer Science',
    level TEXT DEFAULT '100 Level',
    matric_no TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TIMETABLE EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    course_code TEXT,
    type TEXT NOT NULL CHECK (type IN ('class', 'study', 'assignment', 'exam', 'club', 'orientation', 'personal')),
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL, -- e.g. '08:00:00'
    end_time TIME NOT NULL,   -- e.g. '10:00:00'
    venue TEXT,
    lecturer TEXT,
    notes TEXT,
    repeats_weekly BOOLEAN DEFAULT TRUE,
    color TEXT DEFAULT '#0284c7',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REMINDER SETTINGS PER STUDENT
CREATE TABLE IF NOT EXISTS public.reminder_settings (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    lead_time_minutes INTEGER DEFAULT 20 CHECK (lead_time_minutes IN (10, 20, 30, 60)),
    enabled_types JSONB DEFAULT '{"class": true, "study": true, "assignment": true, "exam": true, "club": false, "orientation": true, "personal": false}'::jsonb,
    email_address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REMINDERS SENT (Deduplication log to guarantee zero duplicate emails)
CREATE TABLE IF NOT EXISTS public.reminders_sent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    target_date DATE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recipient_email TEXT NOT NULL,
    status TEXT DEFAULT 'delivered',
    error_message TEXT,
    CONSTRAINT unique_reminder_per_event_day UNIQUE(event_id, target_date)
);

-- 5. AI CHAT HISTORY
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tool_calls JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_events_user_day ON public.events(user_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_reminders_sent_event_date ON public.reminders_sent(event_id, target_date);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id, created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and edit own profile" 
    ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own events" 
    ON public.events FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage reminder settings" 
    ON public.reminder_settings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reminders log" 
    ON public.reminders_sent FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat messages" 
    ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- AUTOMATED REMINDER TRIGGER VIEW / QUERY
-- Runs every minute via Supabase pg_cron or Edge Function
-- Matches events whose start_time is in (NOW + lead_time_minutes) in Africa/Lagos
-- ============================================================================
CREATE OR REPLACE VIEW public.pending_event_reminders AS
SELECT 
    e.id AS event_id,
    e.title,
    e.course_code,
    e.type,
    e.venue,
    e.lecturer,
    e.start_time,
    e.end_time,
    p.id AS user_id,
    p.full_name AS student_name,
    rs.email_address,
    rs.lead_time_minutes,
    CURRENT_DATE AS today_date
FROM public.events e
JOIN public.profiles p ON e.user_id = p.id
JOIN public.reminder_settings rs ON e.user_id = rs.user_id
LEFT JOIN public.reminders_sent sent 
    ON sent.event_id = e.id AND sent.target_date = CURRENT_DATE
WHERE 
    rs.is_active = TRUE
    -- Check if this event type has reminders enabled in JSONB
    AND (rs.enabled_types ->> e.type)::BOOLEAN = TRUE
    -- Ensure reminder was not already sent today
    AND sent.id IS NULL
    -- Day matches today in Africa/Lagos
    AND TRIM(TO_CHAR(NOW() AT TIME ZONE 'Africa/Lagos', 'Day')) = e.day_of_week
    -- Time window: Event starts between now + lead_time and now + lead_time + 2 mins
    AND e.start_time >= (NOW() AT TIME ZONE 'Africa/Lagos')::TIME + (rs.lead_time_minutes || ' minutes')::INTERVAL - INTERVAL '1 minute'
    AND e.start_time <= (NOW() AT TIME ZONE 'Africa/Lagos')::TIME + (rs.lead_time_minutes || ' minutes')::INTERVAL + INTERVAL '1 minute';
