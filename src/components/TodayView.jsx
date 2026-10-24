import React from 'react';
import {
  Plus,
  Sparkles,
  Calendar,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Clock,
  AlertCircle,
  Users,
  Compass,
  CheckSquare,
  Edit2,
  Trash2,
  Upload,
  ArrowRight,
  Smile
} from 'lucide-react';
import { NextUpCard } from './NextUpCard';
import {
  getTodayName,
  formatTime12h,
  getEventStatus,
  formatLagosDate,
  findFreeSlotsForDay,
  getLagosNow
} from '../utils/timeUtils';

export function TodayView({
  events,
  studentProfile,
  onOpenAddEvent,
  onOpenEditEvent,
  onDeleteEvent,
  onOpenAI,
  onOpenCsv
}) {
  const today = getTodayName();
  const todayDateFormatted = formatLagosDate();

  // Time-based friendly greeting
  const getGreeting = () => {
    const hour = getLagosNow().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter and sort today's events chronologically
  const todayEvents = events
    .filter(e => e.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Determine current active or next up event
  const nextEvent = todayEvents.find(e => {
    const status = getEventStatus(e);
    return status === 'happening_now' || status === 'upcoming';
  });

  // Calculate quick stats
  const classesCount = todayEvents.filter(e => e.type === 'class').length;
  const studySessionsCount = todayEvents.filter(e => e.type === 'study').length;
  const examsAndDeadlines = events.filter(
    e => e.type === 'exam' || e.type === 'assignment'
  );

  // Free study slots for today
  const todayFreeSlots = findFreeSlotsForDay(events, today, 45);

  const getEventIcon = type => {
    switch (type) {
      case 'class':
        return <GraduationCap size={15} />;
      case 'study':
        return <BookOpen size={15} />;
      case 'assignment':
        return <Clock size={15} />;
      case 'exam':
        return <AlertCircle size={15} />;
      case 'club':
        return <Users size={15} />;
      case 'orientation':
        return <Compass size={15} />;
      default:
        return <CheckSquare size={15} />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Friendly Student Greeting */}
      <div className="today-header-row">
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
            {todayDateFormatted} • West Africa Time (WAT)
          </p>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>
            {getGreeting()}, {studentProfile.name.split(' ')[0]} 👋
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            {studentProfile.university} • {studentProfile.department}
          </p>
        </div>

        <div className="today-header-actions">
          <button
            className="btn-secondary"
            style={{ width: 'auto', padding: '8px 14px', fontSize: 13, borderRadius: 12 }}
            onClick={onOpenCsv}
            title="Import Timetable from CSV"
          >
            <Upload size={14} style={{ marginRight: 6 }} />
            Import CSV
          </button>
          <button
            style={{
              background: 'var(--primary-600)',
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            onClick={onOpenAddEvent}
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      {/* Responsive Friendly Dashboard Grid */}
      <div className="today-responsive-grid">
        {/* Main Column (Hero Card & Today's Timeline) */}
        <div className="today-main-col">
          {/* Next Up Hero Card */}
          <NextUpCard
            nextEvent={nextEvent}
            onAskAI={() => onOpenAI("Plan a study session for me")}
            onOpenAddEvent={onOpenAddEvent}
          />

          {/* Timeline Section Heading */}
          <div className="section-heading">
            <h3 className="section-title">
              <span>Today's Schedule</span>
              <span className="badge-count">{todayEvents.length} events</span>
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {today} Timeline
            </span>
          </div>

          {/* Timeline Cards */}
          {todayEvents.length === 0 ? (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px dashed var(--border-strong)',
                borderRadius: 20,
                padding: '36px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--emerald-50)',
                  color: 'var(--emerald-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto'
                }}
              >
                <Smile size={24} />
              </div>
              <h4 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
                No commitments scheduled for {today}
              </h4>
              <p style={{ fontSize: 13, maxWidth: 320, margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                You have an open day! Add a class manually or ask the AI copilot to schedule a study session.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button
                  onClick={onOpenAddEvent}
                  className="btn-primary"
                  style={{ width: 'auto', padding: '8px 16px', fontSize: 13, borderRadius: 10 }}
                >
                  + Add Event
                </button>
                <button
                  onClick={() => onOpenAI('Suggest reading slots for today')}
                  className="btn-secondary"
                  style={{ width: 'auto', padding: '8px 16px', fontSize: 13, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Sparkles size={14} color="var(--primary-600)" />
                  AI Study Plan
                </button>
              </div>
            </div>
          ) : (
            <div className="timeline-list">
              {todayEvents.map(event => {
                const status = getEventStatus(event);
                const isLive = status === 'happening_now';
                const isPast = status === 'past';

                return (
                  <div
                    key={event.id}
                    className={`timeline-card ${isLive ? 'happening-now' : ''} ${isPast ? 'past' : ''}`}
                    style={{ borderLeft: `4px solid ${event.color || '#0284c7'}` }}
                  >
                    {/* Time Column */}
                    <div className="timeline-time-col">
                      <span className="time-start">{formatTime12h(event.startTime)}</span>
                      <span className="time-end">{formatTime12h(event.endTime)}</span>
                    </div>

                    {/* Content Column */}
                    <div className="timeline-content">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span
                          className="event-type-badge"
                          style={{
                            backgroundColor: `${event.color || '#0284c7'}15`,
                            color: event.color || '#0284c7'
                          }}
                        >
                          {getEventIcon(event.type)}
                          {event.type}
                        </span>

                        {isLive && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              color: 'var(--emerald-600)',
                              background: 'var(--emerald-50)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)'
                            }}
                          >
                            ● LIVE NOW
                          </span>
                        )}
                      </div>

                      <h4 className="event-title">
                        {event.courseCode && (
                          <span style={{ fontWeight: 800, color: event.color || '#0284c7', marginRight: 6 }}>
                            [{event.courseCode}]
                          </span>
                        )}
                        {event.title}
                      </h4>

                      {event.venue && (
                        <div className="event-venue-row">
                          <span>📍</span>
                          <span>{event.venue}</span>
                        </div>
                      )}

                      {event.lecturer && (
                        <div className="event-lecturer-row">
                          <span>👨‍🏫</span>
                          <span>{event.lecturer}</span>
                        </div>
                      )}

                      {event.notes && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                          "{event.notes}"
                        </div>
                      )}

                      {/* Card Actions: Edit / Delete */}
                      <div className="card-actions-row">
                        <button
                          className="mini-action-btn"
                          onClick={() => onOpenEditEvent(event)}
                          title="Edit event"
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                        <button
                          className="mini-action-btn delete"
                          onClick={() => onDeleteEvent(event.id)}
                          title="Delete event"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Column (Stats, Deadlines, AI Study Copilot, Free Windows) */}
        <div className="today-side-col">
          {/* Quick Stats Bar */}
          <div className="today-summary-bar">
            <div className="stat-card">
              <div className="stat-val">{classesCount}</div>
              <div className="stat-label">Classes Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">{studySessionsCount}</div>
              <div className="stat-label">Study Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-val" style={{ color: examsAndDeadlines.length > 0 ? 'var(--rose-500)' : 'var(--text-main)' }}>
                {examsAndDeadlines.length}
              </div>
              <div className="stat-label">Deadlines / Tests</div>
            </div>
          </div>

          {/* Urgent Deadlines Banner */}
          {examsAndDeadlines.length > 0 && (
            <div
              style={{
                background: 'var(--amber-50)',
                border: '1px solid var(--amber-500)',
                borderRadius: 16,
                padding: '14px 16px',
                marginBottom: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <AlertTriangle size={17} color="var(--amber-600)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
                  Upcoming Test / CA Alert
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
                {examsAndDeadlines[0].day}: {examsAndDeadlines[0].courseCode} - {examsAndDeadlines[0].title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {examsAndDeadlines[0].venue || 'Campus Venue'}
              </div>

              <button
                onClick={() => onOpenAI(`How should I prepare for ${examsAndDeadlines[0].courseCode || examsAndDeadlines[0].title}?`)}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--amber-500)',
                  color: 'var(--amber-700)',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '8px 12px',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: 10
                }}
              >
                <Sparkles size={13} />
                Ask AI For High-Yield Study Plan
              </button>
            </div>
          )}

          {/* Friendly AI Copilot Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))',
              color: 'white',
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>CampusPilot AI Study Copilot</h4>
                <p style={{ fontSize: 11, opacity: 0.8, margin: 0 }}>Ask anything about your timetable</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                "What do I have tomorrow?",
                "Am I free Thursday afternoon?",
                "Schedule a study session for CSC 101",
                "Give me tips for surviving 100L classes"
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => onOpenAI(q)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <span>{q}</span>
                  <ArrowRight size={13} style={{ opacity: 0.7 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Today's Free Windows */}
          {todayFreeSlots.length > 0 && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 18,
                padding: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }}>
                  Free Study Windows Today
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: 'var(--emerald-600)',
                    background: 'var(--emerald-50)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {todayFreeSlots.length} open gaps
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {todayFreeSlots.slice(0, 3).map((slot, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-subtle)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>
                        {formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {slot.durationMinutes} mins free • {slot.description}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onOpenAddEvent({
                          day: today,
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                          type: 'study',
                          title: 'Library Focused Study',
                          venue: 'Main Library'
                        })
                      }
                      style={{
                        background: 'var(--emerald-600)',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: 6
                      }}
                    >
                      + Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
