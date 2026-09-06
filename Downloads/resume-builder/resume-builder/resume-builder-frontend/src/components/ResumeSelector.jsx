import React from "react";

function ResumeSelector({
  resumes = [],
  selectedResumeId = "",
  onSelectResume,
  loading = false,
  onCreateNew,
}) {
  if (loading) {
    return (
      <div className="resume-selector-wrapper loading">
        <div className="spinner-sm" />
        <span className="selector-loading-text">Loading saved resumes...</span>
      </div>
    );
  }

  if (!resumes || resumes.length === 0) {
    return (
      <div className="resume-selector-empty">
        <div className="empty-selector-info">
          <span className="empty-selector-icon">📋</span>
          <div>
            <p className="empty-selector-title">No resumes yet.</p>
            <p className="empty-selector-sub">Create your first resume to enable job matching.</p>
          </div>
        </div>
        {onCreateNew && (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={onCreateNew}
          >
            + Create Your First Resume
          </button>
        )}
      </div>
    );
  }

  const selectedResume = resumes.find(
    (r) => String(r.id) === String(selectedResumeId)
  );

  return (
    <div className="resume-selector-wrapper">
      <div className="selector-field-group">
        <label htmlFor="resume-select-dropdown" className="selector-label">
          <strong>Select Candidate Resume</strong>
        </label>
        <div className="selector-dropdown-container">
          <select
            id="resume-select-dropdown"
            className="resume-select-dropdown"
            value={selectedResumeId || ""}
            onChange={(e) => onSelectResume && onSelectResume(e.target.value)}
          >
            <option value="" disabled>
              -- Select a saved resume --
            </option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                #{resume.id} — {resume.fullName || "Untitled Resume"} (
                {resume.skills ? resume.skills.split(",")[0].trim() : "General"}
                )
              </option>
            ))}
          </select>
          <span className="dropdown-arrow-icon">▼</span>
        </div>
      </div>

      {selectedResume && (
        <div className="selected-resume-pill">
          <span className="pill-badge">Active</span>
          <strong className="pill-name">{selectedResume.fullName || "Untitled"}</strong>
          {selectedResume.email && (
            <span className="pill-meta">• {selectedResume.email}</span>
          )}
          {selectedResume.skills && (
            <span className="pill-meta pill-skills">
              • Skills: {selectedResume.skills.substring(0, 40)}
              {selectedResume.skills.length > 40 ? "..." : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeSelector;
