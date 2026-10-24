import React, { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  Smartphone,
  Maximize2,
  Calendar,
  LayoutDashboard,
  Sparkles,
  Bell,
  User,
  Database,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { getLagosNow } from '../utils/timeUtils';
import { CampusLogo } from './CampusLogo';

export function Header({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  onOpenDocs,
  studentProfile,
  onOpenProfile,
  onLogout
}) {
  const [lagosTime, setLagosTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = getLagosNow();
      setLagosTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { id: 'today', label: 'Today', icon: LayoutDashboard },
    { id: 'schedule', label: 'Timetable', icon: Calendar },
    { id: 'ai', label: 'AI Pilot', icon: Sparkles, isHighlight: true },
    { id: 'reminders', label: 'Reminders', icon: Bell },
  ];

  return (
    <header className="app-header">
      {/* Brand & Live Lagos Time */}
      <div className="brand-section">
        <CampusLogo size={38} />
        <div className="brand-info">
          <h1>
            CampusPilot
            <span className="brand-badge">AI • WAT</span>
          </h1>
          <div className="lagos-time-pill" title="Current time in Africa/Lagos (West Africa Time)">
            <span className="lagos-dot pulse-indicator"></span>
            <span>Lagos {lagosTime || '...'}</span>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Bar */}
      <nav className="desktop-nav-links">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`desktop-nav-btn ${isActive ? 'active' : ''} ${item.isHighlight ? 'highlight' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.isHighlight && <span className="ai-sparkle-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Dark / Light Mode Switcher */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#0284c7" />}
        </button>

        {/* View Mode Toggle: Desktop Full / Phone Frame */}
        <button
          className="view-mode-toggle"
          onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
          title={viewMode === 'desktop' ? 'Preview inside mobile phone frame' : 'Expand to full screen desktop'}
        >
          {viewMode === 'desktop' ? <Smartphone size={14} /> : <Maximize2 size={14} />}
          <span>{viewMode === 'desktop' ? 'Phone Preview' : 'Full Screen'}</span>
        </button>

        {/* Backend & SQL Guide */}
        <button
          className="icon-btn"
          onClick={onOpenDocs}
          title="Supabase Schema & Scheduled Reminder Setup"
        >
          <Database size={17} />
        </button>

        {/* Profile Avatar */}
        <button
          className="icon-btn"
          style={{ padding: 0, overflow: 'hidden' }}
          onClick={onOpenProfile}
          title="Student Profile & Settings"
        >
          <img
            src={studentProfile.avatar}
            alt={studentProfile.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </button>

        {/* Log Out */}
        <button
          className="icon-btn logout-btn"
          onClick={onLogout}
          title="Log out & return to intro screen"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
