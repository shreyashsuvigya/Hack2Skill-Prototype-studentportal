/**
 * AcademiX Data Store & State Management
 * Subject Roster: OOP, DS, DBMS, CN, AI, COA, CLE
 * Official Institutional Attendance Records (Read-Only; no student self-marking)
 */

const CURRICULUM_VERSION = "v3_empty_notes_faculties";

// Exclusive required subjects: OOP, DS, DBMS, CN, AI, COA, CLE
const ACADEMIC_SUBJECTS = [
  { code: "CS-OOP", shortName: "OOP", name: "Object Oriented Programming (OOP)", credits: 4, faculty: "Dr. Vikram Seth", color: "#6366f1" },
  { code: "CS-DS", shortName: "DS", name: "Data Structures (DS)", credits: 4, faculty: "Dr. Alok Nath", color: "#38bdf8" },
  { code: "CS-DBMS", shortName: "DBMS", name: "Database Management Systems (DBMS)", credits: 4, faculty: "Dr. Suresh Reddy", color: "#10b981" },
  { code: "CS-CN", shortName: "CN", name: "Computer Networks (CN)", credits: 4, faculty: "Dr. Rajesh Kulkarni", color: "#f59e0b" },
  { code: "CS-AI", shortName: "AI", name: "Artificial Intelligence (AI)", credits: 4, faculty: "Dr. Ananya Mukherjee", color: "#ec4899" },
  { code: "CS-COA", shortName: "COA", name: "Computer Organization & Architecture (COA)", credits: 3, faculty: "Dr. Anita Desai", color: "#8b5cf6" },
  { code: "CS-CLE", shortName: "CLE", name: "Cyber Laws & Ethics (CLE)", credits: 3, faculty: "Prof. Meenakshi Sundaram", color: "#06b6d4" }
];

