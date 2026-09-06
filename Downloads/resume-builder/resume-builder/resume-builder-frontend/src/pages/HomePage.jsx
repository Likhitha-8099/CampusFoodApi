import React from "react";

function HomePage({ onNavigate, totalResumes = 0 }) {
  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill">
            <span className="sparkle-icon">✨</span> Next-Gen Resume Intelligence
          </div>
          <h1 className="hero-title">
            BUILD A RESUME<br />
            <span className="hero-gradient-text">THAT GETS NOTICED.</span>
          </h1>
          <p className="hero-subtitle">
            Create professional resumes and understand how well your resume matches real job opportunities with transparent hybrid scoring and actionable AI audits.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-hero-primary"
              onClick={() => onNavigate("builder-new")}
            >
              🚀 Create My Resume
            </button>
            <button
              type="button"
              className="btn btn-hero-secondary"
              onClick={() => onNavigate("dashboard")}
            >
              🎯 Analyze My Resume
            </button>
          </div>

          <div className="hero-stats-banner">
            <div className="hero-stat-item">
              <strong>3</strong>
              <span>ATS Templates</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <strong>100%</strong>
              <span>Transparent Scoring</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <strong>0%</strong>
              <span>Hallucinated Claims</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="features-section">
        <div className="section-header text-center">
          <span className="section-tag">Powerful Features</span>
          <h2 className="section-title">Engineered for Technical Candidates</h2>
          <p className="section-desc">
            Everything you need to craft high-impact resumes and optimize them for recruiter ATS algorithms.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card" onClick={() => onNavigate("builder-new")}>
            <div className="feature-icon icon-blue">📝</div>
            <h3>Resume Builder</h3>
            <p>
              Dynamic split-screen editor with real-time preview. Type your experience and watch your resume render instantly without page refresh.
            </p>
            <span className="feature-link">Open Builder →</span>
          </div>

          <div className="feature-card" onClick={() => onNavigate("dashboard")}>
            <div className="feature-icon icon-purple">🎯</div>
            <h3>AI Resume Analysis</h3>
            <p>
              Deep ATS audit evaluating section clarity, keyword density, action verbs, and quantifiable impact with actionable suggestions.
            </p>
            <span className="feature-link">View Analysis →</span>
          </div>

          <div className="feature-card" onClick={() => onNavigate("dashboard")}>
            <div className="feature-icon icon-green">💼</div>
            <h3>Job Matching</h3>
            <p>
              Paste real job descriptions to calculate transparent weighted alignment across skills, keywords, experience, and project relevance.
            </p>
            <span className="feature-link">Match Job Description →</span>
          </div>

          <div className="feature-card" onClick={() => onNavigate("builder")}>
            <div className="feature-icon icon-amber">🎨</div>
            <h3>Professional Templates</h3>
            <p>
              Switch seamlessly between Classic, Modern, and Minimal ATS-compliant templates without losing a single keystroke of your content.
            </p>
            <span className="feature-link">Explore Templates →</span>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header text-center">
          <span className="section-tag">Step-by-Step</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-desc">
            A proven 4-step workflow to maximize your interview conversion rate.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Create Resume</h4>
            <p>Input your technical skills, experience, projects, and education with instant live formatting.</p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h4>Analyze Resume</h4>
            <p>Run ATS scoring to identify missing keywords, weak verbs, and areas for structural improvement.</p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h4>Add Job Description</h4>
            <p>Paste the target job description to classify exact, semantic, and missing skill requirements.</p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">04</div>
            <h4>Improve Resume</h4>
            <p>Apply truthful role recommendations, download as PDF or DOCX, and submit with confidence.</p>
          </div>
        </div>
      </section>

      {/* 4. AI Resume Intelligence Showcase */}
      <section className="intelligence-spotlight-section">
        <div className="spotlight-card">
          <div className="spotlight-left">
            <span className="section-tag-light">AI Intelligence & Integrity</span>
            <h2>Understand how your resume performs against real job requirements.</h2>
            <p>
              Unlike generic AI tools that hallucinate fake experience, our platform combines deterministic weighted scoring with semantic understanding. You see the exact mathematical derivation behind every match percentage.
            </p>
            <ul className="spotlight-checks">
              <li>✓ <strong>Exact & Semantic Matching:</strong> Differentiates direct keyword mentions from conceptual equivalents.</li>
              <li>✓ <strong>Transparent Weighted Formula:</strong> Explicit weights across Skills (40%), Keywords (25%), Experience (15%), Education (10%), and Projects (10%).</li>
              <li>✓ <strong>Strict Truthful Tailoring:</strong> Never invents fake technologies or certifications you haven't mastered.</li>
            </ul>
          </div>
          <div className="spotlight-right">
            <div className="spotlight-preview-box">
              <div className="spotlight-score-badge">
                <span className="spotlight-score-val">85%</span>
                <span className="spotlight-score-lbl">Strong Match</span>
              </div>
              <div className="spotlight-formula-demo">
                <code>Score = (Skills × 0.40) + (Keywords × 0.25) + (Experience × 0.15) + (Education × 0.10) + (Projects × 0.10)</code>
              </div>
              <div className="spotlight-skill-tags">
                <span className="tag-demo match">✓ Java</span>
                <span className="tag-demo match">✓ Spring Boot</span>
                <span className="tag-demo semantic">✓ REST APIs</span>
                <span className="tag-demo partial">◐ AWS Cloud</span>
                <span className="tag-demo missing">⚠ Kafka</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Templates Showcase Section */}
      <section className="templates-showcase-section">
        <div className="section-header text-center">
          <span className="section-tag">ATS Formats</span>
          <h2 className="section-title">Engineered ATS-Compliant Templates</h2>
          <p className="section-desc">
            All templates share the exact same resume state. Switch between them instantly.
          </p>
        </div>

        <div className="templates-showcase-grid">
          <div className="template-showcase-card" onClick={() => onNavigate("builder")}>
            <div className="template-badge-header">01 / Classic ATS</div>
            <h4>Traditional Serif</h4>
            <p>Single-column format optimized for academic and enterprise hiring systems.</p>
            <span className="template-preview-cta">Try Classic →</span>
          </div>

          <div className="template-showcase-card" onClick={() => onNavigate("builder")}>
            <div className="template-badge-header">02 / Modern Split</div>
            <h4>Contemporary 2-Column</h4>
            <p>Accent sidebar separating contact details and skills from work experience.</p>
            <span className="template-preview-cta">Try Modern →</span>
          </div>

          <div className="template-showcase-card" onClick={() => onNavigate("builder")}>
            <div className="template-badge-header">03 / Minimalist</div>
            <h4>Geometric & High-Contrast</h4>
            <p>Clean monospace section dividers engineered for modern tech recruiters.</p>
            <span className="template-preview-cta">Try Minimal →</span>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Section */}
      <section className="cta-banner-section">
        <div className="cta-container">
          <h2>Build your resume today.</h2>
          <p>
            Join candidates crafting ATS-optimized resumes that pass recruiter screens and land top technical interviews.
          </p>
          <div className="cta-buttons">
            <button
              type="button"
              className="btn btn-cta-main"
              onClick={() => onNavigate("builder-new")}
            >
              Get Started Now
            </button>
            <button
              type="button"
              className="btn btn-cta-outline"
              onClick={() => onNavigate("dashboard")}
            >
              View Dashboard ({totalResumes})
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
