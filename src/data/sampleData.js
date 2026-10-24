// Realistic Nigerian University (100L / Fresher) Timetable & Sample Data

export const DEFAULT_USER = {
  id: 'usr_unilag_101',
  name: 'Tobi Adeyemi',
  age: 18,
  occupation: 'Undergraduate Student (Fresher)',
  email: 'tobi.adeyemi.freshman@gmail.com',
  university: 'University of Lagos (UNILAG)',
  faculty: 'Faculty of Science',
  department: 'Computer Science',
  level: '100 Level',
  matricNo: '240805012',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isOnboarded: false
};

export const EVENT_TYPES = [
  { id: 'class', label: 'Class / Lecture', icon: 'GraduationCap', color: '#0284c7', bg: '#e0f2fe' },
  { id: 'study', label: 'Reading & Study Time', icon: 'BookOpen', color: '#059669', bg: '#d1fae5' },
  { id: 'assignment', label: 'Assignment Deadline', icon: 'Clock', color: '#d97706', bg: '#fef3c7' },
  { id: 'exam', label: 'Exam / Test (C.A.)', icon: 'AlertCircle', color: '#dc2626', bg: '#fee2e2' },
  { id: 'club', label: 'Club / Engagement', icon: 'Users', color: '#7c3aed', bg: '#ede9fe' },
  { id: 'orientation', label: 'Orientation Event', icon: 'Compass', color: '#0891b2', bg: '#cffafe' },
  { id: 'personal', label: 'Personal Task', icon: 'CheckSquare', color: '#4b5563', bg: '#f3f4f6' }
];

