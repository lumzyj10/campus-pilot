import React, { useState, useRef } from 'react';
import {
  Compass,
  Sparkles,
  Camera,
  ArrowRight,
  Sun,
  Moon,
  Smile,
  MapPin,
  CheckCircle2,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusLogo } from './CampusLogo';

export function IntroPage({ onCompleteOnboarding, theme, onToggleTheme }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('18');
  const [occupation, setOccupation] = useState('100L Fresher');
  const [university, setUniversity] = useState('University of Lagos (UNILAG)');
  const [department, setDepartment] = useState('Computer Science');
  const [level, setLevel] = useState('100 Level (Fresher)');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  ];

  const topUniversities = [
    'University of Lagos (UNILAG)',
    'University of Ibadan (UI)',
    'Obafemi Awolowo University (OAU)',
    'Federal University of Technology, Akure (FUTA)',
    'University of Nigeria, Nsukka (UNN)',
    'Ahmadu Bello University (ABU)',
    'Covenant University',
    'Babcock University',
    'Lagos State University (LASU)',
    'Other Institution'
  ];

  const occupations = [
    '100L Fresher',
    'Undergraduate Student',
    'Working Student',
    'Direct Entry Student',
    'Postgraduate Student',
    'Pre-Degree Aspirant'
  ];

  const departments = [
    'Computer Science',
    'Software Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Medicine & Surgery',
    'Law',
    'Accounting',
    'Economics',
    'Mass Communication',
    'Biochemistry',
    'Microbiology'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (typeof base64Url === 'string') {
        setAvatar(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please tell us your name so we can personalize your timetable!');
      return;
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    const newProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      age: age ? parseInt(age, 10) : 18,
      occupation,
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      university,
      department,
      level,
      avatar,
      isOnboarded: true
    };

    onCompleteOnboarding(newProfile, 20);
  };

  const handleQuickDemo = () => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const demoProfile = {
      id: 'usr_unilag_101',
      name: 'Tobi Adeyemi',
      age: 18,
      occupation: '100L Fresher',
      email: 'tobi.adeyemi.freshman@gmail.com',
      university: 'University of Lagos (UNILAG)',
      department: 'Computer Science',
      level: '100 Level (Fresher)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isOnboarded: true
    };

    onCompleteOnboarding(demoProfile, 20);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 16px',
        backgroundImage: `linear-gradient(${
          theme === 'dark'
            ? 'rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.92)'
            : 'rgba(240, 249, 255, 0.86), rgba(240, 253, 244, 0.90)'
        }), url('/campus_intro_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Top Bar with Brand & Theme Switcher */}
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          background: theme === 'dark' ? 'rgba(19, 29, 49, 0.88)' : 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '10px 16px',
          borderRadius: 16,
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CampusLogo size={38} />
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
              CampusPilot
              <span className="brand-badge">AI</span>
            </h1>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Built for Nigerian University Freshers & Students
            </span>
          </div>
        </div>

        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#0284c7" />}
        </button>
      </div>

      {/* Main Friendly Glassmorphic Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          background: theme === 'dark' ? 'rgba(19, 29, 49, 0.94)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 24,
          padding: '28px 24px',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        {/* Warm Student Welcome Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--emerald-50)',
              color: 'var(--emerald-700)',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              marginBottom: 8
            }}
          >
            <Smile size={14} /> Welcome to Campus! 🎓
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            Set Up Your Student Pilot
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Never miss a lecture in crowded halls. Get 20-min Gmail alerts & AI study schedules.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--rose-50)',
              color: 'var(--rose-600)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              marginBottom: 16,
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar / Photo Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <div className="avatar-preview-wrapper" style={{ width: 80, height: 80, margin: '0 auto 8px auto' }}>
              <img src={avatar} alt="Profile preview" className="avatar-preview-img" />
              <button
                type="button"
                className="avatar-camera-badge"
                onClick={() => fileInputRef.current?.click()}
                title="Choose photo"
              >
                <Camera size={14} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
              Tap camera to upload your photo, or pick an avatar:
            </span>

            <div className="preset-avatars-row">
              {presetAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-avatar-btn ${avatar === url ? 'active' : ''}`}
                  onClick={() => setAvatar(url)}
                >
                  <img src={url} alt={`Avatar ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Name & Age Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">What's your name? *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Tobi Adeyemi"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">How old are you?</label>
              <input
                type="number"
                min="14"
                max="80"
                className="form-control"
                placeholder="e.g. 18"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          {/* Occupation / Student Status */}
          <div className="form-group">
            <label className="form-label">What best describes you?</label>
            <select
              className="form-control"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            >
              {occupations.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          {/* University / School */}
          <div className="form-group">
            <label className="form-label">Your University / School</label>
            <select
              className="form-control"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            >
              {topUniversities.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Department & Academic Level */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Department / Course</label>
              <select
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Level</label>
              <select
                className="form-control"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="100 Level (Fresher)">100 Level (Fresher)</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="400 Level">400 Level</option>
              </select>
            </div>
          </div>

          {/* Gmail Address for 20-min automated reminders */}
          <div className="form-group">
            <label className="form-label">Your Gmail Address (Optional)</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. tobi@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 3 }}>
              Sends automatic lecture reminders 20 mins before each class starts.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '13px', fontSize: 15, borderRadius: 14 }}
            >
              <span>Launch CampusPilot</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleQuickDemo}
              style={{ borderRadius: 14, padding: '10px' }}
            >
              Or Try Immediate Demo (Tobi, 100L CS @ UNILAG)
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.75)',
          textAlign: 'center',
          background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(6px)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)'
        }}
      >
        CampusPilot • Designed for University Students in Nigeria (WAT, UTC+1)
      </div>
    </div>
  );
}
