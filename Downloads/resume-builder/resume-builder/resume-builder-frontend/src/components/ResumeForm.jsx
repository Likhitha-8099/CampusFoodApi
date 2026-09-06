import { useState } from "react";
import { createResume, updateResume, generateAiSummary } from "../api/resumeApi";

function ResumeForm({
  formData,
  setFormData,
  onResumeSaved,
  onResetForm,
  onNavigateToAts,
  onNavigateToJobMatch,
}) {
  const [loading, setLoading] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isEditing = Boolean(formData.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenerateSummary = async () => {
    setError("");
    setSuccessMsg("");
    setAiSummaryLoading(true);

    try {
      if (formData.id) {
        const updated = await generateAiSummary(formData.id);
        setFormData(updated);
        setSuccessMsg("AI Summary generated and saved!");
      } else {
        // Save first or generate summary prompt
        const savedResume = await createResume(formData);
        const withSummary = await generateAiSummary(savedResume.id);
        setFormData(withSummary);
        onResumeSaved(withSummary);
        setSuccessMsg("Resume created and AI Summary generated!");
      }
    } catch (err) {
      console.error("AI Summary error:", err);
      setError("AI Summary generation failed. Please verify required fields & backend connection.");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      let savedResume;
      if (isEditing) {
        savedResume = await updateResume(formData.id, formData);
        setSuccessMsg("Resume updated successfully!");
      } else {
        savedResume = await createResume(formData);
        setSuccessMsg("Resume created and saved successfully!");
      }
      onResumeSaved(savedResume);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save resume. Please ensure all required fields are populated."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <div className="form-header">
        <div>
          <h2>{isEditing ? `Edit Resume #${formData.id}` : "Resume Editor"}</h2>
          <p className="section-subtitle">
            {isEditing
              ? `Editing candidate profile: ${formData.fullName || "Untitled"}`
              : "Fill in your technical credentials to render the live ATS preview"}
          </p>
        </div>

        <div className="form-header-btn-group">
          {isEditing && (
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={onResetForm}
              title="Start creating a brand new resume"
            >
              + New Resume
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="resume-form">
        {/* Section 1: Contact Information */}
        <fieldset className="form-group">
          <legend>01 / Contact Information</legend>
          <div className="form-row">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName || ""}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="phone"
              placeholder="10-digit Phone Number *"
              value={formData.phone || ""}
              onChange={handleChange}
              required
              maxLength={10}
            />
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn URL (e.g., https://linkedin.com/in/...)"
              value={formData.linkedin || ""}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="github"
            placeholder="GitHub URL (e.g., https://github.com/...)"
            value={formData.github || ""}
            onChange={handleChange}
          />
        </fieldset>

        {/* Section 2: Professional Summary */}
        <fieldset className="form-group">
          <div className="fieldset-header-row">
            <legend>02 / Professional Summary *</legend>
            <button
              type="button"
              className="btn btn-sm btn-ai-inline"
              onClick={handleGenerateSummary}
              disabled={aiSummaryLoading || !formData.fullName}
              title="Generate a 3-line summary using Gemini AI"
            >
              {aiSummaryLoading ? "✨ Generating..." : "✨ AI Generate Summary"}
            </button>
          </div>
          <textarea
            name="summary"
            placeholder="3-4 lines highlighting your core skills, experience, and key technical achievements..."
            value={formData.summary || ""}
            onChange={handleChange}
            required
            rows={3}
          />
        </fieldset>

        {/* Section 3: Technical Skills */}
        <fieldset className="form-group">
          <legend>03 / Technical Skills & Competencies</legend>
          <textarea
            name="skills"
            placeholder="Core Technical Skills (e.g., Java, Spring Boot, React, MySQL, REST APIs) *"
            value={formData.skills || ""}
            onChange={handleChange}
            required
            rows={2}
          />

          <div className="form-row">
            <input
              type="text"
              name="technologies"
              placeholder="Tools & DevOps (e.g., Git, Docker, Postman, Maven, Linux)"
              value={formData.technologies || ""}
              onChange={handleChange}
            />
            <input
              type="text"
              name="libraries"
              placeholder="Libraries & Frameworks (e.g., Hibernate, Axios, Lombok, JUnit)"
              value={formData.libraries || ""}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="softSkills"
            placeholder="Soft Skills (e.g., Problem Solving, Agile Collaboration, System Design)"
            value={formData.softSkills || ""}
            onChange={handleChange}
          />
        </fieldset>

        {/* Section 4: Education */}
        <fieldset className="form-group">
          <legend>04 / Education</legend>
          <input
            type="text"
            name="educationInstitution"
            placeholder="Institution / University Name (e.g., JNTU Hyderabad)"
            value={formData.educationInstitution || ""}
            onChange={handleChange}
          />
          <textarea
            name="education"
            placeholder="Degree & Graduation (e.g., B.Tech in Computer Science and Engineering | CGPA: 8.5 | 2021 - 2025)"
            value={formData.education || ""}
            onChange={handleChange}
            rows={2}
          />
        </fieldset>

        {/* Section 5: Experience */}
        <fieldset className="form-group">
          <legend>05 / Work & Internship Experience</legend>
          <textarea
            name="experience"
            placeholder="Use bullet points starting with • for optimal ATS indexing&#10;• Software Engineer Intern at ABC Tech (May 2024 - Aug 2024)&#10;• Engineered 8+ Spring Boot RESTful microservices, reducing query latency by 25%&#10;• Integrated MySQL database with JPA repositories and validated data via Jakarta Validation..."
            value={formData.experience || ""}
            onChange={handleChange}
            rows={4}
          />
        </fieldset>

        {/* Section 6: Key Projects */}
        <fieldset className="form-group">
          <legend>06 / Technical Projects</legend>
          <textarea
            name="projects"
            placeholder="• AI Resume Intelligence Suite: Full-stack React + Spring Boot application with transparent ATS scoring and job description matching&#10;• Blood Bridge Platform: Real-time emergency donor management system using Java, Spring Security, and MySQL..."
            value={formData.projects || ""}
            onChange={handleChange}
            rows={4}
          />
        </fieldset>

        {/* Section 7: Certifications */}
        <fieldset className="form-group">
          <legend>07 / Certifications & Achievements</legend>
          <textarea
            name="certifications"
            placeholder="• Oracle Certified Professional: Java SE 17 Developer&#10;• AWS Certified Cloud Practitioner"
            value={formData.certifications || ""}
            onChange={handleChange}
            rows={2}
          />
        </fieldset>

        {/* Form Submit & AI Action Bar */}
        <div className="form-submit-row">
          <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
            {loading
              ? isEditing
                ? "Updating Resume..."
                : "Saving Resume..."
              : isEditing
              ? "Update Resume"
              : "Save Resume"}
          </button>

          {isEditing && onNavigateToAts && (
            <button
              type="button"
              className="btn btn-ats-form"
              onClick={() => onNavigateToAts(formData)}
            >
              🎯 ATS Audit →
            </button>
          )}

          {isEditing && onNavigateToJobMatch && (
            <button
              type="button"
              className="btn btn-match-form"
              onClick={() => onNavigateToJobMatch(formData)}
            >
              💼 Match Job →
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default ResumeForm;