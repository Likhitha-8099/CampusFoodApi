import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ResumesPage from "./pages/ResumesPage";
import AtsAnalysisPage from "./pages/AtsAnalysisPage";
import JobMatchPage from "./pages/JobMatchPage";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import { getAllResumes, deleteResume, generateAiSummary } from "./api/resumeApi";
import "./index.css";

const EMPTY_RESUME = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  summary: "",
  skills: "",
  technologies: "",
  libraries: "",
  softSkills: "",
  education: "",
  educationInstitution: "",
  experience: "",
  projects: "",
  certifications: "",
};

function App() {
  const [activeView, setActiveView] = useState("home"); // "home" | "dashboard" | "resumes" | "builder" | "ats" | "job-match"
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [formData, setFormData] = useState(EMPTY_RESUME);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [activeResumeForIntelligence, setActiveResumeForIntelligence] = useState(null);
  const [presetJobDescription, setPresetJobDescription] = useState("");
  const [summaryLoadingId, setSummaryLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchResumes = async () => {
    setLoadingResumes(true);
    try {
      const data = await getAllResumes();
      if (Array.isArray(data)) {
        setResumes(data);
        if (data.length > 0 && !formData.id && !formData.fullName) {
          setFormData(data[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleNavigate = (view) => {
    if (view === "builder-new") {
      setFormData(EMPTY_RESUME);
      setActiveView("builder");
    } else {
      setActiveView(view);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResumeSaved = (savedResume) => {
    setFormData(savedResume);
    fetchResumes();
  };

  const handleResetForm = () => {
    setFormData(EMPTY_RESUME);
  };

  const handleSelectResumeForEdit = (resume) => {
    setFormData(resume);
    setActiveView("builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectResumeForPreview = (resume) => {
    setFormData(resume);
    setActiveView("builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectResumeForAts = (resume) => {
    setActiveResumeForIntelligence(resume || formData);
    setActiveView("ats");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectResumeForJobMatch = (resume, initialJd = "") => {
    setActiveResumeForIntelligence(resume || formData);
    setPresetJobDescription(initialJd || "");
    setActiveView("job-match");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Resume #${id}?`)) return;
    setDeleteLoadingId(id);
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (formData.id === id) {
        setFormData(EMPTY_RESUME);
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
      if (formData.id === resume.id) {
        setFormData(updated);
      }
    } catch (err) {
      console.error("Summary error:", err);
      alert("AI Summary generation failed. Please check backend connection.");
    } finally {
      setSummaryLoadingId(null);
    }
  };

  return (
    <div className="app-root">
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        resumeCount={resumes.length}
      />

      <main className="app-main-content">
        {/* VIEW 1: HOME PAGE */}
        {activeView === "home" && (
          <HomePage onNavigate={handleNavigate} totalResumes={resumes.length} />
        )}

        {/* VIEW 2: DASHBOARD */}
        {activeView === "dashboard" && (
          <DashboardPage
            onNavigate={handleNavigate}
            onSelectResumeForEdit={handleSelectResumeForEdit}
            onSelectResumeForPreview={handleSelectResumeForPreview}
            onSelectResumeForAts={handleSelectResumeForAts}
            onSelectResumeForJobMatch={handleSelectResumeForJobMatch}
          />
        )}

        {/* VIEW 3: MY RESUMES DEDICATED PAGE */}
        {activeView === "resumes" && (
          <ResumesPage
            resumes={resumes}
            loading={loadingResumes}
            onNavigate={handleNavigate}
            onSelectResumeForEdit={handleSelectResumeForEdit}
            onSelectResumeForPreview={handleSelectResumeForPreview}
            onSelectResumeForAts={handleSelectResumeForAts}
            onSelectResumeForJobMatch={handleSelectResumeForJobMatch}
            onDeleteResume={handleDeleteResume}
            onGenerateSummary={handleGenerateSummary}
            summaryLoadingId={summaryLoadingId}
            deleteLoadingId={deleteLoadingId}
          />
        )}

        {/* VIEW 4: RESUME BUILDER + LIVE PREVIEW */}
        {activeView === "builder" && (
          <div className="builder-page-wrapper">
            <div className="builder-layout">
              <ResumeForm
                formData={formData}
                setFormData={setFormData}
                onResumeSaved={handleResumeSaved}
                onResetForm={handleResetForm}
                onNavigateToAts={handleSelectResumeForAts}
                onNavigateToJobMatch={handleSelectResumeForJobMatch}
              />

              <ResumePreview
                resume={formData}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                onNavigateToAts={handleSelectResumeForAts}
                onNavigateToJobMatch={handleSelectResumeForJobMatch}
              />
            </div>
          </div>
        )}

        {/* VIEW 5: ATS AUDIT VIEW */}
        {activeView === "ats" && (
          <AtsAnalysisPage
            resume={activeResumeForIntelligence || (resumes.length > 0 ? resumes[0] : formData)}
            onBack={() => handleNavigate("dashboard")}
            onNavigateToJobMatch={handleSelectResumeForJobMatch}
          />
        )}

        {/* VIEW 6: JOB DESCRIPTION MATCHER VIEW */}
        {activeView === "job-match" && (
          <JobMatchPage
            resume={activeResumeForIntelligence || (resumes.length > 0 ? resumes[0] : formData)}
            initialJobDescription={presetJobDescription}
            onBack={() => handleNavigate("dashboard")}
            onNavigateToEditor={handleSelectResumeForEdit}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <strong>ResumeAI Platform</strong> • Intelligent Resume Engineering & ATS Suitability Suite
          </div>
          <div className="footer-right">
            <span>Built with React + Spring Boot + MySQL (Zero Bootstrap)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;