// Supabase Edge Function: Automated Gmail Reminder Dispatcher
// Runs every minute via pg_cron or Vercel/Supabase Cron
// Timezone: Africa/Lagos (WAT, UTC+1)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const APP_URL = Deno.env.get('APP_URL') || 'https://campuspilot.app';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    console.log('[CampusPilot Cron] Checking pending reminders at:', new Date().toISOString());

    // 1. Fetch all pending reminders due right now from the PostgreSQL view
    const { data: pendingReminders, error: fetchError } = await supabase
      .from('pending_event_reminders')
      .select('*');

    if (fetchError) {
      console.error('[CampusPilot Cron] Error fetching reminders:', fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
    }

    if (!pendingReminders || pendingReminders.length === 0) {
      return new Response(JSON.stringify({ message: 'No reminders due right now.', count: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`[CampusPilot Cron] Found ${pendingReminders.length} reminder(s) to send.`);
    const results = [];

    // 2. Process each reminder
    for (const item of pendingReminders) {
      try {
        const timeFormatted = format12h(item.start_time);
        const subject = `⏰ Reminder: ${item.course_code ? `${item.course_code} - ` : ''}${item.title} starts in ${item.lead_time_minutes} mins!`;
        
        const htmlEmail = generateReminderEmailHtml({
          studentName: item.student_name,
          title: item.title,
          courseCode: item.course_code,
          type: item.type,
          startTime: timeFormatted,
          endTime: format12h(item.end_time),
          venue: item.venue || 'Campus Venue TBA',
          lecturer: item.lecturer || 'Department Lecturer',
          leadTime: item.lead_time_minutes,
          appUrl: APP_URL
        });

        // 3. Send email via Resend API (or SendGrid/Gmail)
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'CampusPilot <notifications@campuspilot.app>',
            to: item.email_address,
            subject,
            html: htmlEmail
          })
        });

        const resData = await emailRes.json();

        if (!emailRes.ok) {
          throw new Error(`Resend API error: ${JSON.stringify(resData)}`);
        }

        // 4. Record into reminders_sent table to guarantee NO duplicate emails
        await supabase.from('reminders_sent').insert({
          user_id: item.user_id,
          event_id: item.event_id,
          target_date: item.today_date,
          recipient_email: item.email_address,
          status: 'sent'
        });

        results.push({ event_id: item.event_id, recipient: item.email_address, status: 'sent' });
      } catch (err: any) {
        console.error(`Failed to send reminder for event ${item.event_id}:`, err);
        // Log failure
        await supabase.from('reminders_sent').insert({
          user_id: item.user_id,
          event_id: item.event_id,
          target_date: item.today_date,
          recipient_email: item.email_address,
          status: 'failed',
          error_message: err.message
        });
        results.push({ event_id: item.event_id, recipient: item.email_address, status: 'failed', error: err.message });
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (globalErr: any) {
    return new Response(JSON.stringify({ error: globalErr.message }), { status: 500 });
  }
});

function format12h(timeStr: string) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  const mm = m < 10 ? `0${m}` : m;
  return `${hour12}:${mm} ${period}`;
}

function generateReminderEmailHtml(data: {
  studentName: string;
  title: string;
  courseCode?: string;
  type: string;
  startTime: string;
  endTime: string;
  venue: string;
  lecturer: string;
  leadTime: number;
  appUrl: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
      .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 24px; text-align: left; }
      .content { padding: 24px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; background: #e0f2fe; color: #0369a1; text-transform: uppercase; margin-bottom: 12px; }
      .event-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
      .detail-row { display: flex; align-items: center; margin-bottom: 12px; font-size: 15px; color: #334155; }
      .detail-icon { margin-right: 10px; font-size: 16px; }
      .button { display: block; text-align: center; background: #0284c7; color: #ffffff !important; padding: 14px 20px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 24px; }
      .footer { text-align: center; font-size: 12px; color: #64748b; padding: 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h2 style="margin:0; font-size: 20px;">🎓 CampusPilot Reminder</h2>
        <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Africa/Lagos Timezone (WAT)</p>
      </div>
      <div class="content">
        <div class="badge">${data.leadTime} Minutes Notice</div>
        <h3 class="event-title">${data.courseCode ? `[${data.courseCode}] ` : ''}${data.title}</h3>
        
        <div class="detail-row">
          <span class="detail-icon">⏰</span>
          <strong>Time:</strong>&nbsp;${data.startTime} - ${data.endTime}
        </div>
        <div class="detail-row">
          <span class="detail-icon">📍</span>
          <strong>Venue:</strong>&nbsp;${data.venue}
        </div>
        ${data.lecturer ? `
        <div class="detail-row">
          <span class="detail-icon">👨‍🏫</span>
          <strong>Lecturer:</strong>&nbsp;${data.lecturer}
        </div>` : ''}

        <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
          Hi ${data.studentName.split(' ')[0]}, head over now to get a comfortable seat before the venue fills up!
        </p>

        <a href="${data.appUrl}" class="button">Open CampusPilot Timetable</a>
      </div>
      <div class="footer">
        You are receiving this reminder because you subscribed on CampusPilot.<br>
        Change your reminder window (10, 20, 30, 60 mins) anytime in app settings.
      </div>
    </div>
  </body>
  </html>
  `;
}
