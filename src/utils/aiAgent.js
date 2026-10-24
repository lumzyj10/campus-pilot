// AI Study Assistant Agent & Tool Calling Architecture
// Designed for Nigerian University Students with Claude 3.5 Sonnet Tool Specifications

import {
  getTodayName,
  DAYS_OF_WEEK,
  formatTime12h,
  findFreeSlotsForDay,
  timeToMinutes
} from './timeUtils';

/**
 * Anthropic Claude 3.5 Sonnet Tool Schemas
 */
export const CLAUDE_TOOLS_SPEC = [
  {
    name: 'get_schedule',
    description: 'Retrieve the student schedule filtered by day or event type.',
    input_schema: {
      type: 'object',
      properties: {
        day: {
          type: 'string',
          description: 'Day of week (e.g. Monday, Tuesday, today, tomorrow)'
        },
        type: {
          type: 'string',
          enum: ['class', 'study', 'assignment', 'exam', 'club', 'orientation', 'personal', 'all'],
          description: 'Filter events by type'
        }
      }
    }
  },
  {
    name: 'find_free_slots',
    description: 'Detect open time windows between lectures and commitments on a given day to schedule revision or reading.',
    input_schema: {
      type: 'object',
      properties: {
        day: {
          type: 'string',
          description: 'Target day of week (e.g. Thursday, today)'
        },
        minDurationMinutes: {
          type: 'number',
          description: 'Minimum duration in minutes required for study (default 45 mins)'
        }
      },
      required: ['day']
    }
  },
  {
    name: 'propose_add_event',
    description: 'Propose adding a new event (class, study slot, assignment deadline, exam) to the schedule. Requires confirmation from student before creating.',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the event' },
        courseCode: { type: 'string', description: 'Course code (e.g. CSC 101, MAT 111)' },
        type: {
          type: 'string',
          enum: ['class', 'study', 'assignment', 'exam', 'club', 'orientation', 'personal']
        },
        day: { type: 'string', description: 'Day of week (Monday - Sunday)' },
        startTime: { type: 'string', description: '24-hour start time (e.g. 14:00)' },
        endTime: { type: 'string', description: '24-hour end time (e.g. 15:30)' },
        venue: { type: 'string', description: 'Lecture theatre, hall, or library' },
        notes: { type: 'string', description: 'Optional reminders or topics to cover' }
      },
      required: ['title', 'day', 'startTime', 'endTime', 'type']
    }
  },
  {
    name: 'propose_delete_event',
    description: 'Propose deleting an existing event by id or title. Requires confirmation from student.',
    input_schema: {
      type: 'object',
      properties: {
        eventId: { type: 'string', description: 'Unique identifier of event' },
        title: { type: 'string', description: 'Title of the event to remove' }
      },
      required: ['eventId']
    }
  }
];

export const SYSTEM_PROMPT = `You are "CampusPilot AI", a warm, encouraging, and sharp academic mentor for Nigerian university freshers (100L/200L students).
Context:
- Timezone: Africa/Lagos (WAT, UTC+1).
- Setting: Nigerian universities (like UNILAG, UI, OAU, FUTA, Covenant, etc.).
- Terminology: Understand terms like "Fresher", "100L", "Continuous Assessment (C.A.)", "GST courses", "Lecture Theatre (LT)", "CBT Test", "Course Rep".
- Role: Help students conquer their daily timetable, find dedicated reading periods, meet assignment deadlines, and transition into university life smoothly.
- Crucial Rule: Always ask for student confirmation before adding, editing, or deleting any timetable event! Present proposed schedule changes clearly.
- Keep responses concise, supportive, and actionable.`;

/**
 * Intelligent Client-Side Agent Executor
 * Evaluates student prompt, executes tools on local state, and formats empathetic responses
 */
