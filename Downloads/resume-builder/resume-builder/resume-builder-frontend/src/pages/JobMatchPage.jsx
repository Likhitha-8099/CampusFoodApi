import React, { useState, useEffect } from "react";
import { matchJobDescription, getJobMatches } from "../api/resumeApi";
import JobDescriptionInput from "../components/JobDescriptionInput";

function JobMatchPage({ resume, initialJobDescription = "", onBack, onNavigateToEditor }) {
  const [jobDescription, setJobDescription] = useState(initialJobDescription || "");
  const [matchResult, setMatchResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("matcher"); // "matcher" or "history"

  useEffect(() => {
    if (initialJobDescription) {
      setJobDescription(initialJobDescription);
    }
  }, [initialJobDescription]);

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
      // ignore
    }
  };

  const handleMatch = async (jdText) => {
    const textToAnalyze = (jdText || jobDescription).trim();
    if (!textToAnalyze) {
      setError("Please paste a target job description before analyzing.");
      return;
    }
    if (!resume?.id) {
      setError("Invalid resume. Please select a valid resume.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await matchJobDescription(resume.id, textToAnalyze);
      setMatchResult(result);
      setHistory((prev) => [result, ...prev]);
      setActiveTab("matcher");
    } catch (err) {
      console.error("Job match error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to analyze job description right now. Please verify backend AI connection."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!resume) {
    return (
      <div className="job-match-page-container">
        <div className="empty-state">
          <p>No resume selected for Job Match.</p>
          <button type="button" className="btn btn-primary" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const score = matchResult?.matchScore ?? null;

  const getTierInfo = (sc) => {
    if (sc === null || sc === undefined) return { label: "Not Evaluated", color: "var(--text-muted)", bg: "var(--surface)" };
    if (sc >= 85) return { label: "Strong Match", color: "var(--success)", bg: "var(--success-bg)" };
    if (sc >= 70) return { label: "Good Match", color: "var(--primary)", bg: "var(--primary-light)" };
    if (sc >= 50) return { label: "Moderate Match", color: "var(--warning)", bg: "var(--warning-bg)" };
    return { label: "Low Alignment", color: "var(--error)", bg: "var(--error-bg)" };
  };

  const tier = getTierInfo(score);
  const breakdown = matchResult?.scoreBreakdown;

  const exactList = breakdown?.exactMatches || [];
  const semanticList = breakdown?.semanticMatches || [];
  const hasSplitMatches = exactList.length > 0 || semanticList.length > 0;

  return (
    <div className="job-match-page-container">
      {/* Top Header */}
      <div className="job-match-page-header">
        <div className="header-left">
          <button type="button" className="btn btn-back" onClick={onBack}>
            ← Back
          </button>
          <div>
            <h1 className="page-title">✨ AI Job Description Matcher</h1>
            <p className="page-subtitle">
              Evaluating <strong>{resume.fullName || "Untitled Resume"}</strong> (ID: #{resume.id}) against target role requirements
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="jm-view-tabs">
          <button
            type="button"
            className={`jm-vtab ${activeTab === "matcher" ? "active" : ""}`}
            onClick={() => setActiveTab("matcher")}
          >
            🎯 Role Matcher
          </button>
          <button
            type="button"
            className={`jm-vtab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📜 Match History ({history.length})
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Tab 1: Matcher */}
      {activeTab === "matcher" && (
        <div className="matcher-layout">
          {/* Form to Paste JD */}
          <div className="card-box jd-input-card">
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              onSubmit={handleMatch}
              loading={loading}
              buttonText="Analyze Job Match"
              placeholder="Paste target job description, responsibilities, and required qualifications here..."
            />
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="card-box loading-card text-center" style={{ marginTop: "20px" }}>
              <div className="spinner spinner-lg" />
              <h3>✨ Comparing your resume with this job...</h3>
              <p>Extracting requirements, computing deterministic weighted scores, detecting gaps, and generating truthful tailoring tips</p>
            </div>
          )}

          {/* Results Dashboard */}
          {matchResult && !loading && (
            <div className="job-match-results-wrapper">
              {/* Score Hero Banner */}
              <div className="score-hero-card" style={{ borderLeftColor: tier.color }}>
                <div className="score-badge-circle" style={{ borderColor: tier.color, color: tier.color }}>
                  <span className="score-number">{score}%</span>
                  <span className="score-out-of">Match</span>
                </div>

                <div className="score-hero-info">
                  <div className="tier-tag" style={{ background: tier.bg, color: tier.color }}>
                    {tier.label}
                  </div>
                  <h2>Job Requirement Alignment Summary</h2>
                  <p>
                    {matchResult.matchSummary ||
                      "Detailed hybrid evaluation comparing candidate technical skills, domain keywords, and relevant experience against job requirements."}
                  </p>
                </div>
              </div>

              {/* Transparent Score Breakdown & Formula Card */}
              <div className="card-box formula-breakdown-card">
                <div className="formula-header">
                  <h3 className="card-heading heading-blue">
                    <span>📊</span> Transparent Score Breakdown & Derivation
                  </h3>
                  <span className="formula-badge">Deterministic Hybrid Formula</span>
                </div>
                <p className="formula-intro">
                  The match score is calculated using explicit, explainable category weights rather than black-box LLM estimations:
                </p>

                <div className="weights-grid">
                  <div className="weight-item">
                    <span className="weight-title">Skills Match</span>
                    <span className="weight-val">
                      {breakdown?.skillsScore ?? 75}% <small>(Weight: 40%)</small>
                    </span>
                    <div className="weight-bar-bg">
                      <div
                        className="weight-bar-fill fill-blue"
                        style={{ width: `${breakdown?.skillsScore ?? 75}%` }}
                      />
                    </div>
                  </div>

                  <div className="weight-item">
                    <span className="weight-title">Keywords Match</span>
                    <span className="weight-val">
                      {breakdown?.keywordScore ?? 70}% <small>(Weight: 25%)</small>
                    </span>
                    <div className="weight-bar-bg">
                      <div
                        className="weight-bar-fill fill-purple"
                        style={{ width: `${breakdown?.keywordScore ?? 70}%` }}
                      />
                    </div>
                  </div>

                  <div className="weight-item">
                    <span className="weight-title">Experience Match</span>
                    <span className="weight-val">
                      {breakdown?.experienceScore ?? 70}% <small>(Weight: 15%)</small>
                    </span>
                    <div className="weight-bar-bg">
                      <div
                        className="weight-bar-fill fill-green"
                        style={{ width: `${breakdown?.experienceScore ?? 70}%` }}
                      />
                    </div>
                  </div>

                  <div className="weight-item">
                    <span className="weight-title">Education Match</span>
                    <span className="weight-val">
                      {breakdown?.educationScore ?? 85}% <small>(Weight: 10%)</small>
                    </span>
                    <div className="weight-bar-bg">
                      <div
                        className="weight-bar-fill fill-amber"
                        style={{ width: `${breakdown?.educationScore ?? 85}%` }}
                      />
                    </div>
                  </div>

                  <div className="weight-item">
                    <span className="weight-title">Project Relevance</span>
                    <span className="weight-val">
                      {breakdown?.projectScore ?? 80}% <small>(Weight: 10%)</small>
                    </span>
                    <div className="weight-bar-bg">
                      <div
                        className="weight-bar-fill fill-teal"
                        style={{ width: `${breakdown?.projectScore ?? 80}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Multiplication Breakdown */}
                <div className="math-multiplication-breakdown">
                  <span className="math-label">📐 Step-by-Step Calculation Formula:</span>
                  <div className="math-steps-grid">
                    <div className="math-step-pill">
                      <span>Skills:</span>
                      <strong>{breakdown?.skillsScore ?? 75} × 40% = {((breakdown?.skillsScore ?? 75) * 0.40).toFixed(1)}</strong>
                    </div>
                    <div className="math-step-pill">
                      <span>Keywords:</span>
                      <strong>{breakdown?.keywordScore ?? 70} × 25% = {((breakdown?.keywordScore ?? 70) * 0.25).toFixed(1)}</strong>
                    </div>
                    <div className="math-step-pill">
                      <span>Experience:</span>
                      <strong>{breakdown?.experienceScore ?? 70} × 15% = {((breakdown?.experienceScore ?? 70) * 0.15).toFixed(1)}</strong>
                    </div>
                    <div className="math-step-pill">
                      <span>Education:</span>
                      <strong>{breakdown?.educationScore ?? 85} × 10% = {((breakdown?.educationScore ?? 85) * 0.10).toFixed(1)}</strong>
                    </div>
                    <div className="math-step-pill">
                      <span>Projects:</span>
                      <strong>{breakdown?.projectScore ?? 80} × 10% = {((breakdown?.projectScore ?? 80) * 0.10).toFixed(1)}</strong>
                    </div>
                  </div>

                  {breakdown?.calculationExplanation && (
                    <div className="math-explanation-box" style={{ marginTop: "12px" }}>
                      <code className="math-code">{breakdown.calculationExplanation}</code>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Classification Grid: Exact, Semantic, Partial, Missing */}
              <div className="skills-classification-grid">
                {/* 1. Exact & Semantic Matched Skills */}
                <div className="card-box matched-skills-box">
                  <h3 className="card-heading heading-green">
                    <span>✓</span> Matched Skills ({matchResult.matchedSkills?.length || 0})
                  </h3>
                  <p className="sub-desc">Skills directly or semantically verified in your resume against the JD:</p>
                  <div className="tags-flex-wrap">
                    {hasSplitMatches ? (
                      <>
                        {exactList.map((sk, idx) => (
                          <span key={`ex-${idx}`} className="skill-badge badge-matched" title="Direct exact keyword match">
                            ✓ Exact: {sk}
                          </span>
                        ))}
                        {semanticList.map((sk, idx) => (
                          <span key={`sem-${idx}`} className="skill-badge badge-semantic" title="Semantically equivalent skill">
                            ✓ Semantic: {sk}
                          </span>
                        ))}
                      </>
                    ) : matchResult.matchedSkills && matchResult.matchedSkills.length > 0 ? (
                      matchResult.matchedSkills.map((sk, idx) => (
                        <span key={idx} className="skill-badge badge-matched">
                          ✓ {sk}
                        </span>
                      ))
                    ) : (
                      <p className="muted-text">No direct skill matches detected.</p>
                    )}
                  </div>
                </div>

                {/* 2. Partial Matches */}
                <div className="card-box partial-skills-box">
                  <h3 className="card-heading heading-orange">
                    <span>◐</span> Partial Matches ({matchResult.partialMatches?.length || 0})
                  </h3>
                  <p className="sub-desc">Related technologies or foundational knowledge detected in resume:</p>
                  <div className="tags-flex-wrap">
                    {matchResult.partialMatches && matchResult.partialMatches.length > 0 ? (
                      matchResult.partialMatches.map((sk, idx) => (
                        <span key={idx} className="skill-badge badge-partial" title="Partial / adjacent foundation">
                          ◐ Partial: {sk}
                        </span>
                      ))
                    ) : (
                      <p className="muted-text">No partial matches flagged.</p>
                    )}
                  </div>
                </div>

                {/* 3. Missing Skills */}
                <div className="card-box missing-skills-box">
                  <h3 className="card-heading heading-red">
                    <span>⚠</span> Missing Requirements ({matchResult.missingSkills?.length || 0})
                  </h3>
                  <p className="sub-desc">Key requirements from JD with no evidence found in resume:</p>
                  <div className="tags-flex-wrap">
                    {matchResult.missingSkills && matchResult.missingSkills.length > 0 ? (
                      matchResult.missingSkills.map((sk, idx) => (
                        <span key={idx} className="skill-badge badge-missing" title="Missing requirement">
                          ⚠ Missing: {sk}
                        </span>
                      ))
                    ) : (
                      <p className="muted-text">No missing skills detected.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume Strengths for this Role */}
              {matchResult.resumeStrengths && matchResult.resumeStrengths.length > 0 && (
                <div className="card-box strengths-role-box">
                  <h3 className="card-heading heading-blue">
                    <span>💪</span> Candidate Strengths for this Role
                  </h3>
                  <ul className="feedback-pill-list">
                    {matchResult.resumeStrengths.map((str, idx) => (
                      <li key={idx} className="pill-item-blue">
                        <span className="pill-bullet">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Recommendations */}
              {matchResult.recommendations && matchResult.recommendations.length > 0 && (
                <div className="card-box recommendations-box">
                  <h3 className="card-heading heading-purple">
                    <span>📋</span> Actionable Recommendations
                  </h3>
                  <ul className="suggestions-ordered-list">
                    {matchResult.recommendations.map((rec, idx) => (
                      <li key={idx}>
                        <div className="suggestion-num">{idx + 1}</div>
                        <div className="suggestion-text">{rec}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Truthful Tailoring Guidance */}
              {matchResult.tailoringSuggestions && matchResult.tailoringSuggestions.length > 0 && (
                <div className="card-box tailoring-guidance-box">
                  <div className="tailoring-notice-banner">
                    <span className="notice-icon">🛡️</span>
                    <div>
                      <strong>Truthful Resume Tailoring Notice</strong>
                      <p>
                        Never fabricate credentials. If a job requires Docker or Kafka but you have not used them, do not simply add them to your resume. Only highlight genuine project experience and demonstrable competencies.
                      </p>
                    </div>
                  </div>

                  <h3 className="card-heading heading-slate" style={{ marginTop: "16px" }}>
                    <span>💡</span> Recommended Truthful Adjustments
                  </h3>
                  <ul className="suggestions-ordered-list">
                    {matchResult.tailoringSuggestions.map((sug, idx) => (
                      <li key={idx}>
                        <div className="suggestion-num">💡</div>
                        <div className="suggestion-text">{sug}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Match History */}
      {activeTab === "history" && (
        <div className="history-tab-content">
          {history.length === 0 ? (
            <div className="empty-state">
              <p>No past job matches recorded for this resume.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveTab("matcher")}
              >
                Match a Job Description
              </button>
            </div>
          ) : (
            <div className="history-grid">
              {history.map((item, idx) => {
                const itemTier = getTierInfo(item.matchScore);
                return (
                  <div key={idx} className="card-box history-card">
                    <div className="history-card-top">
                      <div
                        className="history-score-chip"
                        style={{ color: itemTier.color, background: itemTier.bg }}
                      >
                        {item.matchScore}%
                      </div>
                      <span className="history-date">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recent"}
                      </span>
                    </div>

                    <p className="history-summary-text">
                      {item.matchSummary || "Job description match evaluation record"}
                    </p>

                    <div className="history-tags-preview">
                      {item.matchedSkills?.slice(0, 3).map((sk, sIdx) => (
                        <span key={sIdx} className="skill-chip">
                          ✓ {sk}
                        </span>
                      ))}
                      {item.missingSkills?.slice(0, 2).map((sk, mIdx) => (
                        <span key={mIdx} className="skill-chip chip-missing">
                          ⚠ {sk}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: "12px", width: "100%" }}
                      onClick={() => {
                        setMatchResult(item);
                        setActiveTab("matcher");
                      }}
                    >
                      View Full Analysis & Breakdown →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobMatchPage;
