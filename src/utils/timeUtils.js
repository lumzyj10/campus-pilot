// Time and Date utilities tailored for West Africa Time (WAT / Africa/Lagos, UTC+1)

export const TIMEZONE = 'Africa/Lagos';

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

/**
 * Get current time and date in Africa/Lagos (WAT)
 */
export function getLagosNow() {
  const now = new Date();
  return now;
}

/**
 * Get the current day name in Lagos (e.g. 'Monday')
 */
export function getTodayName() {
  const now = getLagosNow();
  const dayIndex = now.getDay(); // 0 is Sunday, 1 is Monday...
  const map = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return map[dayIndex];
}

/**
 * Format Date to readable Lagos string (e.g., "Thursday, 24 Oct")
 */
export function formatLagosDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  }).format(date);
}

/**
 * Format 24-hour time "14:30" to friendly "2:30 PM"
 */
export function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  const minuteStr = m < 10 ? `0${m}` : m;
  return `${hour12}:${minuteStr} ${period}`;
}

/**
 * Convert time string "14:30" to total minutes from midnight
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * Calculate difference in minutes from current Lagos time to an event start time
 */
export function getMinutesUntil(dayName, startTimeStr) {
  const today = getTodayName();
  if (dayName !== today) return null;

  const now = getLagosNow();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const eventMinutes = timeToMinutes(startTimeStr);

  return eventMinutes - currentMinutes;
}

/**
 * Check if an event is happening right now, upcoming, or past
 */
export function getEventStatus(event) {
  const today = getTodayName();
  if (event.day !== today) {
    const todayIndex = DAYS_OF_WEEK.indexOf(today);
    const eventIndex = DAYS_OF_WEEK.indexOf(event.day);
    if (eventIndex < todayIndex) return 'past';
    return 'upcoming';
  }

  const now = getLagosNow();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(event.startTime);
  const end = timeToMinutes(event.endTime);

  if (currentMinutes < start) return 'upcoming';
  if (currentMinutes >= start && currentMinutes <= end) return 'happening_now';
  return 'past';
}

/**
 * Format remaining time for countdown (e.g. "Starts in 25m" or "Happening now (30m left)")
 */
export function getCountdownDetails(event) {
  if (!event) return null;
  const now = getLagosNow();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();
  
  const start = timeToMinutes(event.startTime);
  const end = timeToMinutes(event.endTime);

  if (currentMinutes < start) {
    const totalDiffMinutes = start - currentMinutes;
    const hours = Math.floor(totalDiffMinutes / 60);
    const mins = totalDiffMinutes % 60;
    const secs = 60 - currentSeconds === 60 ? 0 : 60 - currentSeconds;
    
    let text = '';
    if (hours > 0) {
      text = `Starts in ${hours}h ${mins}m`;
    } else {
      text = `Starts in ${mins}m ${secs}s`;
    }
    return {
      status: 'upcoming',
      text,
      minutesLeft: totalDiffMinutes,
      badge: 'Up Next'
    };
  }

  if (currentMinutes >= start && currentMinutes <= end) {
    const totalDiffMinutes = end - currentMinutes;
    const hours = Math.floor(totalDiffMinutes / 60);
    const mins = totalDiffMinutes % 60;
    return {
      status: 'happening_now',
      text: `Happening now • ${hours > 0 ? `${hours}h ` : ''}${mins}m remaining`,
      minutesLeft: totalDiffMinutes,
      badge: 'Live Now'
    };
  }

  return {
    status: 'past',
    text: 'Completed today',
    minutesLeft: 0,
    badge: 'Done'
  };
}

/**
 * Find free study slots between classes on a given day
 */
export function findFreeSlotsForDay(events, dayName, minDurationMinutes = 45) {
  const dayEvents = events
    .filter(e => e.day === dayName)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const slots = [];
  // Typical university day bounds: 8:00 AM (480 mins) to 6:00 PM (1080 mins)
  const DAY_START = 8 * 60;
  const DAY_END = 18 * 60;

  if (dayEvents.length === 0) {
    slots.push({
      startTime: '09:00',
      endTime: '12:00',
      durationMinutes: 180,
      description: 'Entire morning free for self-paced study or revision'
    });
    slots.push({
      startTime: '14:00',
      endTime: '17:00',
      durationMinutes: 180,
      description: 'Afternoon free slot'
    });
    return slots;
  }

  let lastEnd = DAY_START;

  for (const ev of dayEvents) {
    const evStart = timeToMinutes(ev.startTime);
    const evEnd = timeToMinutes(ev.endTime);

    if (evStart - lastEnd >= minDurationMinutes) {
      slots.push({
        startTime: minutesToTimeStr(lastEnd),
        endTime: minutesToTimeStr(evStart),
        durationMinutes: evStart - lastEnd,
        description: `Free gap before ${ev.courseCode || ev.title}`
      });
    }

    if (evEnd > lastEnd) {
      lastEnd = evEnd;
    }
  }

  if (DAY_END - lastEnd >= minDurationMinutes) {
    slots.push({
      startTime: minutesToTimeStr(lastEnd),
      endTime: minutesToTimeStr(DAY_END),
      durationMinutes: DAY_END - lastEnd,
      description: 'Afternoon / Evening study slot after lectures'
    });
  }

  return slots;
}

export function minutesToTimeStr(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hh = h < 10 ? `0${h}` : h;
  const mm = m < 10 ? `0${m}` : m;
  return `${hh}:${mm}`;
}
