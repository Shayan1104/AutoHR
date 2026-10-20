"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, X, Check, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultMode?: "signup" | "signin";
  standalone?: boolean;
}

export default function AuthModal({
  isOpen = true,
  onClose,
  defaultMode = "signup",
  standalone = false,
}: AuthModalProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(defaultMode === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("Amélie Laurent");
  const [email, setEmail] = useState("amelielaurent7622@gmail.com");
  const [password, setPassword] = useState("password123#");
  const [selectedDay, setSelectedDay] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  if (!isOpen && !standalone) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    setTimeout(() => {
      setIsLoading(false);
      setNotification({
        type: "success",
        message: isSignUp
          ? "Account created successfully! Redirecting to Dashboard..."
          : "Logged in successfully! Redirecting to Dashboard...",
      });
      setTimeout(() => {
        router.push("/dashboard");
        if (onClose) onClose();
      }, 700);
    }, 600);
  };

  const calendarDays = [
    { label: "Sun", date: 22 },
    { label: "Mon", date: 23 },
    { label: "Tue", date: 24 },
    { label: "Wed", date: 25 },
    { label: "Thu", date: 26 },
    { label: "Fri", date: 27 },
    { label: "Sat", date: 28 },
  ];

  return (
    <div className={standalone ? "standalone-auth-wrapper" : "auth-modal-backdrop"}>
      {/* Central Floating Card (matches Dribbble design) */}
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        {/* Left Form Section */}
        <div className="form-section">
          {/* Top Pill Logo Badge */}
          <div className="brand-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="brand-pill">
              <span className="brand-dot" />
              <span>AutoHR</span>
            </div>
            <Link
              href="/dashboard"
              onClick={() => {
                if (onClose) onClose();
              }}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#b45309",
                background: "rgba(245, 190, 66, 0.18)",
                padding: "4px 10px",
                borderRadius: "9999px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                border: "1px solid rgba(245, 190, 66, 0.35)",
              }}
            >
              <span>View Dashboard Demo</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Heading */}
          <div className="auth-header">
            <h1 className="auth-title">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h1>
            <p className="auth-subtitle">
              {isSignUp
                ? "Sign up and get 30 day free trial"
                : "Enter your credentials to access your recruitment portal"}
            </p>
          </div>

          {/* Auth Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {notification && (
              <div className={`feedback-banner ${notification.type}`}>
                <Check size={16} />
                <span>{notification.message}</span>
              </div>
            )}

            {isSignUp && (
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full name
                </label>
                <div className="input-wrapper">
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <span>Authenticating...</span>
              ) : isSignUp ? (
                <>
                  <span>Submit</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Social Logins */}
            <div className="social-buttons">
              <button
                type="button"
                className="btn-social"
                onClick={() =>
                  setNotification({
                    type: "success",
                    message: "Connecting via Apple ID...",
                  })
                }
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 170 170"
                  fill="currentColor"
                >
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.93-12-14.55-5.99-9.25-10.74-20.08-14.25-32.48-3.52-12.4-5.28-24.11-5.28-35.14 0-14.32 3.65-26.23 10.95-35.73 7.3-9.5 16.31-14.37 27.04-14.61 5.35 0 11.22 1.48 17.62 4.45 6.4 2.97 10.45 4.51 12.16 4.63 1.94-.17 6.09-1.74 12.45-4.7 6.36-2.96 11.89-4.33 16.59-4.11 12.28.62 22.36 5.34 30.23 14.17-10.74 6.53-15.98 15.65-15.71 27.36.27 9.17 3.75 16.89 10.44 23.16 6.7 6.27 14.78 9.94 24.25 11.01-2.07 6.13-4.58 12.39-7.53 18.78zM119.22 33.15c0-7.39 2.66-14.44 7.99-21.15 5.33-6.71 11.88-10.97 19.65-12.77.71 2.59 1.07 5.12 1.07 7.59 0 7.23-2.73 14.29-8.19 21.17-5.46 6.89-12.08 11.12-19.86 12.7-0.45-2.58-.66-5.1-.66-7.54z" />
                </svg>
                <span>Apple</span>
              </button>

              <button
                type="button"
                className="btn-social"
                onClick={() =>
                  setNotification({
                    type: "success",
                    message: "Connecting via Google Workspace...",
                  })
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.68-5.17 3.68-9.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.25 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.28C.46 8.24 0 10.06 0 12s.46 3.76 1.28 5.38l3.99-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.62l3.99 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                <span>Google</span>
              </button>
            </div>
          </form>

          {/* Bottom Footer Switcher & Terms */}
          <div className="auth-footer">
            <p>
              {isSignUp ? (
                <>
                  Have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setNotification(null);
                    }}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setNotification(null);
                    }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                alert(
                  "AutoHR Platform Terms & Privacy: Your candidate and interview processing data is secured according to GDPR & ISO27001 standards."
                );
              }}
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>

        {/* Right Visual Section with Hero Image and Floating Overlay Cards */}
        <div className="visual-section">
          {/* Main Hero Photo (Native img tag for 100% reliable rendering) */}
          <img
            src="/team-hero.jpg"
            alt="AutoHR Modern Recruitment Team Collaborating"
            className="hero-background-img"
          />

          <div className="visual-scrim" />

          {/* Close button in top-right */}
          {onClose && (
            <button
              type="button"
              className="close-modal-btn"
              aria-label="Close dialog"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          )}

          {/* Floating UI Elements Overlay */}
          <div className="overlays-container">
            {/* Widget 1: Top Yellow Sticky Note */}
            <div className="widget-task-review overlay-interactive">
              <div className="task-review-header">
                <span className="task-review-dot" />
                <span className="task-review-title">Task Review With Team</span>
              </div>
              <span className="task-review-time">09:30am - 10:00am</span>
            </div>

            {/* Widget 2: Middle Floating Team Avatars */}
            <div className="widget-floating-avatars">
              <div
                className="avatar-bubble"
                title="Sarah Jenkins - Senior Technical Recruiter"
              >
                <img src="/avatar1.jpg" alt="Sarah Jenkins" />
              </div>
              <div
                className="avatar-bubble"
                style={{ marginTop: "-8px" }}
                title="Amélie Laurent - Head of People Operations"
              >
                <img src="/avatar2.jpg" alt="Amélie Laurent" />
              </div>
              <div
                className="avatar-bubble"
                style={{ marginTop: "-8px" }}
                title="Marcus Zhao - Lead AI Engineer"
              >
                <img src="/avatar3.jpg" alt="Marcus Zhao" />
              </div>
            </div>

            {/* Widget 3: Translucent Glass Calendar Strip */}
            <div className="widget-calendar-strip overlay-interactive">
              <div className="calendar-days-row">
                {calendarDays.map((d) => (
                  <span key={d.date} className="cal-day-label">
                    {d.label}
                  </span>
                ))}
              </div>
              <div className="calendar-dates-row">
                {calendarDays.map((d) => (
                  <span
                    key={d.date}
                    className={`cal-date-number ${
                      selectedDay === d.date ? "active" : ""
                    }`}
                    onClick={() => setSelectedDay(d.date)}
                  >
                    {d.date}
                  </span>
                ))}
              </div>
            </div>

            {/* Widget 4: Bottom Left Meeting Card */}
            <div className="widget-daily-meeting overlay-interactive">
              <div className="meeting-header">
                <span className="meeting-title">Daily Meeting</span>
              </div>
              <span className="meeting-time">12:00pm - 01:00pm</span>
              <div className="meeting-attendees">
                <div className="attendee-mini-avatar">
                  <img src="/avatar1.jpg" alt="Attendee 1" />
                </div>
                <div className="attendee-mini-avatar">
                  <img src="/avatar2.jpg" alt="Attendee 2" />
                </div>
                <div className="attendee-mini-avatar">
                  <img src="/avatar3.jpg" alt="Attendee 3" />
                </div>
                <div
                  className="attendee-mini-avatar"
                  style={{ background: "#f5be42", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}
                >
                  +4
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
