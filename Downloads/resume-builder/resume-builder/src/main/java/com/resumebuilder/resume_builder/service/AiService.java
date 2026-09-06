package com.resumebuilder.resume_builder.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.resume_builder.dto.AiSummaryRequest;
import com.resumebuilder.resume_builder.dto.AiSummaryResponse;
import com.resumebuilder.resume_builder.dto.AtsAnalysisResponse;
import com.resumebuilder.resume_builder.dto.JobMatchResponse;
import com.resumebuilder.resume_builder.dto.ScoreBreakdownDto;
import com.resumebuilder.resume_builder.model.Resume;

/**
 * AiService — Groq (llama-3.3-70b-versatile) integration.
 *
 * Uses the OpenAI-compatible Groq chat completions endpoint:
 *   POST https://api.groq.com/openai/v1/chat/completions
 *
 * The HTTP client (RestTemplate)
 * is reused from AppConfig — no additional libraries needed.
 */
@Service
public class AiService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.api.model}")
    private String groqModel;

    // Max characters per section — keeps prompts compact and fast
    private static final int MAX_RESUME_CHARS = 6000;
    private static final int MAX_JD_CHARS     = 3000;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        boolean configured = groqApiKey != null && !groqApiKey.isBlank();
        System.out.println("[AI] Groq API key configured: " + (configured ? "YES" : "NO"));
    }

    // =========================================================================
    // MODULE 1 — Resume Summary
    // =========================================================================

    /**
     * Generates a 3-line professional resume summary via Groq.
     */
    public AiSummaryResponse generateSummary(AiSummaryRequest request) {
        try {
            String userPrompt = buildSummaryPrompt(request);
            String summary = executeGroqPrompt(
                    "You are a professional resume writer. Generate concise, truthful summaries only.",
                    userPrompt
            );
            return new AiSummaryResponse(summary);
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            System.err.println("[Groq] API error in generateSummary: " + ex.getStatusCode()
                    + " — " + ex.getResponseBodyAsString());
            return new AiSummaryResponse("AI service error: " + ex.getStatusCode()
                    + ". Please verify Groq API key & quota.");
        } catch (Exception ex) {
            System.err.println("[Groq] Unexpected error in generateSummary: " + ex.getMessage());
            return new AiSummaryResponse("Unable to generate summary right now. Please try again.");
        }
    }

    // =========================================================================
    // MODULE 2 — ATS Resume Analysis
    // =========================================================================

    /**
     * Analyzes a structured Resume entity for ATS score, strengths, weaknesses,
     * missing keywords, and section-level feedback.
     */
    public AtsAnalysisResponse analyzeResume(Resume resume) {
        try {
            String userPrompt = buildAtsPrompt(resume);
            String rawJson = executeGroqPrompt(
                    "You are an expert ATS auditor and technical recruiter. Respond ONLY with valid JSON.",
                    userPrompt
            );
            String sanitized = sanitizeJson(rawJson);
            Map<String, Object> map = objectMapper.readValue(
                    sanitized, new TypeReference<Map<String, Object>>() {});

            int score = 75;
            if (map.get("score") instanceof Number) {
                score = Math.max(0, Math.min(100, ((Number) map.get("score")).intValue()));
            }
            String summary = map.get("summary") != null
                    ? map.get("summary").toString()
                    : "Comprehensive AI analysis of your resume structure and ATS readiness.";

            return new AtsAnalysisResponse(
                    score, summary,
                    castToStringList(map.get("strengths")),
                    castToStringList(map.get("weaknesses")),
                    castToStringList(map.get("missingKeywords")),
                    castToStringList(map.get("suggestions")),
                    castToStringMap(map.get("sectionFeedback")),
                    LocalDateTime.now()
            );
        } catch (Exception ex) {
            System.err.println("[Groq] Error in analyzeResume: " + ex.getMessage());
            return buildFallbackAtsResponse(resume, ex.getMessage());
        }
    }

    // =========================================================================
    // MODULE 3 — Job Match (from stored Resume entity)
    // =========================================================================

    /**
     * Matches a stored Resume entity against a job description string.
     * Used by ResumeController (/api/resumes/{id}/job-match).
     */
    public JobMatchResponse matchJobDescription(Resume resume, String jobDescription) {
        try {
            String userPrompt = buildJobMatchPrompt(resume, jobDescription);
            String rawJson = executeGroqPrompt(
                    "You are an expert technical recruiter. Respond ONLY with valid JSON matching the exact schema provided.",
                    userPrompt
            );
            return processJobMatchJson(rawJson, resume.getFullName() != null ? resume.getFullName() : "Candidate");
        } catch (Exception ex) {
            System.err.println("[Groq] Error in matchJobDescription: " + ex.getMessage());
            return buildFallbackJobMatchResponse(resume, jobDescription, ex.getMessage());
        }
    }

    // =========================================================================
    // MODULE 3 — Job Fit (from raw uploaded file text)
    // =========================================================================

    /**
     * Matches raw extracted resume text against extracted JD text.
     * Used by JobFitController (POST /api/job-fit/analyze).
     *
     * This is the primary upload-based Job Fit Analysis flow.
     */
    public JobMatchResponse matchJobDescriptionWithText(String resumeText, String jobDescription) {
        // Truncate inputs to keep prompts compact (Groq is fast but large prompts add latency)
        String truncatedResume = truncate(resumeText, MAX_RESUME_CHARS);
        String truncatedJd     = truncate(jobDescription, MAX_JD_CHARS);

        try {
            String userPrompt = buildJobMatchPromptFromRawText(truncatedResume, truncatedJd);

            String rawJson = executeGroqPrompt(
                    "You are an expert technical recruiter. Respond ONLY with valid JSON matching the exact schema provided. Do NOT wrap in markdown.",
                    userPrompt
            );

            System.out.println("[AI] 8 Extracting choices[0].message.content");
            System.out.println("[AI] 9 JSON parsing completed");

            JobMatchResponse result = processJobMatchJson(rawJson, "Candidate");

            System.out.println("[AI] 10 Returning analysis");
            return result;
        } catch (Exception ex) {
            System.err.println("[Groq] Error in matchJobDescriptionWithText: " + ex.getMessage());
            throw new RuntimeException("AI analysis failed: " + ex.getMessage(), ex);
        }
    }

    // =========================================================================
    // GROQ HTTP EXECUTION
    // =========================================================================

    /**
     * Executes a chat completion request against the Groq API.
     *
     * Groq uses the OpenAI-compatible API format:
     *   POST https://api.groq.com/openai/v1/chat/completions
     *   Authorization: Bearer <key>
     *   Body: { model, messages: [{role,content},...], temperature }
     *
     * Response: { choices: [{ message: { content: "..." } }] }
     *
     * temperature=0.2 → near-deterministic, consistent JSON output.
     */
    private String executeGroqPrompt(String systemPrompt, String userPrompt) {
        System.out.println("[AI] 1 Preparing Groq request");
        System.out.println("[AI] 2 URL: " + groqApiUrl);
        System.out.println("[AI] 3 Model: " + groqModel);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + groqApiKey);

        Map<String, Object> body = Map.of(
                "model",       groqModel,
                "temperature", 0.2,
                "messages", List.of(
                        Map.of("role", "system",  "content", systemPrompt),
                        Map.of("role", "user",    "content", userPrompt)
                )
        );

        System.out.println("[AI] 4 Request body prepared");
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        System.out.println("[AI] 5 Sending HTTP request to Groq");
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                groqApiUrl,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        System.out.println("[AI] 6 Groq response received");
        System.out.println("[AI] 7 Groq status: " + response.getStatusCode());

        return extractGroqText(response.getBody());
    }

    /**
     * Extracts the assistant message text from a Groq/OpenAI chat response.
     * Response shape: { choices: [{ message: { content: "..." } }] }
     */
    private String extractGroqText(Map<String, Object> responseBody) {
        if (responseBody == null) return "";
        List<?> choices = (List<?>) responseBody.get("choices");
        if (choices == null || choices.isEmpty()) return "";

        Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
        if (firstChoice == null) return "";

        Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
        if (message == null) return "";

        Object content = message.get("content");
        return content != null ? content.toString() : "";
    }

    // =========================================================================
    // JSON PROCESSING
    // =========================================================================

    private JobMatchResponse processJobMatchJson(String rawJson, String candidateName) throws Exception {
        String sanitized = sanitizeJson(rawJson);
        Map<String, Object> map = objectMapper.readValue(
                sanitized, new TypeReference<Map<String, Object>>() {});

        List<String> exactMatches    = castToStringList(map.get("exactMatches"));
        List<String> semanticMatches = castToStringList(map.get("semanticMatches"));
        List<String> partialMatches  = castToStringList(map.get("partialMatches"));
        List<String> missingSkills   = castToStringList(map.get("missingSkills"));

        // Combined matched skills (exact + semantic)
        List<String> matchedSkills = new ArrayList<>();
        matchedSkills.addAll(exactMatches);
        matchedSkills.addAll(semanticMatches);

        // Sub-scores from AI analysis
        int skillsScore    = extractScore(map.get("skillsScore"),    75);
        int keywordScore   = extractScore(map.get("keywordScore"),   70);
        int experienceScore= extractScore(map.get("experienceScore"),70);
        int educationScore = extractScore(map.get("educationScore"), 85);
        int projectScore   = extractScore(map.get("projectScore"),   80);

        // Refine skillsScore deterministically from match counts when AI provided them
        int total = exactMatches.size() + semanticMatches.size() + partialMatches.size() + missingSkills.size();
        if (total > 0) {
            double rawPoints = (exactMatches.size() * 1.0)
                    + (semanticMatches.size() * 0.85)
                    + (partialMatches.size()  * 0.50);
            skillsScore = Math.max(10, Math.min(100, (int) Math.round((rawPoints / total) * 100)));
        }

        // Spring Boot calculates the final weighted score — NOT the AI
        // Formula: Skills×0.40 + Keywords×0.25 + Experience×0.15 + Education×0.10 + Projects×0.10
        double wSkills  = skillsScore     * 0.40;
        double wKeyword = keywordScore    * 0.25;
        double wExp     = experienceScore * 0.15;
        double wEdu     = educationScore  * 0.10;
        double wProj    = projectScore    * 0.10;

        int finalMatchScore = Math.max(0, Math.min(100,
                (int) Math.round(wSkills + wKeyword + wExp + wEdu + wProj)));

        String calcExplanation = String.format(
                "Skills (%d × 0.40 = %.1f) + Keywords (%d × 0.25 = %.1f) + Experience (%d × 0.15 = %.1f) + Education (%d × 0.10 = %.1f) + Projects (%d × 0.10 = %.1f) = %d%%",
                skillsScore, wSkills,
                keywordScore, wKeyword,
                experienceScore, wExp,
                educationScore, wEdu,
                projectScore, wProj,
                finalMatchScore
        );

        ScoreBreakdownDto scoreBreakdown = new ScoreBreakdownDto(
                skillsScore, keywordScore, experienceScore, educationScore, projectScore,
                exactMatches, semanticMatches, calcExplanation
        );

        String matchSummary = map.get("matchSummary") != null
                ? map.get("matchSummary").toString()
                : "Resume evaluated against target job description with hybrid weighted scoring.";

        return new JobMatchResponse(
                finalMatchScore,
                matchSummary,
                matchedSkills,
                missingSkills,
                partialMatches,
                castToStringList(map.get("resumeStrengths")),
                castToStringList(map.get("recommendations")),
                castToStringList(map.get("tailoringSuggestions")),
                scoreBreakdown,
                LocalDateTime.now()
        );
    }

    private int extractScore(Object val, int fallback) {
        if (val instanceof Number) {
            return Math.max(0, Math.min(100, ((Number) val).intValue()));
        }
        return fallback;
    }

    // =========================================================================
    // PROMPT BUILDERS
    // =========================================================================

    private String buildSummaryPrompt(AiSummaryRequest request) {
        return "Generate exactly one professional resume summary in 3 lines.\n"
                + "Do not give multiple options. Do not use bullet points or headings.\n"
                + "Return ONLY the final summary paragraph — no extra text.\n"
                + "Candidate details:\n"
                + "Name: " + request.getFullName() + "\n"
                + "Skills: " + request.getSkills() + "\n"
                + "Experience: " + request.getExperience() + "\n"
                + "Projects: " + request.getProjects() + "\n\n"
                + "Important: Do not fabricate experience. Keep suitable for a fresher or junior developer.";
    }

    private String buildAtsPrompt(Resume resume) {
        return "Analyze the following resume objectively.\n"
                + "CRITICAL: Do NOT fabricate or invent any experience, companies, metrics, or technologies not stated.\n\n"
                + "RESUME DATA:\n"
                + "Name: "           + safe(resume.getFullName())            + "\n"
                + "Summary: "        + safe(resume.getSummary())             + "\n"
                + "Skills: "         + safe(resume.getSkills())              + "\n"
                + "Technologies: "   + safe(resume.getTechnologies())        + "\n"
                + "Libraries: "      + safe(resume.getLibraries())           + "\n"
                + "Soft Skills: "    + safe(resume.getSoftSkills())          + "\n"
                + "Experience: "     + safe(resume.getExperience())          + "\n"
                + "Projects: "       + safe(resume.getProjects())            + "\n"
                + "Education: "      + safe(resume.getEducation())
                              + " " + safe(resume.getEducationInstitution()) + "\n"
                + "Certifications: " + safe(resume.getCertifications())      + "\n\n"
                + "OUTPUT: A valid JSON object (no markdown) with this exact schema:\n"
                + "{\n"
                + "  \"score\": 0-100,\n"
                + "  \"summary\": \"2-sentence ATS readiness summary\",\n"
                + "  \"strengths\": [\"...\"],\n"
                + "  \"weaknesses\": [\"...\"],\n"
                + "  \"missingKeywords\": [\"...\"],\n"
                + "  \"suggestions\": [\"...\"],\n"
                + "  \"sectionFeedback\": { \"summary\": \"...\", \"skills\": \"...\", \"experience\": \"...\", \"projects\": \"...\", \"education\": \"...\" }\n"
                + "}";
    }

    private String buildJobMatchPrompt(Resume resume, String jobDescription) {
        return "You are an expert technical recruiter performing a job-fit analysis.\n"
                + "Compare the candidate resume against the job description.\n"
                + "CRITICAL RULES:\n"
                + "1. Do NOT invent skills, certifications, companies, or experience.\n"
                + "2. Semantic matching: if resume says 'REST API development' and JD says 'RESTful Web Services', that is a semanticMatch.\n"
                + "3. Classify ALL JD skill requirements into: exactMatches, semanticMatches, partialMatches, missingSkills.\n"
                + "4. Provide sub-scores (0-100): skillsScore, keywordScore, experienceScore, educationScore, projectScore.\n\n"
                + "TARGET JOB DESCRIPTION:\n" + truncate(jobDescription, MAX_JD_CHARS) + "\n\n"
                + "CANDIDATE RESUME:\n"
                + "Skills: "       + safe(resume.getSkills())         + "\n"
                + "Technologies: " + safe(resume.getTechnologies())   + "\n"
                + "Experience: "   + safe(resume.getExperience())     + "\n"
                + "Projects: "     + safe(resume.getProjects())       + "\n"
                + "Education: "    + safe(resume.getEducation())      + "\n\n"
                + buildJobMatchSchema();
    }

    private String buildJobMatchPromptFromRawText(String resumeText, String jobDescription) {
        return "You are an expert technical recruiter performing a job-fit analysis.\n"
                + "Compare the candidate resume text against the job description.\n"
                + "CRITICAL RULES:\n"
                + "1. Do NOT invent skills, certifications, companies, metrics, or experience not in the resume.\n"
                + "2. Semantic matching: if resume says 'REST API development' and JD says 'RESTful Web Services', that is a semanticMatch.\n"
                + "3. Classify ALL JD skill requirements: exactMatches, semanticMatches, partialMatches, missingSkills.\n"
                + "4. Provide sub-scores (0-100): skillsScore, keywordScore, experienceScore, educationScore, projectScore.\n\n"
                + "TARGET JOB DESCRIPTION:\n" + jobDescription + "\n\n"
                + "CANDIDATE RESUME TEXT:\n" + resumeText + "\n\n"
                + buildJobMatchSchema();
    }

    private String buildJobMatchSchema() {
        return "OUTPUT: ONLY a valid parseable JSON object (NO markdown, no extra text) with this exact schema:\n"
                + "{\n"
                + "  \"matchSummary\": \"2-sentence executive summary of candidate alignment\",\n"
                + "  \"exactMatches\": [\"skill1\", \"skill2\"],\n"
                + "  \"semanticMatches\": [\"equivalent skill\"],\n"
                + "  \"partialMatches\": [\"partial skill\"],\n"
                + "  \"missingSkills\": [\"missing required skill\"],\n"
                + "  \"skillsScore\": 85,\n"
                + "  \"keywordScore\": 80,\n"
                + "  \"experienceScore\": 75,\n"
                + "  \"educationScore\": 90,\n"
                + "  \"projectScore\": 80,\n"
                + "  \"resumeStrengths\": [\"key strength for this role\"],\n"
                + "  \"recommendations\": [\"actionable advice based only on actual resume content\"],\n"
                + "  \"tailoringSuggestions\": [\"honest tailoring suggestion — no fabrication\"]\n"
                + "}";
    }

    // =========================================================================
    // HELPERS
    // =========================================================================

    private String sanitizeJson(String text) {
        if (text == null) return "{}";
        String t = text.trim();
        if (t.startsWith("```json")) t = t.substring(7);
        else if (t.startsWith("```"))  t = t.substring(3);
        if (t.endsWith("```"))         t = t.substring(0, t.length() - 3);
        return t.trim();
    }

    /** Null-safe field accessor. */
    private String safe(String value) {
        return value != null ? value : "";
    }

    /** Truncates text to maxChars to keep prompts compact. */
    private String truncate(String text, int maxChars) {
        if (text == null) return "";
        if (text.length() <= maxChars) return text;
        return text.substring(0, maxChars) + "\n[... content truncated ...]";
    }

    private List<String> castToStringList(Object obj) {
        if (obj instanceof List<?>) {
            List<String> list = new ArrayList<>();
            for (Object item : (List<?>) obj) {
                if (item != null) list.add(item.toString());
            }
            return list;
        }
        return new ArrayList<>();
    }

    private Map<String, String> castToStringMap(Object obj) {
        if (obj instanceof Map<?, ?>) {
            Map<String, String> map = new HashMap<>();
            for (Map.Entry<?, ?> entry : ((Map<?, ?>) obj).entrySet()) {
                if (entry.getKey() != null && entry.getValue() != null) {
                    map.put(entry.getKey().toString(), entry.getValue().toString());
                }
            }
            return map;
        }
        return new HashMap<>();
    }

    // =========================================================================
    // FALLBACKS (returned when Groq fails)
    // =========================================================================

    private AtsAnalysisResponse buildFallbackAtsResponse(Resume resume, String errorMsg) {
        int baseScore = (resume.getSkills()     != null && !resume.getSkills().isBlank()     ? 30 : 10)
                      + (resume.getExperience() != null && !resume.getExperience().isBlank() ? 25 : 10)
                      + (resume.getProjects()   != null && !resume.getProjects().isBlank()   ? 25 : 10);
        return new AtsAnalysisResponse(
                baseScore,
                "Resume provides good baseline coverage. Targeted keyword improvements will boost ATS pass-rates.",
                List.of("Resume structure follows standard ATS-readable sections"),
                List.of("Consider quantifying experience bullet points with metrics"),
                List.of("Unit Testing", "CI/CD", "REST APIs", "Git"),
                List.of("Use strong action verbs like 'Architected', 'Implemented', 'Engineered'."),
                Map.of(
                        "summary",    "Keep summary concise in 3-4 lines.",
                        "skills",     "Group skills into Core, Frameworks, and Tools.",
                        "experience", "Use the STAR method for bullet points.",
                        "projects",   "Include architecture details and deployment links.",
                        "education",  "List university, degree, and graduation year."
                ),
                LocalDateTime.now()
        );
    }

    private JobMatchResponse buildFallbackJobMatchResponse(Resume resume, String jd, String errorMsg) {
        int ss = 70, ks = 65, es = 60, edu = 80, ps = 75;
        int finalScore = (int) Math.round(ss*0.40 + ks*0.25 + es*0.15 + edu*0.10 + ps*0.10);
        String calc = String.format(
                "Skills (%d×0.40=%.1f) + Keywords (%d×0.25=%.1f) + Experience (%d×0.15=%.1f) + Education (%d×0.10=%.1f) + Projects (%d×0.10=%.1f) = %d%%",
                ss, ss*0.40, ks, ks*0.25, es, es*0.15, edu, edu*0.10, ps, ps*0.10, finalScore);
        return new JobMatchResponse(
                finalScore,
                "AI analysis temporarily unavailable. Results are based on baseline scoring.",
                List.of("Core Programming", "Software Fundamentals"),
                List.of("Role-specific frameworks or cloud platforms"),
                List.of("Experience level alignment"),
                List.of("Strong foundational background"),
                List.of("Align resume keywords with the specific job posting where truthful."),
                List.of("Tailor project descriptions to emphasize responsibilities matching this role."),
                new ScoreBreakdownDto(ss, ks, es, edu, ps,
                        List.of("Core Programming"), List.of("Problem Solving"), calc),
                LocalDateTime.now()
        );
    }
}