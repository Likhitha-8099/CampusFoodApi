import React from "react";

function JobDescriptionInput({
  value = "",
  onChange,
  onSubmit,
  loading = false,
  maxLength = 10000,
  placeholder = "Paste target job description, responsibilities, and required qualifications here...",
  buttonText = "Analyze Job Match",
  disabled = false,
}) {
  const charCount = value.length;
  const isTooLong = charCount > maxLength;
  const isEmpty = !value.trim();

  const handleTextChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEmpty || isTooLong || loading || disabled) return;
    if (onSubmit) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="job-description-input-wrapper">
      <form onSubmit={handleSubmit} className="jd-input-form">
        <div className="jd-label-bar">
          <label htmlFor="jd-main-textarea" className="jd-input-label">
            <strong>Job Description Requirements</strong>
          </label>
          <div className="jd-char-indicator">
            <span
              className={`char-counter-badge ${
                isTooLong ? "char-error" : charCount > maxLength * 0.85 ? "char-warning" : ""
              }`}
            >
              {charCount.toLocaleString()} / {maxLength.toLocaleString()} characters
            </span>
          </div>
        </div>

        <div className="jd-textarea-container">
          <textarea
            id="jd-main-textarea"
            className="jd-main-textarea"
            placeholder={placeholder}
            value={value}
            onChange={handleTextChange}
            rows={7}
            disabled={loading || disabled}
          />
        </div>

        <div className="jd-input-footer">
          <div className="jd-footer-helper">
            <span className="helper-shield-icon">🛡️</span>
            <span className="helper-text-note">
              Skills & requirements will be compared strictly against the selected candidate profile.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-match-submit"
            disabled={isEmpty || isTooLong || loading || disabled}
          >
            {loading ? (
              <>
                <span className="spinner-inline" />
                <span>Comparing with Job...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>{buttonText}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobDescriptionInput;
