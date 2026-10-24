import React, { useState, useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayView } from './components/TodayView';
import { WeeklyView } from './components/WeeklyView';
import { AIAssistantChat } from './components/AIAssistantChat';
import { RemindersView } from './components/RemindersView';
import { ProfileView } from './components/ProfileView';
import { EventModal } from './components/EventModal';
import { CsvImportModal } from './components/CsvImportModal';
import { BackendDocsModal } from './components/BackendDocsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { IntroPage } from './components/IntroPage';
import {
  DEFAULT_USER,
  SAMPLE_TIMETABLE_EVENTS,
  INITIAL_REMINDER_SETTINGS
} from './data/sampleData';

export default function App() {
  // Persistence with LocalStorage
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('campuspilot_events');
      return saved ? JSON.parse(saved) : SAMPLE_TIMETABLE_EVENTS;
    } catch {
      return SAMPLE_TIMETABLE_EVENTS;
    }
  });

  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('campuspilot_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.age === undefined || parsed.occupation === undefined) {
          return { ...DEFAULT_USER, ...parsed, isOnboarded: false };
        }
        return parsed;
      }
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [reminderSettings, setReminderSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('campuspilot_reminders');
      return saved ? JSON.parse(saved) : INITIAL_REMINDER_SETTINGS;
    } catch {
      return INITIAL_REMINDER_SETTINGS;
    }
  });

  // UI Navigation & View Modes
  const [activeTab, setActiveTab] = useState('today');
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' (full width responsive) or 'mobile'
  
  // Theme: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('campuspilot_theme');
      if (saved) return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('campuspilot_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const handleToggleTheme = (specificTheme) => {
    if (typeof specificTheme === 'string') {
      setTheme(specificTheme);
      showToast(`${specificTheme === 'dark' ? '🌙 Dark Theme' : '☀️ Light Theme'} enabled`);
    } else {
      setTheme((prev) => {
        const next = prev === 'dark' ? 'light' : 'dark';
        showToast(`${next === 'dark' ? '🌙 Dark Theme' : '☀️ Light Theme'} enabled`);
        return next;
      });
    }
  };

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [initialDayForModal, setInitialDayForModal] = useState('Monday');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Chat Prefilled Prompt
  const [prefilledAiPrompt, setPrefilledAiPrompt] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campuspilot_events', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('campuspilot_user', JSON.stringify(studentProfile));
    } catch (e) {
      console.error(e);
    }
  }, [studentProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('campuspilot_reminders', JSON.stringify(reminderSettings));
    } catch (e) {
      console.error(e);
    }
  }, [reminderSettings]);

  // Event CRUD operations
  const handleSaveEvent = (savedEvent) => {
    setEvents((prev) => {
      const index = prev.findIndex((e) => e.id === savedEvent.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = savedEvent;
        return updated;
      }
      return [...prev, savedEvent];
    });
    showToast(editingEvent ? 'Event updated successfully' : 'Added to your timetable');
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Event removed from timetable');
  };

  const handleOpenAddEvent = (opts = {}) => {
    setEditingEvent(null);
    setInitialDayForModal(opts.day || 'Monday');
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleImportCsvEvents = (newEvents, mode) => {
    if (mode === 'replace') {
      setEvents(newEvents);
      showToast(`Replaced timetable with ${newEvents.length} events from CSV`);
    } else {
      setEvents((prev) => [...prev, ...newEvents]);
      showToast(`Imported ${newEvents.length} events from CSV`);
    }
  };

  const handleResetSampleData = () => {
    setEvents(SAMPLE_TIMETABLE_EVENTS);
    showToast('Reloaded Nigerian 100L Sample Timetable!');
  };

  const handleTriggerTestEmail = () => {
    const nextDue = events[0] || SAMPLE_TIMETABLE_EVENTS[0];
    showToast(`📨 Simulated email sent to ${studentProfile.email} (${reminderSettings.leadTimeMinutes}m alert for ${nextDue.courseCode || nextDue.title})`);
  };

  const handleOpenAiWithPrompt = (prompt) => {
    setPrefilledAiPrompt(prompt);
    setActiveTab('ai');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('campuspilot_user');
      localStorage.removeItem('campuspilot_events');
      localStorage.removeItem('campuspilot_reminders');
    } catch (e) {
      console.error(e);
    }
    setStudentProfile(DEFAULT_USER);
    setActiveTab('today');
  };

  if (!studentProfile || !studentProfile.isOnboarded) {
    return (
      <IntroPage
        onCompleteOnboarding={(newProfile, leadTime) => {
          setStudentProfile(newProfile);
          if (leadTime) {
            setReminderSettings((prev) => ({ ...prev, leadTimeMinutes: leadTime }));
          }
          showToast(`Welcome to CampusPilot, ${newProfile.name.split(' ')[0]}! 🎓`);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <div className={`app-viewport mode-${viewMode}`}>
      {/* Toast Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        studentProfile={studentProfile}
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="app-content">
        {activeTab === 'today' && (
          <TodayView
            events={events}
            studentProfile={studentProfile}
            onOpenAddEvent={() => handleOpenAddEvent()}
            onOpenEditEvent={handleOpenEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onOpenAI={handleOpenAiWithPrompt}
            onOpenCsv={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'schedule' && (
          <WeeklyView
            events={events}
            onOpenAddEvent={handleOpenAddEvent}
            onOpenEditEvent={handleOpenEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onOpenAI={handleOpenAiWithPrompt}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistantChat
            events={events}
            studentProfile={studentProfile}
            onApplyPendingAction={(newEvent) => handleSaveEvent(newEvent)}
            prefilledPrompt={prefilledAiPrompt}
            onClearPrefilled={() => setPrefilledAiPrompt('')}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersView
            reminderSettings={reminderSettings}
            onUpdateSettings={setReminderSettings}
            studentProfile={studentProfile}
            sampleEvent={events[0]}
            onTriggerTestEmail={handleTriggerTestEmail}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            studentProfile={studentProfile}
            onUpdateProfile={(updated) => {
              setStudentProfile(updated);
              showToast('Profile photo updated!');
            }}
            onOpenEditProfile={() => setIsOnboardingOpen(true)}
            events={events}
            onResetSampleData={handleResetSampleData}
            onOpenCsvModal={() => setIsCsvModalOpen(true)}
            onOpenDocsModal={() => setIsDocsModalOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onReplayIntro={() => {
              setStudentProfile((prev) => ({ ...prev, isOnboarded: false }));
              showToast('Opening introductory page...');
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Dock */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadRemindersCount={events.filter((e) => e.type === 'exam').length}
      />

      {/* Event Add / Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
        initialDay={initialDayForModal}
      />

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportEvents={handleImportCsvEvents}
      />

      {/* Backend & Supabase Schema Documentation Modal */}
      <BackendDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      {/* Onboarding / Profile Edit Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSave={(updatedProfile, leadTime) => {
          setStudentProfile(updatedProfile);
          if (leadTime) {
            setReminderSettings((prev) => ({ ...prev, leadTimeMinutes: leadTime }));
          }
          showToast('Profile and preferences updated!');
        }}
        currentProfile={studentProfile}
      />
    </div>
  );
}
