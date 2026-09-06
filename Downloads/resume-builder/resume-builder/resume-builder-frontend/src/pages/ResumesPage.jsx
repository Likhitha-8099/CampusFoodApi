import React, { useState } from "react";
import { downloadResumeAsDocx } from "../utils/downloadUtils";

function ResumesPage({
  resumes = [],
  loading = false,
  onNavigate,
  onSelectResumeForEdit,
  onSelectResumeForPreview,
  onSelectResumeForAts,
  onSelectResumeForJobMatch,
  onDeleteResume,
  onGenerateSummary,
  summaryLoadingId,
  deleteLoadingId,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResumes = resumes.filter((r) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (r.fullName || "").toLowerCase().includes(term);
    const skillsMatch = (r.skills || "").toLowerCase().includes(term);
    const emailMatch = (r.email || "").toLowerCase().includes(term);
    return nameMatch || skillsMatch || emailMatch;
  });

  return (
    <div className="resumes-page-container">
      <div className="resumes-page-header">
        <div>
          <h1 className="page-title">My Resumes</h1>
          <p className="page-subtitle">
            Manage your saved candidate profiles, export documents, and run intelligence audits.
          </p>
        </div>
        <div className="resumes-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate("builder-new")}
          >
            + Create New Resume
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="resumes-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by candidate name, skill (e.g. Java, React), or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>
        <span className="results-count-badge">
          Showing {filteredResumes.length} of {resumes.length} resumes
        </span>
      </div>

      {loading ? (
        <div className="card-box loading-card text-center">
          <div className="spinner spinner-lg" />
          <p>Loading candidate resumes from database...</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="card-box empty-dashboard-state text-center">
          <div className="empty-icon">📝</div>
          <h3>No resumes in your database yet</h3>
          <p>Create your first professional resume using our interactive live builder.</p>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate("builder-new")}
          >
            Create Your First Resume
          </button>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="card-box empty-state text-center">
          <p>No resumes match your search "{searchTerm}".</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setSearchTerm("")}
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="resumes-cards-grid">
          {filteredResumes.map((resume) => (
            <div key={resume.id} className="card-box resume-manage-card">
              <div className="resume-card-header">
                <div>
                  <div className="resume-card-name-row">
                    <h3 className="resume-card-title">
                      {resume.fullName || "Untitled Resume"}
                    </h3>
                    <span className="resume-id-badge">#{resume.id}</span>
                  </div>
                  <p className="resume-card-contact">{resume.email || "No email"}</p>
                </div>
              </div>

              {resume.summary && (
                <p className="resume-card-summary">
                  {resume.summary.length > 130
                    ? `${resume.summary.substring(0, 130)}...`
                    : resume.summary}
                </p>
              )}

              <div className="resume-card-skills-section">
                <span className="skills-section-label">Core Skills:</span>
                <div className="skills-chips-wrapper">
                  {resume.skills ? (
                    resume.skills
                      .split(",")
                      .slice(0, 5)
                      .map((sk, idx) => (
                        <span key={idx} className="skill-chip">
                          {sk.trim()}
                        </span>
                      ))
                  ) : (
                    <span className="muted-text">No skills specified</span>
                  )}
                </div>
              </div>

              <div className="resume-card-actions-grid">
                <button
                  type="button"
                  className="btn btn-action-btn btn-action-edit"
                  onClick={() => onSelectResumeForEdit(resume)}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="btn btn-action-btn btn-action-preview"
                  onClick={() => onSelectResumeForPreview(resume)}
                >
                  👁️ Preview
                </button>
                <button
                  type="button"
                  className="btn btn-action-btn btn-action-ats"
                  onClick={() => onSelectResumeForAts(resume)}
                >
                  🎯 ATS Audit
                </button>
                <button
                  type="button"
                  className="btn btn-action-btn btn-action-match"
                  onClick={() => onSelectResumeForJobMatch(resume)}
                >
                  💼 Job Match
                </button>
                <button
                  type="button"
                  className="btn btn-action-btn btn-action-ai"
                  onClick={() => onGenerateSummary(resume)}
                  disabled={summaryLoadingId === resume.id}
                >
                  {summaryLoadingId === resume.id ? "✨ Generating..." : "✨ AI Summary"}
                </button>
                <button
                  type="button"
                  className="btn btn-action-btn btn-action-docx"
                  onClick={() => downloadResumeAsDocx(resume)}
                >
                  📄 DOCX
                </button>
                <button
                  type="button"
                  className="btn btn-action-btn btn-action-delete"
                  onClick={() => onDeleteResume(resume.id)}
                  disabled={deleteLoadingId === resume.id}
                >
                  {deleteLoadingId === resume.id ? "..." : "🗑️ Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumesPage;
