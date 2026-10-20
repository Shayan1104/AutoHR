"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./dashboard.css";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  GitFork,
  Video,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Filter,
  Eye,
  MoreVertical,
  Minus,
  Plus,
  Play,
  Share2,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Layers
} from "lucide-react";

type ViewType =
  | "dashboard"
  | "jobs"
  | "create-job"
  | "applications"
  | "pipeline"
  | "interviews"
  | "reports"
  | "settings";

interface Candidate {
  id: string;
  name: string;
  initials: string;
  role: string;
  score: number;
  skillsScore: number;
  expScore: number;
  reqScore: number;
  status: "Shortlisted" | "Pending" | "Rejected";
  appliedTime: string;
  avatarBg?: string;
  skills: string[];
  experience: string;
  education: string;
  aiInsight: string;
}

const mockCandidates: Candidate[] = [
  {
    id: "c-1",
    name: "Emma Richardson",
    initials: "ER",
    role: "Senior Product Designer",
    score: 92,
    skillsScore: 95,
    expScore: 90,
    reqScore: 93,
    status: "Shortlisted",
    appliedTime: "2h ago",
    skills: ["Product Design", "UI/UX", "Figma", "Design Systems", "User Research"],
    experience: "Lead Product Designer — TechFlow Inc. (2021–Present). Led design for B2B SaaS dashboard used by 50k+ users.",
    education: "B.Des Interaction Design — RISD, 2018",
    aiInsight: "Emma exceeds requirements with 5+ years in product design, strong Figma and design-system experience, and direct B2B SaaS background aligned with this role."
  },
  {
    id: "c-2",
    name: "James Carter",
    initials: "JC",
    role: "Product Designer",
    score: 78,
    skillsScore: 82,
    expScore: 74,
    reqScore: 78,
    status: "Pending",
    appliedTime: "5h ago",
    avatarBg: "linear-gradient(135deg,#fbbf24,#f97316)",
    skills: ["Figma", "Wireframing", "Prototyping", "Adobe XD"],
    experience: "Product Designer — ScaleUp Studio (2022–Present). Designed mobile apps and consumer checkout flows.",
    education: "B.S. Media Arts & Technology — UC Berkeley, 2020",
    aiInsight: "Good visual foundation with strong prototyping skills. Slight gap in enterprise design systems, but high growth potential."
  },
  {
    id: "c-3",
    name: "Michael Kim",
    initials: "MK",
    role: "UX Researcher",
    score: 45,
    skillsScore: 50,
    expScore: 40,
    reqScore: 45,
    status: "Rejected",
    appliedTime: "1d ago",
    avatarBg: "#94a3b8",
    skills: ["User Interviews", "Usability Testing", "Survey Design"],
    experience: "Associate Researcher — ConsumerLab (2023–Present). Conducted qualitative interviews for e-commerce products.",
    education: "B.A. Psychology — NYU, 2022",
    aiInsight: "Limited direct interaction design and Figma component architecture required for this Senior Product Designer requisition."
  },
  {
    id: "c-4",
    name: "Sophia Lim",
    initials: "SL",
    role: "Senior UX Designer",
    score: 96,
    skillsScore: 98,
    expScore: 94,
    reqScore: 96,
    status: "Shortlisted",
    appliedTime: "3h ago",
    avatarBg: "linear-gradient(135deg,#7c3aed,#a855f7)",
    skills: ["UX Architecture", "Figma", "Design Tokens", "Design Sprint", "Accessibility WCAG"],
    experience: "Senior Interaction Designer — NextPay (2020–Present). Re-architected core fintech workflow reducing friction by 34%.",
    education: "M.S. Human-Computer Interaction — Carnegie Mellon, 2019",
    aiInsight: "Exceptional candidate. Top-tier score across behavioral and technical metrics. Direct domain relevance in fintech SaaS."
  },
  {
    id: "c-5",
    name: "Arjun Patel",
    initials: "AP",
    role: "Full Stack Engineer",
    score: 88,
    skillsScore: 92,
    expScore: 85,
    reqScore: 87,
    status: "Shortlisted",
    appliedTime: "6h ago",
    avatarBg: "linear-gradient(135deg,#059669,#10b981)",
    skills: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Docker"],
    experience: "Full Stack Software Engineer — CloudNova (2021–Present). Built high-throughput microservices handling 2M requests/day.",
    education: "B.Tech Computer Science — IIT Bombay, 2020",
    aiInsight: "Strong full-stack acumen with modern Next.js and Python backend experience. Matches job technical requisitions seamlessly."
  }
];

