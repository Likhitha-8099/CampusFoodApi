import { useState, useEffect } from "react";
import { analyzeResumeAts, getLatestResumeAnalysis } from "../api/resumeApi";

function AtsAnalysisPage({ resume, onBack, onNavigateToJobMatch }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resume?.id) {
      loadCachedOrRun(resume.id);
    }
  }, [resume?.id]);

  const loadCachedOrRun = async (resumeId) => {
    try {
      const cached = await getLatestResumeAnalysis(resumeId);
      if (cached && cached.score !== undefined) {
        setAnalysis(cached);
      }
    } catch {
      // If no cached analysis yet, user can click run
    }
  };

  const handleRunAnalysis = async () => {
    if (!resume?.id) return;
    setLoading(true);
    setError("");

    try {
      const result = await analyzeResumeAts(resume.id);
      setAnalysis(result);
    } catch (err) {
      console.error("ATS analysis error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to analyze resume. Please verify backend AI service and Gemini API key."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!resume) {
    return (
      <div className="analysis-page-container">
        <div className="empty-state">
          <p>No resume selected for ATS analysis.</p>
          <button type="button" className="btn btn-primary" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const score = analysis?.score ?? null;
  const scoreColor =
    score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--error)";

  return (
    <div className="analysis-page-container">
      {/* Top Header */}
      <div className="analysis-page-header">
        <div className="header-left">
          <button type="button" className="btn btn-back" onClick={onBack}>
            ← Back
          </button>
          <div>
            <h1 className="page-title">🎯 AI Resume ATS Audit</h1>
            <p className="page-subtitle">
              Evaluating <strong>{resume.fullName || "Untitled Resume"}</strong> (ID: #{resume.id})
            </p>
          </div>
        </div>

        <div className="header-right-actions">
          {resume?.id && (
            <button
              type="button"
              className="btn btn-secondary-action"
              onClick={() => onNavigateToJobMatch(resume)}
            >
              💼 Match with Job Description →
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary-action"
            onClick={handleRunAnalysis}
            disabled={loading}
          >
            {loading ? "✨ Auditing..." : analysis ? "🔄 Re-Analyze" : "✨ Run ATS Audit"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!analysis && !loading && (
        <div className="card-box empty-analysis-card text-center">
          <div className="empty-analysis-icon">🔍</div>
          <h2>Ready to audit this resume with Gemini AI?</h2>
          <p>
            Our ATS analyzer inspects keyword density, section balance, action-verb strength, and quantifiable results with zero false claims.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-lg pulse-btn"
            onClick={handleRunAnalysis}
          >
            Run Full ATS Analysis
          </button>
        </div>
      )}

      {loading && (
        <div className="card-box loading-card text-center">
          <div className="spinner spinner-lg" />
          <h3>✨ Analyzing your resume structure & ATS readability...</h3>
          <p>Evaluating keywords, section quality, metrics, and recruiter screening criteria</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="analysis-content-layout">
          {/* Score Banner */}
          <div className="score-hero-card" style={{ borderLeftColor: scoreColor }}>
            <div className="score-badge-circle" style={{ borderColor: scoreColor, color: scoreColor }}>
              <span className="score-number">{score}</span>
              <span className="score-out-of">/ 100</span>
            </div>

            <div className="score-hero-info">
              <div className="tier-tag" style={{ background: `${scoreColor}20`, color: scoreColor }}>
                {score >= 80
                  ? "✓ High ATS Compatibility"
                  : score >= 60
                  ? "◐ Good — Needs Optimization"
                  : "⚠ Needs Structural Improvement"}
              </div>
              <h2>
                {score >= 80
                  ? "Strong Technical Foundation & Section Balance"
                  : "Optimizations Recommended for Higher Recruiter Pass-Rates"}
              </h2>
              <p>
                {analysis.summary ||
                  "Detailed evaluation of keyword coverage, action-oriented verbs, and formatting alignment."}
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="analysis-two-col-grid">
            {/* Strengths Card */}
            <div className="card-box strengths-card">
              <h3 className="card-heading heading-green">
                <span>✓</span> Key Strengths
              </h3>
              {analysis.strengths && analysis.strengths.length > 0 ? (
                <ul className="feedback-pill-list">
                  {analysis.strengths.map((str, idx) => (
                    <li key={idx} className="pill-item-green">
                      <span className="pill-bullet">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted-text">No notable strengths identified.</p>
              )}
            </div>

            {/* Weaknesses Card */}
            <div className="card-box weaknesses-card">
              <h3 className="card-heading heading-orange">
                <span>⚠</span> Areas for Improvement
              </h3>
              {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                <ul className="feedback-pill-list">
                  {analysis.weaknesses.map((w, idx) => (
                    <li key={idx} className="pill-item-orange">
                      <span className="pill-bullet">⚠</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted-text">No major structural weaknesses detected.</p>
              )}
            </div>
          </div>

          {/* Missing Keywords Tag Cloud */}
          {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
            <div className="card-box keywords-card">
              <h3 className="card-heading heading-blue">
                <span>🏷️</span> Recommended / Missing Technical Keywords
              </h3>
              <p className="card-desc">
                Consider adding these industry keywords if you have genuine experience with them:
              </p>
              <div className="tags-flex-wrap">
                {analysis.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="keyword-badge">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="card-box suggestions-card">
              <h3 className="card-heading heading-purple">
                <span>💡</span> Actionable Suggestions (Zero-Fabrication)
              </h3>
              <ul className="suggestions-ordered-list">
                {analysis.suggestions.map((sug, idx) => (
                  <li key={idx}>
                    <div className="suggestion-num">{idx + 1}</div>
                    <div className="suggestion-text">{sug}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section-by-Section Feedback */}
          {analysis.sectionFeedback && Object.keys(analysis.sectionFeedback).length > 0 && (
            <div className="card-box section-audit-card">
              <h3 className="card-heading heading-slate">
                <span>📑</span> Section-by-Section ATS Audit
              </h3>
              <div className="section-audit-grid">
                {Object.entries(analysis.sectionFeedback).map(([section, fb], idx) => (
                  <div key={idx} className="section-audit-item">
                    <span className="audit-section-name">{section.toUpperCase()}</span>
                    <p className="audit-section-feedback">{fb}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AtsAnalysisPage;
