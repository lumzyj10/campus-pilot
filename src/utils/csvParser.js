// CSV Parser and Generator for Student Timetables

export const CSV_TEMPLATE = `Title,Course Code,Type,Day,Start Time,End Time,Venue,Lecturer,Notes,Repeats Weekly,Color
Intro to Computing,CSC 101,class,Monday,08:00,10:00,Faculty Science LT 1,Dr. Adeyemo,Bring laptop and notebook,true,#0284c7
General Physics I,PHY 101,class,Monday,11:00,13:00,FET Auditorium 2,Prof. Okonjo,Chapter 3 problem sets,true,#0891b2
Library Study Session,CSC 101,study,Monday,15:00,17:00,Main Library 2nd Floor,,Revise Python variables,true,#059669
Elementary Mathematics,MAT 111,class,Tuesday,09:00,11:00,Maths Hall B,Dr. Ibrahim,Quadratic equations,true,#0284c7
Use of English,GST 101,class,Tuesday,12:00,14:00,DLI Hall,Mrs. Balogun,Compulsory GST class,true,#7c3aed
CSC 101 Midterm Test,CSC 101,exam,Friday,09:00,10:30,CBT Center Hall 1,Dr. Adeyemo,CBT 20 marks test,false,#dc2626`;

/**
 * Parses raw CSV string into CampusPilot event objects
 */
export function parseTimetableCSV(csvText) {
  if (!csvText || !csvText.trim()) {
    return { success: false, events: [], error: 'CSV file is empty.' };
  }

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return { success: false, events: [], error: 'CSV must contain a header row and at least one data row.' };
  }

  // Parse header
  const header = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const expectedCols = ['title', 'type', 'day', 'start time', 'end time'];

  // Basic check for minimal required fields
  const hasTitle = header.some(h => h.includes('title'));
  const hasDay = header.some(h => h.includes('day'));
  const hasStart = header.some(h => h.includes('start'));

  if (!hasTitle || !hasDay || !hasStart) {
    return {
      success: false,
      events: [],
      error: 'CSV header is missing required columns (Title, Day, Start Time). Please use the template.'
    };
  }

  const parsedEvents = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const values = parseCSVLine(rawLine);
    const rowObj = {};
    header.forEach((key, idx) => {
      rowObj[key] = values[idx] ? values[idx].trim() : '';
    });

    // Extract fields with fallbacks
    const title = rowObj['title'] || rowObj['event title'] || rowObj['course name'];
    const courseCode = rowObj['course code'] || rowObj['course'] || rowObj['code'] || '';
    let type = (rowObj['type'] || rowObj['event type'] || 'class').toLowerCase();
    
    // Normalize type
    if (!['class', 'study', 'assignment', 'exam', 'club', 'orientation', 'personal'].includes(type)) {
      type = 'class';
    }

    let day = rowObj['day'] || 'Monday';
    // Capitalize day properly
    day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    let startTime = rowObj['start time'] || rowObj['start'] || '09:00';
    let endTime = rowObj['end time'] || rowObj['end'] || '10:00';

    // Normalize time (e.g. "9:00" -> "09:00")
    if (startTime.length === 4 && startTime.indexOf(':') === 1) startTime = '0' + startTime;
    if (endTime.length === 4 && endTime.indexOf(':') === 1) endTime = '0' + endTime;

    const venue = rowObj['venue'] || rowObj['room'] || rowObj['location'] || '';
    const lecturer = rowObj['lecturer'] || rowObj['lecturer / instructor'] || rowObj['teacher'] || '';
    const notes = rowObj['notes'] || rowObj['description'] || '';
    const repeatsWeekly = (rowObj['repeats weekly'] || rowObj['repeat'] || 'true').toLowerCase() !== 'false';
    const color = rowObj['color'] || '#0284c7';

    if (!title) {
      errors.push(`Row ${i + 1}: Skipped because Event Title is empty.`);
      continue;
    }

    parsedEvents.push({
      id: `ev-csv-${Date.now()}-${i}`,
      title,
      courseCode,
      type,
      day,
      startTime,
      endTime,
      venue,
      lecturer,
      notes,
      repeatsWeekly,
      color
    });
  }

  return {
    success: parsedEvents.length > 0,
    events: parsedEvents,
    count: parsedEvents.length,
    warnings: errors
  };
}

/**
 * Handle CSV line splitting taking care of quoted values with commas
 */
function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

/**
 * Convert events array to downloadable CSV string
 */
export function exportEventsToCSV(events) {
  const headers = [
    'Title',
    'Course Code',
    'Type',
    'Day',
    'Start Time',
    'End Time',
    'Venue',
    'Lecturer',
    'Notes',
    'Repeats Weekly',
    'Color'
  ];

  const rows = events.map(e => [
    `"${(e.title || '').replace(/"/g, '""')}"`,
    `"${(e.courseCode || '').replace(/"/g, '""')}"`,
    e.type,
    e.day,
    e.startTime,
    e.endTime,
    `"${(e.venue || '').replace(/"/g, '""')}"`,
    `"${(e.lecturer || '').replace(/"/g, '""')}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
    e.repeatsWeekly ? 'true' : 'false',
    e.color || '#0284c7'
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Trigger browser file download
 */
export function downloadCSV(content, filename = 'CampusPilot_Timetable.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
