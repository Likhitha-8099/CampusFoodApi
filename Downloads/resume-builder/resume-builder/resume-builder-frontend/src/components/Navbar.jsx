import React, { useState } from "react";

function Navbar({ activeView, onNavigate, resumeCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick("home")}>
          <div className="brand-logo-icon">📄</div>
          <div className="brand-text">
            <span className="brand-title">ResumeAI</span>
            <span className="brand-badge">Intelligence Suite</span>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>

        {/* Desktop & Mobile Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-link ${activeView === "home" ? "active" : ""}`}
            onClick={() => handleNavClick("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavClick("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === "resumes" ? "active" : ""}`}
            onClick={() => handleNavClick("resumes")}
          >
            My Resumes
            {resumeCount > 0 && <span className="nav-count">{resumeCount}</span>}
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === "ats" ? "active" : ""}`}
            onClick={() => handleNavClick("ats")}
          >
            AI Analysis
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === "builder" ? "active" : ""}`}
            onClick={() => handleNavClick("builder")}
          >
            Resume Builder
          </button>

          <div className="mobile-only-action">
            <button
              type="button"
              className="btn btn-primary-nav w-full"
              onClick={() => handleNavClick("builder-new")}
            >
              + Create Resume
            </button>
          </div>
        </nav>

        {/* Desktop CTA Action */}
        <div className="navbar-actions">
          <button
            type="button"
            className="btn btn-primary-nav"
            onClick={() => handleNavClick("builder-new")}
          >
            + Create Resume
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
