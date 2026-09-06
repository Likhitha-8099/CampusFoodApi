import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Core Resume CRUD
export const createResume = async (resumeData) => {
  const response = await axios.post(`${API_BASE_URL}/api/resumes`, resumeData);
  return response.data;
};

export const getAllResumes = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/resumes`);
  return response.data;
};

export const getResumeById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/resumes/${id}`);
  return response.data;
};

export const updateResume = async (id, resumeData) => {
  const response = await axios.put(`${API_BASE_URL}/api/resumes/${id}`, resumeData);
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/resumes/${id}`);
  return response.data;
};

// AI Features
export const generateAiSummary = async (resumeId) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/resumes/${resumeId}/generate-summary`
  );
  return response.data;
};

export const analyzeResumeAts = async (resumeId) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/resumes/${resumeId}/analyze`
  );
  return response.data;
};

export const getLatestResumeAnalysis = async (resumeId) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/resumes/${resumeId}/analysis`
  );
  return response.data;
};

export const matchJobDescription = async (resumeId, jobDescription) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/resumes/${resumeId}/job-match`,
    { jobDescription }
  );
  return response.data;
};

export const getJobMatches = async (resumeId) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/resumes/${resumeId}/job-matches`
  );
  return response.data;
};

// Direct Upload AI Job Fit Analyzer
export const analyzeJobFitUpload = async (formData) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/job-fit/analyze`,
    formData,
    {
      // 45s is sufficient — Gemini 2.5 Flash with thinking disabled responds in 2-15s.
      // Backend RestTemplate read timeout is 30s. If backend returns error, it is fast.
      timeout: 45000,
    }
  );
  return response.data;
};