export default function AutoHRDashboard() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(mockCandidates[0]);
  const [activeCandidateTab, setActiveCandidateTab] = useState<"overview" | "breakdown" | "raw">("overview");
  const [showTop5Recordings, setShowTop5Recordings] = useState(true);

  // Job Creation Wizard State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [roleTitle, setRoleTitle] = useState("Senior Product Manager");
  const [skills, setSkills] = useState(["Product Strategy", "Agile Roadmap", "Data Analysis", "User Discovery"]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [expYears, setExpYears] = useState("5+ years");
  const [salaryMin, setSalaryMin] = useState("$ 110,000");
  const [salaryMax, setSalaryMax] = useState("$ 150,000");
  const [hireCount, setHireCount] = useState(1);
  const [shortlistQuota, setShortlistQuota] = useState(10);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkillInput.trim())) {
        setSkills([...skills, newSkillInput.trim()]);
      }
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAdvanceStep = () => {
    if (wizardStep === 1) {
      setIsGeneratingDraft(true);
      setTimeout(() => {
        setIsGeneratingDraft(false);
        setWizardStep(2);
      }, 1000);
    } else if (wizardStep < 4) {
      setWizardStep((prev) => ((prev + 1) as 1 | 2 | 3 | 4));
    }
  };

  return (
    <div className="dashboard-root">
      {/* ===================== SIDEBAR ===================== */}
      <aside className={`db-sidebar ${isSidebarCollapsed ? "is-collapsed" : ""}`}>
        <div className="db-sidebar-header">
          <Link href="/" className="db-logo-link" title="AutoHR Home">
            <div className="db-logo-badge">
              <span className="db-logo-dot" />
              <span className="db-logo-text">AutoHR</span>
            </div>
          </Link>
        </div>

        <nav className="db-nav">
          <button
            type="button"
            className={`db-nav-item ${activeView === "dashboard" ? "is-active" : ""}`}
            onClick={() => setActiveView("dashboard")}
          >
            <span className="db-nav-icon">
              <LayoutDashboard size={18} />
            </span>
            <span className="db-nav-label">Dashboard</span>
          </button>

          <button
            type="button"
            className={`db-nav-item ${activeView === "jobs" ? "is-active" : ""}`}
            onClick={() => setActiveView("jobs")}
          >
            <span className="db-nav-icon">
              <Briefcase size={18} />
            </span>
            <span className="db-nav-label">Jobs</span>
          </button>

          <button
            type="button"
            className={`db-nav-item ${activeView === "create-job" ? "is-active" : ""}`}
            onClick={() => {
              setActiveView("create-job");
              setWizardStep(1);
            }}
          >
            <span className="db-nav-icon">
              <PlusCircle size={18} />
            </span>
            <span className="db-nav-label">Create Job</span>
          </button>

          <button
            type="button"
            className={`db-nav-item ${activeView === "applications" ? "is-active" : ""}`}
            onClick={() => setActiveView("applications")}
          >
            <span className="db-nav-icon">
              <FileText size={18} />
            </span>
            <span className="db-nav-label">Applications</span>
            <span className="db-nav-badge">847</span>
          </button>

          <button
            type="button"
            className={`db-nav-item ${activeView === "pipeline" ? "is-active" : ""}`}
            onClick={() => setActiveView("pipeline")}
          >
            <span className="db-nav-icon">
              <GitFork size={18} />
            </span>
            <span className="db-nav-label">Pipeline</span>
          </button>

          <button
            type="button"
            className={`db-nav-item ${activeView === "interviews" ? "is-active" : ""}`}
            onClick={() => setActiveView("interviews")}
          >
            <span className="db-nav-icon">
              <Video size={18} />
            </span>
            <span className="db-nav-label">Interviews</span>
          </button>

          <button
            type="button"
            className={`db-nav-item ${activeView === "reports" ? "is-active" : ""}`}
            onClick={() => setActiveView("reports")}
          >
            <span className="db-nav-icon">
              <BarChart3 size={18} />
            </span>
            <span className="db-nav-label">Reports</span>
          </button>

          <button
            type="button"
            className={`db-nav-item ${activeView === "settings" ? "is-active" : ""}`}
            onClick={() => setActiveView("settings")}
          >
            <span className="db-nav-icon">
              <Settings size={18} />
            </span>
            <span className="db-nav-label">Settings</span>
          </button>
        </nav>

        {/* Automation Card */}
        <div
          className="db-automation-box"
          onClick={() => setActiveView("pipeline")}
          title="Autonomous AI hiring active"
        >
          <div className="db-auto-header">
            <span>🤖 Automation is On</span>
          </div>
          <p className="db-auto-sub">24 workflows active across Indeed &amp; Rozee →</p>
        </div>

        <div className="db-sidebar-footer">
          <button
            type="button"
            className="btn-sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ===================== MAIN WRAPPER ===================== */}
      <div className="db-main-wrap">
        {/* TOPBAR */}
        <header className="db-topbar">
          <div className="db-search-bar">
            <Search size={16} className="db-search-icon" />
            <input
              type="search"
              className="db-search-input"
              placeholder="Search candidates, jobs, requisitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="db-search-kbd">⌘ K</span>
          </div>

          <div className="db-topbar-actions">
            <button
              type="button"
              className="btn-db-primary"
              onClick={() => {
                setActiveView("create-job");
                setWizardStep(1);
              }}
            >
              <Plus size={16} />
              <span>+ New Job</span>
            </button>

            <button
              type="button"
              className="db-icon-btn"
              title="Notifications (3 unread)"
              onClick={() => alert("AutoHR Notifications: 2 new applications screened from Indeed, 1 interview scheduled on Google Meet.")}
            >
              <Bell size={18} />
              <span className="db-notif-pulse" />
            </button>

            <div className="db-user-chip" onClick={() => setActiveView("settings")}>
              <div className="db-avatar">AL</div>
              <div className="db-user-info">
                <div className="db-user-name">Amélie Laurent</div>
                <div className="db-user-role">Head of People Ops</div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN VIEWS */}
        <main className="db-main-content">
          {/* =========================================================
              VIEW 1: DASHBOARD OVERVIEW (UI 01)
              ========================================================= */}
          {activeView === "dashboard" && (
            <section className="db-view-panel">
              <div className="db-page-header">
                <h1 className="db-title">Welcome back, Amélie 👋</h1>
                <p className="db-subtitle">
                  Here&apos;s what&apos;s happening with your recruitment pipeline across 12 active roles.
                </p>
              </div>

              {/* KPI CARDS */}
              <div className="db-kpi-grid">
                <div className="db-kpi-card">
                  <div className="db-kpi-card-top">
                    <div>
                      <div className="db-kpi-label">Active Jobs</div>
                      <div className="db-kpi-value">12</div>
                      <div className="db-kpi-trend">
                        <TrendingUp size={14} />
                        <span>↑ 20% vs last 7 days</span>
                      </div>
                    </div>
                    <div className="db-kpi-icon-wrap gold">
                      <Briefcase size={20} />
                    </div>
                  </div>
                  {/* Luxury Amber Sparkline */}
                  <svg className="db-sparkline" viewBox="0 0 120 32">
                    <polyline
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2.5"
                      points="0,28 20,22 40,24 60,12 80,16 100,8 120,10"
                    />
                  </svg>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-card-top">
                    <div>
                      <div className="db-kpi-label">New Applications</div>
                      <div className="db-kpi-value">847</div>
                      <div className="db-kpi-trend">
                        <TrendingUp size={14} />
                        <span>↑ 18% vs last 7 days</span>
                      </div>
                    </div>
                    <div className="db-kpi-icon-wrap green">
                      <FileText size={20} />
                    </div>
                  </div>
                  <svg className="db-sparkline" viewBox="0 0 120 32">
                    <polyline
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                      points="0,26 25,20 50,22 75,14 120,6"
                    />
                  </svg>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-card-top">
                    <div>
                      <div className="db-kpi-label">Shortlisted</div>
                      <div className="db-kpi-value">64</div>
                      <div className="db-kpi-trend">
                        <TrendingUp size={14} />
                        <span>↑ 23% vs last 7 days</span>
                      </div>
                    </div>
                    <div className="db-kpi-icon-wrap purple">
                      <Sparkles size={20} />
                    </div>
                  </div>
                  <svg className="db-sparkline" viewBox="0 0 120 32">
                    <polyline
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="2.5"
                      points="0,24 30,18 60,20 90,10 120,12"
                    />
                  </svg>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-card-top">
                    <div>
                      <div className="db-kpi-label">Interviews This Week</div>
                      <div className="db-kpi-value">18</div>
                      <div className="db-kpi-trend">
                        <TrendingUp size={14} />
                        <span>↑ 12% vs last 7 days</span>
                      </div>
                    </div>
                    <div className="db-kpi-icon-wrap teal">
                      <Video size={20} />
                    </div>
                  </div>
                  <svg className="db-sparkline" viewBox="0 0 120 32">
                    <polyline
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="2.5"
                      points="0,22 40,16 80,18 120,8"
                    />
                  </svg>
                </div>
              </div>

              {/* GRID 2: PIPELINE FUNNEL + RECENT ACTIVITY */}
              <div className="db-grid-2">
                {/* FUNNEL CARD */}
                <div className="db-card">
                  <div className="db-card-header">
                    <h2 className="db-card-title">
                      <span>Hiring Pipeline</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 400 }}>
                        (Autonomous Phase 1–4)
                      </span>
                    </h2>
                    <button
                      type="button"
                      className="btn-db-secondary"
                      style={{ padding: "5px 12px", fontSize: "12px" }}
                      onClick={() => setActiveView("pipeline")}
                    >
                      <span>View full pipeline →</span>
                    </button>
                  </div>
                  <div className="db-card-body">
                    <div className="db-funnel-list">
                      <div className="db-funnel-row">
                        <strong>Post</strong>
                        <div className="db-funnel-bar-bg">
                          <div className="db-funnel-fill post" style={{ width: "100%" }}>
                            1,248 Candidates
                          </div>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>100%</span>
                      </div>

                      <div className="db-funnel-row">
                        <strong>Screen</strong>
                        <div className="db-funnel-bar-bg">
                          <div className="db-funnel-fill screen" style={{ width: "68%" }}>
                            847 Screened
                          </div>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>68%</span>
                      </div>

                      <div className="db-funnel-row">
                        <strong>Interview</strong>
                        <div className="db-funnel-bar-bg">
                          <div className="db-funnel-fill interview" style={{ width: "27%" }}>
                            231 3-Stage
                          </div>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>27%</span>
                      </div>

                      <div className="db-funnel-row">
                        <strong>Decide</strong>
                        <div className="db-funnel-bar-bg">
                          <div className="db-funnel-fill decide" style={{ width: "12%", minWidth: "55px" }}>
                            64
                          </div>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>8%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RECENT ACTIVITY CARD */}
                <div className="db-card">
                  <div className="db-card-header">
                    <h2 className="db-card-title">Recent Activity</h2>
                    <button
                      type="button"
                      className="btn-db-secondary"
                      style={{ padding: "5px 12px", fontSize: "12px" }}
                      onClick={() => setActiveView("applications")}
                    >
                      <span>View all →</span>
                    </button>
                  </div>
                  <div className="db-card-body">
                    <ul className="db-activity-list">
                      <li className="db-activity-item">
                        <span className="db-activity-icon" style={{ background: "rgba(5, 150, 105, 0.12)", color: "#059669" }}>
                          📥
                        </span>
                        <div>
                          <div className="db-activity-desc">
                            <strong>New application received</strong>
                            <br />
                            Software Engineer • Alex Johnson
                          </div>
                          <div className="db-activity-time">2m ago • via Indeed</div>
                        </div>
                      </li>

                      <li className="db-activity-item">
                        <span className="db-activity-icon" style={{ background: "rgba(245, 190, 66, 0.2)", color: "#b45309" }}>
                          ⭐
                        </span>
                        <div>
                          <div className="db-activity-desc">
                            <strong>Candidate shortlisted</strong>
                            <br />
                            Product Manager • Sarah Lee
                          </div>
                          <div className="db-activity-time">15m ago • AI Score 94%</div>
                        </div>
                      </li>

                      <li className="db-activity-item">
                        <span className="db-activity-icon" style={{ background: "rgba(13, 148, 136, 0.12)", color: "#0d9488" }}>
                          📅
                        </span>
                        <div>
                          <div className="db-activity-desc">
                            <strong>Interview scheduled</strong>
                            <br />
                            Frontend Developer • Michael Chen
                          </div>
                          <div className="db-activity-time">1h ago • 3-Stage AI Video</div>
                        </div>
                      </li>

                      <li className="db-activity-item">
                        <span className="db-activity-icon" style={{ background: "rgba(124, 58, 237, 0.12)", color: "#7c3aed" }}>
                          ✓
                        </span>
                        <div>
                          <div className="db-activity-desc">
                            <strong>Offer accepted</strong>
                            <br />
                            UI/UX Designer • Priya Sharma
                          </div>
                          <div className="db-activity-time">3h ago • Phase 4 Completed</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* APPLICATIONS OVER 30 DAYS CHART */}
              <div className="db-card">
                <div className="db-card-header">
                  <h2 className="db-card-title">
                    <span>Applications Over 30 Days</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 400 }}>
                      (Multi-channel intake: Indeed + Rozee.pk)
                    </span>
                  </h2>
                  <select className="db-select" style={{ minWidth: "140px" }}>
                    <option>Last 30 Days</option>
                    <option>Last 60 Days</option>
                    <option>Year to Date</option>
                  </select>
                </div>
                <div className="db-card-body">
                  <div className="db-chart-container">
                    <svg viewBox="0 0 800 160" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f5be42" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#f5be42" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <polygon
                        fill="url(#chartGradient)"
                        points="0,120 80,100 160,110 240,70 320,85 400,55 480,65 560,40 640,50 720,25 800,30 800,160 0,160"
                      />
                      <polyline
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="3"
                        points="0,120 80,100 160,110 240,70 320,85 400,55 480,65 560,40 640,50 720,25 800,30"
                      />
                      <polyline
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        points="0,100 200,95 400,90 600,88 800,85"
                      />
                    </svg>
                  </div>
                  <div className="db-chart-dates">
                    <span>Apr 24</span>
                    <span>May 01</span>
                    <span>May 08</span>
                    <span>May 15</span>
                    <span>May 21</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              VIEW 2: JOBS MANAGEMENT (UI 02)
              ========================================================= */}
          {activeView === "jobs" && (
            <section className="db-view-panel">
              <div className="db-page-header-row">
                <div>
                  <h1 className="db-title">Jobs 💼</h1>
                  <p className="db-subtitle">
                    Manage and track all your multi-board job postings and recruitment quotas.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="btn-db-secondary"
                    onClick={() => alert("Previewing public career portal with active branding.")}
                  >
                    🌐 View Jobs on Career Page
                  </button>
                  <button
                    type="button"
                    className="btn-db-primary"
                    onClick={() => {
                      setActiveView("create-job");
                      setWizardStep(1);
                    }}
                  >
                    + Create New Job
                  </button>
                </div>
              </div>

              {/* FILTER TOOLBAR */}
              <div className="db-toolbar">
                <input
                  type="text"
                  className="db-input"
                  style={{ minWidth: "260px" }}
                  placeholder="Search by job title or keyword..."
                />
                <select className="db-select">
                  <option>Department: All</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Design</option>
                  <option>Human Resources</option>
                </select>
                <select className="db-select">
                  <option>Status: All</option>
                  <option>Live</option>
                  <option>Draft</option>
                  <option>Closed</option>
                </select>
                <select className="db-select">
                  <option>Posted On: All Platforms</option>
                  <option>Indeed</option>
                  <option>Rozee.pk</option>
                </select>
                <button type="button" className="btn-db-secondary">
                  ⚙ More Filters
                </button>
                <button
                  type="button"
                  className="btn-db-secondary"
                  onClick={() => setSearchQuery("")}
                >
                  Clear All
                </button>
              </div>

              {/* JOBS TABLE */}
              <div className="db-card">
                <div className="db-table-wrapper">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Applications</th>
                        <th>Shortlist N</th>
                        <th>Posted On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="db-job-cell">
                            <div className="db-job-icon">📁</div>
                            <div>
                              <div className="db-job-title">Senior Frontend Developer</div>
                              <div className="db-job-sub">Lahore, Pakistan • Full-time</div>
                            </div>
                          </div>
                        </td>
                        <td>Engineering</td>
                        <td>
                          <span className="db-badge db-badge-live">● Live</span>
                        </td>
                        <td>👥 48</td>
                        <td><strong>12</strong> / 12</td>
                        <td>
                          <span className="db-tag-indeed">Indeed</span>
                          <span className="db-tag-rozee">Rozee</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 8px" }}
                            onClick={() => setActiveView("applications")}
                            title="View CVs"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <div className="db-job-cell">
                            <div className="db-job-icon" style={{ background: "rgba(245, 190, 66, 0.2)", color: "#b45309" }}>
                              📁
                            </div>
                            <div>
                              <div className="db-job-title">Product Marketing Manager</div>
                              <div className="db-job-sub">Karachi, Pakistan • Hybrid</div>
                            </div>
                          </div>
                        </td>
                        <td>Marketing</td>
                        <td>
                          <span className="db-badge db-badge-draft">● Draft</span>
                        </td>
                        <td>👥 0</td>
                        <td><strong>10</strong></td>
                        <td>—</td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 8px" }}
                            onClick={() => {
                              setActiveView("create-job");
                              setWizardStep(2);
                            }}
                            title="Continue Draft"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <div className="db-job-cell">
                            <div className="db-job-icon" style={{ background: "rgba(13, 148, 136, 0.15)", color: "#0d9488" }}>
                              📁
                            </div>
                            <div>
                              <div className="db-job-title">Senior Product Designer</div>
                              <div className="db-job-sub">Remote • UX/UI Team</div>
                            </div>
                          </div>
                        </td>
                        <td>Design</td>
                        <td>
                          <span className="db-badge db-badge-live">● Live</span>
                        </td>
                        <td>👥 124</td>
                        <td><strong>15</strong> / 15</td>
                        <td>
                          <span className="db-tag-indeed">Indeed</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 8px" }}
                            onClick={() => setActiveView("applications")}
                            title="View Applications"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <div className="db-job-cell">
                            <div className="db-job-icon" style={{ background: "rgba(124, 58, 237, 0.15)", color: "#7c3aed" }}>
                              📁
                            </div>
                            <div>
                              <div className="db-job-title">HR Business Partner</div>
                              <div className="db-job-sub">Islamabad, Pakistan</div>
                            </div>
                          </div>
                        </td>
                        <td>Human Resources</td>
                        <td>
                          <span className="db-badge db-badge-closed">● Closed</span>
                        </td>
                        <td>👥 32</td>
                        <td><strong>8</strong> (Hired)</td>
                        <td>
                          <span className="db-tag-rozee">Rozee</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 8px" }}
                            onClick={() => setActiveView("reports")}
                            title="View Final Report"
                          >
                            <FileText size={14} />
                          </button>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <div className="db-job-cell">
                            <div className="db-job-icon" style={{ background: "rgba(5, 150, 105, 0.15)", color: "#059669" }}>
                              📁
                            </div>
                            <div>
                              <div className="db-job-title">Lead AI / ML Engineer</div>
                              <div className="db-job-sub">Remote • Core AI Team</div>
                            </div>
                          </div>
                        </td>
                        <td>Engineering</td>
                        <td>
                          <span className="db-badge db-badge-live">● Live</span>
                        </td>
                        <td>👥 89</td>
                        <td><strong>10</strong> / 10</td>
                        <td>
                          <span className="db-tag-indeed">Indeed</span>
                          <span className="db-tag-rozee">Rozee</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 8px" }}
                            onClick={() => setActiveView("applications")}
                            title="View Applications"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="db-pagination">
                  <span>Showing 1 to 5 of 24 active and archived jobs</span>
                  <div className="db-page-btn-group">
                    <button type="button" className="db-page-btn">‹</button>
                    <button type="button" className="db-page-btn is-active">1</button>
                    <button type="button" className="db-page-btn">2</button>
                    <button type="button" className="db-page-btn">3</button>
                    <button type="button" className="db-page-btn">›</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              VIEW 3: CREATE JOB WIZARD (UI 03)
              ========================================================= */}
          {activeView === "create-job" && (
            <section className="db-view-panel">
              <div className="db-page-header">
                <h1 className="db-title">Create Job ✨</h1>
                <p className="db-subtitle">
                  Step {wizardStep} of 4:{" "}
                  {wizardStep === 1
                    ? "Tell us about the role you want to hire for."
                    : wizardStep === 2
                    ? "AI generates tailored job descriptions & screening prompts."
                    : wizardStep === 3
                    ? "Review requisitions & platform posting credentials."
                    : "One-click publish to Indeed and Rozee.pk on autopilot."}
                </p>
              </div>

              {/* STEPPER */}
              <div className="db-stepper">
                <div
                  className={`db-step-item ${
                    wizardStep === 1
                      ? "is-active"
                      : wizardStep > 1
                      ? "is-completed"
                      : ""
                  }`}
                  onClick={() => setWizardStep(1)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="db-step-num">
                    {wizardStep > 1 ? "✓" : "1"}
                  </span>
                  <span>Input</span>
                </div>
                <div className="db-step-separator" />

                <div
                  className={`db-step-item ${
                    wizardStep === 2
                      ? "is-active"
                      : wizardStep > 2
                      ? "is-completed"
                      : ""
                  }`}
                  onClick={() => setWizardStep(2)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="db-step-num">
                    {wizardStep > 2 ? "✓" : "2"}
                  </span>
                  <span>AI Draft</span>
                </div>
                <div className="db-step-separator" />

                <div
                  className={`db-step-item ${
                    wizardStep === 3
                      ? "is-active"
                      : wizardStep > 3
                      ? "is-completed"
                      : ""
                  }`}
                  onClick={() => setWizardStep(3)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="db-step-num">
                    {wizardStep > 3 ? "✓" : "3"}
                  </span>
                  <span>Review</span>
                </div>
                <div className="db-step-separator" />

                <div
                  className={`db-step-item ${wizardStep === 4 ? "is-active" : ""}`}
                  onClick={() => setWizardStep(4)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="db-step-num">4</span>
                  <span>Publish</span>
                </div>
              </div>

              {/* WIZARD CONTENT */}
              <div className="db-card">
                <div className="db-card-body">
                  <div className="db-grid-2">
                    {/* LEFT: FORM INPUTS */}
                    <div>
                      <h3 style={{ margin: "0 0 16px", color: "var(--text-main)" }}>
                        {wizardStep === 1 && "Role Details & Shortlist Target"}
                        {wizardStep === 2 && "AI Generated Job Requisition"}
                        {wizardStep === 3 && "Final Review & Screening Criteria"}
                        {wizardStep === 4 && "Multi-Board Broadcast Ready"}
                      </h3>

                      {wizardStep === 1 && (
                        <div>
                          <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                              Role Title
                            </label>
                            <input
                              type="text"
                              className="db-input"
                              style={{ width: "100%" }}
                              value={roleTitle}
                              onChange={(e) => setRoleTitle(e.target.value)}
                            />
                          </div>

                          <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                              Required Skills (Press Enter to add)
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                              {skills.map((skill) => (
                                <span
                                  key={skill}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "4px 10px",
                                    background: "rgba(245, 190, 66, 0.2)",
                                    color: "#b45309",
                                    borderRadius: "var(--pill-radius)",
                                    fontSize: "12px",
                                    fontWeight: 600
                                  }}
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    style={{ border: "none", background: "none", cursor: "pointer", color: "inherit" }}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              className="db-input"
                              style={{ width: "100%" }}
                              placeholder="Type a skill and press Enter..."
                              value={newSkillInput}
                              onChange={(e) => setNewSkillInput(e.target.value)}
                              onKeyDown={handleAddSkill}
                            />
                          </div>

                          <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                              Years of Experience
                            </label>
                            <select
                              className="db-select"
                              style={{ width: "100%" }}
                              value={expYears}
                              onChange={(e) => setExpYears(e.target.value)}
                            >
                              <option>5+ years</option>
                              <option>3+ years</option>
                              <option>1–3 years</option>
                              <option>7+ years</option>
                            </select>
                          </div>

                          <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                              Salary Range (Annual)
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "10px", alignItems: "center" }}>
                              <input
                                type="text"
                                className="db-input"
                                value={salaryMin}
                                onChange={(e) => setSalaryMin(e.target.value)}
                              />
                              <span style={{ color: "var(--text-muted)" }}>—</span>
                              <input
                                type="text"
                                className="db-input"
                                value={salaryMax}
                                onChange={(e) => setSalaryMax(e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                            <div>
                              <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                                Number of Hires
                              </label>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <button
                                  type="button"
                                  className="btn-db-secondary"
                                  style={{ padding: "6px 10px" }}
                                  onClick={() => setHireCount(Math.max(1, hireCount - 1))}
                                >
                                  <Minus size={14} />
                                </button>
                                <strong>{hireCount}</strong>
                                <button
                                  type="button"
                                  className="btn-db-secondary"
                                  style={{ padding: "6px 10px" }}
                                  onClick={() => setHireCount(hireCount + 1)}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                            <div>
                              <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                                Shortlist Size (N)
                              </label>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <button
                                  type="button"
                                  className="btn-db-secondary"
                                  style={{ padding: "6px 10px" }}
                                  onClick={() => setShortlistQuota(Math.max(5, shortlistQuota - 1))}
                                >
                                  <Minus size={14} />
                                </button>
                                <strong>{shortlistQuota}</strong>
                                <button
                                  type="button"
                                  className="btn-db-secondary"
                                  style={{ padding: "6px 10px" }}
                                  onClick={() => setShortlistQuota(shortlistQuota + 1)}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn-db-primary"
                            style={{ width: "100%", justifyContent: "center" }}
                            onClick={handleAdvanceStep}
                            disabled={isGeneratingDraft}
                          >
                            {isGeneratingDraft ? (
                              <span>Drafting with Claude 3.5...</span>
                            ) : (
                              <>
                                <span>→ Continue to AI Draft</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {wizardStep === 2 && (
                        <div style={{ lineHeight: 1.6 }}>
                          <p style={{ color: "#059669", fontWeight: 700, marginBottom: "8px" }}>
                            ✓ AI Draft generated based on {roleTitle} &amp; {skills.length} skills
                          </p>
                          <div style={{ background: "var(--bg-surface-warm)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", marginBottom: "16px" }}>
                            <h4>Role Overview</h4>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                              We are looking for a high-impact {roleTitle} ({expYears}) to lead end-to-end product architecture. You will collaborate closely with engineering and cross-functional partners to drive strategy, roadmap, and data-driven customer discovery.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="btn-db-primary"
                            style={{ width: "100%", justifyContent: "center" }}
                            onClick={() => setWizardStep(3)}
                          >
                            <span>→ Proceed to Review &amp; Compliance</span>
                          </button>
                        </div>
                      )}

                      {wizardStep === 3 && (
                        <div>
                          <div style={{ background: "#fcfaf4", padding: "16px", borderRadius: "var(--radius-sm)", border: "1px solid #ebd9a9", marginBottom: "16px" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                              <ShieldCheck color="#b45309" size={20} />
                              <strong>Automated Compliance &amp; Bias Screening</strong>
                            </div>
                            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                              Verified zero-bias vocabulary. Equal opportunity guidelines adhere to international labor compliance.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="btn-db-primary"
                            style={{ width: "100%", justifyContent: "center" }}
                            onClick={() => setWizardStep(4)}
                          >
                            <span>→ Finalize &amp; Broadcast to Job Boards</span>
                          </button>
                        </div>
                      )}

                      {wizardStep === 4 && (
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                          <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "rgba(5, 150, 105, 0.15)", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                            <Check size={28} />
                          </div>
                          <h3 style={{ marginBottom: "6px" }}>Job Requisition Published!</h3>
                          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>
                            Simultaneous webhook dispatch sent to Indeed Partner API &amp; Rozee.pk. Incoming CVs will be automatically screened.
                          </p>
                          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                            <button
                              type="button"
                              className="btn-db-secondary"
                              onClick={() => setActiveView("jobs")}
                            >
                              View in Jobs List
                            </button>
                            <button
                              type="button"
                              className="btn-db-primary"
                              onClick={() => setActiveView("applications")}
                            >
                              Go to CV Screening
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT: JOB DESCRIPTION PREVIEW */}
                    <div>
                      <h3 style={{ margin: "0 0 16px", color: "var(--text-main)" }}>
                        ✨ Job Description Preview
                      </h3>

                      {wizardStep === 1 ? (
                        <div
                          style={{
                            border: "2px dashed var(--border-subtle)",
                            borderRadius: "var(--radius-md)",
                            padding: "48px 24px",
                            textAlign: "center",
                            color: "var(--text-muted)"
                          }}
                        >
                          <div style={{ fontSize: "40px", marginBottom: "10px", opacity: 0.6 }}>
                            📄✨
                          </div>
                          <p style={{ fontWeight: 700, color: "var(--text-main)" }}>
                            AI Job Description will appear after submit
                          </p>
                          <p style={{ fontSize: "13px" }}>
                            Complete role title &amp; skills to generate optimized recruitment copy.
                          </p>
                        </div>
                      ) : (
                        <div
                          style={{
                            background: "var(--bg-surface-warm)",
                            borderRadius: "var(--radius-md)",
                            padding: "20px",
                            border: "1px solid var(--border-subtle)",
                            fontSize: "13px",
                            lineHeight: 1.6
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <strong style={{ fontSize: "15px" }}>{roleTitle}</strong>
                            <span className="db-badge db-badge-live">Ready to Post</span>
                          </div>
                          <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
                            Target Shortlist: {shortlistQuota} Candidates | Hires: {hireCount}
                          </p>
                          <strong>Core Responsibilities:</strong>
                          <ul style={{ paddingLeft: "18px", margin: "6px 0 12px", color: "var(--text-secondary)" }}>
                            <li>Define strategic product vision and lead roadmap execution.</li>
                            <li>Analyze qualitative and quantitative user feedback to uncover high-impact opportunities.</li>
                            <li>Partner with engineering leads on architectural prioritization and sprint delivery.</li>
                          </ul>
                          <strong>Key Qualifications:</strong>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                            {skills.map((s) => (
                              <span key={s} className="db-badge db-badge-pending">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div
                        style={{
                          marginTop: "16px",
                          padding: "12px 16px",
                          background: "#fcfaf4",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid #ebd9a9",
                          fontSize: "12.5px",
                          color: "#92400e",
                          display: "flex",
                          gap: "10px",
                          alignItems: "center"
                        }}
                      >
                        <Sparkles size={16} />
                        <span>
                          Your inputs help our AI create a clear, compelling and effective job description tailored for Indeed and Rozee.pk.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              VIEW 4: CV SCREENING & APPLICATIONS (UI 04)
              ========================================================= */}
          {activeView === "applications" && (
            <section className="db-view-panel">
              <div className="db-page-header-row">
                <div>
                  <h1 className="db-title">CV Screening &amp; Applications 📄</h1>
                  <p className="db-subtitle">
                    AI-powered multi-dimensional CV screening and candidate ranking.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-db-secondary"
                  onClick={() => alert("Exporting 24 shortlisted candidate records as CSV / PDF report.")}
                >
                  <Download size={14} />
                  <span>Export Results</span>
                </button>
              </div>

              {/* TOOLBAR */}
              <div className="db-toolbar">
                <select className="db-select" style={{ minWidth: "280px" }}>
                  <option>Senior Product Designer — UX/UI Team</option>
                  <option>Senior Frontend Developer — Engineering</option>
                  <option>Lead AI / ML Engineer — Core AI</option>
                </select>
                <select className="db-select">
                  <option>Score: 60% and above</option>
                  <option>Score: 80% and above (Top Tier)</option>
                  <option>All Match Scores</option>
                </select>
                <button type="button" className="btn-db-secondary">
                  <Filter size={14} />
                  <span>Filter</span>
                </button>
                <input
                  type="search"
                  className="db-input"
                  style={{ flex: 1, minWidth: "200px" }}
                  placeholder="Search candidates by name or skill..."
                />
              </div>

              {/* SPLIT VIEW */}
              <div className="db-split-grid">
                {/* CANDIDATE LIST */}
                <div className="db-card db-candidate-list-pane">
                  <div
                    style={{
                      padding: "14px 18px",
                      borderBottom: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <strong>Candidates ({mockCandidates.length})</strong>
                    <select className="db-select" style={{ padding: "4px 8px", fontSize: "12px" }}>
                      <option>Sort: Best Match</option>
                      <option>Sort: Newest First</option>
                    </select>
                  </div>

                  <div style={{ overflowY: "auto", flex: 1 }}>
                    {mockCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        className={`db-candidate-card ${
                          selectedCandidate.id === cand.id ? "is-selected" : ""
                        }`}
                        onClick={() => setSelectedCandidate(cand)}
                      >
                        <div
                          className="db-avatar"
                          style={{
                            background: cand.avatarBg || "linear-gradient(135deg,#a78bfa,#4f46e5)",
                            width: "38px",
                            height: "38px"
                          }}
                        >
                          {cand.initials}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: "13.5px" }}>{cand.name}</strong>
                            <span
                              style={{
                                color:
                                  cand.score >= 85
                                    ? "#059669"
                                    : cand.score >= 70
                                    ? "#d97706"
                                    : "#dc2626",
                                fontWeight: 700,
                                fontSize: "13px"
                              }}
                            >
                              {cand.score}%
                            </span>
                          </div>
                          <div className="db-job-sub">{cand.role}</div>

                          <div className="db-score-bar-bg">
                            <div
                              className="db-score-bar-fill"
                              style={{
                                width: `${cand.score}%`,
                                background:
                                  cand.score >= 85
                                    ? "#059669"
                                    : cand.score >= 70
                                    ? "#d97706"
                                    : "#dc2626"
                              }}
                            />
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                            <span
                              className={`db-badge ${
                                cand.status === "Shortlisted"
                                  ? "db-badge-shortlisted"
                                  : cand.status === "Pending"
                                  ? "db-badge-pending"
                                  : "db-badge-rejected"
                              }`}
                            >
                              {cand.status}
                            </span>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {cand.appliedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SELECTED CANDIDATE DETAIL */}
                <div className="db-card">
                  <div className="db-card-body">
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                      <div
                        className="db-avatar"
                        style={{
                          width: "56px",
                          height: "56px",
                          fontSize: "18px",
                          background: selectedCandidate.avatarBg || "linear-gradient(135deg,#a78bfa,#4f46e5)"
                        }}
                      >
                        {selectedCandidate.initials}
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--text-main)" }}>
                          {selectedCandidate.name}
                        </h2>
                        <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "13px" }}>
                          {selectedCandidate.role} • Applied via Indeed
                        </p>
                      </div>
                      <span
                        className={`db-badge ${
                          selectedCandidate.status === "Shortlisted"
                            ? "db-badge-shortlisted"
                            : selectedCandidate.status === "Pending"
                            ? "db-badge-pending"
                            : "db-badge-rejected"
                        }`}
                        style={{ marginLeft: "auto", fontSize: "13px", padding: "6px 14px" }}
                      >
                        {selectedCandidate.status}
                      </span>
                    </div>

                    {/* Tabs */}
                    <div className="db-tab-bar">
                      <button
                        type="button"
                        className={`db-tab-btn ${activeCandidateTab === "overview" ? "is-active" : ""}`}
                        onClick={() => setActiveCandidateTab("overview")}
                      >
                        CV Overview
                      </button>
                      <button
                        type="button"
                        className={`db-tab-btn ${activeCandidateTab === "breakdown" ? "is-active" : ""}`}
                        onClick={() => setActiveCandidateTab("breakdown")}
                      >
                        5D AI Score Breakdown
                      </button>
                      <button
                        type="button"
                        className={`db-tab-btn ${activeCandidateTab === "raw" ? "is-active" : ""}`}
                        onClick={() => setActiveCandidateTab("raw")}
                      >
                        Raw CV View
                      </button>
                    </div>

                    {/* TAB: OVERVIEW */}
                    {activeCandidateTab === "overview" && (
                      <div className="db-grid-2">
                        <div>
                          <h4 style={{ margin: "0 0 8px", color: "var(--text-main)" }}>
                            Parsed Skills
                          </h4>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                            {selectedCandidate.skills.map((s) => (
                              <span
                                key={s}
                                style={{
                                  padding: "4px 10px",
                                  background: "rgba(5, 150, 105, 0.12)",
                                  color: "#059669",
                                  borderRadius: "var(--pill-radius)",
                                  fontSize: "12px",
                                  fontWeight: 600
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          <h4 style={{ margin: "0 0 6px", color: "var(--text-main)" }}>
                            Experience
                          </h4>
                          <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                            {selectedCandidate.experience}
                          </p>

                          <h4 style={{ margin: "0 0 6px", color: "var(--text-main)" }}>
                            Education
                          </h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                            {selectedCandidate.education}
                          </p>
                        </div>

                        {/* Ring score & sub scores */}
                        <div>
                          <div
                            className="db-score-ring"
                            style={{
                              borderColor:
                                selectedCandidate.score >= 85
                                  ? "#059669"
                                  : selectedCandidate.score >= 70
                                  ? "#d97706"
                                  : "#dc2626",
                              color:
                                selectedCandidate.score >= 85
                                  ? "#059669"
                                  : selectedCandidate.score >= 70
                                  ? "#d97706"
                                  : "#dc2626"
                            }}
                          >
                            {selectedCandidate.score}%
                          </div>
                          <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)", margin: "0 0 18px" }}>
                            Overall Requisition Match
                          </p>

                          <div style={{ marginBottom: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                              <span>Skills Match</span>
                              <strong>{selectedCandidate.skillsScore}%</strong>
                            </div>
                            <div className="db-score-bar-bg">
                              <div
                                className="db-score-bar-fill"
                                style={{ width: `${selectedCandidate.skillsScore}%` }}
                              />
                            </div>
                          </div>

                          <div style={{ marginBottom: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                              <span>Experience Match</span>
                              <strong>{selectedCandidate.expScore}%</strong>
                            </div>
                            <div className="db-score-bar-bg">
                              <div
                                className="db-score-bar-fill"
                                style={{ width: `${selectedCandidate.expScore}%` }}
                              />
                            </div>
                          </div>

                          <div style={{ marginBottom: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                              <span>Requirements Match</span>
                              <strong>{selectedCandidate.reqScore}%</strong>
                            </div>
                            <div className="db-score-bar-bg">
                              <div
                                className="db-score-bar-fill"
                                style={{ width: `${selectedCandidate.reqScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: BREAKDOWN */}
                    {activeCandidateTab === "breakdown" && (
                      <div>
                        <h4 style={{ marginBottom: "12px" }}>5-Dimensional Autonomous AI Scoring Model</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div style={{ background: "var(--bg-surface-warm)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                            <strong>1. Technical Competence: {selectedCandidate.skillsScore}%</strong>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                              Evaluated across core framework keywords, repository code artifacts, and portfolio demonstrations.
                            </p>
                          </div>
                          <div style={{ background: "var(--bg-surface-warm)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                            <strong>2. Domain Experience: {selectedCandidate.expScore}%</strong>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                              Verified industry relevance in SaaS product design and scalable web workflows.
                            </p>
                          </div>
                          <div style={{ background: "var(--bg-surface-warm)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                            <strong>3. Pedigree &amp; Education: {selectedCandidate.reqScore}%</strong>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                              Accreditation validation and consistency of tenure across past positions.
                            </p>
                          </div>
                          <div style={{ background: "var(--bg-surface-warm)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                            <strong>4. Behavioral Predictor: 92%</strong>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                              Derived from communication velocity, career trajectory, and proactive ownership metrics.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: RAW CV */}
                    {activeCandidateTab === "raw" && (
                      <div
                        style={{
                          background: "var(--bg-surface-warm)",
                          padding: "18px",
                          borderRadius: "var(--radius-sm)",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          whiteSpace: "pre-wrap",
                          border: "1px solid var(--border-subtle)",
                          maxHeight: "260px",
                          overflowY: "auto"
                        }}
                      >
                        {`CANDIDATE CURRICULUM VITAE
----------------------------------------
Name: ${selectedCandidate.name}
Target Requisition: ${selectedCandidate.role}
Email: ${selectedCandidate.name.toLowerCase().replace(" ", ".")}@example.com

SUMMARY:
Results-driven design leader with demonstrated ability in shipping enterprise-scale UI/UX systems.

EXPERIENCE:
${selectedCandidate.experience}

CORE SKILLS:
${selectedCandidate.skills.join(", ")}

EDUCATION:
${selectedCandidate.education}
----------------------------------------
PARSED BY: AutoHR Async FastParser v2.4 (Status: 100% Parsed)`}
                      </div>
                    )}

                    {/* AI INSIGHT CALLOUT */}
                    <div className="db-insight-box">
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#b45309", fontWeight: 700 }}>
                        <Sparkles size={16} />
                        <span>AI Hiring Recommendation &amp; Summary</span>
                      </div>
                      <p style={{ margin: "8px 0 12px", color: "var(--text-main)", lineHeight: 1.5 }}>
                        {selectedCandidate.aiInsight}
                      </p>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          className="btn-db-primary"
                          onClick={() => {
                            alert(`Advancing ${selectedCandidate.name} to 3-Stage Interview!`);
                            setActiveView("interviews");
                          }}
                        >
                          Schedule 3-Stage AI Interview →
                        </button>
                        <button
                          type="button"
                          className="btn-db-secondary"
                          onClick={() => alert(`Candidate ${selectedCandidate.name} flagged as Shortlisted.`)}
                        >
                          Confirm Shortlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              VIEW 5: PIPELINE KANBAN (UI 05 Pipeline)
              ========================================================= */}
          {activeView === "pipeline" && (
            <section className="db-view-panel">
              <div className="db-page-header-row">
                <div>
                  <h1 className="db-title">Hiring Pipeline ⏵</h1>
                  <p className="db-subtitle">
                    Autonomous progression across Post → Screen → Interview → Decide.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-db-secondary"
                  onClick={() => alert("Auto-syncing applicants from Indeed and Rozee.pk webhooks...")}
                >
                  🔄 Sync Webhooks
                </button>
              </div>

              <div className="db-kanban-board">
                {/* COL 1: POST */}
                <div className="db-kanban-col">
                  <div className="db-kanban-col-head">
                    <span className="db-kanban-col-title">Phase 1 · Post</span>
                    <span className="db-badge db-badge-draft">1,248</span>
                  </div>
                  <div className="db-kanban-card">
                    <strong>Indeed Intake Feed</strong>
                    <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: "4px 0" }}>
                      820 active clicks • 412 direct applications
                    </p>
                    <span className="db-tag-indeed">Indeed API</span>
                  </div>
                  <div className="db-kanban-card">
                    <strong>Rozee.pk Broadcast</strong>
                    <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: "4px 0" }}>
                      428 applications received in last 24h
                    </p>
                    <span className="db-tag-rozee">Rozee Live</span>
                  </div>
                </div>

                {/* COL 2: SCREEN */}
                <div className="db-kanban-col">
                  <div className="db-kanban-col-head">
                    <span className="db-kanban-col-title">Phase 2 · CV Screen</span>
                    <span className="db-badge db-badge-pending">847</span>
                  </div>
                  <div className="db-kanban-card" onClick={() => setActiveView("applications")}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>James Carter</strong>
                      <span style={{ color: "#d97706", fontWeight: 700 }}>78%</span>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: "4px 0" }}>
                      Product Designer • Pending Review
                    </p>
                    <span className="db-badge db-badge-pending">Needs Review</span>
                  </div>
                  <div className="db-kanban-card" onClick={() => setActiveView("applications")}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>Michael Kim</strong>
                      <span style={{ color: "#dc2626", fontWeight: 700 }}>45%</span>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: "4px 0" }}>
                      UX Researcher • Below Threshold
                    </p>
                    <span className="db-badge db-badge-rejected">Rejected</span>
                  </div>
                </div>

                {/* COL 3: INTERVIEW */}
                <div className="db-kanban-col">
                  <div className="db-kanban-col-head">
                    <span className="db-kanban-col-title">Phase 3 · Interview</span>
                    <span className="db-badge db-badge-live">231</span>
                  </div>
                  <div className="db-kanban-card" onClick={() => setActiveView("interviews")}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>Emma Richardson</strong>
                      <span style={{ color: "#059669", fontWeight: 700 }}>92%</span>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: "4px 0" }}>
                      Stage 2: Technical Assessment Today
                    </p>
                    <span className="db-badge db-badge-shortlisted">Stage 2 Live</span>
                  </div>
                  <div className="db-kanban-card" onClick={() => setActiveView("interviews")}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>Arjun Patel</strong>
                      <span style={{ color: "#059669", fontWeight: 700 }}>88%</span>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: "4px 0" }}>
                      Stage 3: Behavioral Completed
                    </p>
                    <span className="db-badge db-badge-shortlisted">Stage 3 Done</span>
                  </div>
                </div>

                {/* COL 4: DECIDE */}
                <div className="db-kanban-col">
                  <div className="db-kanban-col-head">
                    <span className="db-kanban-col-title">Phase 4 · Decide</span>
                    <span className="db-badge db-badge-shortlisted">64</span>
                  </div>
                  <div className="db-kanban-card" onClick={() => setActiveView("reports")}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>Sophia Lim</strong>
                      <span style={{ color: "#059669", fontWeight: 700 }}>96%</span>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: "4px 0" }}>
                      Rank #1 • Strong Hire Recommended
                    </p>
                    <span className="db-badge db-badge-live">Offer Ready</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              VIEW 6: INTERVIEWS (UI 06)
              ========================================================= */}
          {activeView === "interviews" && (
            <section className="db-view-panel">
              <div className="db-page-header-row">
                <div>
                  <h1 className="db-title">3-Stage AI Interviews 🎥</h1>
                  <p className="db-subtitle">
                    Automated calendar slots, candidate recording consent, and AI sentiment analysis.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-db-primary"
                  onClick={() => alert("Launching live AI interview video room simulator...")}
                >
                  <Play size={14} />
                  <span>Launch AI Video Room</span>
                </button>
              </div>

              {/* 3-STAGE BREAKDOWN CARDS */}
              <div className="db-kpi-grid">
                <div className="db-kpi-card">
                  <div className="db-kpi-label">Stage 1: AI Voice Screening</div>
                  <div className="db-kpi-value" style={{ fontSize: "1.45rem" }}>
                    142 Active
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Conversational voice screening verifying experience &amp; communication.
                  </p>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-label">Stage 2: Technical Assessment</div>
                  <div className="db-kpi-value" style={{ fontSize: "1.45rem" }}>
                    65 Active
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Live system design / interactive technical problem solving.
                  </p>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-label">Stage 3: Behavioral &amp; Culture</div>
                  <div className="db-kpi-value" style={{ fontSize: "1.45rem" }}>
                    24 Active
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Emotion analysis, ownership questions, and organizational fit.
                  </p>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-label">Consent &amp; Security</div>
                  <div className="db-kpi-value" style={{ fontSize: "1.45rem", color: "#059669" }}>
                    100% GDPR
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Audio/video recording agreements securely signed and timestamped.
                  </p>
                </div>
              </div>

              {/* SCHEDULED INTERVIEWS TABLE */}
              <div className="db-card">
                <div className="db-card-header">
                  <h2 className="db-card-title">Upcoming Scheduled AI Interviews Today</h2>
                  <span className="db-badge db-badge-live">Auto-Recording Active</span>
                </div>
                <div className="db-table-wrapper">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Target Role</th>
                        <th>Stage</th>
                        <th>Slot Time</th>
                        <th>Consent Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Emma Richardson</strong>
                        </td>
                        <td>Senior Product Designer</td>
                        <td>
                          <span className="db-badge db-badge-pending">Stage 2: Technical</span>
                        </td>
                        <td>Today, 02:00 PM - 02:45 PM</td>
                        <td>
                          <span className="db-badge db-badge-live">✓ Consent Verified</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-primary"
                            style={{ padding: "4px 10px", fontSize: "12px" }}
                            onClick={() => alert("Connecting to AI Interview Room for Emma Richardson...")}
                          >
                            Join AI Room
                          </button>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <strong>Arjun Patel</strong>
                        </td>
                        <td>Full Stack Developer</td>
                        <td>
                          <span className="db-badge db-badge-shortlisted">Stage 3: Behavioral</span>
                        </td>
                        <td>Today, 04:30 PM - 05:15 PM</td>
                        <td>
                          <span className="db-badge db-badge-live">✓ Consent Verified</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 10px", fontSize: "12px" }}
                            onClick={() => alert("Reviewing Arjun Patel's completed transcript & code logs.")}
                          >
                            View Recording &amp; Log
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              VIEW 7: REPORTS / FINAL RANKING (UI 05)
              ========================================================= */}
          {activeView === "reports" && (
            <section className="db-view-panel">
              <div className="db-page-header-row">
                <div>
                  <h1 className="db-title">
                    Final Ranking and Reports
                    <span className="db-phase-tag">Phase 4 · Decide</span>
                  </h1>
                  <p className="db-subtitle">
                    Review ranked candidates, AI recommendations, and export hiring reports.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-db-secondary"
                  onClick={() => alert("Generating full executive hiring audit PDF with candidate scorecards.")}
                >
                  <Download size={14} />
                  <span>📄 Export PDF Report ▾</span>
                </button>
              </div>

              {/* 4 KPI CARDS */}
              <div className="db-kpi-grid">
                <div className="db-kpi-card">
                  <div className="db-kpi-label">Total Candidates</div>
                  <div className="db-kpi-value" style={{ fontSize: "1.55rem" }}>
                    28
                  </div>
                  <div className="db-job-sub">Shortlisted from 56 applicants</div>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-label">Average Combined Score</div>
                  <div className="db-kpi-value" style={{ fontSize: "1.55rem" }}>
                    72.4{" "}
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-muted)" }}>
                      / 100
                    </span>
                  </div>
                  <div className="db-kpi-trend">
                    <TrendingUp size={14} />
                    <span>↑ +6.3 pts vs previous stage</span>
                  </div>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-label">Top Score</div>
                  <div className="db-kpi-value" style={{ fontSize: "1.55rem", color: "#059669" }}>
                    92.7
                  </div>
                  <div className="db-job-sub">Candidate #1 (Sophia Lim)</div>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-label">Hiring Decision Status</div>
                  <div className="db-kpi-value" style={{ fontSize: "1.35rem", color: "#b45309" }}>
                    AI Recommended
                  </div>
                  <div className="db-job-sub">8 candidates ready to advance</div>
                </div>
              </div>

              {/* TOGGLES & SEARCH */}
              <div className="db-card">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--border-subtle)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                    <div
                      className={`db-switch ${showTop5Recordings ? "is-on" : ""}`}
                      onClick={() => setShowTop5Recordings(!showTop5Recordings)}
                      role="switch"
                      aria-checked={showTop5Recordings}
                      tabIndex={0}
                    />
                    <strong>Show interview recording links (Top 5 only)</strong>
                  </div>
                  <select className="db-select">
                    <option>All Open Roles</option>
                    <option>Senior UX Designer</option>
                    <option>Full Stack Developer</option>
                  </select>
                  <input
                    type="search"
                    className="db-input"
                    placeholder="Search candidates..."
                    style={{ maxWidth: "220px" }}
                  />
                  <button type="button" className="btn-db-secondary">
                    Filters
                  </button>
                </div>

                {/* RANKED TABLE */}
                <div className="db-table-wrapper">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Candidate</th>
                        <th>Combined</th>
                        <th>CV Score</th>
                        <th>Interview</th>
                        <th>AI Recommendation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* RANK 1 */}
                      <tr>
                        <td>
                          <strong style={{ fontSize: "15px", color: "#b45309" }}>#1</strong>
                        </td>
                        <td>
                          <div className="db-job-cell">
                            <div className="db-avatar" style={{ width: "34px", height: "34px", fontSize: "11px", background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
                              SL
                            </div>
                            <div>
                              <div className="db-job-title">Sophia Lim</div>
                              <div className="db-job-sub">Senior UX Designer · CND-2025-041</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "120px" }}>
                            <strong>92.7</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "93%", background: "#059669" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "100px" }}>
                            <strong>89</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "89%", background: "#7c3aed" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "100px" }}>
                            <strong>95</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "95%", background: "#d97706" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="db-badge db-badge-shortlisted">✓ Strong Hire</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 8px" }}
                            onClick={() => alert("Downloading Sophia Lim's candidate dossier.")}
                          >
                            📄 ▾
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* AI EXPAND CALLOUT */}
                  {showTop5Recordings && (
                    <div className="db-ai-recommend-card">
                      <h4 style={{ margin: "0 0 6px", color: "#92400e", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Sparkles size={16} />
                        <span>AI Hiring Recommendation — Sophia Lim</span>
                      </h4>
                      <p style={{ fontWeight: 600, margin: "0 0 6px" }}>
                        Strong Hire — Highly recommended to extend formal offer.
                      </p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "0 0 8px" }}>
                        Sophia demonstrated exceptional communication and deep UX knowledge in the behavioral stage. CV and interview scores are consistently top-tier for this requisition.
                      </p>
                      <ul style={{ paddingLeft: "18px", margin: "6px 0 10px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                        <li>Strong portfolio with measurable product impact across fintech SaaS</li>
                        <li>Clear problem-solving in technical scenarios &amp; design token architecture</li>
                        <li>Excellent stakeholder communication and consensus-building</li>
                      </ul>
                      <a
                        href="#recording"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Opening encrypted interview recording player...");
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: 600,
                          fontSize: "12.5px",
                          color: "#b45309"
                        }}
                      >
                        🎥 View Interview Recording (42m · Audio/Video Consent Given)
                      </a>
                    </div>
                  )}

                  {/* CANDIDATES 2 & 3 */}
                  <table className="db-table">
                    <tbody>
                      {/* RANK 2 */}
                      <tr>
                        <td style={{ width: "60px" }}>
                          <strong style={{ fontSize: "15px" }}>#2</strong>
                        </td>
                        <td>
                          <div className="db-job-cell">
                            <div className="db-avatar" style={{ width: "34px", height: "34px", fontSize: "11px", background: "linear-gradient(135deg,#059669,#10b981)" }}>
                              AP
                            </div>
                            <div>
                              <div className="db-job-title">Arjun Patel</div>
                              <div className="db-job-sub">Full Stack Developer · CND-2025-038</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "120px" }}>
                            <strong>88.4</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "88%", background: "#059669" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "100px" }}>
                            <strong>86</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "86%", background: "#7c3aed" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "100px" }}>
                            <strong>91</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "91%", background: "#d97706" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="db-badge db-badge-shortlisted">★ Good Hire</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 8px" }}
                            onClick={() => alert("Downloading dossier...")}
                          >
                            📄 ▾
                          </button>
                        </td>
                      </tr>

                      {/* RANK 3 */}
                      <tr>
                        <td style={{ width: "60px" }}>
                          <strong style={{ fontSize: "15px" }}>#3</strong>
                        </td>
                        <td>
                          <div className="db-job-cell">
                            <div className="db-avatar" style={{ width: "34px", height: "34px", fontSize: "11px", background: "linear-gradient(135deg,#f5be42,#151a22)" }}>
                              ER
                            </div>
                            <div>
                              <div className="db-job-title">Emma Richardson</div>
                              <div className="db-job-sub">Product Designer · CND-2025-035</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "120px" }}>
                            <strong>85.1</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "85%", background: "#059669" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "100px" }}>
                            <strong>92</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "92%", background: "#7c3aed" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "100px" }}>
                            <strong>79</strong>
                            <div className="db-score-bar-bg" style={{ flex: 1, margin: 0 }}>
                              <div className="db-score-bar-fill" style={{ width: "79%", background: "#d97706" }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="db-badge db-badge-pending">◎ Consider</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-db-secondary"
                            style={{ padding: "4px 8px" }}
                            onClick={() => alert("Downloading dossier...")}
                          >
                            📄 ▾
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="db-pagination">
                  <span>Showing 1 to 3 of 28 ranked candidates</span>
                  <div className="db-page-btn-group">
                    <button type="button" className="db-page-btn is-active">1</button>
                    <button type="button" className="db-page-btn">2</button>
                    <button type="button" className="db-page-btn">3</button>
                    <button type="button" className="db-page-btn">4</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              VIEW 8: SETTINGS
              ========================================================= */}
          {activeView === "settings" && (
            <section className="db-view-panel">
              <div className="db-page-header">
                <h1 className="db-title">Settings ⚙</h1>
                <p className="db-subtitle">
                  Company profile, HR inbox, multi-board integrations (Indeed, Rozee.pk), and AI scoring weights.
                </p>
              </div>

              <div className="db-grid-2">
                {/* INTEGRATIONS */}
                <div className="db-card">
                  <div className="db-card-header">
                    <h2 className="db-card-title">Job Board &amp; External Integrations</h2>
                  </div>
                  <div className="db-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--bg-surface-warm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                      <div>
                        <strong>Indeed Partner API</strong>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                          Automated posting &amp; direct candidate CV parsing.
                        </p>
                      </div>
                      <span className="db-badge db-badge-live">Connected</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--bg-surface-warm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                      <div>
                        <strong>Rozee.pk Enterprise</strong>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                          Pakistan regional talent distribution &amp; requisition sync.
                        </p>
                      </div>
                      <span className="db-badge db-badge-live">Connected</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--bg-surface-warm)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                      <div>
                        <strong>Google Workspace &amp; Meet</strong>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                          Calendar scheduling &amp; video link automated dispatch.
                        </p>
                      </div>
                      <span className="db-badge db-badge-live">Connected</span>
                    </div>
                  </div>
                </div>

                {/* AI THRESHOLDS */}
                <div className="db-card">
                  <div className="db-card-header">
                    <h2 className="db-card-title">AI Automation Defaults</h2>
                  </div>
                  <div className="db-card-body">
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                        Default Shortlist Cutoff Score
                      </label>
                      <select className="db-select" style={{ width: "100%" }}>
                        <option>70% Match and above</option>
                        <option>80% Match and above (Strict)</option>
                        <option>60% Match (Broad Intake)</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                        Default Shortlist Size (N)
                      </label>
                      <input type="number" className="db-input" style={{ width: "100%" }} defaultValue={10} />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>
                        Candidate Recording Consent Notice
                      </label>
                      <textarea
                        className="db-input"
                        rows={3}
                        style={{ width: "100%", borderRadius: "var(--radius-sm)" }}
                        defaultValue="AutoHR Video AI securely records audio & video for objective 5D scoring adhering to GDPR and ISO27001 compliance standards."
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-db-primary"
                      onClick={() => alert("Settings saved successfully!")}
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