export const COLOR_OPTIONS = [
  { name: 'Lagoon Blue', hex: '#0284c7' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Amber Orange', hex: '#d97706' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Royal Purple', hex: '#7c3aed' },
  { name: 'Teal Cyan', hex: '#0891b2' },
  { name: 'Midnight Slate', hex: '#334155' }
];

export const INITIAL_REMINDER_SETTINGS = {
  leadTimeMinutes: 20, // Options: 10, 20, 30, 60
  enabledTypes: {
    class: true,
    study: true,
    assignment: true,
    exam: true,
    club: false,
    orientation: true,
    personal: false
  },
  gmailAddress: 'tobi.adeyemi.freshman@gmail.com',
  browserNotifications: true,
  dailyMorningDigest: true
};

export const SAMPLE_TIMETABLE_EVENTS = [
  // MONDAY
  {
    id: 'ev-mon-1',
    title: 'Intro to Computer Science & Problem Solving',
    type: 'class',
    courseCode: 'CSC 101',
    day: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    venue: 'Faculty of Science Lecture Theatre (LT 1)',
    lecturer: 'Dr. Adeyemo & Dr. Folashade',
    notes: 'Bring laptop or notebook. Attendance counts for 10% Continuous Assessment (CA).',
    repeatsWeekly: true,
    color: '#0284c7'
  },
  {
    id: 'ev-mon-2',
    title: 'General Physics I (Mechanics & Properties of Matter)',
    type: 'class',
    courseCode: 'PHY 101',
    day: 'Monday',
    startTime: '11:00',
    endTime: '13:00',
    venue: 'FET Main Auditorium Room 2',
    lecturer: 'Prof. Okonjo',
    notes: 'Solve problem set 2 from textbook chapter 3 before next class.',
    repeatsWeekly: true,
    color: '#0891b2'
  },
  {
    id: 'ev-mon-3',
    title: 'Library Deep Study: Review PHY 101 Formulas',
    type: 'study',
    courseCode: 'PHY 101',
    day: 'Monday',
    startTime: '15:00',
    endTime: '17:00',
    venue: 'UNILAG Main Library (2nd Floor Quiet Wing)',
    lecturer: '',
    notes: 'Revise projectile motion and Newton’s second law exercises with study partner Amina.',
    repeatsWeekly: true,
    color: '#059669'
  },

  // TUESDAY
  {
    id: 'ev-tue-1',
    title: 'Elementary Mathematics I (Algebra & Trigonometry)',
    type: 'class',
    courseCode: 'MAT 111',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '11:00',
    venue: 'Maths Department Hall B',
    lecturer: 'Dr. Ibrahim',
    notes: 'Quadratic equations, mathematical induction, and complex numbers.',
    repeatsWeekly: true,
    color: '#0284c7'
  },
  {
    id: 'ev-tue-2',
    title: 'Use of English & Communication Skills',
    type: 'class',
    courseCode: 'GST 101',
    day: 'Tuesday',
    startTime: '12:00',
    endTime: '14:00',
    venue: 'Distance Learning Institute (DLI) Hall',
    lecturer: 'Mrs. Balogun',
    notes: 'Compulsory university-wide GST course. Come early to get a front seat!',
    repeatsWeekly: true,
    color: '#7c3aed'
  },
  {
    id: 'ev-tue-3',
    title: 'GST 101 Term Paper Submission Deadline',
    type: 'assignment',
    courseCode: 'GST 101',
    day: 'Tuesday',
    startTime: '16:00',
    endTime: '17:00',
    venue: 'Department General Office',
    lecturer: 'Mrs. Balogun',
    notes: 'Printed copy on A4 paper with proper cover page and matriculation number.',
    repeatsWeekly: false,
    color: '#d97706'
  },

  // WEDNESDAY
  {
    id: 'ev-wed-1',
    title: 'General Chemistry I (Physical & Inorganic)',
    type: 'class',
    courseCode: 'CHM 101',
    day: 'Wednesday',
    startTime: '08:00',
    endTime: '10:00',
    venue: 'Chemistry New Complex Hall 1',
    lecturer: 'Prof. Eze',
    notes: 'Atomic structure, periodic table trends, and chemical bonding.',
    repeatsWeekly: true,
    color: '#0891b2'
  },
  {
    id: 'ev-wed-2',
    title: 'Faculty of Science Freshers Orientation Lecture',
    type: 'orientation',
    courseCode: 'SCI 100',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '13:00',
    venue: 'J.F. Ade Ajayi Auditorium',
    lecturer: 'Dean of Science & Sub-Dean',
    notes: 'Guidance on course registration, GPA calculation, and examination rules.',
    repeatsWeekly: false,
    color: '#059669'
  },
  {
    id: 'ev-wed-3',
    title: 'CSC 101 Python Lab Practical',
    type: 'class',
    courseCode: 'CSC 101',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '16:30',
    venue: 'Centre for Information Technology & Systems (CITS) Lab 3',
    lecturer: 'Engr. Taiwo',
    notes: 'Lab task: Python conditional statements and loops.',
    repeatsWeekly: true,
    color: '#0284c7'
  },

  // THURSDAY
  {
    id: 'ev-thu-1',
    title: 'Elementary Mathematics I Tutorial',
    type: 'class',
    courseCode: 'MAT 111',
    day: 'Thursday',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'Science Complex Room 204',
    lecturer: 'Graduate Assistant Kazeem',
    notes: 'Solving past exam questions on binomial theorem.',
    repeatsWeekly: true,
    color: '#0284c7'
  },
  {
    id: 'ev-thu-2',
    title: 'Self-Paced Study: Coding Practice (CSC 101)',
    type: 'study',
    courseCode: 'CSC 101',
    day: 'Thursday',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Department Study Lounge / CITS Annex',
    lecturer: '',
    notes: 'Complete HackerRank Python basics module 1.',
    repeatsWeekly: true,
    color: '#059669'
  },
  {
    id: 'ev-thu-3',
    title: 'Google Developer Student Clubs (GDSC) Freshers Meetup',
    type: 'club',
    courseCode: 'TECH-SOC',
    day: 'Thursday',
    startTime: '17:00',
    endTime: '18:30',
    venue: 'Faculty of Engineering Boardroom & Hybrid Meet',
    lecturer: 'GDSC Lead',
    notes: 'Networking, tech roadmap for year 1 students, and free refreshments!',
    repeatsWeekly: false,
    color: '#7c3aed'
  },

  // FRIDAY
  {
    id: 'ev-fri-1',
    title: 'Intro to Computer Science Continuous Assessment (C.A.) Test',
    type: 'exam',
    courseCode: 'CSC 101',
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:30',
    venue: 'Computer Science CBT Center (Hall 1)',
    lecturer: 'Dr. Adeyemo',
    notes: 'Crucial 20-mark mid-term CBT test! Bring UNILAG Student ID card and blue biro.',
    repeatsWeekly: false,
    color: '#dc2626'
  },
  {
    id: 'ev-fri-2',
    title: 'Juma’at Prayer & Friday Break',
    type: 'personal',
    courseCode: '',
    day: 'Friday',
    startTime: '13:00',
    endTime: '14:30',
    venue: 'UNILAG Central Mosque / Campus Grounds',
    lecturer: '',
    notes: 'Midday prayer and lunch at 2001 Cafeteria.',
    repeatsWeekly: true,
    color: '#4b5563'
  },
  {
    id: 'ev-fri-3',
    title: 'Weekend Catchup: Chemistry Notes & Lab Report',
    type: 'study',
    courseCode: 'CHM 101',
    day: 'Friday',
    startTime: '15:30',
    endTime: '17:30',
    venue: 'Hostel Study Room (Mariere Hall)',
    lecturer: '',
    notes: 'Prepare volumetric analysis practical writeup for next week.',
    repeatsWeekly: true,
    color: '#059669'
  },

  // SATURDAY
  {
    id: 'ev-sat-1',
    title: 'Fresher Marathon Study Session: MAT 111 Problem Solving',
    type: 'study',
    courseCode: 'MAT 111',
    day: 'Saturday',
    startTime: '10:00',
    endTime: '13:00',
    venue: 'Faculty of Science Foyer Study Desks',
    lecturer: '',
    notes: 'Group study with course reps. Reviewing matrices, permutations, and combinations.',
    repeatsWeekly: true,
    color: '#059669'
  },
  {
    id: 'ev-sat-2',
    title: 'Hall of Residence Freshers Welcome & Games Night',
    type: 'club',
    courseCode: 'SOCIAL',
    day: 'Saturday',
    startTime: '18:00',
    endTime: '20:30',
    venue: 'Mariere Hall Quadrangle',
    lecturer: '',
    notes: 'Table tennis, chess, and welcoming floor-mates.',
    repeatsWeekly: false,
    color: '#7c3aed'
  },

  // SUNDAY
  {
    id: 'ev-sun-1',
    title: 'Weekly Review & Week 2 Planning on CampusPilot',
    type: 'personal',
    courseCode: '',
    day: 'Sunday',
    startTime: '16:00',
    endTime: '17:30',
    venue: 'Hostel Room',
    lecturer: '',
    notes: 'Review notes, organize course materials, and check upcoming week schedule.',
    repeatsWeekly: true,
    color: '#0284c7'
  }
];
