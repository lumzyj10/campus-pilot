import React, { useRef } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  School,
  Download,
  Upload,
  RefreshCw,
  Database,
  ExternalLink,
  Shield,
  Camera,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { exportEventsToCSV, downloadCSV } from '../utils/csvParser';

export function ProfileView({
  studentProfile,
  onUpdateProfile,
  onOpenEditProfile,
  events,
  onResetSampleData,
  onOpenCsvModal,
  onOpenDocsModal,
  theme,
  onToggleTheme,
  onReplayIntro
}) {
  const fileInputRef = useRef(null);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  ];

  const handleExportCSV = () => {
    const csvContent = exportEventsToCSV(events);
    downloadCSV(csvContent, `CampusPilot_${studentProfile.department}_Timetable.csv`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (typeof base64Url === 'string') {
        onUpdateProfile({
          ...studentProfile,
          avatar: base64Url
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (avatarUrl) => {
    onUpdateProfile({
      ...studentProfile,
      avatar: avatarUrl
    });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 840, margin: '0 auto' }}>
      {/* Student Profile Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 24,
          marginBottom: 20,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
          {/* Avatar Preview with Camera Overlay */}
          <div className="avatar-preview-wrapper" style={{ width: 88, height: 88 }}>
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="avatar-preview-img"
            />
            <button
              type="button"
              className="avatar-camera-badge"
              onClick={() => fileInputRef.current?.click()}
              title="Upload new profile picture"
            >
              <Camera size={14} />
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />

          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 2px 0' }}>
            {studentProfile.name}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            {studentProfile.email}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--emerald-600)',
                background: 'var(--emerald-50)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Shield size={12} />
              Google Account Connected
            </span>
          </div>

          {/* Preset Avatar Selection */}
          <div style={{ marginTop: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              Choose a preset avatar or upload your photo
            </span>
            <div className="preset-avatars-row">
              {presetAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-avatar-btn ${studentProfile.avatar === url ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(url)}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} />
                </button>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed var(--border-strong)',
                  fontSize: 10,
                  fontWeight: 700
                }}
                title="Upload custom image"
              >
                +Upload
              </button>
            </div>
          </div>
        </div>

        {/* Academic Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)',
            fontSize: 13
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>Age</div>
            <strong style={{ color: 'var(--text-main)' }}>{studentProfile.age ? `${studentProfile.age} yrs` : '18 yrs'}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>Occupation / Status</div>
            <strong style={{ color: 'var(--text-main)' }}>{studentProfile.occupation || 'Undergraduate Student'}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>University</div>
            <strong style={{ color: 'var(--text-main)' }}>{studentProfile.university}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>Department</div>
            <strong style={{ color: 'var(--text-main)' }}>{studentProfile.department}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>Academic Level</div>
            <strong style={{ color: 'var(--text-main)' }}>{studentProfile.level}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>Timezone</div>
            <strong style={{ color: 'var(--text-main)' }}>Africa/Lagos (WAT, UTC+1)</strong>
          </div>
        </div>

        <button
          onClick={onOpenEditProfile}
          className="btn-secondary"
          style={{ marginTop: 16 }}
        >
          Edit Academic Details
        </button>
      </div>

      {/* Theme Settings Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 20,
          marginBottom: 20,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Palette size={18} color="var(--primary-600)" />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Appearance & Theme Setting
          </h3>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
          Choose your preferred visual style for studying day or night
        </p>

        <div className="theme-choice-grid">
          <button
            type="button"
            className={`theme-choice-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => onToggleTheme('light')}
          >
            <Sun size={20} color="#f59e0b" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Light Mode</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Crisp & clear academic view</div>
            </div>
          </button>

          <button
            type="button"
            className={`theme-choice-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => onToggleTheme('dark')}
          >
            <Moon size={20} color="#38bdf8" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Dark Mode</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Relaxed for night reading</div>
            </div>
          </button>
        </div>
      </div>

      {/* Timetable Management Actions */}
      <div className="section-heading" style={{ marginBottom: 10 }}>
        <h3 className="section-title">
          <span>Timetable & Data Actions</span>
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {/* Reload Demo Sample */}
        <button
          onClick={onResetSampleData}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RefreshCw size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                Reload 100L Timetable Sample
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Restore realistic GST 101, MAT 111, PHY 101, and CSC 101 demo data
              </div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-600)' }}>Reload</span>
        </button>

        {/* Upload CSV */}
        <button
          onClick={onOpenCsvModal}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--emerald-50)',
                color: 'var(--emerald-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Upload size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                Upload Timetable (CSV)
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Import courses, venues, and lecture times from file
              </div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald-600)' }}>Upload</span>
        </button>

        {/* Export CSV */}
        <button
          onClick={handleExportCSV}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Download size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                Export Timetable (.CSV)
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Download your current schedule ({events.length} events)
              </div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Download</span>
        </button>

        {/* Replay Introductory Page */}
        <button
          onClick={onReplayIntro}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Compass size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                Replay Introductory Welcome Page
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Experience or test the first-time student onboarding page
              </div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-600)' }}>Replay</span>
        </button>

        {/* Backend & Supabase Docs */}
        <button
          onClick={onOpenDocsModal}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--purple-50)',
                color: 'var(--purple-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Database size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                Backend Schema & Cron Setup Guide
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                View Supabase SQL, Edge Functions, and Resend setup steps
              </div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple-600)' }}>View</span>
        </button>
      </div>
    </div>
  );
}
