import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Tag, BookOpen, AlertCircle } from 'lucide-react';
import { EVENT_TYPES, COLOR_OPTIONS } from '../data/sampleData';
import { DAYS_OF_WEEK } from '../utils/timeUtils';

export function EventModal({ isOpen, onClose, onSave, editingEvent, initialDay }) {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [type, setType] = useState('class');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [venue, setVenue] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [notes, setNotes] = useState('');
  const [repeatsWeekly, setRepeatsWeekly] = useState(true);
  const [color, setColor] = useState('#0284c7');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setCourseCode(editingEvent.courseCode || '');
      setType(editingEvent.type || 'class');
      setDay(editingEvent.day || 'Monday');
      setStartTime(editingEvent.startTime || '09:00');
      setEndTime(editingEvent.endTime || '10:00');
      setVenue(editingEvent.venue || '');
      setLecturer(editingEvent.lecturer || '');
      setNotes(editingEvent.notes || '');
      setRepeatsWeekly(editingEvent.repeatsWeekly !== false);
      setColor(editingEvent.color || '#0284c7');
    } else {
      setTitle('');
      setCourseCode('');
      setType('class');
      setDay(initialDay || 'Monday');
      setStartTime('09:00');
      setEndTime('11:00');
      setVenue('');
      setLecturer('');
      setNotes('');
      setRepeatsWeekly(true);
      setColor('#0284c7');
    }
    setError('');
  }, [editingEvent, initialDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event Title is required.');
      return;
    }

    if (startTime >= endTime) {
      setError('Start time must be earlier than end time.');
      return;
    }

    const payload = {
      id: editingEvent ? editingEvent.id : `ev-${Date.now()}`,
      title: title.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      type,
      day,
      startTime,
      endTime,
      venue: venue.trim(),
      lecturer: lecturer.trim(),
      notes: notes.trim(),
      repeatsWeekly,
      color
    };

    onSave(payload);
    onClose();
  };

  const venueSuggestions = [
    'Faculty of Science LT 1',
    'FET Main Auditorium Room 2',
    'Maths Department Hall B',
    'Main Library (Quiet Wing)',
    'CITS Computer Lab 3',
    'Science Complex Room 204'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingEvent ? 'Edit Timetable Event' : 'Add New Event'}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--rose-50)',
              color: 'var(--rose-600)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Event Title */}
          <div className="form-group">
            <label className="form-label">Event / Subject Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Intro to Computing / Algebra / Library Study"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Type & Course Code */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Course Code (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CSC 101 / GST 101"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          {/* Day & Times */}
          <div className="form-group">
            <label className="form-label">Day of Week</label>
            <select
              className="form-control"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Start Time (WAT)</label>
              <input
                type="time"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time (WAT)</label>
              <input
                type="time"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Venue */}
          <div className="form-group">
            <label className="form-label">Venue / Room</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Faculty LT 1 / Hall B / Library"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
            {/* Quick venue tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {venueSuggestions.slice(0, 3).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setVenue(v)}
                  style={{
                    background: 'var(--slate-100)',
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--slate-600)'
                  }}
                >
                  + {v}
                </button>
              ))}
            </div>
          </div>

          {/* Lecturer */}
          <div className="form-group">
            <label className="form-label">Lecturer / Instructor (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dr. Adeyemo / Prof. Okeke"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Preparation Notes / Task Reminders</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. Bring scientific calculator, submit assignment before class"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Repeats & Color Palette */}
          <div className="form-group">
            <label className="form-label">Color Code Tag</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: color === c.hex ? '3px solid white' : 'none',
                    boxShadow: color === c.hex ? `0 0 0 2px ${c.hex}` : 'none',
                    transform: color === c.hex ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
            <input
              type="checkbox"
              id="repeatWeekly"
              checked={repeatsWeekly}
              onChange={(e) => setRepeatsWeekly(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--primary-600)' }}
            />
            <label htmlFor="repeatWeekly" style={{ fontSize: 13, color: 'var(--slate-700)', cursor: 'pointer' }}>
              Repeats every week on this day
            </label>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>
            {editingEvent ? 'Save Changes' : 'Add to Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
}
