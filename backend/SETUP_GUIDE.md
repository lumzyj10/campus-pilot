# CampusPilot Backend & Automation Setup Guide
*Tailored for beginners: Step-by-step setup for Google Sign-In, Supabase Database, Resend Emails, and 1-Minute Cron Reminders.*

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │    CampusPilot Mobile Web App (PWA)    │
                      │  - Schedule & Timetable (Today & Week) │
                      │  - AI Study Assistant (Claude Tools)   │
                      │  - Email Simulator & Reminder Controls │
                      └───────────────────┬────────────────────┘
                                          │
                      ┌───────────────────┴────────────────────┐
                      ▼                                        ▼
         ┌─────────────────────────┐             ┌─────────────────────────┐
         │     Supabase Auth       │             │   Anthropic API Route   │
         │  (Google Sign-In OAuth) │             │  (Claude 3.5 Sonnet)    │
         └────────────┬────────────┘             └─────────────────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │ PostgreSQL Database     │
         │  - profiles             │
         │  - events               │
         │  - reminder_settings    │
         │  - reminders_sent (Log) │
         └────────────┬────────────┘
                      │ (Every minute cron)
                      ▼
         ┌─────────────────────────┐
         │  Scheduled Edge Worker  │ ──► [Resend / Gmail API] ──► Student's Gmail
         │  (Africa/Lagos WAT)     │                              (20 mins before)
         └─────────────────────────┘
```

---

## Step 1: Create a Free Supabase Project

1. Go to [supabase.com](https://supabase.com) and click **Sign Up** (or Sign In with GitHub).
2. Click **New Project**:
   - **Name:** `campuspilot`
   - **Database Password:** Pick a secure password.
   - **Region:** Choose `Europe (Frankfurt or London)` (closest to West Africa with lowest latency).
3. Once the database is provisioned (takes ~1 minute), go to the left sidebar and click **SQL Editor**.
4. Click **New Query**, copy the entire contents of [`backend/supabase_schema.sql`](./supabase_schema.sql), paste it into the editor, and click **Run**.
   - This creates all tables (`profiles`, `events`, `reminder_settings`, `reminders_sent`, `chat_messages`), security policies, and the `pending_event_reminders` view.

---

## Step 2: Configure Google Sign-In (OAuth)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project named **CampusPilot**.
3. Go to **APIs & Services** > **OAuth consent screen**:
   - User Type: **External**
   - App Name: `CampusPilot`
   - User support email: Select your email
   - Developer contact info: Enter your email
   - Click **Save and Continue** until done.
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**:
   - Application type: **Web application**
   - Name: `CampusPilot Web Client`
   - **Authorized redirect URIs**:
     - Go back to your Supabase Dashboard: **Authentication** > **Providers** > **Google**.
     - Copy the **Callback URL (for OAuth)** (looks like `https://<your-project>.supabase.co/auth/v1/callback`).
     - Paste this into Google's "Authorized redirect URIs" field.
   - Click **Create**.
5. Copy the generated **Client ID** and **Client Secret**.
6. In Supabase, toggle **Google** to **Enabled**, paste your **Client ID** and **Client Secret**, and click **Save**.

---

## Step 3: Configure Resend for Automated Emails

1. Go to [resend.com](https://resend.com) and create a free account (includes 3,000 emails/month free).
2. Go to **API Keys** > **Create API Key**:
   - Name: `campuspilot-reminders`
   - Permission: Full access
   - Copy the key (`re_...`).
3. *(Optional for testing)*: In free mode, you can immediately send test emails to your own registered email address. For sending to any student domain (`@unilag.edu.ng` or `@gmail.com`), add and verify your custom domain in Resend DNS settings.

---

## Step 4: Deploy the Scheduled 1-Minute Cron Job

There are two easy methods to run the reminder worker every minute:

### Method A: Supabase Edge Functions + pg_cron (Recommended)
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```
2. Deploy the function:
   ```bash
   supabase functions deploy scheduled_reminder_function
   supabase secrets set RESEND_API_KEY=re_your_api_key_here
   ```
3. In Supabase **SQL Editor**, enable `pg_cron` and schedule it every minute:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_cron;

   -- Trigger edge function every minute
   SELECT cron.schedule(
     'dispatch-student-reminders',
     '* * * * *',
     $$
     SELECT
       net.http_post(
           url:='https://<your-project-ref>.supabase.co/functions/v1/scheduled_reminder_function',
           headers:='{"Content-Type": "application/json", "Authorization": "Bearer <YOUR_SERVICE_ROLE_KEY>"}'::jsonb
       ) as request_id;
     $$
   );
   ```

### Method B: Vercel Cron or GitHub Action (No CLI required)
If you host your app on Vercel, simply add a `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "* * * * *"
    }
  ]
}
```

---

## Step 5: Configure Anthropic API (Claude 3.5 Sonnet)

1. Go to [console.anthropic.com](https://console.anthropic.com) and generate an API Key.
2. In your hosting environment (Vercel, Render, or `.env.local`), add:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
3. Use [`backend/api_chat_claude.ts`](./api_chat_claude.ts) as your `/api/chat` route. The agent uses native tool calling to interact with the student's timetable.

---

## Step 6: Connect Frontend (.env)

Create a `.env` file in `campus-pilot/`:
```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_APP_URL=http://localhost:5173
```
*Note: The frontend currently runs in demo mode with full offline state, realistic sample data, and email simulator so you can test all flows instantly before connecting live credentials!*
