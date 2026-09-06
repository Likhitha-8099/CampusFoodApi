import React, { useState, useEffect } from "react";
import { getAllResumes, deleteResume, generateAiSummary, getJobMatches } from "../api/resumeApi";
import { downloadResumeAsDocx } from "../utils/downloadUtils";
import ResumeSelector from "../components/ResumeSelector";
import JobDescriptionInput from "../components/JobDescriptionInput";
import JobFitAnalyzer from "../components/JobFitAnalyzer";

function DashboardPage({
  onNavigate,
  onSelectResumeForEdit,
  onSelectResumeForAts,
  onSelectResumeForJobMatch,
  onSelectResumeForPreview,
}) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryLoadingId, setSummaryLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [recentJobMatches, setRecentJobMatches] = useState([]);
  const [stats, setStats] = useState({ totalResumes: 0, totalAnalyses: 0, totalMatches: 0 });

  // Dashboard Embedded Job Matcher state
  const [selectedMatchResumeId, setSelectedMatchResumeId] = useState("");
  const [quickJdText, setQuickJdText] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getAllResumes();
      const resumeList = Array.isArray(data) ? data : [];
      setResumes(resumeList);

      if (resumeList.length > 0 && !selectedMatchResumeId) {
        setSelectedMatchResumeId(resumeList[0].id);
      }

      let totalMatchesCount = 0;
      const allMatches = [];

      for (const r of resumeList.slice(0, 6)) {
        try {
          const matches = await getJobMatches(r.id);
          if (Array.isArray(matches) && matches.length > 0) {
            totalMatchesCount += matches.length;
            matches.forEach((m) => {
              allMatches.push({
                ...m,
                resumeName: r.fullName || `Resume #${r.id}`,
                resumeId: r.id,
              });
            });
          }
        } catch {
          // ignore
        }
      }

      setRecentJobMatches(allMatches.slice(0, 5));
      setStats({
        totalResumes: resumeList.length,
        totalAnalyses: resumeList.length,
        totalMatches: totalMatchesCount,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Resume #${id}?`)) return;
    setDeleteLoadingId(id);
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      setStats((prev) => ({
        ...prev,
        totalResumes: Math.max(0, prev.totalResumes - 1),
      }));
      if (String(selectedMatchResumeId) === String(id)) {
        const remaining = resumes.filter((r) => r.id !== id);
        setSelectedMatchResumeId(remaining.length > 0 ? remaining[0].id : "");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete resume.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleGenerateSummary = async (resume) => {
    setSummaryLoadingId(resume.id);
    try {
      const updated = await generateAiSummary(resume.id);
      setResumes((prev) => prev.map((r) => (r.id === resume.id ? updated : r)));
    } catch (err) {
      console.error("Summary error:", err);
      alert("AI Summary generation failed. Please check backend connection.");
    } finally {
      setSummaryLoadingId(null);
    }
  };

  const handleLaunchJobMatch = (jdText) => {
    const targetResume = resumes.find(
      (r) => String(r.id) === String(selectedMatchResumeId)
    );
    if (!targetResume) {
      alert("Please select a valid resume first.");
      return;
    }
    // Navigate directly to Job Match page with selected resume & preset JD
    onSelectResumeForJobMatch(targetResume, jdText);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { color: "var(--success)", bg: "var(--success-bg)" };
    if (score >= 60) return { color: "var(--warning)", bg: "var(--warning-bg)" };
    return { color: "var(--error)", bg: "var(--error-bg)" };
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Hero Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-banner-content">
          <span className="welcome-tag">Control Panel</span>
          <h1 className="welcome-title">Build a resume that fits the opportunity.</h1>
          <p className="welcome-subtitle">
            Evaluate your candidate resumes against ATS criteria, match requirements from real job postings, and export interview-ready documents.
          </p>
        </div>
        <div className="welcome-banner-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate("builder-new")}
          >
            + Create New Resume
          </button>
        </div>
      </div>

      {/* Statistics Cards Row */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => onNavigate("resumes")}>
          <div className="metric-header">
            <span className="metric-icon icon-blue">📄</span>
            <span className="metric-tag">Database</span>
          </div>
          <div className="metric-value">{stats.totalResumes}</div>
          <div className="metric-label">My Resumes</div>
          <div className="metric-footer">Total stored candidate profiles</div>
        </div>

        <div className="metric-card" onClick={() => onNavigate("ats")}>
          <div className="metric-header">
            <span className="metric-icon icon-purple">🎯</span>
            <span className="metric-tag">ATS Scans</span>
          </div>
          <div className="metric-value">{stats.totalAnalyses}</div>
          <div className="metric-label">AI Analyses</div>
          <div className="metric-footer">Section audits & keyword scans</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon icon-green">💼</span>
            <span className="metric-tag">Evaluations</span>
          </div>
          <div className="metric-value">{stats.totalMatches}</div>
          <div className="metric-label">Job Matches</div>
          <div className="metric-footer">Target role comparisons run</div>
        </div>
      </div>

      {/* PRIMARY SECTION: AI JOB FIT ANALYZER (UPLOAD & PASTE) */}
      <div style={{ marginBottom: "28px" }}>
        <JobFitAnalyzer
          onNavigate={onNavigate}
          onSelectResumeForJobMatch={onSelectResumeForJobMatch}
        />
      </div>

      {/* Main Dashboard Layout: Saved Resumes & History */}
      <div className="dashboard-layout-grid">
        {/* Left Column: Saved Resumes */}
        <div className="dashboard-main-col">
          {/* SECTION: My Resumes Cards / Table */}
          <div className="card-box section-card">
            <div className="section-card-header flex-between">
              <div>
                <h2 className="section-heading">My Stored Resumes ({resumes.length})</h2>
                <p className="section-subheading">
                  Manage candidate profiles and launch instant actions
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => onNavigate("resumes")}
              >
                View All Resumes →
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading candidate profiles...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="empty-dashboard-state">
                <div className="empty-icon">📝</div>
                <h3>No resumes saved yet</h3>
                <p>Create your first resume using the live split-screen builder.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onNavigate("builder-new")}
                >
                  Create Your First Resume
                </button>
              </div>
            ) : (
              <div className="resumes-table-wrapper">
                <table className="resumes-table">
                  <thead>
                    <tr>
                      <th>Candidate & Role</th>
                      <th>Core Skills</th>
                      <th>Contact</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumes.slice(0, 5).map((resume) => (
                      <tr key={resume.id} className="resume-row">
                        <td>
                          <div className="candidate-info">
                            <span className="candidate-name">
                              {resume.fullName || "Untitled Resume"}
                            </span>
                            <span className="candidate-id">#{resume.id}</span>
                          </div>
                          {resume.summary && (
                            <p className="table-summary-snippet">
                              {resume.summary.length > 75
                                ? `${resume.summary.substring(0, 75)}...`
                                : resume.summary}
                            </p>
                          )}
                        </td>
                        <td>
                          <div className="skills-cell">
                            {resume.skills ? (
                              resume.skills
                                .split(",")
                                .slice(0, 3)
                                .map((sk, idx) => (
                                  <span key={idx} className="skill-chip">
                                    {sk.trim()}
                                  </span>
                                ))
                            ) : (
                              <span className="muted-text">None</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="contact-cell">
                            <span>{resume.email || "—"}</span>
                            <span>{resume.phone || ""}</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn btn-action-btn btn-action-edit"
                              onClick={() => onSelectResumeForEdit(resume)}
                              title="Edit Resume"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-action-btn btn-action-preview"
                              onClick={() => onSelectResumeForPreview(resume)}
                              title="Live Preview"
                            >
                              👁️ Preview
                            </button>
                            <button
                              type="button"
                              className="btn btn-action-btn btn-action-ats"
                              onClick={() => onSelectResumeForAts(resume)}
                              title="ATS Analysis"
                            >
                              🎯 Analyze
                            </button>
                            <button
                              type="button"
                              className="btn btn-action-btn btn-action-match"
                              onClick={() => onSelectResumeForJobMatch(resume)}
                              title="Job Match"
                            >
                              💼 Match
                            </button>
                            <button
                              type="button"
                              className="btn btn-action-btn btn-action-delete"
                              onClick={() => handleDelete(resume.id)}
                              disabled={deleteLoadingId === resume.id}
                              title="Delete"
                            >
                              {deleteLoadingId === resume.id ? "..." : "🗑️"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Job Matches & Quick Actions */}
        <div className="dashboard-side-col">
          {/* Recent Job Matches Card */}
          <div className="card-box side-card">
            <h3 className="side-card-title">
              <span>📜</span> Recent Job Matches
            </h3>
            <p className="side-card-subtitle">Previous role evaluations</p>

            {recentJobMatches.length === 0 ? (
              <div className="empty-side-state">
                <p>No job matches run yet.</p>
                <span>Paste a job description on the left to evaluate alignment.</span>
              </div>
            ) : (
              <div className="recent-matches-list">
                {recentJobMatches.map((jm, idx) => {
                  const colors = getScoreColor(jm.matchScore);
                  return (
                    <div key={idx} className="recent-match-item">
                      <div className="match-item-top">
                        <span className="match-resume-name">{jm.resumeName}</span>
                        <span
                          className="match-score-badge"
                          style={{ color: colors.color, background: colors.bg }}
                        >
                          {jm.matchScore}%
                        </span>
                      </div>
                      <p className="match-item-summary">
                        {jm.matchSummary
                          ? jm.matchSummary.substring(0, 85) + "..."
                          : "Role alignment calculation"}
                      </p>
                      <button
                        type="button"
                        className="btn-outline-match"
                        onClick={() => {
                          const target = resumes.find((r) => r.id === jm.resumeId);
                          if (target) onSelectResumeForJobMatch(target);
                        }}
                      >
                        View Full Breakdown →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Shortcuts Card */}
          <div className="card-box side-card" style={{ marginTop: "20px" }}>
            <h3 className="side-card-title">
              <span>⚡</span> Quick Shortcuts
            </h3>
            <div className="quick-actions-list">
              <button
                type="button"
                className="quick-action-btn"
                onClick={() => onNavigate("builder-new")}
              >
                <span>📝</span>
                <div>
                  <strong>New Resume Editor</strong>
                  <small>Open blank split-screen builder</small>
                </div>
              </button>
              <button
                type="button"
                className="quick-action-btn"
                onClick={() => onNavigate("resumes")}
              >
                <span>📂</span>
                <div>
                  <strong>Manage Resumes</strong>
                  <small>Search & export documents</small>
                </div>
              </button>
              <button
                type="button"
                className="quick-action-btn"
                onClick={() => {
                  if (resumes.length > 0) {
                    onSelectResumeForAts(resumes[0]);
                  } else {
                    onNavigate("builder-new");
                  }
                }}
              >
                <span>🎯</span>
                <div>
                  <strong>ATS Audit Suite</strong>
                  <small>Scan latest resume for keywords</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