export async function processUserMessage(userMessage, events, studentProfile, apiKey = null) {
  const query = userMessage.toLowerCase().trim();
  const today = getTodayName();
  const tomorrow = DAYS_OF_WEEK[(DAYS_OF_WEEK.indexOf(today) + 1) % 7];

  // 1. "What's next?" / "Next class"
  if (query.includes("what's next") || query.includes("what is next") || query.includes("next class") || query.includes("next up")) {
    const todayEvents = events
      .filter(e => e.day === today)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const upcoming = todayEvents.filter(e => timeToMinutes(e.startTime) > currentMins);
    const active = todayEvents.find(e => timeToMinutes(e.startTime) <= currentMins && timeToMinutes(e.endTime) >= currentMins);

    if (active) {
      return {
        reply: `You're currently in **${active.courseCode ? `${active.courseCode} - ` : ''}${active.title}** at **${active.venue || 'Campus'}** (ends at ${formatTime12h(active.endTime)}). \n\n${upcoming.length > 0 ? `After this, your next commitment is **${upcoming[0].title}** at ${formatTime12h(upcoming[0].startTime)}.` : 'No more classes scheduled for the rest of today! Great time to relax or head to the library.'}`,
        toolUsed: 'get_schedule',
        data: { current: active, next: upcoming[0] || null }
      };
    }

    if (upcoming.length > 0) {
      const nextEv = upcoming[0];
      const minsLeft = timeToMinutes(nextEv.startTime) - currentMins;
      return {
        reply: `Next up today is **${nextEv.courseCode ? `${nextEv.courseCode} - ` : ''}${nextEv.title}**!\n- ⏰ **Time:** ${formatTime12h(nextEv.startTime)} - ${formatTime12h(nextEv.endTime)} (in ~${minsLeft} mins)\n- 📍 **Venue:** ${nextEv.venue || 'TBA'}\n- 👨‍🏫 **Lecturer:** ${nextEv.lecturer || 'Department Staff'}\n${nextEv.notes ? `- 💡 **Note:** ${nextEv.notes}` : ''}`,
        toolUsed: 'get_schedule',
        data: { next: nextEv }
      };
    }

    return {
      reply: `You're all clear for the rest of **${today}**! 🎉 No more classes or deadlines on your timetable today. Would you like me to find open reading slots to review tomorrow's materials?`,
      toolUsed: 'get_schedule',
      data: null
    };
  }

  // 2. "What do I have tomorrow?" / "Tomorrow schedule"
  if (query.includes('tomorrow')) {
    const tomorrowEvents = events
      .filter(e => e.day === tomorrow)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    if (tomorrowEvents.length === 0) {
      return {
        reply: `You don't have any classes scheduled for tomorrow (**${tomorrow}**). It's a free day! Perfect for catching up on personal revision, assignments, or resting.`,
        toolUsed: 'get_schedule',
        data: { day: tomorrow, events: [] }
      };
    }

    const list = tomorrowEvents.map(e => `• **${formatTime12h(e.startTime)} - ${formatTime12h(e.endTime)}**: ${e.courseCode ? `\`${e.courseCode}\` ` : ''}${e.title} @ *${e.venue || 'Campus'}*`).join('\n');

    return {
      reply: `Here is your lineup for tomorrow, **${tomorrow}** (${tomorrowEvents.length} events):\n\n${list}\n\nTip: Make sure your notebooks and assignments are packed tonight so you don't rush!`,
      toolUsed: 'get_schedule',
      data: { day: tomorrow, events: tomorrowEvents }
    };
  }

  // 3. "Am I free Thursday afternoon?" / "Free time" / "find free slots"
  const dayMatch = DAYS_OF_WEEK.find(d => query.includes(d.toLowerCase()));
  if (query.includes('free') || query.includes('free slot') || query.includes('free time') || query.includes('available')) {
    const targetDay = dayMatch || (query.includes('today') ? today : (query.includes('tomorrow') ? tomorrow : 'Thursday'));
    const freeSlots = findFreeSlotsForDay(events, targetDay, 45);

    if (freeSlots.length === 0) {
      return {
        reply: `Your schedule on **${targetDay}** is quite packed between 8:00 AM and 6:00 PM without any significant breaks over 45 minutes! Consider scheduling study sessions in the evening after 6:00 PM.`,
        toolUsed: 'find_free_slots',
        data: { targetDay, freeSlots: [] }
      };
    }

    const slotsList = freeSlots.map(s => `• **${formatTime12h(s.startTime)} - ${formatTime12h(s.endTime)}** (${s.durationMinutes} mins free) - ${s.description}`).join('\n');

    return {
      reply: `Yes, you have open windows on **${targetDay}**:\n\n${slotsList}\n\nWould you like me to schedule a **reading or study session** into one of these slots? Just let me know which course!`,
      toolUsed: 'find_free_slots',
      data: { targetDay, freeSlots }
    };
  }

  // 4. "How should I prepare for my exam on Friday?" / "Test prep" / "Study advice"
  if (query.includes('exam') || query.includes('test') || query.includes('prepare') || query.includes('c.a.')) {
    const upcomingExams = events.filter(e => e.type === 'exam');
    const examTarget = upcomingExams[0];

    return {
      reply: `Here is a high-yield study plan for **${examTarget ? `${examTarget.courseCode} (${examTarget.title})` : 'your upcoming exam'}**:\n\n1. **Past Questions (PQs) are King**: Nigerian university examiners love repeating core concept questions. Grab the last 3-5 years of past CBT/theory questions from your department library or course rep.\n2. **Active Recall**: Don't just re-read notes passively. Test yourself on key definitions, formulas, and proofs without looking.\n3. **CBT Speed Drills**: If it's a CBT test, practice answering 50 questions under a 30-minute timer.\n4. **Rest Before Exam Day**: Sleep at least 6-7 hours the night before. Cramming all night leads to avoidable errors during tests.\n\nShall I block out a 2-hour revision slot for you on Wednesday or Thursday?`,
      toolUsed: 'study_advisor',
      data: { examTarget }
    };
  }

  // 5. Add / Schedule a study slot or event (e.g. "Add study session for CSC 101 on Wednesday 4pm")
  if (query.includes('add') || query.includes('schedule') || query.includes('put') || query.includes('create')) {
    const targetDay = dayMatch || 'Wednesday';
    
    // Extract course or topic
    let courseCode = 'CSC 101';
    if (query.includes('mat')) courseCode = 'MAT 111';
    else if (query.includes('phy')) courseCode = 'PHY 101';
    else if (query.includes('chm')) courseCode = 'CHM 101';
    else if (query.includes('gst')) courseCode = 'GST 101';

    // Proposed event
    const proposedEvent = {
      title: `${courseCode} Focused Study & Practice`,
      type: 'study',
      courseCode,
      day: targetDay,
      startTime: '16:00',
      endTime: '17:30',
      venue: 'Main Library / Quiet Study Hall',
      lecturer: '',
      notes: 'Scheduled by CampusPilot AI: Review lecture notes and practice exercises.',
      repeatsWeekly: false,
      color: '#059669'
    };

    return {
      reply: `I've prepared this new study slot for you on **${targetDay}**:\n\n• **Event:** ${proposedEvent.title}\n• **Time:** 4:00 PM - 5:30 PM (90 mins)\n• **Venue:** ${proposedEvent.venue}\n\n⚠️ **Confirmation Required:** Per your safety rules, please click below to confirm or decline adding this to your timetable.`,
      toolUsed: 'propose_add_event',
      pendingAction: {
        action: 'add_event',
        event: proposedEvent
      }
    };
  }

  // 6. General 100L / University Survival Tips
  if (query.includes('tip') || query.includes('advice') || query.includes('fresher') || query.includes('survive')) {
    return {
      reply: `Welcome to university life, **${studentProfile.name.split(' ')[0]}**! Here are the 4 golden rules every 100L student needs:\n\n1. **First-Year CGPA Sets Your Trajectory**: It is 10x easier to start with a 4.5+ GPA in 100L and maintain it than to climb from a 2.5 later.\n2. **Beat Venue Crowds Early**: General courses (like GST 101 and PHY 101) have huge crowds. Arrive 15-20 minutes early to secure a seat where you can hear and see clearly.\n3. **Continuous Assessment (C.A.) is 30-40 Marks**: Never miss an attendance sheet, assignment, or pop quiz. Those 30 marks are the cushion that guarantees your A grade.\n4. **Use CampusPilot Reminders**: Keep your 20-minute Gmail reminders on so you never rush into class in a panic!`,
      toolUsed: 'study_tips',
      data: null
    };
  }

  // Default Fallback
  return {
    reply: `I'm here to help you manage your timetable and study time! You can ask me:\n- *"What's next today?"*\n- *"What classes do I have tomorrow?"*\n- *"Am I free Thursday afternoon?"*\n- *"Schedule a study session for MAT 111 on Wednesday"*\n- *"Give me tips on preparing for my Friday exam"*\n\nWhat would you like to check?`,
    toolUsed: 'general_help',
    data: null
  };
}
