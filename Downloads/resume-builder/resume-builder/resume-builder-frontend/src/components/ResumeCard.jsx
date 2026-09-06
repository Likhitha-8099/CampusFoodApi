function ResumeCard({
  resume,
  onSelectResume,
  onEditResume,
  onGenerateSummary,
  onOpenAtsModal,
  onOpenJobMatchModal,
  onDeleteResume,
  loadingSummaryId,
  deletingId,
}) {
  return (
    <div className="resume-card">
      <div className="card-top">
        <div>
          <h3 className="card-name">{resume.fullName || "Untitled Resume"}</h3>
          <p className="card-email">{resume.email}</p>
        </div>
        <span className="badge badge-id">ID: #{resume.id}</span>
      </div>

      {resume.skills && (
        <p className="card-skills">
          <strong>Skills:</strong> {resume.skills}
        </p>
      )}

      {resume.summary && (
        <p className="card-summary">
          {resume.summary.length > 120
            ? `${resume.summary.substring(0, 120)}...`
            : resume.summary}
        </p>
      )}

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onSelectResume(resume)}
          title="View in live preview pane"
        >
          View Preview
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onEditResume(resume)}
          title="Load into editor form"
        >
          Edit
        </button>

        <button
          type="button"
          className="btn btn-ai"
          onClick={() => onGenerateSummary(resume.id)}
          disabled={loadingSummaryId === resume.id}
        >
          {loadingSummaryId === resume.id ? "Generating..." : "✨ AI Summary"}
        </button>

        <button
          type="button"
          className="btn btn-ats"
          onClick={() => onOpenAtsModal(resume)}
        >
          🎯 ATS Analysis
        </button>

        <button
          type="button"
          className="btn btn-match"
          onClick={() => onOpenJobMatchModal(resume)}
        >
          💼 Job Match
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDeleteResume(resume.id)}
          disabled={deletingId === resume.id}
        >
          {deletingId === resume.id ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default ResumeCard;
