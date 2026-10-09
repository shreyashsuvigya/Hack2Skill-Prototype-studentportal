/**
 * AcademiX Chart Visualization Module
 * Powered by Chart.js with responsive dark-cyber aesthetic & animated transitions
 */

const ChartManager = {
  sgpaChartInstance: null,
  marksChartInstance: null,
  gradeDistChartInstance: null,
  attendanceDoughnutInstance: null,

  // Initialize all result & attendance charts
  initResultCharts() {
    this.renderSgpaProgression();
    this.renderSubjectMarksDistribution();
    this.renderGradeBreakdown();
  },

  // 1. Line Chart: Semester-wise SGPA Progression
  renderSgpaProgression() {
    const canvas = document.getElementById("sgpaProgressionChart");
    if (!canvas) return;

    if (this.sgpaChartInstance) {
      this.sgpaChartInstance.destroy();
    }

    const results = DataManager.getResults();
    const labels = results.semesters.map(s => `Sem ${s.sem}`);
    const dataPoints = results.semesters.map(s => s.sgpa);

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.45)");
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");

    this.sgpaChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "SGPA (Scale of 10)",
          data: dataPoints,
          borderColor: "#818cf8",
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "#161e31",
            titleColor: "#f8fafc",
            bodyColor: "#94a3b8",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => `SGPA: ${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          y: {
            min: 7.0,
            max: 10.0,
            grid: {
              color: "rgba(255, 255, 255, 0.06)"
            },
            ticks: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
              stepSize: 0.5
            }
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.03)"
            },
            ticks: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 }
            }
          }
        }
      }
    });
  },

  // 2. Bar Chart: Current Semester Subject Marks (Internals vs End Sem)
  renderSubjectMarksDistribution() {
    const canvas = document.getElementById("subjectMarksChart");
    if (!canvas) return;

    if (this.marksChartInstance) {
      this.marksChartInstance.destroy();
    }

    const results = DataManager.getResults();
    const subjects = results.currentSubjectMarks;
    const labels = subjects.map(s => s.code.replace("CS-", ""));
    const internalScores = subjects.map(s => s.internal);
    const endSemScores = subjects.map(s => s.endSem);

    const ctx = canvas.getContext("2d");

    this.marksChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Continuous Internals (max 30)",
            data: internalScores,
            backgroundColor: "#38bdf8",
            borderRadius: 6,
            stack: 'combined'
          },
          {
            label: "End-Semester Final (max 70)",
            data: endSemScores,
            backgroundColor: "#8b5cf6",
            borderRadius: 6,
            stack: 'combined'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
              boxWidth: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: "#161e31",
            titleColor: "#f8fafc",
            bodyColor: "#94a3b8",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          y: {
            stacked: true,
            max: 100,
            grid: {
              color: "rgba(255, 255, 255, 0.06)"
            },
            ticks: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
            }
          },
          x: {
            stacked: true,
            grid: {
              display: false
            },
            ticks: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
            }
          }
        }
      }
    });
  },

  // 3. Doughnut Chart: Grade breakdown (S, A, B, etc.)
  renderGradeBreakdown() {
    const canvas = document.getElementById("gradeBreakdownChart");
    if (!canvas) return;

    if (this.gradeDistChartInstance) {
      this.gradeDistChartInstance.destroy();
    }

    const results = DataManager.getResults();
    const gradeCounts = { 'S (Outstanding)': 0, 'A+ (Excellent)': 0, 'A (Very Good)': 0, 'B (Good)': 0 };
    
    results.currentSubjectMarks.forEach(s => {
      if (s.grade === 'S') gradeCounts['S (Outstanding)']++;
      else if (s.grade === 'A' && s.total >= 85) gradeCounts['A+ (Excellent)']++;
      else if (s.grade === 'A') gradeCounts['A (Very Good)']++;
      else gradeCounts['B (Good)']++;
    });

    const ctx = canvas.getContext("2d");

    this.gradeDistChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(gradeCounts),
        datasets: [{
          data: Object.values(gradeCounts),
          backgroundColor: ["#10b981", "#38bdf8", "#6366f1", "#f59e0b"],
          borderColor: "#161e31",
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
              padding: 14,
              boxWidth: 10,
              usePointStyle: true
            }
          }
        }
      }
    });
  },

  // 4. Attendance Doughnut gauge chart
  renderAttendanceGauge(canvasId, attended, total) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const missed = Math.max(0, total - attended);
    const percentage = total > 0 ? ((attended / total) * 100).toFixed(1) : 0;
    const isGood = percentage >= 75;

    const ctx = canvas.getContext("2d");
    if (this.attendanceDoughnutInstance) {
      this.attendanceDoughnutInstance.destroy();
    }

    this.attendanceDoughnutInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Classes Attended", "Classes Missed"],
        datasets: [{
          data: [attended, missed],
          backgroundColor: [isGood ? "#10b981" : "#ef4444", "rgba(255, 255, 255, 0.08)"],
          borderColor: "#161e31",
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#161e31",
            titleColor: "#f8fafc",
            bodyColor: "#94a3b8",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1
          }
        }
      }
    });
  }
};