// Timetable strictly featuring OOP, DS, DBMS, CN, AI, COA, CLE
const DEFAULT_TIMETABLE = {
  Monday: [
    { period: 1, time: "09:00 - 10:00 AM", subject: "Object Oriented Programming (OOP)", code: "CS-OOP", room: "LH-301", faculty: "Dr. Vikram Seth" },
    { period: 2, time: "10:00 - 11:00 AM", subject: "Data Structures (DS)", code: "CS-DS", room: "LH-301", faculty: "Dr. Alok Nath" },
    { period: 3, time: "11:15 - 12:15 PM", subject: "Database Management Systems (DBMS)", code: "CS-DBMS", room: "Lab-402", faculty: "Dr. Suresh Reddy" },
    { period: 4, time: "01:15 - 02:15 PM", subject: "Computer Networks (CN)", code: "CS-CN", room: "LH-301", faculty: "Dr. Rajesh Kulkarni" },
    { period: 5, time: "02:15 - 04:15 PM", subject: "Artificial Intelligence (AI)", code: "CS-AI", room: "AI Computing Lab", faculty: "Dr. Ananya Mukherjee" }
  ],
  Tuesday: [
    { period: 1, time: "09:00 - 10:00 AM", subject: "Computer Organization & Architecture (COA)", code: "CS-COA", room: "LH-302", faculty: "Dr. Anita Desai" },
    { period: 2, time: "10:00 - 11:00 AM", subject: "Cyber Laws & Ethics (CLE)", code: "CS-CLE", room: "LH-301", faculty: "Prof. Meenakshi Sundaram" },
    { period: 3, time: "11:15 - 12:15 PM", subject: "Object Oriented Programming (OOP)", code: "CS-OOP", room: "LH-301", faculty: "Dr. Vikram Seth" },
    { period: 4, time: "01:15 - 02:15 PM", subject: "Data Structures (DS)", code: "CS-DS", room: "LH-301", faculty: "Dr. Alok Nath" },
    { period: 5, time: "02:15 - 03:15 PM", subject: "Database Management Systems (DBMS)", code: "CS-DBMS", room: "DB Lab-1", faculty: "Dr. Suresh Reddy" }
  ],
  Wednesday: [
    { period: 1, time: "09:00 - 10:00 AM", subject: "Computer Networks (CN)", code: "CS-CN", room: "LH-301", faculty: "Dr. Rajesh Kulkarni" },
    { period: 2, time: "10:00 - 11:00 AM", subject: "Artificial Intelligence (AI)", code: "CS-AI", room: "LH-302", faculty: "Dr. Ananya Mukherjee" },
    { period: 3, time: "11:15 - 01:15 PM", subject: "Computer Organization & Architecture (COA)", code: "CS-COA", room: "LH-301", faculty: "Dr. Anita Desai" },
    { period: 4, time: "02:00 - 03:00 PM", subject: "Cyber Laws & Ethics (CLE)", code: "CS-CLE", room: "LH-301", faculty: "Prof. Meenakshi Sundaram" },
    { period: 5, time: "03:00 - 04:00 PM", subject: "Library & Academic Research", code: "LIB-CS", room: "Central Lib", faculty: "Faculty Coordinator" }
  ],
  Thursday: [
    { period: 1, time: "09:00 - 10:00 AM", subject: "Data Structures (DS)", code: "CS-DS", room: "LH-301", faculty: "Dr. Alok Nath" },
    { period: 2, time: "10:00 - 11:00 AM", subject: "Database Management Systems (DBMS)", code: "CS-DBMS", room: "LH-301", faculty: "Dr. Suresh Reddy" },
    { period: 3, time: "11:15 - 12:15 PM", subject: "Computer Networks (CN)", code: "CS-CN", room: "LH-302", faculty: "Dr. Rajesh Kulkarni" },
    { period: 4, time: "01:15 - 03:15 PM", subject: "Object Oriented Programming (OOP)", code: "CS-OOP", room: "Java Lab-2", faculty: "Dr. Vikram Seth" }
  ],
  Friday: [
    { period: 1, time: "09:00 - 10:00 AM", subject: "Artificial Intelligence (AI)", code: "CS-AI", room: "LH-301", faculty: "Dr. Ananya Mukherjee" },
    { period: 2, time: "10:00 - 11:00 AM", subject: "Computer Organization & Architecture (COA)", code: "CS-COA", room: "LH-301", faculty: "Dr. Anita Desai" },
    { period: 3, time: "11:15 - 12:15 PM", subject: "Cyber Laws & Ethics (CLE)", code: "CS-CLE", room: "Auditorium-2", faculty: "Prof. Meenakshi Sundaram" },
    { period: 4, time: "01:15 - 02:15 PM", subject: "Computer Networks (CN)", code: "CS-CN", room: "Net Lab-4", faculty: "Dr. Rajesh Kulkarni" }
  ],
  Saturday: [
    { period: 1, time: "09:30 - 11:30 AM", subject: "Data Structures & Algorithms Practical Practicum", code: "CS-DS", room: "Lab-301", faculty: "Dr. Alok Nath" },
    { period: 2, time: "11:45 - 01:15 PM", subject: "AI & DBMS Seminar Presentation", code: "CS-AI", room: "Seminar Hall A", faculty: "Dr. Ananya Mukherjee" }
  ]
};



// Student Settings & Dark Mode Customization Preferences
const DEFAULT_SETTINGS = {
  theme: {
    bg: "slate",          // obsidian | slate | navy | forest | cosmic | crimson
    textTone: "platinum", // platinum | warm | ice | mint
    accent: "indigo",     // indigo | emerald | crimson | amethyst | sapphire | amber | cyan | pink
    surface: "glass",     // glass | matte
    glow: "high"          // high | subtle
  },
  notifications: {
    dailyAttendance: true,
    newDocs: true,
    lectureReminders: true,
    examDeadlines: true
  }
};

// Notes and Docs - Initially empty as requested; students can upload notes/PDFs
const DEFAULT_NOTES = [];

