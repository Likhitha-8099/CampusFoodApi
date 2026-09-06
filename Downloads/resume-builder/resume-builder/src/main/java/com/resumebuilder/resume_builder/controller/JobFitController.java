package com.resumebuilder.resume_builder.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.multipart.MultipartFile;

import com.resumebuilder.resume_builder.dto.JobMatchResponse;
import com.resumebuilder.resume_builder.service.AiService;
import com.resumebuilder.resume_builder.service.TextExtractionService;

@RestController
@RequestMapping("/api/job-fit")
@CrossOrigin(origins = "*")
public class JobFitController {

    private final TextExtractionService textExtractionService;
    private final AiService aiService;

    public JobFitController(TextExtractionService textExtractionService, AiService aiService) {
        this.textExtractionService = textExtractionService;
        this.aiService = aiService;
    }

    /**
     * Endpoint for Upload-based AI Job Fit Analysis.
     * Accepts:
     * - resumeFile: MultipartFile (PDF, DOCX, TXT) [REQUIRED]
     * - jobDescriptionFile: MultipartFile (PDF, DOCX, TXT) [OPTIONAL]
     * - jobDescriptionText: String [OPTIONAL]
     */
    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeJobFit(
            @RequestParam("resumeFile") MultipartFile resumeFile,
            @RequestParam(value = "jobDescriptionFile", required = false) MultipartFile jobDescriptionFile,
            @RequestParam(value = "jobDescriptionText", required = false) String jobDescriptionText) {

        System.out.println("[JOB-FIT-BROWSER] 1 REQUEST RECEIVED");
        System.out.println("[JOB-FIT-BROWSER] PID=" + ProcessHandle.current().pid());

        // 1. Validate Resume File
        if (resumeFile == null || resumeFile.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Resume file is required. Please upload a PDF, DOCX, or TXT file."));
        }

        System.out.println("[JOB-FIT-BROWSER] resumeFile=" + resumeFile.getOriginalFilename());
        System.out.println("[JOB-FIT-BROWSER] 2 RESUME RECEIVED");

        // 2. Extract Resume Text
        String resumeText;
        try {
            resumeText = textExtractionService.extractText(resumeFile);
            System.out.println("[JOB-FIT-BROWSER] 4 RESUME EXTRACTION DONE");
        } catch (IllegalArgumentException ex) {
            System.err.println("[JOB-FIT-BROWSER] Resume extraction failed (bad input): " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            System.err.println("[JOB-FIT-BROWSER] Resume extraction failed (error): " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to extract text from resume: " + ex.getMessage()));
        }

        if (resumeText.trim().length() < 30) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Extracted resume text is too short or unreadable. Please ensure the document has clear readable text."));
        }

        // 3. Extract Job Description (prefer uploaded file, then pasted text)
        String jdText = "";
        if (jobDescriptionFile != null && !jobDescriptionFile.isEmpty()) {
            System.out.println("[JOB-FIT-BROWSER] jdFile=" + jobDescriptionFile.getOriginalFilename());
            System.out.println("[JOB-FIT-BROWSER] 3 JD RECEIVED");
            try {
                jdText = textExtractionService.extractText(jobDescriptionFile);
                System.out.println("[JOB-FIT-BROWSER] 5 JD EXTRACTION DONE");
            } catch (IllegalArgumentException ex) {
                System.err.println("[JOB-FIT-BROWSER] JD extraction failed (bad input): " + ex.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Job Description file error: " + ex.getMessage()));
            } catch (Exception ex) {
                System.err.println("[JOB-FIT-BROWSER] JD extraction failed (error): " + ex.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Failed to extract text from Job Description file: " + ex.getMessage()));
            }
        } else if (jobDescriptionText != null && !jobDescriptionText.trim().isEmpty()) {
            jdText = jobDescriptionText.trim();
            System.out.println("[JOB-FIT-BROWSER] jdFile=pasted text (" + jdText.length() + " chars)");
            System.out.println("[JOB-FIT-BROWSER] 3 JD RECEIVED");
            System.out.println("[JOB-FIT-BROWSER] 5 JD EXTRACTION DONE");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Job description is required. Please upload a JD file or paste the job description text."));
        }

        if (jdText.trim().length() < 30) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Job description text is too short. Please provide a detailed job description with qualifications and responsibilities."));
        }

        // 4. Perform Hybrid AI Match
        try {
            System.out.println("[JOB-FIT-BROWSER] 6 CALLING GROQ");
            JobMatchResponse response = aiService.matchJobDescriptionWithText(resumeText, jdText);
            System.out.println("[JOB-FIT-BROWSER] 7 GROQ RETURNED");
            System.out.println("[JOB-FIT-BROWSER] 8 JSON PARSED");
            System.out.println("[JOB-FIT-BROWSER] 9 RESPONSE OBJECT CREATED");
            System.out.println("[JOB-FIT-BROWSER] 10 RETURNING HTTP RESPONSE");
            return ResponseEntity.ok(response);
        } catch (ResourceAccessException ex) {
            // RestTemplate timeout or connection error
            System.err.println("[JOB-FIT] AI service timed out or unreachable: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                    .body(Map.of("message", "AI analysis timed out. The AI service took too long to respond. Please try again."));
        } catch (Exception ex) {
            System.err.println("[JOB-FIT] AI analysis failed: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "AI analysis service is currently unavailable. Please try again in a moment."));
        }
    }
}
