import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatTime12h, getCountdownDetails } from '../utils/timeUtils';

export function NextUpCard({ nextEvent, onAskAI, onOpenAddEvent }) {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!nextEvent) {
      setCountdown(null);
      return;
    }

    const refresh = () => {
      setCountdown(getCountdownDetails(nextEvent));
    };

    refresh();
    const timer = setInterval(refresh, 1000);
    return () => clearInterval(timer);
  }, [nextEvent]);

  if (!nextEvent) {
    return (
      <div className="hero-empty">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <CheckCircle2 size={36} color="white" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>All Clear for Today!</h3>
        <p style={{ fontSize: 13, opacity: 0.9, maxWidth: 320, margin: '0 auto 16px auto' }}>
          You have completed all scheduled commitments for today in Africa/Lagos.
        </p>
        <button
          onClick={onAskAI}
          style={{
            background: 'white',
            color: 'var(--emerald-700)',
            fontWeight: 700,
            fontSize: 12,
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Sparkles size={14} />
          Plan Evening Study with AI Pilot
        </button>
      </div>
    );
  }

  const isLive = countdown?.status === 'happening_now';

  return (
    <div
      className="next-up-hero animate-slide-up"
      style={{
        background: isLive
          ? 'linear-gradient(135deg, #059669 0%, #047857 70%, #065f46 100%)'
          : undefined
      }}
    >
      <div className="hero-top-row">
        <div className="status-tag">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: isLive ? '#4ade80' : '#38bdf8'
            }}
            className="pulse-indicator"
          />
          {countdown?.badge || 'Up Next'}
        </div>

        <div className="countdown-ticker">
          {countdown?.text || 'Calculating...'}
        </div>
      </div>

      <h2 className="hero-title">
        {nextEvent.courseCode && <span className="hero-code">{nextEvent.courseCode}</span>}
        {nextEvent.title}
      </h2>

      <div className="hero-meta-grid">
        <div className="hero-meta-item">
          <Clock size={15} />
          <span>
            {formatTime12h(nextEvent.startTime)} - {formatTime12h(nextEvent.endTime)}
          </span>
        </div>

        <div className="hero-meta-item">
          <MapPin size={15} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nextEvent.venue || 'Campus Venue TBA'}
          </span>
        </div>

        {nextEvent.lecturer && (
          <div className="hero-meta-item">
            <User size={15} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {nextEvent.lecturer}
            </span>
          </div>
        )}
      </div>

      {nextEvent.notes && (
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.15)',
            fontSize: 12,
            lineHeight: 1.4,
            opacity: 0.95
          }}
        >
          💡 <strong>Prep note:</strong> {nextEvent.notes}
        </div>
      )}
    </div>
  );
}