// Faculties & Institutional Contacts
const DEFAULT_FACULTY_CONTACTS = [
  {
    id: "fac-1",
    name: "Dr. Vikram Seth",
    designation: "Professor & Lead Course Faculty",
    subject: "OOP",
    subjectName: "Object Oriented Programming",
    department: "Dept of Computer Science & Engg",
    email: "vikram.seth@snpsu.edu",
    phone: "+91 98765 43210",
    office: "LH-301 Faculty Cabin B",
    officeHours: "Mon & Thu • 02:00 PM - 04:00 PM",
    category: "Faculty",
    color: "#6366f1",
    isSystem: true
  },
  {
    id: "fac-2",
    name: "Dr. Alok Nath",
    designation: "Associate Professor",
    subject: "DS",
    subjectName: "Data Structures",
    department: "Dept of Computer Science & Engg",
    email: "alok.nath@snpsu.edu",
    phone: "+91 98765 43211",
    office: "LH-301 Faculty Pod 4",
    officeHours: "Tue & Fri • 11:30 AM - 01:00 PM",
    category: "Faculty",
    color: "#38bdf8",
    isSystem: true
  },
  {
    id: "fac-3",
    name: "Dr. Suresh Reddy",
    designation: "Professor & Lab Director",
    subject: "DBMS",
    subjectName: "Database Management Systems",
    department: "Dept of Computer Science & Engg",
    email: "suresh.reddy@snpsu.edu",
    phone: "+91 98765 43212",
    office: "Lab-402 Database Systems Center",
    officeHours: "Mon & Wed • 03:00 PM - 05:00 PM",
    category: "Faculty",
    color: "#10b981",
    isSystem: true
  },
  {
    id: "fac-4",
    name: "Dr. Rajesh Kulkarni",
    designation: "Associate Professor & Class Proctor",
    subject: "CN",
    subjectName: "Computer Networks",
    department: "Dept of Computer Science & Engg",
    email: "rajesh.kulkarni@snpsu.edu",
    phone: "+91 98765 43213",
    office: "NetLab-205 Systems Wing",
    officeHours: "Wed & Thu • 01:30 PM - 03:30 PM",
    category: "Faculty",
    color: "#f59e0b",
    isSystem: true
  },
  {
    id: "fac-5",
    name: "Dr. Ananya Mukherjee",
    designation: "Professor & AI Research Chair",
    subject: "AI",
    subjectName: "Artificial Intelligence",
    department: "Dept of Computer Science & Engg",
    email: "ananya.mukherjee@snpsu.edu",
    phone: "+91 98765 43214",
    office: "AI Computing Center Pod 2",
    officeHours: "Mon & Fri • 02:15 PM - 04:15 PM",
    category: "Faculty",
    color: "#ec4899",
    isSystem: true
  },
  {
    id: "fac-6",
    name: "Dr. Anita Desai",
    designation: "Associate Professor",
    subject: "COA",
    subjectName: "Computer Organization & Architecture",
    department: "Dept of Computer Science & Engg",
    email: "anita.desai@snpsu.edu",
    phone: "+91 98765 43215",
    office: "LH-302 Faculty Chamber 7",
    officeHours: "Tue & Thu • 10:00 AM - 11:30 AM",
    category: "Faculty",
    color: "#8b5cf6",
    isSystem: true
  },
  {
    id: "fac-7",
    name: "Prof. Meenakshi Sundaram",
    designation: "Assistant Professor",
    subject: "CLE",
    subjectName: "Cyber Laws & Ethics",
    department: "School of Law & Humanities",
    email: "meenakshi.s@snpsu.edu",
    phone: "+91 98765 43216",
    office: "Humanities Annex Room 108",
    officeHours: "Wed & Fri • 12:00 PM - 01:30 PM",
    category: "Faculty",
    color: "#06b6d4",
    isSystem: true
  },
  {
    id: "fac-8",
    name: "Dr. R. K. Sharma",
    designation: "Head of Department (HOD)",
    subject: "Administration",
    subjectName: "Dept of Computer Science & Engg",
    department: "CSE Executive Wing Block A",
    email: "hod.cse@snpsu.edu",
    phone: "+91 80 2345 6701",
    office: "Block A • HOD Office Room 101",
    officeHours: "Daily • 03:30 PM - 05:00 PM",
    category: "Administration",
    color: "#14b8a6",
    isSystem: true
  },
  {
    id: "fac-9",
    name: "Dr. Sunita Rao",
    designation: "Chief Academic Counselor & Proctor",
    subject: "Counseling",
    subjectName: "Student Affairs & Guidance",
    department: "Dean Student Welfare Office",
    email: "proctor.cse@snpsu.edu",
    phone: "+91 80 2345 6710",
    office: "Student Center Wing 102",
    officeHours: "Mon to Fri • 10:00 AM - 05:00 PM",
    category: "Administration",
    color: "#a855f7",
    isSystem: true
  },
  {
    id: "fac-10",
    name: "Campus Health & Emergency Desk",
    designation: "24/7 Rapid Response & Medical Support",
    subject: "Emergency",
    subjectName: "Health, Security & Dispatch",
    department: "University Emergency Services",
    email: "emergency@snpsu.edu",
    phone: "1800-425-0011 / +91 80 2345 6999",
    office: "Campus Health Annex Ground Floor",
    officeHours: "Available 24x7 Round-the-Clock",
    category: "Emergency",
    color: "#ef4444",
    isSystem: true
  }
];

