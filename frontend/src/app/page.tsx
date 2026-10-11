"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Send,
  FileText,
  Video,
  Award,
  Mic,
  Brain,
  ShieldCheck,
  ChevronRight,
  Database,
  Layers,
  Cpu,
  BarChart3,
  Calendar,
  Users
} from "lucide-react";

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  const openAuth = (mode: "signup" | "signin") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="landing-wrapper">
      {/* ---------------- NAVIGATION ---------------- */}
      <header className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="brand-badge">
              <span className="brand-pulse-dot" />
              <span>AutoHR</span>
            </div>
          </div>

          <nav>
            <ul className="nav-links">
              <li>
                <a href="#pipeline" className="nav-link">
                  10-Step Pipeline
                </a>
              </li>
              <li>
                <a href="#scoring" className="nav-link">
                  5D AI Scoring
                </a>
              </li>
              <li>
                <a href="#tech" className="nav-link">
                  Tech Stack
                </a>
              </li>
              <li>
                <a href="#preview" className="nav-link">
                  Interactive Demo
                </a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="btn-nav-ghost"
              onClick={() => openAuth("signin")}
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn-nav-primary"
              onClick={() => openAuth("signup")}
            >
              <span>Get Started</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="hero-section">
        <div className="hero-glow-1" />

        <div className="hero-content">
          <div className="hero-pill-tag">
            <span className="hero-pill-badge">Phase 1 Live</span>
            <Sparkles size={14} color="#b45309" />
            <span>Autonomous Recruitment Pipeline for Modern HR</span>
          </div>

          <h1 className="hero-title">
            Hire the Top 1% Faster with <span>Autonomous AI Workflows</span>
          </h1>

          <p className="hero-desc">
            An aligned 10-step recruitment engine across 4 phases: multi-platform posting on Indeed &amp; Rozee.pk, AI CV screening, 3-stage interactive video interviews, and explainable candidate rankings.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => openAuth("signup")}
            >
              <span>Start 30-Day Free Trial</span>
              <ArrowRight size={18} />
            </button>
            <a href="#pipeline" className="btn-hero-secondary">
              <span>View 10-Step Workflow</span>
              <ChevronRight size={18} />
            </a>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="hero-stats-ribbon">
            <div className="stat-item">
              <span className="stat-value">85%</span>
              <span className="stat-label">Faster Time-to-Hire</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">10 Steps</span>
              <span className="stat-label">Continuous Pipeline</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">5 Dimensions</span>
              <span className="stat-label">Objective AI Scoring</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Auditable AI Decisions</span>
            </div>
          </div>
        </div>

        {/* ---------------- INTERACTIVE HERO PREVIEW (Dribbble Match) ---------------- */}
        <div id="preview" className="hero-preview-wrapper">
          <div className="preview-card-frame">
            <AuthModal standalone={true} />
          </div>
        </div>
      </section>

      {/* ---------------- THE 4 PHASES PIPELINE ---------------- */}
      <section id="pipeline" className="pipeline-section">
        <div className="section-header">
          <span className="section-pill">The Aligned Workflow</span>
          <h2 className="section-title">4 Phases. 10 Continuous Steps.</h2>
          <p className="section-subtitle">
            Every step seamlessly passes its output to the next, from role creation to final hiring decisions.
          </p>
        </div>

        <div className="phases-grid">
          {/* Phase 1 */}
          <div className="phase-card">
            <span className="phase-badge phase-1">Phase 1 &bull; Post</span>
            <h3 className="phase-title">Post &amp; Distribute</h3>
            <p className="phase-desc">
              Generate tailored role specs, approve AI-drafted job postings, and publish instantly across top boards.
            </p>
            <div className="steps-list">
              <div className="step-item">
                <span className="step-num">1</span>
                <span className="step-text">
                  <strong>Job input:</strong> HR inputs role title, skills, experience, salary &amp; hire count.
                </span>
              </div>
              <div className="step-item">
                <span className="step-num">2</span>
                <span className="step-text">
                  <strong>AI JD generation:</strong> LLM crafts description; HR reviews and approves.
                </span>
              </div>
              <div className="step-item">
                <span className="step-num">3</span>
                <span className="step-text">
                  <strong>Multi-board posting:</strong> Live publishing to Indeed and Rozee.pk.
                </span>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="phase-card">
            <span className="phase-badge phase-2">Phase 2 &bull; Screen</span>
            <h3 className="phase-title">Screen &amp; Shortlist</h3>
            <p className="phase-desc">
              Collect inbound applications, run AI semantic CV matching, and automatically filter candidates.
            </p>
            <div className="steps-list">
              <div className="step-item">
                <span className="step-num">4</span>
                <span className="step-text">
                  <strong>Application collection:</strong> Resumes arrive via dedicated inbox or web form.
                </span>
              </div>
              <div className="step-item">
                <span className="step-num">5</span>
                <span className="step-text">
                  <strong>AI CV screening:</strong> Parsing into structured JSON &amp; scored against criteria.
                </span>
              </div>
              <div className="step-item">
                <span className="step-num">6</span>
                <span className="step-text">
                  <strong>Shortlist &amp; notify:</strong> Top N shortlisted; rejections automated politely.
                </span>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="phase-card">
            <span className="phase-badge phase-3">Phase 3 &bull; Interview</span>
            <h3 className="phase-title">AI Video Interview</h3>
            <p className="phase-desc">
              Autonomous 3-stage interviews with speech transcription and multi-parameter scorecards.
            </p>
            <div className="steps-list">
              <div className="step-item">
                <span className="step-num">7</span>
                <span className="step-text">
                  <strong>Schedule &amp; consent:</strong> Self-serve time picker with mandatory recording consent.
                </span>
              </div>
              <div className="step-item">
                <span className="step-num">8</span>
                <span className="step-text">
                  <strong>3-Stage AI interview:</strong> Screening &rarr; Technical &rarr; Behavioral.
                </span>
              </div>
              <div className="step-item">
                <span className="step-num">9</span>
                <span className="step-text">
                  <strong>Speech analysis:</strong> Whisper STT &amp; 5-dimension scoring (0&ndash;10).
                </span>
              </div>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="phase-card">
            <span className="phase-badge phase-4">Phase 4 &bull; Decide</span>
            <h3 className="phase-title">Decide &amp; Retain</h3>
            <p className="phase-desc">
              Weighted composite leaderboard with explainable AI reasons and smart storage retention.
            </p>
            <div className="steps-list">
              <div className="step-item">
                <span className="step-num">10</span>
                <span className="step-text">
                  <strong>Final ranking:</strong> Combined CV + interview score in HR dashboard.
                </span>
              </div>
              <div className="step-item">
                <span className="step-num">&bull;</span>
                <span className="step-text">
                  <strong>AI rationale:</strong> Clear hiring justification generated for each applicant.
                </span>
              </div>
              <div className="step-item">
                <span className="step-num">&bull;</span>
                <span className="step-text">
                  <strong>Retention policy:</strong> Video retained only for top candidates; others purged.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5-DIMENSION AI SCORING ---------------- */}
      <section id="scoring" className="scoring-section">
        <div className="scoring-container">
          <div className="scoring-header">
            <span className="section-pill" style={{ background: "rgba(245, 190, 66, 0.2)", color: "#f5be42" }}>
              Step 9 Assessment Framework
            </span>
            <h2 className="scoring-title">5-Dimension AI Interview Rubric</h2>
            <p className="scoring-subtitle">
              Every candidate response is transcribed and objectively evaluated across five distinct competency dimensions, each scored out of 10.
            </p>
          </div>

          <div className="dimensions-grid">
            <div className="dimension-card">
              <div className="dim-icon-wrapper">
                <Mic size={22} />
              </div>
              <h4 className="dim-name">Communication</h4>
              <span className="dim-score-badge">/ 10</span>
              <p className="dim-desc">
                Articulation, clarity, brevity, grammatical fluency, and structured delivery.
              </p>
            </div>

            <div className="dimension-card">
              <div className="dim-icon-wrapper">
                <ShieldCheck size={22} />
              </div>
              <h4 className="dim-name">Confidence</h4>
              <span className="dim-score-badge">/ 10</span>
              <p className="dim-desc">
                Decisiveness, composure under pressure, steady pace, and affirmative phrasing.
              </p>
            </div>

            <div className="dimension-card">
              <div className="dim-icon-wrapper">
                <Cpu size={22} />
              </div>
              <h4 className="dim-name">Technical Knowledge</h4>
              <span className="dim-score-badge">/ 10</span>
              <p className="dim-desc">
                Domain expertise depth, conceptual correctness, architecture reasoning, and terminology.
              </p>
            </div>

            <div className="dimension-card">
              <div className="dim-icon-wrapper">
                <CheckCircle2 size={22} />
              </div>
              <h4 className="dim-name">Relevance</h4>
              <span className="dim-score-badge">/ 10</span>
              <p className="dim-desc">
                Direct answer precision, avoiding evasiveness, and staying tightly targeted on the prompt.
              </p>
            </div>

            <div className="dimension-card">
              <div className="dim-icon-wrapper">
                <Brain size={22} />
              </div>
              <h4 className="dim-name">Problem-Solving</h4>
              <span className="dim-score-badge">/ 10</span>
              <p className="dim-desc">
                Analytical reasoning, structured decomposition, trade-off evaluation, and edge-case handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TECH STACK HIGHLIGHT ---------------- */}
      <section id="tech" className="tech-section">
        <div className="section-header">
          <span className="section-pill">Engineered For Scale</span>
          <h2 className="section-title">Production Technology Stack</h2>
          <p className="section-subtitle">
            Built on a resilient hybrid architecture optimized for real-time video streaming, async AI inference, and enterprise compliance.
          </p>
        </div>

        <div className="tech-grid">
          <div className="tech-card">
            <span className="tech-layer-tag">Frontend</span>
            <h4 className="tech-title">React + Next.js</h4>
            <p className="tech-items">
              App Router, TypeScript, server components, and responsive candidate interview portal.
            </p>
          </div>

          <div className="tech-card">
            <span className="tech-layer-tag">Backend</span>
            <h4 className="tech-title">Node.js + FastAPI</h4>
            <p className="tech-items">
              Node.js for real-time WebSocket orchestration and Python FastAPI for asynchronous AI pipelines.
            </p>
          </div>

          <div className="tech-card">
            <span className="tech-layer-tag">AI Intelligence</span>
            <h4 className="tech-title">LLMs + Whisper</h4>
            <p className="tech-items">
              GPT-4o &amp; Claude 3.5 Sonnet for JD crafting, screening &amp; scoring; Whisper for speech-to-text.
            </p>
          </div>

          <div className="tech-card">
            <span className="tech-layer-tag">Data &amp; Media</span>
            <h4 className="tech-title">PostgreSQL + S3</h4>
            <p className="tech-items">
              PostgreSQL 16 relational data, MongoDB profile caching, Redis queues, and AWS S3 media storage.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- BOTTOM CTA BANNER ---------------- */}
      <section className="cta-banner">
        <h2 className="cta-title">Ready to Automate Your Hiring Workflow?</h2>
        <p className="cta-desc">
          Join modern HR teams cutting time-to-hire by 85% with autonomous multi-board posting, AI screening, and video evaluations.
        </p>
        <button
          type="button"
          className="btn-hero-primary"
          style={{ margin: "0 auto" }}
          onClick={() => openAuth("signup")}
        >
          <span>Launch Your First AI Job Post</span>
          <ArrowRight size={18} />
        </button>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="brand-badge" style={{ padding: "6px 14px" }}>
            <span className="brand-pulse-dot" />
            <span>AutoHR &copy; 2026</span>
          </div>

          <div className="footer-links">
            <a href="#pipeline" className="footer-link">Pipeline</a>
            <a href="#scoring" className="footer-link">5D Scoring</a>
            <a href="#tech" className="footer-link">Technology</a>
            <Link href="/login" className="footer-link">Login Portal</Link>
          </div>

          <p style={{ fontSize: "12px", color: "#9ca3af" }}>
            Designed according to Phase 1–4 recruitment specifications.
          </p>
        </div>
      </footer>

      {/* ---------------- AUTH MODAL (POPS UP ON SIGN IN / SIGN UP) ---------------- */}
      <AuthModal
        isOpen={isAuthOpen}
        defaultMode={authMode}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
