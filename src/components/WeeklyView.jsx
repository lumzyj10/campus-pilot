import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  GraduationCap,
  BookOpen,
  Clock,
  AlertCircle,
  Users,
  Compass,
  CheckSquare,
  Edit2,
  Trash2,
  Repeat
} from 'lucide-react';
import {
  DAYS_OF_WEEK,
  getTodayName,
  formatTime12h,
  findFreeSlotsForDay
} from '../utils/timeUtils';
import { EVENT_TYPES } from '../data/sampleData';

export function WeeklyView({
  events,
  onOpenAddEvent,
  onOpenEditEvent,
  onDeleteEvent,
  onOpenAI
}) {
  const today = getTodayName();
  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  // Filter events for the selected day and type
  const dayEvents = events
    .filter(e => e.day === selectedDay)
    .filter(e => (selectedTypeFilter === 'all' ? true : e.type === selectedTypeFilter))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Count events per day for the pill indicators
  const eventCountsByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = events.filter(e => e.day === day).length;
    return acc;
  }, {});

  // Find free slots for the selected day
  const freeSlots = findFreeSlotsForDay(events, selectedDay, 45);

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
      {/* Title & Add Event button */}
      <div className="section-heading" style={{ marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>
            Weekly Timetable
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            Switch days to view schedules, lectures, and open study slots
          </p>
        </div>
        <button
          className="btn-primary"
          style={{
            width: 'auto',
            fontSize: 13,
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
          onClick={() => onOpenAddEvent({ day: selectedDay })}
        >
          <Plus size={15} />
          Add Event
        </button>
      </div>

      {/* Day Selector Strip (Mon - Sun) */}
      <div className="day-selector-strip">
        {DAYS_OF_WEEK.map(day => {
          const isSelected = day === selectedDay;
          const isToday = day === today;
          const count = eventCountsByDay[day] || 0;

          return (
            <button
              key={day}
              className={`day-pill ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <span className="day-pill-short">{day.substring(0, 3)}</span>
              {isToday && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isSelected ? '#bae6fd' : 'var(--primary-600)'
                  }}
                >
                  Today
                </span>
              )}
              {count > 0 && <span className="day-pill-dot" />}
            </button>
          );
        })}
      </div>

      {/* Event Type Filter Chips */}
      <div className="filter-pills-row">
        <button
          className={`filter-pill ${selectedTypeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTypeFilter('all')}
        >
          All ({events.filter(e => e.day === selectedDay).length})
        </button>
        {EVENT_TYPES.map(typeObj => {
          const count = events.filter(e => e.day === selectedDay && e.type === typeObj.id).length;
          if (count === 0 && selectedTypeFilter !== typeObj.id) return null;
          return (
            <button
              key={typeObj.id}
              className={`filter-pill ${selectedTypeFilter === typeObj.id ? 'active' : ''}`}
              onClick={() => setSelectedTypeFilter(typeObj.id)}
            >
              {typeObj.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Schedule for Selected Day */}
      {dayEvents.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-strong)',
            borderRadius: 20,
            padding: '36px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            marginBottom: 20
          }}
        >
          <h4 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
            No events scheduled for {selectedDay}
          </h4>
          <p style={{ fontSize: 13, maxWidth: 320, margin: '0 auto 16px auto', lineHeight: 1.5 }}>
            No lectures or deadlines found. You can add one or use open hours for study.
          </p>
          <button
            onClick={() => onOpenAddEvent({ day: selectedDay })}
            className="btn-primary"
            style={{ width: 'auto', padding: '8px 18px', borderRadius: 10, fontSize: 13 }}
          >
            + Add to {selectedDay}
          </button>
        </div>
      ) : (
        <div className="timeline-list" style={{ marginBottom: 20 }}>
          {dayEvents.map(event => (
            <div
              key={event.id}
              className="timeline-card"
              style={{ borderLeft: `4px solid ${event.color || '#0284c7'}` }}
            >
              <div className="timeline-time-col">
                <span className="time-start">{formatTime12h(event.startTime)}</span>
                <span className="time-end">{formatTime12h(event.endTime)}</span>
                {event.repeatsWeekly && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      fontSize: 10,
                      color: 'var(--slate-400)',
                      marginTop: 4
                    }}
                    title="Repeats weekly"
                  >
                    <Repeat size={10} /> Weekly
                  </span>
                )}
              </div>

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
                  <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 4, fontStyle: 'italic' }}>
                    "{event.notes}"
                  </div>
                )}

                <div className="card-actions-row">
                  <button
                    className="mini-action-btn"
                    onClick={() => onOpenEditEvent(event)}
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button
                    className="mini-action-btn delete"
                    onClick={() => onDeleteEvent(event.id)}
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Smart Free Slots Detection Widget */}
      {freeSlots.length > 0 && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 18,
            padding: 18
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} color="var(--emerald-600)" />
              <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>
                Free Study Windows on {selectedDay}
              </h4>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--emerald-600)',
                background: 'var(--emerald-50)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {freeSlots.length} available
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {freeSlots.map((slot, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
                    {formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                    ({slot.durationMinutes} mins free)
                  </span>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {slot.description}
                  </div>
                </div>

                <button
                  onClick={() =>
                    onOpenAddEvent({
                      day: selectedDay,
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                      type: 'study',
                      title: 'Library Focused Study',
                      venue: 'Main Library / Study Hall'
                    })
                  }
                  style={{
                    background: 'var(--emerald-600)',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  + Book Slot
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