// Academic Results for the 7 Subjects
const DEFAULT_RESULTS = {
  cgpa: 8.86,
  totalCredits: 106,
  semesters: [
    { sem: 1, sgpa: 8.50, credits: 20 },
    { sem: 2, sgpa: 8.65, credits: 21 },
    { sem: 3, sgpa: 8.85, credits: 21 },
    { sem: 4, sgpa: 8.92, credits: 21 },
    { sem: 5, sgpa: 9.15, credits: 23 }
  ],
  currentSubjectMarks: [
    { code: "CS-OOP", name: "Object Oriented Programming (OOP)", internal: 28, endSem: 62, total: 90, grade: "S", points: 10, credits: 4 },
    { code: "CS-DS", name: "Data Structures (DS)", internal: 29, endSem: 65, total: 94, grade: "S", points: 10, credits: 4 },
    { code: "CS-DBMS", name: "Database Management Systems (DBMS)", internal: 27, endSem: 61, total: 88, grade: "A", points: 9, credits: 4 },
    { code: "CS-CN", name: "Computer Networks (CN)", internal: 26, endSem: 58, total: 84, grade: "A", points: 9, credits: 4 },
    { code: "CS-AI", name: "Artificial Intelligence (AI)", internal: 29, endSem: 64, total: 93, grade: "S", points: 10, credits: 4 },
    { code: "CS-COA", name: "Computer Organization & Architecture (COA)", internal: 26, endSem: 56, total: 82, grade: "A", points: 9, credits: 3 },
    { code: "CS-CLE", name: "Cyber Laws & Ethics (CLE)", internal: 28, endSem: 60, total: 88, grade: "A", points: 9, credits: 3 }
  ]
};

// Events
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: "HackSphere 2026 - 36hr National Hackathon",
    category: "Hackathon",
    date: { day: "24", month: "OCT" },
    time: "09:00 AM - Next Day 09:00 PM",
    venue: "Main Campus Auditorium & Tech Hub",
    tag: "High Priority",
    tagColor: "#ec4899",
    desc: "Premier annual inter-collegiate hackathon featuring AI/ML, Web3, and Systems tracks with prize pool and company interviews.",
    rsvp: true
  },
  {
    id: 2,
    title: "Mid-Term Examinations: OOP, DS, DBMS, CN, AI, COA, CLE",
    category: "Academic",
    date: { day: "02", month: "NOV" },
    time: "10:00 AM - 01:00 PM Daily",
    venue: "Examination Halls Block B & C",
    tag: "Mandatory",
    tagColor: "#ef4444",
    desc: "Official university mid-semester assessment across all 7 enrolled subjects. Minimum 75% attendance required for hall ticket generation.",
    rsvp: false
  },
  {
    id: 3,
    title: "Workshop: Building Autonomous AI with LLMs",
    category: "Technical",
    date: { day: "14", month: "NOV" },
    time: "02:00 PM - 05:30 PM",
    venue: "Seminar Hall 2 & Live Stream",
    tag: "Guest Speaker",
    tagColor: "#38bdf8",
    desc: "Hands-on session with industry researchers on multi-agent architectures, reasoning models, and production AI integration.",
    rsvp: true
  },
  {
    id: 4,
    title: "Annual Tech-Cultural Fest: 'Ignite 2026'",
    category: "Cultural",
    date: { day: "28", month: "NOV" },
    time: "All Day",
    venue: "University Amphitheater & Campus Grounds",
    tag: "Fest",
    tagColor: "#10b981",
    desc: "Robotics battles, competitive gaming tournaments, live band performances, and alumni interactions.",
    rsvp: false
  }
];

