import React, { useState, useRef } from 'react';
import { X, Check, Compass, Shield, Sparkles, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

export function OnboardingModal({ isOpen, onClose, onSave, currentProfile }) {
  const [name, setName] = useState(currentProfile?.name || 'Tobi Adeyemi');
  const [email, setEmail] = useState(currentProfile?.email || 'tobi.adeyemi.freshman@gmail.com');
  const [university, setUniversity] = useState(currentProfile?.university || 'University of Lagos (UNILAG)');
  const [department, setDepartment] = useState(currentProfile?.department || 'Computer Science');
  const [level, setLevel] = useState(currentProfile?.level || '100 Level');
  const [leadTime, setLeadTime] = useState(20);
  const [avatar, setAvatar] = useState(currentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

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
    'Lagos State University (LASU)'
  ];

  const departments = [
    'Computer Science',
    'Software Engineering',
    'Electrical / Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Medicine & Surgery',
    'Law',
    'Accounting',
    'Economics',
    'Mass Communication',
    'Biochemistry',
    'Microbiology'
  ];

  const levels = ['100 Level (Fresher)', '200 Level', '300 Level', '400 Level', '500 Level'];

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

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // non-critical
    }

    onSave({
      ...currentProfile,
      name,
      email,
      university,
      department,
      level,
      avatar,
      isOnboarded: true
    }, leadTime);

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div className="avatar-preview-wrapper" style={{ margin: '0 auto 10px auto' }}>
            <img src={avatar} alt="Profile" className="avatar-preview-img" />
            <button
              type="button"
              className="avatar-camera-badge"
              onClick={() => fileInputRef.current?.click()}
              title="Change profile picture"
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

          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Student Profile & Settings
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Set your photo, academic details, and reminder preferences
          </p>

          {/* Quick Avatar selection row */}
          <div className="preset-avatars-row">
            {presetAvatars.map((url, idx) => (
              <button
                key={idx}
                type="button"
                className={`preset-avatar-btn ${avatar === url ? 'active' : ''}`}
                onClick={() => setAvatar(url)}
              >
                <img src={url} alt={`Preset ${idx + 1}`} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--primary-600)',
                background: 'var(--primary-50)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-full)',
                alignSelf: 'center'
              }}
            >
              + Upload Photo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">University / Institution</label>
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

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Department</label>
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
                {levels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Gmail Reminder Lead Time</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[10, 20, 30, 60].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  className={`lead-time-btn ${leadTime === mins ? 'active' : ''}`}
                  onClick={() => setLeadTime(mins)}
                  style={{ padding: '8px 4px' }}
                >
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{mins}m</span>
                  <span style={{ fontSize: 9, opacity: 0.8 }}>Before</span>
                </button>
              ))}
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
              Automated reminders will be delivered to {email}
            </span>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 14 }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
