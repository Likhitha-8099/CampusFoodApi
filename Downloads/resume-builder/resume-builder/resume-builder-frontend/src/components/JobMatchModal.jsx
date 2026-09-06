import { useState, useEffect } from "react";
import { matchJobDescription, getJobMatches } from "../api/resumeApi";

function JobMatchModal({ resume, onClose }) {
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("matcher"); // "matcher" or "history"

  const MAX_CHARS = 10000;

  useEffect(() => {
    if (resume?.id) {
      loadHistory(resume.id);
    }
  }, [resume?.id]);

  const loadHistory = async (resumeId) => {
    try {
      const data = await getJobMatches(resumeId);
      if (Array.isArray(data) && data.length > 0) {
        setHistory(data);
        if (!matchResult) {
          setMatchResult(data[0]);
        }
      }
    } catch {
      // If no history yet, ignore
    }
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError("Please paste a job description before analyzing.");
      return;
    }
    if (jobDescription.length > MAX_CHARS) {
      setError(`Job description exceeds maximum limit of ${MAX_CHARS} characters.`);
      return;
    }
    if (!resume?.id) {
      setError("Invalid resume. Please select an existing resume.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await matchJobDescription(resume.id, jobDescription.trim());
      setMatchResult(result);
      setHistory((prev) => [result, ...prev]);
      setActiveTab("matcher");
    } catch (err) {
      console.error("Job match error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to analyze this job description right now. Please verify your backend and AI connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!resume) return null;

  const score = matchResult?.matchScore ?? null;

  const getScoreTier = (sc) => {
    if (sc === null || sc === undefined) return { label: "Not Evaluated", color: "#64748b", bg: "#f1f5f9" };
    if (sc >= 85) return { label: "Excellent Match", color: "#16a34a", bg: "#dcfce7" };
    if (sc >= 70) return { label: "Strong Match", color: "#2563eb", bg: "#dbeafe" };
    if (sc >= 40) return { label: "Moderate Match", color: "#d97706", bg: "#fef3c7" };
    return { label: "Weak Match", color: "#dc2626", bg: "#fee2e2" };
  };

  const tier = getScoreTier(score);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3>✨ AI Job Description Matcher</h3>
            <p className="modal-subtitle">
              Analyze how well <strong>{resume.fullName || "Your Resume"}</strong> aligns with a specific role
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="jm-tabs">
          <button
            type="button"
            className={`jm-tab-btn ${activeTab === "matcher" ? "active" : ""}`}
            onClick={() => setActiveTab("matcher")}
          >
            🎯 Role Matcher
          </button>
          <button
            type="button"
            className={`jm-tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📜 Match History ({history.length})
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          {activeTab === "matcher" && (
            <>
              {/* Form to paste Job Description */}
              <form onSubmit={handleMatch} className="job-match-form">
                <div className="form-group">
                  <div className="form-row-between">
                    <label htmlFor="jd-textarea">
                      <strong>Job Description / Requirements</strong>
                    </label>
                    <span className="char-count">
                      {jobDescription.length} / {MAX_CHARS}
                    </span>
                  </div>
                  <textarea
                    id="jd-textarea"
                    placeholder="Paste the target job description, responsibilities, and required qualifications here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    maxLength={MAX_CHARS}
                    rows={5}
                    disabled={loading}
                  />
                </div>

                <div className="form-row-between" style={{ marginTop: "10px" }}>
                  <span className="helper-text">
                    Zero-fabrication rule: Skills are verified strictly against your saved resume data.
                  </span>
                  <button
                    type="submit"
                    className="primary-btn match-btn pulse-btn"
                    disabled={loading || !jobDescription.trim()}
                  >
                    {loading ? "✨ Analyzing Job Match..." : "✨ Analyze Job Match"}
                  </button>
                </div>
              </form>

              {/* Loading State */}
              {loading && (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p className="loading-text">
                    ✨ Analyzing your resume against this job description...
                  </p>
                  <span className="loading-sub">
                    Extracting requirements, matching technical skills, detecting gaps, and generating truthful tailoring tips
                  </span>
                </div>
              )}

              {/* Match Results Dashboard */}
              {matchResult && !loading && (
                <div className="match-results">
                  {/* Score Banner */}
                  <div className="score-banner" style={{ borderColor: tier.color }}>
                    <div
                      className="score-circle"
                      style={{ background: tier.bg, color: tier.color, borderColor: tier.color }}
                    >
                      <span className="score-num">{score}%</span>
                      <span className="score-total">Score</span>
                    </div>
                    <div className="score-meta">
                      <div className="tier-badge" style={{ background: tier.bg, color: tier.color }}>
                        {tier.label}
                      </div>
                      <h4 style={{ marginTop: "6px" }}>AI Job Match Overview</h4>
                      <p>
                        {matchResult.matchSummary ||
                          "Comparison between your resume qualifications and the target job description."}
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="match-grid">
                    {/* Matched Skills */}
                    <div className="card-box card-strengths">
                      <h4 className="box-title title-green">
                        <span>✓</span> Matched Skills ({matchResult.matchedSkills?.length || 0})
                      </h4>
                      <div className="tags-container">
                        {matchResult.matchedSkills && matchResult.matchedSkills.length > 0 ? (
                          matchResult.matchedSkills.map((sk, idx) => (
                            <span key={idx} className="keyword-tag tag-green">
                              ✓ {sk}
                            </span>
                          ))
                        ) : (
                          <p className="muted-text">No direct skill matches detected in resume.</p>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="card-box card-weaknesses">
                      <h4 className="box-title title-red">
                        <span>⚠</span> Missing Skills ({matchResult.missingSkills?.length || 0})
                      </h4>
                      <div className="tags-container">
                        {matchResult.missingSkills && matchResult.missingSkills.length > 0 ? (
                          matchResult.missingSkills.map((sk, idx) => (
                            <span key={idx} className="keyword-tag tag-red">
                              ⚠ {sk}
                            </span>
                          ))
                        ) : (
                          <p className="muted-text">No critical missing skills found.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Partial Matches */}
                  {matchResult.partialMatches && matchResult.partialMatches.length > 0 && (
                    <div className="card-box keyword-box" style={{ marginTop: "16px" }}>
                      <h4 className="box-title title-orange">
                        <span>◐</span> Partial / Related Matches ({matchResult.partialMatches.length})
                      </h4>
                      <div className="tags-container">
                        {matchResult.partialMatches.map((sk, idx) => (
                          <span key={idx} className="keyword-tag tag-yellow">
                            ◐ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resume Strengths for this Role */}
                  {matchResult.resumeStrengths && matchResult.resumeStrengths.length > 0 && (
                    <div className="card-box" style={{ marginTop: "16px", background: "var(--card-bg)" }}>
                      <h4 className="box-title title-blue">
                        <span>💪</span> Resume Strengths for this Role
                      </h4>
                      <ul className="suggestions-list">
                        {matchResult.resumeStrengths.map((str, idx) => (
                          <li key={idx}>
                            <strong>✓</strong> {str}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {matchResult.recommendations && matchResult.recommendations.length > 0 && (
                    <div className="card-box suggestions-box" style={{ marginTop: "16px" }}>
                      <h4 className="box-title title-purple">
                        <span>📋</span> Role-Specific Recommendations
                      </h4>
                      <ul className="suggestions-list">
                        {matchResult.recommendations.map((rec, idx) => (
                          <li key={idx}>
                            <strong>{idx + 1}.</strong> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Truthful Tailoring Suggestions */}
                  {matchResult.tailoringSuggestions && matchResult.tailoringSuggestions.length > 0 && (
                    <div className="card-box tailoring-box" style={{ marginTop: "16px" }}>
                      <h4 className="box-title title-indigo">
                        <span>🛡️</span> Truthful Tailoring Guidance
                      </h4>
                      <p className="tailoring-notice">
                        <strong>Important:</strong> Never fabricate experience. Add missing requirements only if you possess genuine, demonstrable capability.
                      </p>
                      <ul className="suggestions-list">
                        {matchResult.tailoringSuggestions.map((sug, idx) => (
                          <li key={idx}>
                            <strong>💡</strong> {sug}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Previous Match History Tab */}
          {activeTab === "history" && (
            <div className="history-container">
              {history.length === 0 ? (
                <div className="empty-state">
                  <p>No previous job matches recorded yet.</p>
                  <span>Paste a job description in the Role Matcher tab to run your first match.</span>
                </div>
              ) : (
                <div className="history-list">
                  {history.map((item, idx) => {
                    const itemTier = getScoreTier(item.matchScore);
                    return (
                      <div key={idx} className="history-item">
                        <div className="history-left">
                          <div className="history-score" style={{ background: itemTier.bg, color: itemTier.color }}>
                            {item.matchScore}%
                          </div>
                          <div className="history-info">
                            <span className="history-tier" style={{ color: itemTier.color }}>
                              {itemTier.label}
                            </span>
                            <p className="history-summary">
                              {item.matchSummary || "Job description match record"}
                            </p>
                            <span className="history-date">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recent"}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="secondary-btn btn-sm"
                          onClick={() => {
                            setMatchResult(item);
                            setActiveTab("matcher");
                          }}
                        >
                          View Result
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobMatchModal;
