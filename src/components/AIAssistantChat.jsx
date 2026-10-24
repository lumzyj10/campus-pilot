import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Check,
  X,
  RefreshCw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { processUserMessage } from '../utils/aiAgent';
import { formatTime12h } from '../utils/timeUtils';

export function AIAssistantChat({
  events,
  studentProfile,
  onApplyPendingAction,
  prefilledPrompt,
  onClearPrefilled
}) {
  const [messages, setMessages] = useState([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: `Hello **${studentProfile.name.split(' ')[0]}**! 👋 I'm **CampusPilot AI**, your academic copilot for **${studentProfile.university || 'university'}**.\n\nI have full access to your timetable, upcoming tests, and free study gaps. How can I help you today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingAction]);

  // Handle prefilled prompt from other cards (e.g. NextUp or Deadlines card)
  useEffect(() => {
    if (prefilledPrompt) {
      handleSendMessage(prefilledPrompt);
      if (onClearPrefilled) onClearPrefilled();
    }
  }, [prefilledPrompt]);

  const quickPrompts = [
    "What's next today?",
    "What do I have tomorrow?",
    "Am I free Thursday afternoon?",
    "How should I prepare for my Friday exam?",
    "Schedule study session for MAT 111 on Wednesday",
    "Tips for surviving 100L classes"
  ];

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText.trim();
    if (!text || isLoading) return;

    const userMessageId = `msg-user-${Date.now()}`;
    const newMessages = [...messages, { id: userMessageId, sender: 'user', text }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Process using local tool execution or Claude
      const response = await processUserMessage(text, events, studentProfile);

      setMessages(prev => [
        ...prev,
        {
          id: `msg-asst-${Date.now()}`,
          sender: 'assistant',
          text: response.reply,
          toolUsed: response.toolUsed
        }
      ]);

      if (response.pendingAction) {
        setPendingAction(response.pendingAction);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: "I encountered a slight network hitch. Please try asking again!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.action === 'add_event') {
      onApplyPendingAction(pendingAction.event);

      setMessages(prev => [
        ...prev,
        {
          id: `msg-asst-confirm-${Date.now()}`,
          sender: 'assistant',
          text: `✅ Done! I've added **${pendingAction.event.title}** to your timetable on **${pendingAction.event.day}** (${formatTime12h(pendingAction.event.startTime)} - ${formatTime12h(pendingAction.event.endTime)}). Your Gmail reminder is also set! 🎉`
        }
      ]);
    }

    setPendingAction(null);
  };

  const handleCancelAction = () => {
    setPendingAction(null);
    setMessages(prev => [
      ...prev,
      {
        id: `msg-asst-cancel-${Date.now()}`,
        sender: 'assistant',
        text: "Understood! I've cancelled that schedule change. Nothing was altered in your timetable."
      }
    ]);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-msg-reset',
        sender: 'assistant',
        text: `Fresh start! Ask me anything about your ${studentProfile.level} schedule or study plans.`
      }
    ]);
    setPendingAction(null);
  };

  // Convert markdown bold and bullets for simple display
  const renderFormattedText = (rawText) => {
    return rawText.split('\n').map((line, i) => {
      // Bold replacer
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');

      return (
        <span
          key={i}
          style={{ display: 'block', minHeight: line.trim() === '' ? '8px' : 'auto' }}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className="ai-chat-container animate-fade-in">
      {/* AI Header Card */}
      <div className="ai-header-card">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Sparkles size={20} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>CampusPilot AI Assistant</h3>
          <p style={{ fontSize: 12, opacity: 0.9, margin: '2px 0 0 0' }}>
            Claude 3.5 Sonnet Tool Calling • Africa/Lagos WAT
          </p>
        </div>
        <button
          onClick={handleResetChat}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
          title="Restart Conversation"
        >
          <RefreshCw size={12} />
          Reset
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="ai-messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, opacity: 0.8, fontSize: 11, fontWeight: 700 }}>
              {msg.sender === 'assistant' ? (
                <>
                  <Bot size={13} />
                  <span>CampusPilot AI</span>
                  {msg.toolUsed && (
                    <span
                      style={{
                        background: 'var(--bg-subtle)',
                        padding: '1px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 10,
                        color: 'var(--text-muted)'
                      }}
                    >
                      ✦ {msg.toolUsed === 'get_schedule' ? 'Checked Timetable' : msg.toolUsed === 'find_free_slots' ? 'Found Free Slots' : msg.toolUsed}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <User size={13} />
                  <span>You</span>
                </>
              )}
            </div>
            <div>{renderFormattedText(msg.text)}</div>
          </div>
        ))}

        {/* Pending Action Confirmation Card */}
        {pendingAction && (
          <div className="confirmation-card animate-slide-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--amber-600)', marginBottom: 6 }}>
              <HelpCircle size={16} />
              <span>Would you like me to add this?</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-main)', fontSize: 13 }}>
              I prepared this study slot for your review:
            </p>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                marginTop: 6
              }}
            >
              <strong style={{ color: 'var(--text-main)' }}>{pendingAction.event.title}</strong>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                🗓️ {pendingAction.event.day} • ⏰ {formatTime12h(pendingAction.event.startTime)} - {formatTime12h(pendingAction.event.endTime)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                📍 {pendingAction.event.venue}
              </div>
            </div>

            <div className="confirm-btn-row">
              <button className="btn-confirm" onClick={handleConfirmAction}>
                <Check size={14} style={{ display: 'inline', marginRight: 4 }} />
                Yes, Add to Timetable
              </button>
              <button className="btn-cancel" onClick={handleCancelAction}>
                <X size={14} style={{ display: 'inline', marginRight: 4 }} />
                Decline
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="chat-bubble assistant" style={{ fontStyle: 'italic', color: 'var(--slate-500)' }}>
            Thinking and checking your schedule...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="quick-prompts-row">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            className="prompt-chip"
            onClick={() => handleSendMessage(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          className="chat-input"
          placeholder="Ask AI about classes, deadlines, or free slots..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={!inputText.trim() || isLoading}
          title="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