// Helper functions for LocalStorage Data Operations
const DataManager = {
  // Check and ensure data consistency with updated curriculum
  checkVersion() {
    const version = localStorage.getItem("academix_version");
    if (version !== CURRICULUM_VERSION) {
      // Refresh cached subjects, attendance, notes, results to match new subjects
      localStorage.setItem("academix_version", CURRICULUM_VERSION);
      localStorage.removeItem("academix_attendance");
      localStorage.removeItem("academix_notes");
      localStorage.removeItem("academix_results");
      localStorage.removeItem("academix_contacts");
    }
  },

  // Generate section options list based on semester number: e.g. "5CSE1" to "5CSE30"
  generateSectionsForSemester(semNumber) {
    const sem = parseInt(semNumber, 10) || 1;
    const sections = [];
    for (let i = 1; i <= 30; i++) {
      sections.push(`${sem}CSE${i}`);
    }
    return sections;
  },

  // Get or initialize user profile
  getUser() {
    const data = localStorage.getItem("academix_user");
    return data ? JSON.parse(data) : null;
  },

  setUser(userData) {
    localStorage.setItem("academix_user", JSON.stringify(userData));
  },

  clearUser() {
    localStorage.removeItem("academix_user");
  },

  // The 7 subjects: OOP, DS, DBMS, CN, AI, COA, CLE
  getSubjects() {
    return ACADEMIC_SUBJECTS;
  },

  // Official Attendance Records (Read-Only institutional attendance data)
  getAttendance() {
    this.checkVersion();
    const data = localStorage.getItem("academix_attendance");
    if (data) return JSON.parse(data);

    // Realistic institutional attendance record for the 7 subjects
    const defaultAttendance = {
      overall: { attended: 201, missed: 27, total: 228 },
      history: [
        { date: "2026-10-09", subject: "Object Oriented Programming (OOP)", status: "Attended", period: "Period 01" },
        { date: "2026-10-09", subject: "Data Structures (DS)", status: "Attended", period: "Period 02" },
        { date: "2026-10-08", subject: "Database Management Systems (DBMS)", status: "Attended", period: "Period 03" },
        { date: "2026-10-08", subject: "Computer Networks (CN)", status: "Not Attended", period: "Period 04" },
        { date: "2026-10-07", subject: "Artificial Intelligence (AI)", status: "Attended", period: "Period 05" },
        { date: "2026-10-07", subject: "Computer Organization & Architecture (COA)", status: "Attended", period: "Period 01" },
        { date: "2026-10-06", subject: "Cyber Laws & Ethics (CLE)", status: "Attended", period: "Period 02" }
      ],
      subjects: {
        "CS-OOP": { name: "Object Oriented Programming (OOP)", code: "CS-OOP", attended: 32, missed: 4, total: 36 },
        "CS-DS": { name: "Data Structures (DS)", code: "CS-DS", attended: 34, missed: 4, total: 38 },
        "CS-DBMS": { name: "Database Management Systems (DBMS)", code: "CS-DBMS", attended: 30, missed: 4, total: 34 },
        "CS-CN": { name: "Computer Networks (CN)", code: "CS-CN", attended: 27, missed: 5, total: 32 },
        "CS-AI": { name: "Artificial Intelligence (AI)", code: "CS-AI", attended: 31, missed: 3, total: 34 },
        "CS-COA": { name: "Computer Organization & Architecture (COA)", code: "CS-COA", attended: 23, missed: 5, total: 28 },
        "CS-CLE": { name: "Cyber Laws & Ethics (CLE)", code: "CS-CLE", attended: 24, missed: 2, total: 26 }
      }
    };

    // Calculate totals dynamically
    let totalAttended = 0;
    let totalMissed = 0;
    let totalClasses = 0;
    Object.values(defaultAttendance.subjects).forEach(s => {
      totalAttended += s.attended;
      totalMissed += s.missed;
      totalClasses += s.total;
    });
    defaultAttendance.overall = { attended: totalAttended, missed: totalMissed, total: totalClasses };

    this.saveAttendance(defaultAttendance);
    return defaultAttendance;
  },

  saveAttendance(attendanceData) {
    localStorage.setItem("academix_attendance", JSON.stringify(attendanceData));
  },



  // Student Preferences & Settings (Pure Dark Mode System)
  getSettings() {
    const data = localStorage.getItem("academix_settings");
    if (!data) return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    try {
      const parsed = JSON.parse(data);
      return {
        theme: {
          bg: parsed.theme?.bg || "slate",
          textTone: parsed.theme?.textTone || "platinum",
          accent: parsed.theme?.accent || parsed.accent || "indigo",
          surface: parsed.theme?.surface || "glass",
          glow: parsed.theme?.glow || "high"
        },
        notifications: {
          dailyAttendance: parsed.notifications?.dailyAttendance !== false,
          newDocs: parsed.notifications?.newDocs !== false,
          lectureReminders: parsed.notifications?.lectureReminders !== false,
          examDeadlines: parsed.notifications?.examDeadlines !== false
        }
      };
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }
  },

  saveSettings(settings) {
    localStorage.setItem("academix_settings", JSON.stringify(settings));
  },

  // Notes
  getNotes() {
    this.checkVersion();
    const data = localStorage.getItem("academix_notes");
    return data ? JSON.parse(data) : DEFAULT_NOTES;
  },

  saveNotes(notes) {
    localStorage.setItem("academix_notes", JSON.stringify(notes));
  },

  // Results
  getResults() {
    this.checkVersion();
    const data = localStorage.getItem("academix_results");
    return data ? JSON.parse(data) : DEFAULT_RESULTS;
  },

  // Events
  getEvents() {
    const data = localStorage.getItem("academix_events");
    return data ? JSON.parse(data) : DEFAULT_EVENTS;
  },

  saveEvents(events) {
    localStorage.setItem("academix_events", JSON.stringify(events));
  },

  // Faculties & Contacts Management
  getContacts() {
    this.checkVersion();
    const data = localStorage.getItem("academix_contacts");
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return DEFAULT_FACULTY_CONTACTS;
      }
    }
    this.saveContacts(DEFAULT_FACULTY_CONTACTS);
    return DEFAULT_FACULTY_CONTACTS;
  },

  saveContacts(contacts) {
    localStorage.setItem("academix_contacts", JSON.stringify(contacts));
  },

  addContact(contact) {
    const contacts = this.getContacts();
    const newContact = {
      id: `custom_${Date.now()}`,
      name: contact.name,
      designation: contact.designation || "Contact",
      subject: contact.subject || "General",
      subjectName: contact.subjectName || contact.subject || "General Inquiry",
      department: contact.department || "General",
      email: contact.email || "",
      phone: contact.phone || "",
      office: contact.office || "Campus Premises",
      officeHours: contact.officeHours || "By Prior Appointment",
      category: contact.category || "Faculty",
      color: contact.color || "#6366f1",
      isSystem: false,
      addedAt: new Date().toISOString()
    };
    contacts.unshift(newContact);
    this.saveContacts(contacts);
    return newContact;
  },

  deleteContact(id) {
    let contacts = this.getContacts();
    contacts = contacts.filter(c => c.id !== id);
    this.saveContacts(contacts);
    return contacts;
  }
};
