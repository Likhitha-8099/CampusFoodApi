import React, { useState, useRef } from "react";
import { analyzeJobFitUpload } from "../api/resumeApi";

function JobFitAnalyzer({ onNavigate, onSelectResumeForJobMatch }) {
  // Resume File State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeDragOver, setResumeDragOver] = useState(false);

  // Job Description State
  const [jdMode, setJdMode] = useState("paste"); // "paste" | "upload"
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [jdDragOver, setJdDragOver] = useState(false);

  // Analysis State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // File Inputs Refs
  const resumeInputRef = useRef(null);
  const jdInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Supported Extensions
  const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".txt"];
  const MAX_FILE_SIZE_MB = 10;

  const validateFile = (file) => {
    if (!file) return "No file selected.";
    const name = file.name.toLowerCase();
    const isValidExt = SUPPORTED_EXTENSIONS.some((ext) => name.endsWith(ext));
    if (!isValidExt) {
      return "Unsupported file type. Please upload PDF, DOCX, or TXT.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File exceeds ${MAX_FILE_SIZE_MB}MB size limit.`;
    }
    return null;
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getFileBadgeType = (fileName) => {
    if (!fileName) return "FILE";
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".pdf")) return "PDF";
    if (lower.endsWith(".docx")) return "DOCX";
    if (lower.endsWith(".txt")) return "TXT";
    return "DOC";
  };

  const handleResumeFileSelect = (file) => {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setResumeFile(file);
  };

  const handleJdFileSelect = (file) => {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setJdFile(file);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  const handleRemoveJdFile = () => {
    setJdFile(null);
    if (jdInputRef.current) jdInputRef.current.value = "";
  };

  const hasValidJd =
    (jdMode === "paste" && jdText.trim().length >= 20) ||
    (jdMode === "upload" && jdFile !== null);

  const isFormReady = resumeFile !== null && hasValidJd && !loading;

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!resumeFile) {
      setError("Please upload your resume (PDF, DOCX, or TXT).");
      return;
    }
    if (!hasValidJd) {
      setError("Please upload or paste a detailed Job Description.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resumeFile", resumeFile);

    if (jdMode === "upload" && jdFile) {
      formData.append("jobDescriptionFile", jdFile);
    } else if (jdText.trim()) {
      formData.append("jobDescriptionText", jdText.trim());
    }

    try {
      const data = await analyzeJobFitUpload(formData);
      setResult(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error("Job Fit Analysis error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to analyze the resume right now. Please check backend connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const getScoreVerdict = (score) => {
    if (score >= 80) return { title: "Strong Match", color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)" };
    if (score >= 60) return { title: "Moderate Match", color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)" };
    return { title: "Growth Potential", color: "var(--error)", bg: "var(--error-bg)", border: "var(--error-border)" };
  };

  return (
    <div className="job-fit-analyzer-wrapper">
      {/* Header Banner */}
      <div className="analyzer-header-box">
        <div className="analyzer-header-content">
          <div className="analyzer-title-row">
            <span className="analyzer-icon">🎯</span>
            <div>
              <h2 className="analyzer-title">AI Job Fit Analyzer</h2>
              <p className="analyzer-subtitle">
                Upload your resume and compare it against any target job description. Get transparent weighted scoring, semantic requirement matching, and truthful recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Input Grid */}
      <div className="analyzer-inputs-grid">
        {/* INPUT 1: RESUME UPLOAD */}
        <div className="card-box input-column-card">
          <div className="column-header">
            <div className="column-step-badge">1</div>
            <div>
              <h3 className="column-title">Upload Your Resume</h3>
              <p className="column-desc">Supports PDF, DOCX, or TXT (Max 10MB)</p>
            </div>
          </div>

          {!resumeFile ? (
            <div
              className={`dropzone-area ${resumeDragOver ? "dropzone-dragover" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setResumeDragOver(true);
              }}
              onDragLeave={() => setResumeDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setResumeDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                  handleResumeFileSelect(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => resumeInputRef.current?.click()}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleResumeFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div className="dropzone-icon">📄</div>
              <p className="dropzone-primary-text">
                <strong>Click to browse</strong> or drag & drop resume here
              </p>
              <span className="dropzone-hint">PDF, DOCX, TXT up to 10MB</span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: "12px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  resumeInputRef.current?.click();
                }}
              >
                Choose Resume
              </button>
            </div>
          ) : (
            <div className="uploaded-file-card">
              <div className="uploaded-file-main">
                <span className="uploaded-file-icon">📄</span>
                <div className="uploaded-file-info">
                  <div className="uploaded-file-title" title={resumeFile.name}>
                    {resumeFile.name}
                  </div>
                  <div className="uploaded-file-meta">
                    <span className="file-badge">
                      {getFileBadgeType(resumeFile.name)}
                    </span>
                    <span className="file-size">
                      {formatFileSize(resumeFile.size)}
                    </span>
                    <span className="file-ready-tag">✓ Ready for extraction</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-remove-file"
                onClick={handleRemoveResume}
                title="Remove resume"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* INPUT 2: JOB DESCRIPTION */}
        <div className="card-box input-column-card">
          <div className="column-header flex-between">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="column-step-badge">2</div>
              <div>
                <h3 className="column-title">Target Job Description</h3>
                <p className="column-desc">Paste text or upload posting file</p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="jd-mode-tabs">
              <button
                type="button"
                className={`jd-mode-tab ${jdMode === "paste" ? "active" : ""}`}
                onClick={() => setJdMode("paste")}
              >
                ✏️ Paste Text
              </button>
              <button
                type="button"
                className={`jd-mode-tab ${jdMode === "upload" ? "active" : ""}`}
                onClick={() => setJdMode("upload")}
              >
                📁 Upload File
              </button>
            </div>
          </div>

          {jdMode === "paste" ? (
            <div className="jd-paste-container">
              <textarea
                className="jd-textarea-input"
                placeholder="Paste the target job description (responsibilities, required skills, tools, and qualifications) here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={7}
              />
              <div className="jd-char-footer">
                <span>
                  {jdText.trim().length < 20 && jdText.length > 0 ? (
                    <span style={{ color: "var(--warning)" }}>
                      ⚠️ Minimum 20 characters recommended
                    </span>
                  ) : (
                    <span>Provide full qualifications for best accuracy</span>
                  )}
                </span>
                <span className="jd-counter">{jdText.length.toLocaleString()} chars</span>
              </div>
            </div>
          ) : (
            <div className="jd-upload-container">
              {!jdFile ? (
                <div
                  className={`dropzone-area ${jdDragOver ? "dropzone-dragover" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setJdDragOver(true);
                  }}
                  onDragLeave={() => setJdDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setJdDragOver(false);
                    if (e.dataTransfer.files?.[0]) {
                      handleJdFileSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => jdInputRef.current?.click()}
                >
                  <input
                    ref={jdInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleJdFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="dropzone-icon">💼</div>
                  <p className="dropzone-primary-text">
                    <strong>Click to upload</strong> Job Description file
                  </p>
                  <span className="dropzone-hint">PDF, DOCX, TXT up to 10MB</span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "12px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      jdInputRef.current?.click();
                    }}
                  >
                    Upload JD
                  </button>
                </div>
              ) : (
                <div className="uploaded-file-card">
                  <div className="uploaded-file-main">
                    <span className="uploaded-file-icon">💼</span>
                    <div className="uploaded-file-info">
                      <div className="uploaded-file-title" title={jdFile.name}>
                        {jdFile.name}
                      </div>
                      <div className="uploaded-file-meta">
                        <span className="file-badge">
                          {getFileBadgeType(jdFile.name)}
                        </span>
                        <span className="file-size">
                          {formatFileSize(jdFile.size)}
                        </span>
                        <span className="file-ready-tag">✓ Ready for extraction</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={handleRemoveJdFile}
                    title="Remove JD file"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="analyzer-error-banner">
          <span className="error-icon">⚠️</span>
          <div className="error-text">{error}</div>
        </div>
      )}

      {/* Action Control Bar */}
      <div className="analyzer-action-bar">
        <button
          type="button"
          className="btn btn-primary btn-lg analyze-submit-btn"
          disabled={!isFormReady}
          onClick={handleAnalyze}
        >
          {loading ? (
            <>
              <span className="spinner-inline" />
              <span>Analyzing Resume & Requirements...</span>
            </>
          ) : (
            <>
              <span>⚡ Analyze Job Fit</span>
            </>
          )}
        </button>
      </div>

      {/* RESULTS SECTION */}
      {result && (
        <div ref={resultsRef} className="job-fit-results-section">
          {/* Header */}
          <div className="results-header-banner">
            <div>
              <span className="results-tag">Analysis Report</span>
              <h2 className="results-title">AI Job Fit Result</h2>
              <p className="results-subtitle">
                Comprehensive evaluation comparing candidate credentials with role requirements.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleReset}
            >
              🔄 Clear Results
            </button>
          </div>

          {/* Primary Score Banner */}
          {(() => {
            const verdict = getScoreVerdict(result.matchScore);
            return (
              <div
                className="score-overview-card"
                style={{ borderColor: verdict.border, background: verdict.bg }}
              >
                <div className="score-gauge-box">
                  <div className="score-big-number" style={{ color: verdict.color }}>
                    {result.matchScore}
                    <span className="score-denom">/ 100</span>
                  </div>
                  <div className="score-verdict-tag" style={{ color: verdict.color }}>
                    {verdict.title}
                  </div>
                  <span className="score-type-label">AI Job Fit Score</span>
                </div>

                <div className="score-summary-box">
                  <h4 className="summary-heading">Executive Fit Summary</h4>
                  <p className="summary-text">{result.matchSummary}</p>
                </div>
              </div>
            );
          })()}

          {/* Transparent Score Breakdown */}
          {result.scoreBreakdown && (
            <div className="card-box breakdown-card">
              <h3 className="section-title">
                <span>📊</span> Score Breakdown & Formula
              </h3>
              <p className="section-desc">
                Explainable scoring model based on transparent weights. The AI extracts requirements, and the backend calculates exact contributions.
              </p>

              <div className="breakdown-metrics-grid">
                <div className="breakdown-metric-pill">
                  <div className="metric-pill-header">
                    <span className="pill-name">Skills Match</span>
                    <span className="pill-weight">40% Weight</span>
                  </div>
                  <div className="pill-value">{result.scoreBreakdown.skillsScore}%</div>
                  <div className="metric-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${result.scoreBreakdown.skillsScore}%` }}
                    />
                  </div>
                </div>

                <div className="breakdown-metric-pill">
                  <div className="metric-pill-header">
                    <span className="pill-name">Keyword Match</span>
                    <span className="pill-weight">25% Weight</span>
                  </div>
                  <div className="pill-value">{result.scoreBreakdown.keywordScore}%</div>
                  <div className="metric-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${result.scoreBreakdown.keywordScore}%` }}
                    />
                  </div>
                </div>

                <div className="breakdown-metric-pill">
                  <div className="metric-pill-header">
                    <span className="pill-name">Experience Match</span>
                    <span className="pill-weight">15% Weight</span>
                  </div>
                  <div className="pill-value">{result.scoreBreakdown.experienceScore}%</div>
                  <div className="metric-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${result.scoreBreakdown.experienceScore}%` }}
                    />
                  </div>
                </div>

                <div className="breakdown-metric-pill">
                  <div className="metric-pill-header">
                    <span className="pill-name">Education Match</span>
                    <span className="pill-weight">10% Weight</span>
                  </div>
                  <div className="pill-value">{result.scoreBreakdown.educationScore}%</div>
                  <div className="metric-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${result.scoreBreakdown.educationScore}%` }}
                    />
                  </div>
                </div>

                <div className="breakdown-metric-pill">
                  <div className="metric-pill-header">
                    <span className="pill-name">Project Relevance</span>
                    <span className="pill-weight">10% Weight</span>
                  </div>
                  <div className="pill-value">{result.scoreBreakdown.projectScore}%</div>
                  <div className="metric-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${result.scoreBreakdown.projectScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {result.scoreBreakdown.calculationExplanation && (
                <div className="formula-explanation-box">
                  <div className="formula-title">Mathematical Calculation:</div>
                  <code>{result.scoreBreakdown.calculationExplanation}</code>
                </div>
              )}
            </div>
          )}

          {/* Matched, Partial, and Missing Requirements Grid */}
          <div className="requirements-classification-grid">
            {/* Matched Skills */}
            <div className="card-box req-card matched-card">
              <div className="req-card-header">
                <span className="req-badge-icon icon-success">✓</span>
                <div>
                  <h4 className="req-card-title">
                    Matched Skills ({result.matchedSkills?.length || 0})
                  </h4>
                  <span className="req-card-sub">Exact & semantic requirement matches</span>
                </div>
              </div>
              <div className="req-tags-container">
                {result.matchedSkills && result.matchedSkills.length > 0 ? (
                  result.matchedSkills.map((sk, idx) => (
                    <span key={idx} className="match-tag tag-matched">
                      ✓ {sk}
                    </span>
                  ))
                ) : (
                  <p className="empty-tag-note">No direct skill matches detected.</p>
                )}
              </div>
            </div>

            {/* Partial Matches */}
            <div className="card-box req-card partial-card">
              <div className="req-card-header">
                <span className="req-badge-icon icon-warning">◐</span>
                <div>
                  <h4 className="req-card-title">
                    Partial Matches ({result.partialMatches?.length || 0})
                  </h4>
                  <span className="req-card-sub">Foundational or related familiarity</span>
                </div>
              </div>
              <div className="req-tags-container">
                {result.partialMatches && result.partialMatches.length > 0 ? (
                  result.partialMatches.map((pm, idx) => (
                    <span key={idx} className="match-tag tag-partial">
                      ◐ {pm}
                    </span>
                  ))
                ) : (
                  <p className="empty-tag-note">No partial match ambiguities detected.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="card-box req-card missing-card">
              <div className="req-card-header">
                <span className="req-badge-icon icon-error">✕</span>
                <div>
                  <h4 className="req-card-title">
                    Missing Skills ({result.missingSkills?.length || 0})
                  </h4>
                  <span className="req-card-sub">Required in JD but absent in resume</span>
                </div>
              </div>
              <div className="req-tags-container">
                {result.missingSkills && result.missingSkills.length > 0 ? (
                  result.missingSkills.map((ms, idx) => (
                    <span key={idx} className="match-tag tag-missing">
                      ✕ {ms}
                    </span>
                  ))
                ) : (
                  <p className="empty-tag-note">All key requirements identified.</p>
                )}
              </div>
              <p className="missing-advisory-note">
                💡 <em>These requirements were found in the job description but not clearly found in the resume. Add them only if you have genuine experience.</em>
              </p>
            </div>
          </div>

          {/* Strengths & AI Recommendations Grid */}
          <div className="insights-two-col-grid">
            {/* Why Your Resume Fits */}
            <div className="card-box insight-card">
              <h3 className="insight-title">
                <span>🌟</span> Why Your Resume Fits
              </h3>
              <p className="insight-sub">Key candidate assets for this position</p>
              <ul className="insight-list">
                {result.resumeStrengths && result.resumeStrengths.length > 0 ? (
                  result.resumeStrengths.map((str, idx) => (
                    <li key={idx} className="insight-item">
                      <span className="bullet-check">✓</span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="insight-item">Solid technical baseline demonstrated.</li>
                )}
              </ul>
            </div>

            {/* AI Recommendations */}
            <div className="card-box insight-card">
              <h3 className="insight-title">
                <span>💡</span> AI Recommendations
              </h3>
              <p className="insight-sub">Truthful tailoring and enhancement advice</p>
              <ol className="recommendation-numbered-list">
                {result.recommendations && result.recommendations.length > 0 ? (
                  result.recommendations.map((rec, idx) => (
                    <li key={idx} className="rec-numbered-item">
                      <span className="rec-num">{idx + 1}</span>
                      <span>{rec}</span>
                    </li>
                  ))
                ) : (
                  <li className="rec-numbered-item">
                    <span className="rec-num">1</span>
                    <span>Align technical keywords with the job posting where truthful.</span>
                  </li>
                )}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobFitAnalyzer;
