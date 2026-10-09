# AcademiX — Student Personal College Data Management Portal

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Dark Mode](https://img.shields.io/badge/Theme-Pure_Dark_Mode-6366f1?style=for-the-badge)](https://github.com/shreyashsuvigya/Hack2Skill-Prototype-studentportal)

> **AcademiX** is a responsive, web-based student personal data and academic management portal developed for collegiate tracking. Built with modern dark mode aesthetics, glassmorphism, and performance analytics, AcademiX provides students with an all-in-one hub for their academic profile, institutional attendance ledger, timetable, subject notes vault, graphical result analytics, campus events, and faculty contacts.

---

## 🌟 Key Highlights & Architecture

### 1. 🎭 Role Selection Landing ("Who are you?")
- Interactive welcome screen allowing users to choose their access portal: **Student** or **Teacher**.
- Selecting **Teacher** opens a dedicated *"Feature Coming Soon"* advisory modal, reserving space for the upcoming faculty portal.
- Selecting **Student** routes directly to the student login and registration workflows.

### 2. 🔐 Registration & Authentication
- **University Credential Validation**: Requires Full Name, SRN (Student Registration Number), Semester, Section, Official University Email, 10-digit Mobile Number, and Password.
- **Dynamic Section Population**: Automatically generates section options based on the chosen semester in the standard format `[Semester]CSE[1-30]` (e.g., `5CSE1` through `5CSE30`).
- **Data Integrity**: Enforces email pattern validation and phone number formatting.

### 3. 🛡️ Verified & Immutable Student Profile
- **Virtual Digital ID Card**: Highlights the student's photo avatar, SRN tag, branch, section proctor, and university department credentials.
- **Tamper-Proof Post-Registration**: Student profile details (name, SRN, email, phone number, semester, section) are **strictly immutable** after registration to maintain academic record veracity.
- **Verified Record Badge**: Prominently displays an institutional verified lock indicator in place of client-side profile editing.

### 4. 🏛️ Class Section (Dual-Frame Architecture)
Organized into two distinct, high-clarity visual frames:
- **Frame 1 — Attendance Tracking & Subject Register**:
  - Displays official institutional attendance records across the **7 enrolled curriculum courses** (`OOP`, `DS`, `DBMS`, `CN`, `AI`, `COA`, `CLE`).
  - Read-only institutional records (prevents fraudulent self-marking).
  - Subject cards with attendance percentages, visual progress bars, attended vs. missed counts, and a 75% university eligibility threshold indicator.
  - One-click trigger to inspect the full chronological lecture attendance ledger.
- **Frame 2 — Classmates Directory (Sync Pending)**:
  - Dedicated cohort roster frame with a real-time pulsing amber status indicator (`Yet to be Updated`).
  - Explains that the batch roll sheet and peer profiles are currently undergoing verification with the University Academic Council.
  - Illustrative pending roster skeleton slots indicating official council verification in progress.

### 5. 📅 Interactive Academic Timetable
- Structured weekly timetable from **Monday to Saturday**.
- Day-switcher tab navigation with period numbering, lecture timings, classroom/lab venues, and assigned professor details.

### 6. 👨‍🏫 Faculties & University Contacts Directory
- Pre-loaded with official institutional directory entries for all 7 enrolled course professors, the Head of Department (HOD), Academic Proctor, and 24/7 Campus Emergency Medical Desk.
- **Add Contact Option**: Students can easily add custom contacts (professors, lab assistants, project guides, or study group peers) via an integrated modal form.
- Filter contacts by category: *All Contacts*, *Subject Faculties*, *Administration*, *Emergency*, and *Added by You*.
- Quick action buttons to launch default email (`mailto:`) or phone (`tel:`) clients.
- Delete capability with confirmation for custom-added contacts.

### 7. 📚 Note & Docs Vault
- Initialized with a clean, empty vault state allowing students to create their own study notes from scratch.
- Modal to create lecture summaries, upload reference PDF metadata, and organize files by course code and category (*Lecture Notes* vs. *Reference Docs*).

### 8. 📊 Academic Results & Graphical Analytics (Chart.js)
- **Cumulative GPA & Credit Tracker**: Displays CGPA (8.86), earned credits, standing percentiles, and zero-backlog academic standing.
- **SGPA Progression Line Chart**: Visualizes semester-by-semester GPA trends (Sem 1 through Sem 5).
- **Internal vs. End-Sem Marks Bar Chart**: Comparative visual breakdown for each subject.
- **Attendance Distribution Doughnut Chart**: High-level ratio of attended lectures to missed sessions.
- **Detailed Marks Sheet**: Tabular grade ledger with grades (`S`, `A`, `B`), grade points, internal marks, and end-semester scores.

### 9. 🎨 Dark Mode Customizer & Settings Drawer
- Built-in Dark Mode theme customizer:
  - **Background Themes**: Obsidian, Cyber Slate, Deep Navy, Forest Dark, Cosmic Void, Crimson Dark.
  - **Text Tone Adjustments**: Platinum, Warm Paper, Ice Blue, Mint White.
  - **Vibrant Accent Colors**: Indigo, Emerald, Crimson, Amethyst, Sapphire, Amber, Cyan, Pink.
  - **Surface Textures**: Frosted Glass vs. Solid Matte.
- Bottom-left settings menu including toggle options for daily attendance alerts, document upload notifications, developer contact details, and student sign-out.

---

## 📖 Enrolled Curriculum Subjects

AcademiX is configured with the following 7 required computer science curriculum courses:

| Subject Code | Short Code | Course Name | Credits | Assigned Faculty |
| :--- | :--- | :--- | :---: | :--- |
| `CS-OOP` | **OOP** | Object Oriented Programming | 4 | Dr. Vikram Seth |
| `CS-DS` | **DS** | Data Structures | 4 | Dr. Alok Nath |
| `CS-DBMS` | **DBMS** | Database Management Systems | 4 | Dr. Suresh Reddy |
| `CS-CN` | **CN** | Computer Networks | 4 | Dr. Rajesh Kulkarni |
| `CS-AI` | **AI** | Artificial Intelligence | 4 | Dr. Ananya Mukherjee |
| `CS-COA` | **COA** | Computer Organization & Architecture | 3 | Dr. Anita Desai |
| `CS-CLE` | **CLE** | Cyber Laws & Ethics | 3 | Prof. Meenakshi Sundaram |

---

## 📂 Project Directory Structure

```text
Hack2Skill-Prototype/
│
├── index.html                   # Root entry point (auto-redirects to Student Portal)
├── README.md                    # Project documentation
│
├── Student Portal/              # Core Student Portal Application
│   ├── index.html               # Main single-page application markup & modals
│   ├── css/
│   │   └── style.css            # Custom CSS system, themes, animations & frames
│   └── js/
│       ├── app.js               # Application controller, view routing & event binding
│       ├── data.js              # Data layer, subject roster, contacts & localStorage
│       └── charts.js            # Chart.js visualization configurations
│
└── Faculty Portal/              # Dedicated directory for upcoming teacher portal
```

---

## 🚀 Getting Started

No build steps or npm installations are required! The portal is built purely with vanilla web standards and can run in any modern web browser.

### Option 1: Direct File Launch
Simply double-click [`Student Portal/index.html`](file:///Users/shreyashsuvigya/My%20Projects/GitHub/Hack2Skill-Prototype/Student%20Portal/index.html) or the root [`index.html`](file:///Users/shreyashsuvigya/My%20Projects/GitHub/Hack2Skill-Prototype/index.html) to open the portal in your browser.

### Option 2: Run via Local HTTP Server (Recommended)

Using **Python 3**:
```bash
python3 -m http.server 4173
```
Then navigate to:
```text
http://localhost:4173/Student%20Portal/index.html
```

Using **Node.js (npx serve)**:
```bash
npx -y serve .
```

---

## 💡 Usage Walkthrough

1. **Role Select**: Click **Continue as Student** on the landing page.
2. **Registration**:
   - Switch to the **Register** tab.
   - Enter your name, SRN (e.g., `PES1UG24CS001`), choose your semester (1–8), select your class section (e.g., `5CSE1`), provide your email and 10-digit mobile number, and set a password.
   - Click **Complete Registration & Enter Portal**.
3. **Explore Dashboard**:
   - **Student Profile**: View your digital ID card, GPA metrics, and immutable verified contact information.
   - **Class Section**: Review subject-wise attendance in **Frame 1** and view the synchronization status in **Frame 2 (Classmates)**.
   - **Timetable**: Browse your daily lecture schedule.
   - **Faculties & Contacts**: Access professor contact details or click **+ Add Contact** to add custom peer/faculty numbers.
   - **Note & Docs**: Upload your own lecture notes or reference PDF summaries.
   - **Results & Charts**: Inspect your grade trends and interactive Chart.js diagrams.
   - **Settings (Bottom-Left)**: Customize your dark mode palette, theme accents, and background shades.

---

## 🛠️ Technology Stack

- **Markup**: Semantic HTML5 (Single Page Architecture, Accessible Form Elements, SVG Icons)
- **Styling**: Vanilla CSS3 (Custom Variables, Flexbox/Grid, Glassmorphic Backdrop Filters, Micro-animations)
- **Scripting**: Vanilla JavaScript ES6+ (Modular architecture, DOM event delegation)
- **Visualizations**: [Chart.js 4.4.1](https://www.chartjs.org/) via CDN
- **Persistence**: HTML5 `localStorage` for offline data retention

---

## 📜 License

Created as a prototype submission for **Hack2Skill**. Open-source under the [MIT License](https://opensource.org/licenses/MIT).
