import React from 'react';
import {
  Bell,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';
import { EVENT_TYPES } from '../data/sampleData';
import { formatTime12h } from '../utils/timeUtils';

export function RemindersView({
  reminderSettings,
  onUpdateSettings,
  studentProfile,
  sampleEvent,
  onTriggerTestEmail
}) {
  const leadTimes = [10, 20, 30, 60];

  const handleLeadTimeChange = mins => {
    onUpdateSettings({ ...reminderSettings, leadTimeMinutes: mins });
  };

  const handleToggleType = typeId => {
    onUpdateSettings({
      ...reminderSettings,
      enabledTypes: {
        ...reminderSettings.enabledTypes,
        [typeId]: !reminderSettings.enabledTypes[typeId]
      }
    });
  };

  const previewEvent = sampleEvent || {
    title: 'Intro to Computer Science & Problem Solving',
    courseCode: 'CSC 101',
    type: 'class',
    day: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    venue: 'Faculty of Science LT 1',
    lecturer: 'Dr. Adeyemo & Dr. Folashade'
  };

  return (
    <div className="animate-fade-in">
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--slate-900)' }}>
          Automated Gmail Reminders
        </h2>
        <p style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 2 }}>
          Server-side cron worker sends alerts to your student Gmail before lectures, practicals, and exams
        </p>
      </div>

      {/* 2-Column Responsive Layout for Desktop */}
      <div className="reminders-responsive-grid">
        {/* Left Column: Settings, Lead Times, Per-type toggles */}
        <div className="reminders-settings-col">
          {/* Target Gmail Address */}
          <div
            style={{
              background: 'white',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                  Delivery Destination (Google Sign-In)
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--slate-900)' }}>
                  {studentProfile.email}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--emerald-700)',
                background: 'var(--emerald-100)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <ShieldCheck size={14} />
              Connected
            </span>
          </div>

          {/* Lead Time Selection */}
          <div className="section-heading" style={{ marginBottom: 8 }}>
            <h3 className="section-title">
              <span>Reminder Lead Time</span>
            </h3>
            <span style={{ fontSize: 12, color: 'var(--slate-500)' }}>
              How early before event start?
            </span>
          </div>

          <div className="lead-time-grid">
            {leadTimes.map(mins => (
              <button
                key={mins}
                className={`lead-time-btn ${reminderSettings.leadTimeMinutes === mins ? 'active' : ''}`}
                onClick={() => handleLeadTimeChange(mins)}
              >
                <span className="lead-num">{mins}</span>
                <span className="lead-unit">Minutes</span>
              </button>
            ))}
          </div>

          {/* Per-Event-Type Toggles */}
          <div className="section-heading" style={{ marginBottom: 8 }}>
            <h3 className="section-title">
              <span>Event Categories</span>
            </h3>
            <span style={{ fontSize: 12, color: 'var(--slate-500)' }}>
              Toggle automated alerts
            </span>
          </div>

          <div className="toggle-list">
            {EVENT_TYPES.map(typeObj => {
              const isEnabled = !!reminderSettings.enabledTypes[typeObj.id];
              return (
                <div key={typeObj.id} className="toggle-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: typeObj.bg,
                        color: typeObj.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 13
                      }}
                    >
                      {typeObj.label.charAt(0)}
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)' }}>
                        {typeObj.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                        {isEnabled
                          ? `Sends email ${reminderSettings.leadTimeMinutes}m before start time`
                          : 'Reminders disabled for this type'}
                      </div>
                    </div>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggleType(typeObj.id)}
                    />
                    <span className="slider" />
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Server Cron Status & Live Gmail Mockup */}
        <div className="reminders-preview-col">
          {/* Backend Worker Status Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Server size={22} color="var(--emerald-500)" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Server-Side Cron Worker</span>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'var(--emerald-500)'
                    }}
                    className="pulse-indicator"
                  />
                </div>
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                  Runs every 60 seconds • Africa/Lagos (WAT, UTC+1)
                </div>
              </div>
            </div>

            <button
              onClick={onTriggerTestEmail}
              style={{
                background: 'var(--primary-600)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Send size={13} />
              Send Test Email
            </button>
          </div>

          {/* Live Gmail Email Preview Mockup */}
          <div className="section-heading" style={{ marginBottom: 8 }}>
            <h3 className="section-title">
              <span>Live Gmail Email Preview</span>
            </h3>
            <span style={{ fontSize: 12, color: 'var(--slate-500)' }}>
              Responsive HTML Template
            </span>
          </div>

          <div className="email-mockup-card">
            <div className="email-mockup-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--primary-600)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800
                  }}
                >
                  CP
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate-900)' }}>
                    CampusPilot Notifications &lt;notifications@campuspilot.app&gt;
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--slate-500)' }}>
                    To: {studentProfile.email}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--slate-400)' }}>Just now</span>
            </div>

            <div className="email-mockup-body">
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: 'var(--primary-700)',
                  background: 'var(--primary-50)',
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 10,
                  textTransform: 'uppercase'
                }}
              >
                ⏰ {reminderSettings.leadTimeMinutes} MINUTES NOTICE
              </div>

              <h4 style={{ fontSize: 17, fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 12px 0' }}>
                {previewEvent.courseCode ? `[${previewEvent.courseCode}] ` : ''}
                {previewEvent.title}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--slate-700)', fontSize: 13 }}>
                <div>
                  ⏰ <strong>Time:</strong> {formatTime12h(previewEvent.startTime)} - {formatTime12h(previewEvent.endTime)} (WAT)
                </div>
                <div>
                  📍 <strong>Venue:</strong> {previewEvent.venue || 'Campus Venue TBA'}
                </div>
                {previewEvent.lecturer && (
                  <div>
                    👨‍🏫 <strong>Lecturer:</strong> {previewEvent.lecturer}
                  </div>
                )}
              </div>

              <p style={{ fontSize: 13, color: 'var(--slate-600)', marginTop: 14, lineHeight: 1.5 }}>
                Hi {studentProfile.name.split(' ')[0]}, get moving now to secure a good front seat at {previewEvent.venue || 'the hall'}!
              </p>

              <a
                href="#timetable"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: 'var(--primary-600)',
                  color: 'white',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 13,
                  marginTop: 16
                }}
                onClick={e => e.preventDefault()}
              >
                Open CampusPilot Schedule
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
