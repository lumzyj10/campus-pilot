import React, { useState } from 'react';
import { X, Copy, Check, Database, Server, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export function BackendDocsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaSQL = `-- CAMPUSPILOT SUPABASE SCHEMA (PostgreSQL)
-- Timezone: Africa/Lagos (WAT, UTC+1)

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    university TEXT DEFAULT 'University of Lagos (UNILAG)',
    department TEXT DEFAULT 'Computer Science',
    level TEXT DEFAULT '100 Level',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    course_code TEXT,
    type TEXT NOT NULL CHECK (type IN ('class', 'study', 'assignment', 'exam', 'club', 'orientation', 'personal')),
    day_of_week TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue TEXT,
    lecturer TEXT,
    notes TEXT,
    repeats_weekly BOOLEAN DEFAULT TRUE,
    color TEXT DEFAULT '#0284c7',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reminder_settings (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    lead_time_minutes INTEGER DEFAULT 20,
    enabled_types JSONB,
    email_address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.reminders_sent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    target_date DATE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recipient_email TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    CONSTRAINT unique_reminder_per_event_day UNIQUE(event_id, target_date)
);`;

  const cronCode = `// Supabase Scheduled Function: Dispatch Gmail Reminders every minute
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

Deno.serve(async (req) => {
  // 1. Fetch pending reminders due within lead_time_minutes in Africa/Lagos
  const { data: reminders } = await supabase.from('pending_event_reminders').select('*');

  for (const item of (reminders || [])) {
    // 2. Dispatch email via Resend API
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${Deno.env.get('RESEND_API_KEY')}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CampusPilot <notifications@campuspilot.app>',
        to: item.email_address,
        subject: \`⏰ Reminder: \${item.title} starts in \${item.lead_time_minutes}m!\`,
        html: \`<p>Hi \${item.student_name}, your class is at \${item.venue} at \${item.start_time}.</p>\`
      })
    });

    // 3. Mark sent in reminders_sent to prevent duplicates
    await supabase.from('reminders_sent').insert({
      user_id: item.user_id,
      event_id: item.event_id,
      target_date: item.today_date,
      recipient_email: item.email_address
    });
  }
  return new Response('OK');
});`;

  const guideText = `### CampusPilot Production Deployment Steps:

1. **Supabase Database**:
   - Create a free project on supabase.com.
   - Run the SQL script from the "SQL Schema" tab in Supabase SQL Editor.
2. **Google Sign-In**:
   - Create an OAuth Client in Google Cloud Console.
   - Set Authorized Redirect URI to: https://<your-project>.supabase.co/auth/v1/callback
   - Paste Client ID and Secret in Supabase Auth > Providers > Google.
3. **Resend Email Service**:
   - Get a free API key from resend.com.
   - Add RESEND_API_KEY into Supabase secrets.
4. **Schedule 1-Minute Cron**:
   - Enable pg_cron in Supabase SQL editor:
     SELECT cron.schedule('reminders', '* * * * *', 'SELECT dispatch_reminders()');
5. **Anthropic Claude 3.5 Sonnet**:
   - Deploy backend/api_chat_claude.ts to Next.js or Cloudflare Workers.
   - Add ANTHROPIC_API_KEY.`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={20} color="var(--primary-600)" />
            <h3 className="modal-title">Backend Architecture & Code</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--slate-200)', paddingBottom: 10, marginBottom: 14 }}>
          <button
            className={`filter-pill ${activeTab === 'schema' ? 'active' : ''}`}
            onClick={() => setActiveTab('schema')}
          >
            SQL Schema
          </button>
          <button
            className={`filter-pill ${activeTab === 'cron' ? 'active' : ''}`}
            onClick={() => setActiveTab('cron')}
          >
            1-Min Cron Worker
          </button>
          <button
            className={`filter-pill ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            Setup Guide
          </button>
        </div>

        {/* Code Content */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() =>
              handleCopy(
                activeTab === 'schema' ? schemaSQL : activeTab === 'cron' ? cronCode : guideText
              )
            }
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid var(--slate-300)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            {copied ? <Check size={12} color="var(--emerald-600)" /> : <Copy size={12} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <pre
            style={{
              background: 'var(--slate-900)',
              color: '#e2e8f0',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              lineHeight: 1.5,
              padding: 16,
              borderRadius: 'var(--radius-md)',
              maxHeight: 380,
              overflow: 'auto',
              whiteSpace: 'pre-wrap'
            }}
          >
            {activeTab === 'schema' && schemaSQL}
            {activeTab === 'cron' && cronCode}
            {activeTab === 'guide' && guideText}
          </pre>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--slate-500)', textAlign: 'center' }}>
          Files are also available in the <code>/backend</code> directory in your project root!
        </div>
      </div>
    </div>
  );
}
