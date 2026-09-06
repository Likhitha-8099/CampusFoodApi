import { useState, useEffect } from "react";
import { analyzeResumeAts, getLatestResumeAnalysis } from "../api/resumeApi";

function AtsAnalysisModal({ resume, onClose }) {
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
      // If no cached analysis, that's fine; user can click analyze
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
          "Failed to analyze resume. Please check the backend AI service and Gemini API key."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!resume) return null;

  const score = analysis?.score ?? null;
  const scoreColor =
    score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>🎯 AI Resume Analyzer & ATS Score</h3>
            <p className="modal-subtitle">
              Resume #{resume.id} • {resume.fullName || "Candidate"}
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          {!analysis && !loading && (
            <div className="empty-analysis">
              <p>Ready to audit this resume with Google Gemini AI?</p>
              <span>
                Our AI evaluates ATS compatibility, keyword density, section
                clarity, and quantifiable impact.
              </span>
              <button
                type="button"
                className="primary-btn pulse-btn"
                onClick={handleRunAnalysis}
              >
                Run ATS Analysis
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">
                Analyzing resume structure, keyword optimization & ATS scoring...
              </p>
              <span className="loading-sub">
                This takes ~3-5 seconds using Google Gemini AI
              </span>
            </div>
          )}

          {analysis && !loading && (
            <div className="analysis-results">
              <div className="score-banner" style={{ borderColor: scoreColor }}>
                <div
                  className="score-circle"
                  style={{ background: `${scoreColor}15`, color: scoreColor }}
                >
                  <span className="score-num">{score}</span>
                  <span className="score-total">/ 100</span>
                </div>
                <div className="score-meta">
                  <h4>
                    {score >= 80
                      ? "Excellent ATS Compatibility"
                      : score >= 60
                      ? "Good - Needs Minor Keyword Optimization"
                      : "Needs Improvement for ATS Pass-Rates"}
                  </h4>
                  <p>
                    {score >= 80
                      ? "Your resume shows strong technical depth and clear formatting suitable for recruiter screens."
                      : "Following the actionable suggestions below will significantly improve your recruiter screening score."}
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline re-analyze-btn"
                    onClick={handleRunAnalysis}
                  >
                    🔄 Re-Analyze
                  </button>
                </div>
              </div>

              {/* AI Overview Summary */}
              {analysis.summary && (
                <div className="card-box overview-summary-box">
                  <h4 className="box-title title-blue">
                    <span>🔍</span> AI Executive Overview
                  </h4>
                  <p className="overview-summary-text">{analysis.summary}</p>
                </div>
              )}

              {/* Strengths & Weaknesses Grid */}
              <div className="analysis-grid">
                {/* Strengths */}
                <div className="card-box card-strengths">
                  <h4 className="box-title title-green">
                    <span>✓</span> Strengths
                  </h4>
                  {analysis.strengths && analysis.strengths.length > 0 ? (
                    <ul className="pill-list-vertical">
                      {analysis.strengths.map((item, idx) => (
                        <li key={idx} className="pill-item pill-green">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-text">No notable strengths flagged.</p>
                  )}
                </div>

                {/* Weaknesses */}
                <div className="card-box card-weaknesses">
                  <h4 className="box-title title-orange">
                    <span>⚠</span> Areas for Improvement
                  </h4>
                  {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                    <ul className="pill-list-vertical">
                      {analysis.weaknesses.map((item, idx) => (
                        <li key={idx} className="pill-item pill-orange">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-text">No major weaknesses detected.</p>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                <div className="card-box keyword-box">
                  <h4 className="box-title title-blue">
                    <span>🏷️</span> Missing / Recommended Keywords
                  </h4>
                  <div className="tags-container">
                    {analysis.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="keyword-tag">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Suggestions */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="card-box suggestions-box">
                  <h4 className="box-title title-purple">
                    <span>💡</span> Actionable Suggestions (No False Claims)
                  </h4>
                  <ul className="suggestions-list">
                    {analysis.suggestions.map((sug, idx) => (
                      <li key={idx}>
                        <strong>{idx + 1}.</strong> {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section-by-Section Feedback */}
              {analysis.sectionFeedback &&
                Object.keys(analysis.sectionFeedback).length > 0 && (
                  <div className="card-box section-fb-box">
                    <h4 className="box-title">
                      <span>📑</span> Section-by-Section Feedback
                    </h4>
                    <div className="section-fb-grid">
                      {Object.entries(analysis.sectionFeedback).map(
                        ([secName, fb], idx) => (
                          <div key={idx} className="section-fb-item">
                            <h5 className="section-fb-title">
                              {secName.toUpperCase()}
                            </h5>
                            <p className="section-fb-text">{fb}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AtsAnalysisModal;
