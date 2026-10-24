import React from 'react';
import { Calendar, LayoutDashboard, Sparkles, Bell, User } from 'lucide-react';

export function BottomNav({ activeTab, setActiveTab, unreadRemindersCount = 0 }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${activeTab === 'today' ? 'active' : ''}`}
        onClick={() => setActiveTab('today')}
      >
        {activeTab === 'today' && <span className="nav-active-pip" />}
        <div className="nav-icon-wrapper">
          <LayoutDashboard size={20} />
        </div>
        <span className="nav-label">Today</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
        onClick={() => setActiveTab('schedule')}
      >
        {activeTab === 'schedule' && <span className="nav-active-pip" />}
        <div className="nav-icon-wrapper">
          <Calendar size={20} />
        </div>
        <span className="nav-label">Timetable</span>
      </button>

      {/* Center AI Pilot floating bubble */}
      <button
        className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`}
        onClick={() => setActiveTab('ai')}
        style={{ flex: 1.1 }}
      >
        <div className="nav-ai-bubble" title="AI Study Assistant">
          <Sparkles size={22} />
        </div>
        <span className="nav-label" style={{ fontWeight: 700, color: activeTab === 'ai' ? 'var(--primary-600)' : 'var(--slate-600)' }}>
          AI Pilot
        </span>
      </button>

      <button
        className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`}
        onClick={() => setActiveTab('reminders')}
      >
        {activeTab === 'reminders' && <span className="nav-active-pip" />}
        <div className="nav-icon-wrapper">
          <Bell size={20} />
          {unreadRemindersCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--emerald-500)'
              }}
            />
          )}
        </div>
        <span className="nav-label">Reminders</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        {activeTab === 'profile' && <span className="nav-active-pip" />}
        <div className="nav-icon-wrapper">
          <User size={20} />
        </div>
        <span className="nav-label">Profile</span>
      </button>
    </nav>
  );
}
