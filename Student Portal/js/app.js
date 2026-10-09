/**
 * AcademiX Main Application Controller
 * Handles authentication, view routing, institutional attendance records (read-only),
 * timetable, routines, notes, results, and events.
 * Enforces subjects: OOP, DS, DBMS, CN, AI, COA, CLE
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  currentUser: null,
  activeSection: "profile",
  selectedDay: "Monday",
  pomodoroTimer: null,
  pomodoroSeconds: 25 * 60,
  isPomodoroRunning: false,

  init() {
    this.applySavedTheme();
    this.bindRoleSelectEvents();
    this.bindAuthEvents();
    this.bindNavigationEvents();
    this.bindAttendanceEvents();
    this.bindTimetableEvents();
    this.bindThemeAndSettingsEvents();
    this.bindNotesEvents();
    this.bindEventsSection();
    this.bindFacultiesEvents();

    // Check if user already logged in
    const existingUser = DataManager.getUser();
    if (existingUser) {
      this.currentUser = existingUser;
      this.launchDashboard();
    } else {
      this.showRoleSelectView();
    }
  },

  /* ==========================================================================
     AUTHENTICATION & REGISTRATION
     ========================================================================== */
  bindAuthEvents() {
    const authTabs = document.querySelectorAll(".auth-tab-btn");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const regSemesterSelect = document.getElementById("regSemester");
    const regSectionSelect = document.getElementById("regSection");

    // Tab switching (Login vs Register)
    authTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        authTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const target = tab.dataset.target;
        if (target === "login") {
          loginForm.style.display = "block";
          registerForm.style.display = "none";
        } else {
          loginForm.style.display = "none";
          registerForm.style.display = "block";
        }
      });
    });

    // Dynamic Section Population on Semester Change (Format: [Sem]CSE[1-30])
    if (regSemesterSelect && regSectionSelect) {
      regSemesterSelect.addEventListener("change", (e) => {
        const selectedSem = e.target.value;
        this.populateSectionDropdown(regSectionSelect, selectedSem);
      });
    }

    // Register Form Submit
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fullName = document.getElementById("regName").value.trim();
        const srn = document.getElementById("regSRN").value.trim().toUpperCase();
        const email = document.getElementById("regEmail") ? document.getElementById("regEmail").value.trim() : "";
        const phone = document.getElementById("regPhone") ? document.getElementById("regPhone").value.trim() : "";
        const semester = parseInt(document.getElementById("regSemester").value, 10);
        const section = document.getElementById("regSection").value;
        const password = document.getElementById("regPassword").value;

        if (!fullName || !srn || !email || !phone || !semester || !section || !password) {
          this.showToast("Please fill in all mandatory registration fields.", "danger");
          return;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          this.showToast("Please enter a valid email address.", "danger");
          return;
        }

        // Phone validation (clean out punctuation and verify min 10 digits)
        const digitsOnly = phone.replace(/\D/g, "");
        if (digitsOnly.length < 10) {
          this.showToast("Please enter a valid 10-digit mobile number.", "danger");
          return;
        }

        const newUser = {
          name: fullName,
          srn: srn,
          semester: semester,
          section: section,
          branch: "Computer Science & Engineering",
          email: email,
          phone: phone,
          bloodGroup: "O+",
          advisor: "Dr. Rajesh Kulkarni",
          address: "Bengaluru, Karnataka, India",
          registeredAt: new Date().toISOString()
        };

        DataManager.setUser(newUser);
        this.currentUser = newUser;
        this.showToast(`Welcome ${fullName}! Your account has been registered.`, "success");
        this.launchDashboard();
      });
    }

    // Login Form Submit
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const srn = document.getElementById("loginSRN").value.trim().toUpperCase();
        const password = document.getElementById("loginPassword").value;

        if (!srn || !password) {
          this.showToast("Please provide your SRN and password.", "danger");
          return;
        }

        let user = DataManager.getUser();
        if (!user || user.srn !== srn) {
          user = {
            name: "Alex Sterling",
            srn: srn,
            semester: 5,
            section: "5CSE14",
            branch: "Computer Science & Engineering",
            email: `${srn.toLowerCase()}@college.edu`,
            phone: "+91 98450 11223",
            bloodGroup: "B+",
            advisor: "Dr. Rajesh Kulkarni",
            address: "Campus Crest Residency, Outer Ring Road, Bengaluru"
          };
          DataManager.setUser(user);
        }

        this.currentUser = user;
        this.showToast(`Login successful. Welcome back, ${user.name}!`, "success");
        this.launchDashboard();
      });
    }



    // Logout Button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to sign out?")) {
          DataManager.clearUser();
          this.currentUser = null;
          this.showToast("You have been signed out.", "info");
          this.showRoleSelectView();
        }
      });
    }
  },

  populateSectionDropdown(selectElement, semester) {
    selectElement.innerHTML = `<option value="" disabled selected>Select Class Section</option>`;
    if (!semester) {
      selectElement.disabled = true;
      return;
    }
    selectElement.disabled = false;
    const sections = DataManager.generateSectionsForSemester(semester);
    sections.forEach(sec => {
      const opt = document.createElement("option");
      opt.value = sec;
      opt.textContent = sec;
      selectElement.appendChild(opt);
    });
  },

  showRoleSelectView() {
    const roleSelect = document.getElementById("roleSelectView");
    const authView = document.getElementById("authView");
    const dashView = document.getElementById("dashboardView");
    if (roleSelect) roleSelect.style.display = "flex";
    if (authView) authView.style.display = "none";
    if (dashView) dashView.style.display = "none";
  },

  showAuthView() {
    const roleSelect = document.getElementById("roleSelectView");
    const authView = document.getElementById("authView");
    const dashView = document.getElementById("dashboardView");
    if (roleSelect) roleSelect.style.display = "none";
    if (authView) authView.style.display = "flex";
    if (dashView) dashView.style.display = "none";
  },

  launchDashboard() {
    const roleSelect = document.getElementById("roleSelectView");
    const authView = document.getElementById("authView");
    const dashView = document.getElementById("dashboardView");
    if (roleSelect) roleSelect.style.display = "none";
    if (authView) authView.style.display = "none";
    if (dashView) dashView.style.display = "flex";

    this.updateUserInterface();
    this.navigateTo("profile");
    this.updateAttendanceBadges();
  },

  /* ==========================================================================
     NAVIGATION SYSTEM (Exact requested sequence:
     1. Student Profile
     2. Class-Section
     3. Timetable
     4. Routine
     5. Note and docs
     6. Results
     7. Events)
     ========================================================================== */
  bindNavigationEvents() {
    const navLinks = document.querySelectorAll(".nav-link[data-nav]");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.dataset.nav;
        this.navigateTo(target);

        // Close sidebar on mobile
        const sidebar = document.getElementById("appSidebar");
        if (sidebar && window.innerWidth <= 1024) {
          sidebar.classList.remove("open");
        }
      });
    });

    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById("sidebarToggleBtn");
    const sidebar = document.getElementById("appSidebar");
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }
  },

  navigateTo(sectionId) {
    this.activeSection = sectionId;

    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.dataset.nav === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });

    const targetSec = document.getElementById(`section-${sectionId}`);
    if (targetSec) {
      targetSec.classList.add("active");
    }

    switch (sectionId) {
      case "profile":
        this.renderProfileView();
        break;
      case "class-section":
        this.renderClassSectionView();
        break;
      case "timetable":
        this.renderTimetableView();
        break;
      case "faculties":
        this.renderFacultiesView();
        break;
      case "notes":
        this.renderNotesView();
        break;
      case "results":
        this.renderResultsView();
        break;
      case "events":
        this.renderEventsView();
        break;
    }
  },

  updateUserInterface() {
    if (!this.currentUser) return;
    const user = this.currentUser;

    const avatarEl = document.getElementById("sidebarAvatar");
    const nameEl = document.getElementById("sidebarUserName");
    const srnEl = document.getElementById("sidebarUserSRN");

    if (avatarEl) avatarEl.textContent = user.name.charAt(0);
    if (nameEl) nameEl.textContent = user.name;
    if (srnEl) srnEl.textContent = `${user.section} • ${user.srn}`;

    const semSecPill = document.getElementById("headerSemSecPill");
    if (semSecPill) {
      semSecPill.textContent = `${user.section} (Sem ${user.semester})`;
    }
  },

  /* ==========================================================================
     1. STUDENT PROFILE
     ========================================================================== */
  renderProfileView() {
    const user = this.currentUser;
    if (!user) return;

    // Digital ID Card
    const idNameEl = document.getElementById("profileIdName");
    if (idNameEl) idNameEl.textContent = user.name;
    const idSrnEl = document.getElementById("profileIdSRN");
    if (idSrnEl) idSrnEl.textContent = user.srn;
    const idAvatarEl = document.getElementById("profileIdAvatar");
    if (idAvatarEl) idAvatarEl.textContent = user.name ? user.name.charAt(0) : "S";
    const idSemEl = document.getElementById("profileIdSem");
    if (idSemEl) idSemEl.textContent = `Semester ${user.semester}`;
    const idSecEl = document.getElementById("profileIdSection");
    if (idSecEl) idSecEl.textContent = user.section;
    const idBranchEl = document.getElementById("profileIdBranch");
    if (idBranchEl) idBranchEl.textContent = user.branch || "Computer Science & Engineering";
    const idAdvisorEl = document.getElementById("profileIdAdvisor");
    if (idAdvisorEl) idAdvisorEl.textContent = user.advisor || "Dr. Rajesh Kulkarni";

    // Information Fields in Personal Dashboard
    const profileEmailEl = document.getElementById("profileEmail");
    if (profileEmailEl) profileEmailEl.textContent = user.email || "Not Provided";
    const profilePhoneEl = document.getElementById("profilePhone");
    if (profilePhoneEl) profilePhoneEl.textContent = user.phone || "Not Provided";
    const profileBloodEl = document.getElementById("profileBlood");
    if (profileBloodEl) profileBloodEl.textContent = user.bloodGroup || "O+";
    const profileAddressEl = document.getElementById("profileAddress");
    if (profileAddressEl) profileAddressEl.textContent = user.address || "Bengaluru, Karnataka, India";

    // Official Attendance Statistics
    const attendance = DataManager.getAttendance();
    const overall = attendance.overall;
    const percent = overall.total > 0 ? ((overall.attended / overall.total) * 100).toFixed(1) : 0;

    const attendStatEl = document.getElementById("profileAttendanceStat");
    if (attendStatEl) attendStatEl.textContent = `${percent}%`;

    const attendedCountEl = document.getElementById("profileAttendedClasses");
    if (attendedCountEl) attendedCountEl.textContent = `${overall.attended} Attended • ${overall.missed} Missed (${overall.total} Held)`;

    // CGPA Stat
    const results = DataManager.getResults();
    const cgpaStatEl = document.getElementById("profileCgpaStat");
    if (cgpaStatEl) cgpaStatEl.textContent = results.cgpa.toFixed(2);
  },

  /* ==========================================================================
     2. CLASS SECTION VIEW
     Renders Two Separate Frames:
     - Frame 1: Attendance Register & Subject Progress (OOP, DS, DBMS, CN, AI, COA, CLE)
     - Frame 2: Classmates Directory (Yet to be Updated state)
     ========================================================================== */
  renderClassSectionView() {
    const user = this.currentUser;
    const subjects = DataManager.getSubjects();
    const attendance = DataManager.getAttendance();

    const titleEl = document.getElementById("classSectionTitle");
    if (titleEl) titleEl.textContent = `${user.section} • Class Section`;
    const semBadge = document.getElementById("classSemBadge");
    if (semBadge) semBadge.textContent = `Semester ${user.semester} CSE`;
    const strengthBadge = document.getElementById("classStrengthBadge");
    if (strengthBadge) strengthBadge.textContent = "68 Students Enrolled";
    const advisorBadge = document.getElementById("classAdvisorBadge");
    if (advisorBadge) advisorBadge.textContent = `Advisor: ${user.advisor || "Dr. Rajesh Kulkarni"}`;

    // Frame 1: Attendance metrics & progress
    const overall = attendance.overall;
    const percent = overall.total > 0 ? ((overall.attended / overall.total) * 100).toFixed(1) : 0;
    const frameAttendBadge = document.getElementById("frameAttendanceOverallBadge");
    if (frameAttendBadge) {
      frameAttendBadge.textContent = `${percent}% Overall`;
      frameAttendBadge.style.color = percent >= 75 ? "#10b981" : "#ef4444";
      frameAttendBadge.style.borderColor = percent >= 75 ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)";
    }
    const frameAttendedVal = document.getElementById("frameAttendedVal");
    if (frameAttendedVal) frameAttendedVal.textContent = overall.attended;
    const frameMissedVal = document.getElementById("frameMissedVal");
    if (frameMissedVal) frameMissedVal.textContent = overall.missed;
    const frameTotalHeldVal = document.getElementById("frameTotalHeldVal");
    if (frameTotalHeldVal) frameTotalHeldVal.textContent = overall.total;

    // Frame 2: Classmates pending pill
    const pendingSectionPill = document.getElementById("pendingSectionPill");
    if (pendingSectionPill) pendingSectionPill.textContent = `${user.section} (Sem ${user.semester})`;

    const container = document.getElementById("classSubjectsGrid");
    if (!container) return;
    container.innerHTML = "";

    subjects.forEach(sub => {
      const subAttend = attendance.subjects[sub.code] || { attended: 0, missed: 0, total: 0 };
      const subPercent = subAttend.total > 0 ? ((subAttend.attended / subAttend.total) * 100).toFixed(1) : 0;
      const statusColor = subPercent >= 75 ? "var(--success)" : "var(--danger)";

      const card = document.createElement("div");
      card.className = "subject-card";
      card.innerHTML = `
        <div class="subject-header">
          <span class="subject-code">${sub.shortName} • ${sub.code}</span>
          <span class="subject-credits">${sub.credits} Credits</span>
        </div>
        <h4 class="subject-title">${sub.name}</h4>
        <div class="faculty-info">
          <div class="faculty-avatar">${sub.shortName.charAt(0)}</div>
          <span>${sub.faculty}</span>
        </div>
        <div class="subject-attendance-progress">
          <div class="progress-info-row">
            <span>Official Attendance: <strong style="color: ${statusColor}">${subPercent}%</strong></span>
            <span>${subAttend.attended}/${subAttend.total} Attended</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${subPercent}%; background: ${statusColor}"></div>
          </div>
          <div style="margin-top: 0.75rem; font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>Attended: <strong style="color: #10b981;">${subAttend.attended}</strong></span>
            <span>Not Attended: <strong style="color: #ef4444;">${subAttend.missed}</strong></span>
            <span>Total Held: <strong>${subAttend.total}</strong></span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  /* ==========================================================================
     4. FACULTIES & CONTACTS SECTION
     ========================================================================== */
  bindFacultiesEvents() {
    const openBtn = document.getElementById("openAddContactModalBtn");
    const modal = document.getElementById("addContactModal");
    const closeBtn = document.getElementById("closeAddContactModal");
    const cancelBtn = document.getElementById("cancelAddContactBtn");
    const form = document.getElementById("addContactForm");
    const filterBtns = document.querySelectorAll(".faculty-filter-btn");

    if (openBtn && modal) {
      openBtn.addEventListener("click", () => {
        if (form) form.reset();
        modal.classList.add("active");
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.remove("active");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (form && modal) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contactName").value.trim();
        const designation = document.getElementById("contactDesignation").value.trim();
        const category = document.getElementById("contactCategory").value;
        const subject = document.getElementById("contactSubject").value.trim();
        const office = document.getElementById("contactOffice").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const phone = document.getElementById("contactPhone").value.trim();
        const officeHours = document.getElementById("contactOfficeHours").value.trim();

        if (!name || !email) {
          this.showToast("Please provide at least a name and email.", "danger");
          return;
        }

        const newContact = {
          name,
          designation,
          category,
          subject,
          subjectName: subject,
          office: office || "Campus Premises",
          email,
          phone: phone || "Not Provided",
          officeHours: officeHours || "By Prior Appointment",
          color: category === "Faculty" ? "#6366f1" : (category === "Emergency" ? "#ef4444" : "#10b981")
        };

        DataManager.addContact(newContact);
        this.renderFacultiesView();
        closeModal();
        this.showToast(`Contact "${name}" saved to directory!`, "success");
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderFacultiesView(btn.dataset.filter);
      });
    });
  },

  renderFacultiesView(filter = "All") {
    const container = document.getElementById("facultiesGridContainer");
    if (!container) return;

    let contacts = DataManager.getContacts();

    if (filter === "Custom") {
      contacts = contacts.filter(c => !c.isSystem);
    } else if (filter !== "All") {
      contacts = contacts.filter(c => c.category.toLowerCase() === filter.toLowerCase());
    }

    container.innerHTML = "";

    if (contacts.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); border: 1px dashed var(--border-color);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
          <h4 style="color: var(--text-main); margin-bottom: 0.35rem;">No contacts found in this filter</h4>
          <p style="font-size: 0.85rem; margin-bottom: 1rem;">Click '+ Add Contact' to create a new faculty or personal contact.</p>
          <button type="button" class="btn-primary" onclick="document.getElementById('openAddContactModalBtn').click()" style="width: auto; display: inline-flex;">
            + Add Contact
          </button>
        </div>
      `;
      return;
    }

    contacts.forEach(c => {
      const card = document.createElement("div");
      card.className = "faculty-card";
      const initial = c.name ? c.name.replace(/^(Dr\.|Prof\.)\s*/i, "").trim().charAt(0) : "F";
      const color = c.color || "#6366f1";

      card.innerHTML = `
        <div class="faculty-card-header">
          <div class="faculty-avatar-lg" style="background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
            ${initial}
          </div>
          <div class="faculty-meta">
            <div class="faculty-name-row">
              <h4 class="faculty-name">${c.name}</h4>
              <span class="badge-pill category-badge ${c.category.toLowerCase()}-badge">${c.category}</span>
            </div>
            <div class="faculty-role">${c.designation}</div>
            <div class="faculty-dept">${c.subjectName || c.subject || c.department}</div>
          </div>
        </div>

        <div class="faculty-contact-details">
          <div class="contact-info-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <a href="mailto:${c.email}" class="contact-link">${c.email}</a>
          </div>
          ${c.phone ? `
          <div class="contact-info-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <a href="tel:${c.phone}" class="contact-link">${c.phone}</a>
          </div>` : ""}
          <div class="contact-info-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${c.office || "Campus Premises"}</span>
          </div>
          <div class="contact-info-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>${c.officeHours || "Available by Appointment"}</span>
          </div>
        </div>

        <div class="faculty-card-footer">
          <div class="faculty-actions-left">
            <a href="mailto:${c.email}" class="btn-sm-action">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Email</span>
            </a>
            ${c.phone && c.phone !== "Not Provided" ? `
            <a href="tel:${c.phone}" class="btn-sm-action">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>Call</span>
            </a>` : ""}
          </div>
          ${!c.isSystem ? `
          <button type="button" class="btn-delete-contact" onclick="App.deleteCustomContact('${c.id}')" title="Delete custom contact">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>` : ""}
        </div>
      `;
      container.appendChild(card);
    });
  },

  deleteCustomContact(id) {
    if (confirm("Are you sure you want to delete this contact?")) {
      DataManager.deleteContact(id);
      this.renderFacultiesView();
      this.showToast("Contact removed from directory.", "info");
    }
  },

  /* ==========================================================================
     3. TIMETABLE (Features OOP, DS, DBMS, CN, AI, COA, CLE)
     ========================================================================== */
  bindTimetableEvents() {
    const dayTabs = document.querySelectorAll(".day-tab-btn");
    dayTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        dayTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.selectedDay = tab.dataset.day;
        this.renderTimetableView();
      });
    });
  },

  renderTimetableView() {
    const container = document.getElementById("timetablePeriodsContainer");
    if (!container) return;

    const periods = DEFAULT_TIMETABLE[this.selectedDay] || [];
    container.innerHTML = "";

    if (periods.length === 0) {
      container.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted); padding: 3rem;">No scheduled lectures for ${this.selectedDay}. Enjoy your study & rest day!</div>`;
      return;
    }

    periods.forEach((p, idx) => {
      const isCurrent = idx === 1;
      const card = document.createElement("div");
      card.className = `period-card ${isCurrent ? 'current-class' : ''}`;
      card.innerHTML = `
        <div class="period-time">
          <span class="time-range">${p.time}</span>
          <span class="period-num">Period 0${p.period} ${isCurrent ? '• Happening Now' : ''}</span>
        </div>
        <div class="period-subject-box">
          <h4>${p.subject}</h4>
          <span class="period-subtext">${p.faculty} • Subject Code: ${p.code}</span>
        </div>
        <div class="period-room-badge">
          <span class="room-tag">${p.room}</span>
        </div>
      `;
      container.appendChild(card);
    });
  },

  /* ==========================================================================
     0. ROLE SELECTION ("Who are you?")
     ========================================================================== */
  bindRoleSelectEvents() {
    const btnSelectStudent = document.getElementById("btnSelectStudent");
    const roleCardStudent = document.getElementById("roleCardStudent");
    const btnSelectTeacher = document.getElementById("btnSelectTeacher");
    const roleCardTeacher = document.getElementById("roleCardTeacher");
    const closeTeacherModalBtn = document.getElementById("closeTeacherModalBtn");
    const goStudentFromTeacherBtn = document.getElementById("goStudentFromTeacherBtn");
    const backToRolesBtn = document.getElementById("backToRolesBtn");
    const teacherModal = document.getElementById("teacherComingSoonModal");

    const goToStudent = () => {
      this.hideTeacherComingSoonModal();
      this.showAuthView();
    };

    if (btnSelectStudent) btnSelectStudent.addEventListener("click", goToStudent);
    if (roleCardStudent) {
      roleCardStudent.addEventListener("click", (e) => {
        if (!e.target.closest("#btnSelectStudent")) goToStudent();
      });
      roleCardStudent.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToStudent();
        }
      });
    }

    const triggerTeacher = () => {
      this.showTeacherComingSoonModal();
    };

    if (btnSelectTeacher) btnSelectTeacher.addEventListener("click", triggerTeacher);
    if (roleCardTeacher) {
      roleCardTeacher.addEventListener("click", (e) => {
        if (!e.target.closest("#btnSelectTeacher")) triggerTeacher();
      });
      roleCardTeacher.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          triggerTeacher();
        }
      });
    }

    if (closeTeacherModalBtn) {
      closeTeacherModalBtn.addEventListener("click", () => this.hideTeacherComingSoonModal());
    }
    if (goStudentFromTeacherBtn) {
      goStudentFromTeacherBtn.addEventListener("click", () => {
        this.hideTeacherComingSoonModal();
        this.showAuthView();
      });
    }
    if (teacherModal) {
      teacherModal.addEventListener("click", (e) => {
        if (e.target === teacherModal) this.hideTeacherComingSoonModal();
      });
    }

    if (backToRolesBtn) {
      backToRolesBtn.addEventListener("click", () => {
        this.showRoleSelectView();
      });
    }
  },

  showTeacherComingSoonModal() {
    const modal = document.getElementById("teacherComingSoonModal");
    if (modal) modal.classList.add("active");
    this.showToast("Feature Coming Soon: Faculty & Teacher Portal is under active development.", "info");
  },

  hideTeacherComingSoonModal() {
    const modal = document.getElementById("teacherComingSoonModal");
    if (modal) modal.classList.remove("active");
  },

  /* ==========================================================================
     DARK MODE THEMES & SETTINGS CONTROLLER (Custom Backgrounds, Text Tones, Accents & Surfaces)
     ========================================================================== */
  applySavedTheme() {
    const settings = DataManager.getSettings();
    const theme = settings.theme || {
      bg: "slate",
      textTone: "platinum",
      accent: "indigo",
      surface: "glass",
      glow: "high"
    };

    // Ensure system is in pure dark mode
    document.documentElement.dataset.theme = "dark";
    document.documentElement.dataset.bg = theme.bg || "slate";
    document.documentElement.dataset.textTone = theme.textTone || "platinum";
    document.documentElement.dataset.accent = theme.accent || "indigo";
    document.documentElement.dataset.surface = theme.surface || "glass";
    document.documentElement.dataset.glow = theme.glow || "high";

    this.updateThemeActiveStates();
  },

  bindThemeAndSettingsEvents() {
    const headerThemePaletteBtn = document.getElementById("headerThemePaletteBtn");
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    const closeSettingsModal = document.getElementById("closeSettingsModal");
    const resetCacheBtn = document.getElementById("resetCacheBtn");
    const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");

    // Header Quick Palette Trigger -> opens settings modal
    if (headerThemePaletteBtn && settingsModal) {
      headerThemePaletteBtn.addEventListener("click", () => {
        settingsModal.classList.add("active");
        this.updateThemeActiveStates();
      });
    }

    // Open Settings Modal from Bottom-Left Sidebar
    if (openSettingsBtn && settingsModal) {
      openSettingsBtn.addEventListener("click", () => {
        this.updateThemeActiveStates();

        const settings = DataManager.getSettings();
        if (settings.notifications) {
          const n1 = document.getElementById("notifDailyAttendance");
          const n2 = document.getElementById("notifNewDocs");
          const n3 = document.getElementById("notifLectureReminders");
          const n4 = document.getElementById("notifExamAlerts");
          if (n1) n1.checked = settings.notifications.dailyAttendance !== false;
          if (n2) n2.checked = settings.notifications.newDocs !== false;
          if (n3) n3.checked = settings.notifications.lectureReminders !== false;
          if (n4) n4.checked = settings.notifications.examDeadlines !== false;
        }

        settingsModal.classList.add("active");
      });
    }

    // Close Settings Modal
    if (closeSettingsModal && settingsModal) {
      closeSettingsModal.addEventListener("click", () => settingsModal.classList.remove("active"));
    }

    // 1-Click Aesthetic Presets
    document.querySelectorAll(".preset-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const preset = btn.dataset.preset;
        if (preset) this.applyThemePreset(preset);
      });
    });

    // Dark Background Selectors
    document.querySelectorAll(".theme-bg-option").forEach(opt => {
      opt.addEventListener("click", () => {
        const bg = opt.dataset.bgChoice;
        if (bg) this.setThemeBg(bg);
      });
    });

    // Text Tone Selectors
    document.querySelectorAll(".theme-tone-option").forEach(opt => {
      opt.addEventListener("click", () => {
        const tone = opt.dataset.toneChoice;
        if (tone) this.setThemeTextTone(tone);
      });
    });

    // Color Accent Swatches
    document.querySelectorAll(".theme-swatch").forEach(swatch => {
      swatch.addEventListener("click", () => {
        const accent = swatch.dataset.accentChoice;
        if (accent) this.setThemeAccent(accent);
      });
    });

    // Surface finish buttons
    document.querySelectorAll(".theme-surface-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const surface = btn.dataset.surfaceChoice;
        if (surface) this.setThemeSurface(surface);
      });
    });

    // Glow intensity buttons
    document.querySelectorAll(".theme-glow-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const glow = btn.dataset.glowChoice;
        if (glow) this.setThemeGlow(glow);
      });
    });

    // Notification Toggles persistence
    const notifInputs = ["notifDailyAttendance", "notifNewDocs", "notifLectureReminders", "notifExamAlerts"];
    notifInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", () => {
          const settings = DataManager.getSettings();
          settings.notifications = settings.notifications || {};
          settings.notifications[id.replace("notif", "").charAt(0).toLowerCase() + id.replace("notif", "").slice(1)] = el.checked;
          DataManager.saveSettings(settings);
          this.showToast(`Notification preferences updated.`, "success");
        });
      }
    });

    // Reset Cache
    if (resetCacheBtn) {
      resetCacheBtn.addEventListener("click", () => {
        if (confirm("Reset local theme, notification settings, and data cache?")) {
          localStorage.removeItem("academix_settings");
          localStorage.removeItem("academix_version");
          this.applySavedTheme();
          this.showToast("Settings and cache reset to defaults.", "info");
          setTimeout(() => location.reload(), 600);
        }
      });
    }

    // Logout from Settings
    if (settingsLogoutBtn) {
      settingsLogoutBtn.addEventListener("click", () => {
        const mainLogout = document.getElementById("logoutBtn");
        if (mainLogout) mainLogout.click();
      });
    }
  },

  setThemeBg(bg) {
    document.documentElement.dataset.bg = bg;
    const settings = DataManager.getSettings();
    settings.theme = settings.theme || {};
    settings.theme.bg = bg;
    DataManager.saveSettings(settings);
    this.updateThemeActiveStates();
    this.showToast(`Background canvas set to ${bg.toUpperCase()}`, "info");
  },

  setThemeTextTone(tone) {
    document.documentElement.dataset.textTone = tone;
    const settings = DataManager.getSettings();
    settings.theme = settings.theme || {};
    settings.theme.textTone = tone;
    DataManager.saveSettings(settings);
    this.updateThemeActiveStates();
    this.showToast(`Text color tone set to ${tone.toUpperCase()}`, "info");
  },

  setThemeAccent(accent) {
    document.documentElement.dataset.accent = accent;
    const settings = DataManager.getSettings();
    settings.theme = settings.theme || {};
    settings.theme.accent = accent;
    DataManager.saveSettings(settings);
    this.updateThemeActiveStates();
    this.showToast(`Accent palette changed to ${accent.toUpperCase()}`, "info");
  },

  setThemeSurface(surface) {
    document.documentElement.dataset.surface = surface;
    const settings = DataManager.getSettings();
    settings.theme = settings.theme || {};
    settings.theme.surface = surface;
    DataManager.saveSettings(settings);
    this.updateThemeActiveStates();
    this.showToast(`Surface style set to ${surface === 'glass' ? 'Glassmorphic' : 'Solid Matte'}`, "info");
  },

  setThemeGlow(glow) {
    document.documentElement.dataset.glow = glow;
    const settings = DataManager.getSettings();
    settings.theme = settings.theme || {};
    settings.theme.glow = glow;
    DataManager.saveSettings(settings);
    this.updateThemeActiveStates();
    this.showToast(`Accent glow set to ${glow === 'high' ? 'High Cyber Glow' : 'Subtle'}`, "info");
  },

  applyThemePreset(presetKey) {
    const presets = {
      cyber: { bg: "slate", textTone: "platinum", accent: "indigo", surface: "glass", glow: "high" },
      oled: { bg: "obsidian", textTone: "platinum", accent: "sapphire", surface: "matte", glow: "subtle" },
      forest: { bg: "forest", textTone: "warm", accent: "emerald", surface: "glass", glow: "high" },
      cosmic: { bg: "cosmic", textTone: "ice", accent: "amethyst", surface: "glass", glow: "high" },
      matrix: { bg: "obsidian", textTone: "mint", accent: "emerald", surface: "matte", glow: "high" },
      crimson: { bg: "crimson", textTone: "warm", accent: "crimson", surface: "glass", glow: "high" },
      amber: { bg: "slate", textTone: "warm", accent: "amber", surface: "glass", glow: "subtle" },
      cyan: { bg: "navy", textTone: "ice", accent: "cyan", surface: "glass", glow: "high" }
    };

    const target = presets[presetKey];
    if (!target) return;

    document.documentElement.dataset.bg = target.bg;
    document.documentElement.dataset.textTone = target.textTone;
    document.documentElement.dataset.accent = target.accent;
    document.documentElement.dataset.surface = target.surface;
    document.documentElement.dataset.glow = target.glow;

    const settings = DataManager.getSettings();
    settings.theme = target;
    DataManager.saveSettings(settings);
    this.updateThemeActiveStates();
    this.showToast(`Applied "${presetKey.toUpperCase()}" Dark Aesthetic Preset!`, "success");
  },

  updateThemeActiveStates() {
    const settings = DataManager.getSettings();
    const theme = settings.theme || {};

    // Accent swatches
    document.querySelectorAll(".theme-swatch").forEach(s => {
      s.classList.toggle("active", s.dataset.accentChoice === theme.accent);
    });

    // Background option cards
    document.querySelectorAll(".theme-bg-option").forEach(b => {
      b.classList.toggle("active", b.dataset.bgChoice === theme.bg);
    });

    // Text tone options
    document.querySelectorAll(".theme-tone-option").forEach(t => {
      t.classList.toggle("active", t.dataset.toneChoice === theme.textTone);
    });

    // Surface buttons
    document.querySelectorAll(".theme-surface-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.surfaceChoice === theme.surface);
    });

    // Glow buttons
    document.querySelectorAll(".theme-glow-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.glowChoice === theme.glow);
    });
  },

  /* ==========================================================================
     5. NOTES AND DOCS (For OOP, DS, DBMS, CN, AI, COA, CLE)
     ========================================================================== */
  bindNotesEvents() {
    const filterBtns = document.querySelectorAll(".notes-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderNotesView(btn.dataset.filter);
      });
    });

    const addNoteBtn = document.getElementById("addNoteBtn");
    const modal = document.getElementById("addNoteModal");
    const closeBtn = document.getElementById("closeAddNoteModal");
    const form = document.getElementById("addNoteForm");

    if (addNoteBtn && modal) {
      addNoteBtn.addEventListener("click", () => modal.classList.add("active"));
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    if (form && modal) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("newNoteTitle").value.trim();
        const subject = document.getElementById("newNoteSubject").value.trim();
        const category = document.getElementById("newNoteCategory").value;
        const content = document.getElementById("newNoteContent").value.trim();

        if (!title || !content) {
          this.showToast("Please provide both title and content.", "danger");
          return;
        }

        const notes = DataManager.getNotes();
        notes.unshift({
          id: Date.now(),
          title: title,
          subject: subject || "Computer Science",
          category: category,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          excerpt: content.substring(0, 110) + "...",
          content: content
        });

        DataManager.saveNotes(notes);
        this.renderNotesView();
        form.reset();
        modal.classList.remove("active");
        this.showToast("Document saved to your personal vault!", "success");
      });
    }

    const readerModal = document.getElementById("viewNoteModal");
    const closeReaderBtn = document.getElementById("closeViewNoteModal");
    if (closeReaderBtn && readerModal) {
      closeReaderBtn.addEventListener("click", () => readerModal.classList.remove("active"));
    }
  },

  renderNotesView(filter = "All") {
    const container = document.getElementById("notesGridContainer");
    if (!container) return;

    let notes = DataManager.getNotes();
    if (filter !== "All") {
      notes = notes.filter(n => n.category.toLowerCase() === filter.toLowerCase());
    }

    container.innerHTML = "";

    if (notes.length === 0) {
      container.innerHTML = `
        <div class="card notes-empty-state-card" style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 2rem; border: 1px dashed var(--border-color);">
          <div style="width: 58px; height: 58px; border-radius: 50%; background: rgba(99, 102, 241, 0.12); color: #818cf8; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-main);">Note & Docs Vault is Empty</h3>
          <p style="color: var(--text-muted); max-width: 440px; margin: 0 auto 1.5rem; font-size: 0.9rem; line-height: 1.5;">
            No documents or notes found in your study repository. Click below to add lecture notes, upload reference PDFs, or save cheat sheets.
          </p>
          <button type="button" class="btn-primary" onclick="document.getElementById('addNoteBtn').click()" style="display: inline-flex; width: auto; margin: 0 auto;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ Create Note / Upload Doc</span>
          </button>
        </div>
      `;
      return;
    }

    notes.forEach(n => {
      const card = document.createElement("div");
      card.className = "note-card";
      card.onclick = () => App.viewNoteDetails(n.id);
      card.innerHTML = `
        <div class="note-card-top">
          <span class="note-category-tag" style="background: rgba(99, 102, 241, 0.15); color: #818cf8;">${n.category}</span>
          <span style="font-size: 0.75rem; color: var(--text-dim);">${n.date}</span>
        </div>
        <h4 class="note-title">${n.title}</h4>
        <p class="note-excerpt">${n.excerpt}</p>
        <div class="note-footer">
          <span>📚 Subject: <strong>${n.subject}</strong></span>
          <span style="color: #38bdf8; font-weight: 600;">Read Notes →</span>
        </div>
      `;
      container.appendChild(card);
    });
  },

  viewNoteDetails(id) {
    const notes = DataManager.getNotes();
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const modal = document.getElementById("viewNoteModal");
    if (!modal) return;

    document.getElementById("viewNoteTitle").textContent = note.title;
    document.getElementById("viewNoteMeta").textContent = `${note.subject} • ${note.category} • ${note.date}`;
    document.getElementById("viewNoteContent").innerHTML = note.content.replace(/\n/g, "<br>");

    modal.classList.add("active");
  },

  /* ==========================================================================
     6. RESULTS (Graphs & Charts for OOP, DS, DBMS, CN, AI, COA, CLE)
     ========================================================================== */
  renderResultsView() {
    const results = DataManager.getResults();

    document.getElementById("resultsCgpaVal").textContent = results.cgpa.toFixed(2);
    document.getElementById("resultsCreditsVal").textContent = `${results.totalCredits} Earned`;
    document.getElementById("resultsRankVal").textContent = "Top 4% in CSE Batch";
    document.getElementById("resultsBacklogsVal").textContent = "0 Backlogs (All Clear)";

    // Render Chart.js diagrams
    ChartManager.initResultCharts();

    // Render Detailed Grade Table
    const tableBody = document.getElementById("resultsTableBody");
    if (tableBody) {
      tableBody.innerHTML = "";
      results.currentSubjectMarks.forEach(s => {
        const row = document.createElement("tr");
        let badgeClass = "grade-s";
        if (s.grade === "A") badgeClass = "grade-a";
        if (s.grade === "B") badgeClass = "grade-b";

        row.innerHTML = `
          <td><strong>${s.code}</strong></td>
          <td>${s.name}</td>
          <td>${s.credits}</td>
          <td>${s.internal} / 30</td>
          <td>${s.endSem} / 70</td>
          <td><strong>${s.total} / 100</strong></td>
          <td><span class="grade-badge ${badgeClass}">${s.grade} (${s.points} pts)</span></td>
        `;
        tableBody.appendChild(row);
      });
    }
  },

  /* ==========================================================================
     7. EVENTS
     ========================================================================== */
  bindEventsSection() {
    const createEventBtn = document.getElementById("createEventBtn");
    if (createEventBtn) {
      createEventBtn.addEventListener("click", () => {
        const title = prompt("Event / Exam / Hackathon Name:");
        if (!title) return;
        const category = prompt("Category (Hackathon, Academic, Cultural, Tech):") || "Academic";
        const dateDay = prompt("Day (e.g. 15):") || "15";
        const dateMonth = prompt("Month abbreviation (e.g. NOV):") || "NOV";
        const venue = prompt("Venue / Location:") || "Auditorium";

        const events = DataManager.getEvents();
        events.unshift({
          id: Date.now(),
          title: title,
          category: category,
          date: { day: dateDay, month: dateMonth.toUpperCase() },
          time: "10:00 AM - 04:00 PM",
          venue: venue,
          tag: "Scheduled",
          tagColor: "#8b5cf6",
          desc: `Campus calendar entry: ${title}`,
          rsvp: true
        });

        DataManager.saveEvents(events);
        this.renderEventsView();
        this.showToast("Event successfully added to your schedule!", "success");
      });
    }
  },

  renderEventsView() {
    const container = document.getElementById("eventsCardsContainer");
    if (!container) return;

    const events = DataManager.getEvents();
    container.innerHTML = "";

    events.forEach(ev => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <div class="event-card-banner">
          <div class="event-date-chip">
            <div class="day">${ev.date.day}</div>
            <div class="month">${ev.date.month}</div>
          </div>
          <span class="badge-pill" style="border-color: ${ev.tagColor}; color: ${ev.tagColor}">
            ${ev.tag}
          </span>
        </div>
        <div class="event-card-body">
          <h4 class="event-title">${ev.title}</h4>
          <p class="event-desc">${ev.desc}</p>
          <div class="event-meta-list">
            <div class="event-meta-item">🕒 ${ev.time}</div>
            <div class="event-meta-item">📍 ${ev.venue}</div>
            <div class="event-meta-item">🏷️ Category: ${ev.category}</div>
          </div>
          <div class="event-card-footer">
            <button class="btn-secondary" onclick="App.toggleEventRsvp(${ev.id})">
              ${ev.rsvp ? '✓ Attending' : '+ RSVP / Register'}
            </button>
            <span style="font-size: 0.8rem; color: var(--accent-primary); font-weight: 700;">Remind Me</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  toggleEventRsvp(id) {
    const events = DataManager.getEvents();
    const ev = events.find(e => e.id === id);
    if (ev) {
      ev.rsvp = !ev.rsvp;
      DataManager.saveEvents(events);
      this.renderEventsView();
      this.showToast(ev.rsvp ? `RSVP confirmed for ${ev.title}!` : `RSVP cancelled for ${ev.title}.`, "info");
    }
  },

  /* ==========================================================================
     OFFICIAL ATTENDANCE RECORDS (READ-ONLY INSTITUTIONAL DATA)
     Displays attended vs not attended classes, calculates attendance percentage.
     Students cannot self-mark or modify attendance.
     ========================================================================== */
  bindAttendanceEvents() {
    const openModalBtn = document.getElementById("openAttendanceModalBtn");
    const modal = document.getElementById("attendanceModal");
    const closeModalBtn = document.getElementById("closeAttendanceModal");

    if (openModalBtn && modal) {
      openModalBtn.addEventListener("click", () => {
        this.renderAttendanceModalContent();
        modal.classList.add("active");
      });
    }

    if (closeModalBtn && modal) {
      closeModalBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });
    }
  },

  renderAttendanceModalContent() {
    const attendance = DataManager.getAttendance();
    const subjects = DataManager.getSubjects();
    const overall = attendance.overall;

    const percent = overall.total > 0 ? ((overall.attended / overall.total) * 100).toFixed(1) : 0;
    const missed = overall.missed;

    // Summary Banner
    document.getElementById("modalOverallPercent").textContent = `${percent}%`;
    document.getElementById("modalAttendedCount").textContent = `${overall.attended} Attended`;
    document.getElementById("modalMissedCount").textContent = `${missed} Not Attended`;

    // 75% Threshold Advisory Analysis
    const advisoryEl = document.getElementById("modalAttendanceAdvisory");
    if (advisoryEl) {
      if (percent < 75) {
        const needed = Math.max(1, Math.ceil(3 * overall.total - 4 * overall.attended));
        advisoryEl.innerHTML = `⚠️ <strong style="color: #ef4444">Attendance Warning:</strong> Current attendance is below the university 75% mandatory threshold. You must attend the next <strong>${needed}</strong> consecutive lectures to regain examination eligibility.`;
      } else {
        const safeSkips = Math.max(0, Math.floor((4 * overall.attended - 3 * overall.total) / 3));
        advisoryEl.innerHTML = `✅ <strong style="color: #10b981">Exam Eligible:</strong> Your attendance satisfies university guidelines (>= 75%). You may miss up to <strong>${safeSkips}</strong> more lectures while remaining eligible.`;
      }
    }

    // Subject List Breakdown (Read-Only)
    const listContainer = document.getElementById("modalSubjectList");
    if (listContainer) {
      listContainer.innerHTML = "";
      subjects.forEach(sub => {
        const subData = attendance.subjects[sub.code] || { attended: 0, missed: 0, total: 0 };
        const subPct = subData.total > 0 ? ((subData.attended / subData.total) * 100).toFixed(1) : 0;
        const color = subPct >= 75 ? "var(--success)" : "var(--danger)";

        const row = document.createElement("div");
        row.className = "attend-marking-item";
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.justifyContent = "space-between";
        row.innerHTML = `
          <div class="attend-subject-details">
            <div class="attend-sub-name" style="font-weight: 700; font-size: 0.95rem;">${sub.name}</div>
            <div class="attend-sub-stats" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              Attended: <strong style="color: #10b981;">${subData.attended}</strong> • 
              Not Attended: <strong style="color: #ef4444;">${subData.missed}</strong> • 
              Total Held: <strong>${subData.total}</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.15rem; font-weight: 800; color: ${color};">${subPct}%</div>
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: ${subPct >= 75 ? '#10b981' : '#ef4444'};">
              ${subPct >= 75 ? 'Eligible' : 'Low Attendance'}
            </div>
          </div>
        `;
        listContainer.appendChild(row);
      });
    }

    // Institutional Attendance Log
    const historyContainer = document.getElementById("modalAttendanceHistory");
    if (historyContainer && attendance.history) {
      historyContainer.innerHTML = "";
      attendance.history.forEach(h => {
        const item = document.createElement("div");
        item.style.cssText = "display: flex; justify-content: space-between; padding: 0.55rem 0; font-size: 0.82rem; border-bottom: 1px solid rgba(255,255,255,0.05);";
        item.innerHTML = `
          <span>📅 ${h.date} • <strong>${h.subject}</strong> <span style="color: var(--text-dim);">(${h.period})</span></span>
          <span style="font-weight: 700; color: ${h.status === 'Attended' ? 'var(--success)' : 'var(--danger)'}">
            ${h.status === 'Attended' ? '✓ Attended' : '✗ Not Attended'}
          </span>
        `;
        historyContainer.appendChild(item);
      });
    }
  },

  updateAttendanceBadges() {
    const attendance = DataManager.getAttendance();
    const overall = attendance.overall;
    const percent = overall.total > 0 ? ((overall.attended / overall.total) * 100).toFixed(1) : 0;

    const pill = document.getElementById("headerAttendancePill");
    const valSpan = document.getElementById("headerAttendanceVal");

    if (valSpan) valSpan.textContent = `${percent}% Attendance`;

    if (pill) {
      pill.classList.remove("warning", "danger");
      if (percent < 75) {
        pill.classList.add("danger");
      } else if (percent < 80) {
        pill.classList.add("warning");
      }
    }
  },

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */
  showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";

    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";
    if (type === "danger") icon = "❌";

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(40px)";
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }
};
