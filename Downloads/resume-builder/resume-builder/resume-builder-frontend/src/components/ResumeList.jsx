import { useEffect, useState } from "react";
import { getAllResumes, generateAiSummary, deleteResume } from "../api/resumeApi";
import ResumeCard from "./ResumeCard";

function ResumeList({
  refreshList,
  onSelectResume,
  onEditResume,
  onOpenAtsModal,
  onOpenJobMatchModal,
}) {
  const [resumes, setResumes] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchResumes = async () => {
    try {
      const data = await getAllResumes();
      if (Array.isArray(data)) {
        setResumes(data);
      } else {
        console.error("Expected array but got:", data);
        setResumes([]);
      }
    } catch (error) {
      console.error("Failed to fetch resumes", error);
      setResumes([]);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [refreshList]);

  const handleGenerateSummary = async (resumeId) => {
    setLoadingId(resumeId);

    try {
      const updatedResume = await generateAiSummary(resumeId);

      setResumes((prevResumes) =>
        Array.isArray(prevResumes)
          ? prevResumes.map((resume) =>
              resume.id === resumeId ? updatedResume : resume
            )
          : []
      );

      onSelectResume(updatedResume);
    } catch (error) {
      console.error("AI summary generation failed", error);
      alert("AI summary generation failed. Please check Gemini API key & logs.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm(`Are you sure you want to delete Resume #${resumeId}?`)) {
      return;
    }

    setDeleteLoadingId(resumeId);
    try {
      await deleteResume(resumeId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
    } catch (err) {
      console.error("Failed to delete resume", err);
      alert("Failed to delete resume.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const safeResumes = Array.isArray(resumes) ? resumes : [];

  return (
    <section className="list-section">
      <div className="list-header">
        <div>
          <h2>Saved Resumes ({safeResumes.length})</h2>
          <p className="section-subtitle">
            Manage your saved resumes, run AI audits, or match against job descriptions
          </p>
        </div>
      </div>

      {safeResumes.length === 0 ? (
        <div className="empty-state">
          <p>No resumes saved in database yet.</p>
          <span>Fill out the form above and click "Save Resume" to create your first resume.</span>
        </div>
      ) : (
        <div className="resume-grid">
          {safeResumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onSelectResume={onSelectResume}
              onEditResume={onEditResume}
              onGenerateSummary={handleGenerateSummary}
              onOpenAtsModal={onOpenAtsModal}
              onOpenJobMatchModal={onOpenJobMatchModal}
              onDeleteResume={handleDelete}
              loadingSummaryId={loadingId}
              deletingId={deleteLoadingId}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ResumeList;