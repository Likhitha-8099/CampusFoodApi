import DownloadButtons from "./DownloadButton";

function formatLines(text) {
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function ResumePreview({
  resume = {},
  selectedTemplate = "classic",
  onTemplateChange,
  onNavigateToAts,
  onNavigateToJobMatch,
}) {
  const educationLines = formatLines(resume.education);
  const experienceLines = formatLines(resume.experience);
  const projectLines = formatLines(resume.projects);
  const skillLines = formatLines(resume.skills);

  const templates = [
    { id: "classic", label: "Classic ATS", desc: "Traditional serif format" },
    { id: "modern", label: "Modern Split", desc: "Contemporary 2-column sidebar" },
    { id: "minimal", label: "Minimalist", desc: "Clean geometric high-contrast" },
  ];

  return (
    <section className="preview-section">
      <div className="preview-top">
        <div className="preview-header-info">
          <h2>Live Resume Preview</h2>
          <p className="section-subtitle">
            Real-time ATS rendering • Switch templates instantly with zero loss of content
          </p>
        </div>

        <div className="preview-actions">
          <div className="template-selector" role="group" aria-label="Resume Templates">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                className={`template-btn ${selectedTemplate === tpl.id ? "active" : ""}`}
                onClick={() => onTemplateChange && onTemplateChange(tpl.id)}
                title={tpl.desc}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          <div className="preview-cta-group">
            {resume?.id && onNavigateToAts && (
              <button
                type="button"
                className="btn btn-ats"
                onClick={() => onNavigateToAts(resume)}
                title="Run AI ATS Analysis on this resume"
              >
                🎯 ATS Audit
              </button>
            )}
            {resume?.id && onNavigateToJobMatch && (
              <button
                type="button"
                className="btn btn-match"
                onClick={() => onNavigateToJobMatch(resume)}
                title="Match against Job Description"
              >
                💼 Job Match
              </button>
            )}
            <DownloadButtons resume={resume} />
          </div>
        </div>
      </div>

      <div
        className={`resume-paper template-${selectedTemplate}`}
        id="resume-preview-download"
      >
        {selectedTemplate === "modern" ? (
          <ModernTemplate
            resume={resume}
            educationLines={educationLines}
            experienceLines={experienceLines}
            projectLines={projectLines}
          />
        ) : selectedTemplate === "minimal" ? (
          <MinimalTemplate
            resume={resume}
            educationLines={educationLines}
            experienceLines={experienceLines}
            projectLines={projectLines}
            skillLines={skillLines}
          />
        ) : (
          <ClassicTemplate
            resume={resume}
            educationLines={educationLines}
            experienceLines={experienceLines}
            projectLines={projectLines}
            skillLines={skillLines}
          />
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   1. CLASSIC TEMPLATE (Traditional, Academic, Single-Column ATS Standard)
   ========================================================================== */
function ClassicTemplate({
  resume,
  educationLines,
  experienceLines,
  projectLines,
}) {
  return (
    <div className="classic-layout">
      <div className="resume-main-header">
        <h1>{resume.fullName || "Your Full Name"}</h1>

        <p className="contact-line">
          {resume.phone || "+91-XXXXXXXXXX"} | {resume.email || "email@example.com"}
        </p>

        <p className="contact-line">
          {resume.linkedin ? (
            <a href={resume.linkedin} target="_blank" rel="noreferrer">
              {resume.linkedin}
            </a>
          ) : (
            "linkedin.com/in/yourprofile"
          )}
          {resume.github && (
            <span>
              {" "}
              |{" "}
              <a href={resume.github} target="_blank" rel="noreferrer">
                {resume.github}
              </a>
            </span>
          )}
        </p>
      </div>

      {resume.summary && (
        <ResumeSection title="Professional Summary">
          <p className="summary-text">{resume.summary}</p>
        </ResumeSection>
      )}

      {(educationLines.length > 0 || resume.educationInstitution) && (
        <ResumeSection title="Education">
          {resume.educationInstitution && (
            <p className="institution-line">
              <strong>{resume.educationInstitution}</strong>
            </p>
          )}
          {educationLines.length > 0 ? (
            educationLines.map((line, index) => (
              <p key={index} className="resume-line">
                {line}
              </p>
            ))
          ) : (
            <p className="muted-text">Add education details.</p>
          )}
        </ResumeSection>
      )}

      {(resume.skills ||
        resume.technologies ||
        resume.libraries ||
        resume.softSkills) && (
        <ResumeSection title="Technical & Professional Skills">
          {resume.skills && (
            <p>
              <strong>Core Skills:</strong> {resume.skills}
            </p>
          )}
          {resume.technologies && (
            <p>
              <strong>Technologies & Tools:</strong> {resume.technologies}
            </p>
          )}
          {resume.libraries && (
            <p>
              <strong>Libraries & Frameworks:</strong> {resume.libraries}
            </p>
          )}
          {resume.softSkills && (
            <p>
              <strong>Soft Skills:</strong> {resume.softSkills}
            </p>
          )}
        </ResumeSection>
      )}

      {experienceLines.length > 0 && (
        <ResumeSection title="Work & Internship Experience">
          {experienceLines.map((line, index) => (
            <p
              key={index}
              className={line.startsWith("•") ? "bullet-line" : "resume-line"}
            >
              {line}
            </p>
          ))}
        </ResumeSection>
      )}

      {projectLines.length > 0 && (
        <ResumeSection title="Key Technical Projects">
          {projectLines.map((line, index) => (
            <p
              key={index}
              className={line.startsWith("•") ? "bullet-line" : "resume-line"}
            >
              {line}
            </p>
          ))}
        </ResumeSection>
      )}

      {resume.certifications && (
        <ResumeSection title="Certifications & Achievements">
          {formatLines(resume.certifications).map((line, index) => (
            <p key={index} className="resume-line">
              {line}
            </p>
          ))}
        </ResumeSection>
      )}
    </div>
  );
}

/* ==========================================================================
   2. MODERN TEMPLATE (2-Column Accent Sidebar)
   ========================================================================== */
function ModernTemplate({
  resume,
  educationLines,
  experienceLines,
  projectLines,
}) {
  return (
    <div className="modern-layout">
      <header className="modern-header">
        <div className="modern-header-content">
          <h1>{resume.fullName || "Your Full Name"}</h1>
          <p className="modern-title-sub">
            {resume.skills ? resume.skills.split(",")[0] : "Software Engineer"}
          </p>
        </div>
      </header>

      <div className="modern-body">
        {/* Left Sidebar */}
        <aside className="modern-sidebar">
          <div className="modern-side-block">
            <h4>Contact</h4>
            <p className="side-text">{resume.phone || "+91-XXXXXXXXXX"}</p>
            <p className="side-text">{resume.email || "email@example.com"}</p>
            {resume.linkedin && <p className="side-text">{resume.linkedin}</p>}
            {resume.github && <p className="side-text">{resume.github}</p>}
          </div>

          {(resume.skills ||
            resume.technologies ||
            resume.libraries ||
            resume.softSkills) && (
            <div className="modern-side-block">
              <h4>Skills</h4>
              {resume.skills && (
                <div className="skill-group">
                  <span className="skill-label">Core:</span>
                  <p className="side-text">{resume.skills}</p>
                </div>
              )}
              {resume.technologies && (
                <div className="skill-group">
                  <span className="skill-label">Technologies:</span>
                  <p className="side-text">{resume.technologies}</p>
                </div>
              )}
              {resume.libraries && (
                <div className="skill-group">
                  <span className="skill-label">Libraries:</span>
                  <p className="side-text">{resume.libraries}</p>
                </div>
              )}
              {resume.softSkills && (
                <div className="skill-group">
                  <span className="skill-label">Soft Skills:</span>
                  <p className="side-text">{resume.softSkills}</p>
                </div>
              )}
            </div>
          )}

          {resume.certifications && (
            <div className="modern-side-block">
              <h4>Certifications</h4>
              {formatLines(resume.certifications).map((line, idx) => (
                <p key={idx} className="side-text">
                  {line}
                </p>
              ))}
            </div>
          )}
        </aside>

        {/* Right Main Column */}
        <main className="modern-main">
          {resume.summary && (
            <div className="modern-section">
              <h3>Profile Summary</h3>
              <p className="summary-text">{resume.summary}</p>
            </div>
          )}

          {experienceLines.length > 0 && (
            <div className="modern-section">
              <h3>Experience</h3>
              {experienceLines.map((line, idx) => (
                <p
                  key={idx}
                  className={line.startsWith("•") ? "bullet-line" : "resume-line"}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          {projectLines.length > 0 && (
            <div className="modern-section">
              <h3>Projects</h3>
              {projectLines.map((line, idx) => (
                <p
                  key={idx}
                  className={line.startsWith("•") ? "bullet-line" : "resume-line"}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          {(educationLines.length > 0 || resume.educationInstitution) && (
            <div className="modern-section">
              <h3>Education</h3>
              {resume.educationInstitution && (
                <p className="institution-line">
                  <strong>{resume.educationInstitution}</strong>
                </p>
              )}
              {educationLines.map((line, idx) => (
                <p key={idx} className="resume-line">
                  {line}
                </p>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. MINIMAL TEMPLATE (Geometric, High-Contrast Monospace Accents)
   ========================================================================== */
function MinimalTemplate({
  resume,
  educationLines,
  experienceLines,
  projectLines,
  skillLines,
}) {
  return (
    <div className="minimal-layout">
      <div className="minimal-header">
        <h1 className="minimal-name">{resume.fullName || "Your Full Name"}</h1>
        <div className="minimal-contact">
          <span>{resume.email || "email@example.com"}</span>
          <span>•</span>
          <span>{resume.phone || "+91-XXXXXXXXXX"}</span>
          {resume.linkedin && (
            <>
              <span>•</span>
              <span>{resume.linkedin}</span>
            </>
          )}
          {resume.github && (
            <>
              <span>•</span>
              <span>{resume.github}</span>
            </>
          )}
        </div>
      </div>

      {resume.summary && (
        <div className="minimal-block">
          <h3 className="minimal-title">01 / SUMMARY</h3>
          <p className="summary-text">{resume.summary}</p>
        </div>
      )}

      {(resume.skills ||
        resume.technologies ||
        resume.libraries ||
        resume.softSkills) && (
        <div className="minimal-block">
          <h3 className="minimal-title">02 / TECHNICAL COMPETENCIES</h3>
          <div className="minimal-skills-grid">
            {resume.skills && (
              <div>
                <strong>Core Skills:</strong> {resume.skills}
              </div>
            )}
            {resume.technologies && (
              <div>
                <strong>Technologies:</strong> {resume.technologies}
              </div>
            )}
            {resume.libraries && (
              <div>
                <strong>Frameworks:</strong> {resume.libraries}
              </div>
            )}
            {resume.softSkills && (
              <div>
                <strong>Soft Skills:</strong> {resume.softSkills}
              </div>
            )}
          </div>
        </div>
      )}

      {experienceLines.length > 0 && (
        <div className="minimal-block">
          <h3 className="minimal-title">03 / EXPERIENCE</h3>
          {experienceLines.map((line, idx) => (
            <p
              key={idx}
              className={line.startsWith("•") ? "bullet-line" : "resume-line"}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {projectLines.length > 0 && (
        <div className="minimal-block">
          <h3 className="minimal-title">04 / PROJECTS</h3>
          {projectLines.map((line, idx) => (
            <p
              key={idx}
              className={line.startsWith("•") ? "bullet-line" : "resume-line"}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {(educationLines.length > 0 || resume.educationInstitution) && (
        <div className="minimal-block">
          <h3 className="minimal-title">05 / EDUCATION</h3>
          {resume.educationInstitution && (
            <p className="institution-line">
              <strong>{resume.educationInstitution}</strong>
            </p>
          )}
          {educationLines.map((line, idx) => (
            <p key={idx} className="resume-line">
              {line}
            </p>
          ))}
        </div>
      )}

      {resume.certifications && (
        <div className="minimal-block">
          <h3 className="minimal-title">06 / CERTIFICATIONS</h3>
          {formatLines(resume.certifications).map((line, idx) => (
            <p key={idx} className="resume-line">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function ResumeSection({ title, children }) {
  return (
    <div className="resume-block">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default ResumePreview;