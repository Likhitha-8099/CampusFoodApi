package com.resumebuilder.resume_builder.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.resumebuilder.resume_builder.dto.AtsAnalysisResponse;
import com.resumebuilder.resume_builder.dto.JobMatchRequest;
import com.resumebuilder.resume_builder.dto.JobMatchResponse;
import com.resumebuilder.resume_builder.dto.ResumeDto;
import com.resumebuilder.resume_builder.model.Resume;
import com.resumebuilder.resume_builder.service.ResumeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
@Tag(name = "Resume Management & AI Suite", description = "CRUD operations, ATS Analysis, and Job Matching APIs")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @Operation(summary = "Create a new resume")
    @PostMapping
    public ResponseEntity<Resume> createResume(@Valid @RequestBody ResumeDto resumedto) {
        Resume savedResume = resumeService.createResume(resumedto);
        return new ResponseEntity<>(savedResume, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all resumes")
    @GetMapping
    public ResponseEntity<List<Resume>> getResumes() {
        List<Resume> get = resumeService.getResumes();
        return new ResponseEntity<>(get, HttpStatus.OK);
    }

    @Operation(summary = "Get a resume by id")
    @GetMapping("/{id}")
    public ResponseEntity<Resume> resumeById(@PathVariable Long id) {
        Resume savedResume = resumeService.resumeById(id);
        return new ResponseEntity<>(savedResume, HttpStatus.OK);
    }

    @Operation(summary = "Update a resume by id")
    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateById(@PathVariable Long id, @Valid @RequestBody ResumeDto resumedto) {
        Resume update = resumeService.updateById(id, resumedto);
        return new ResponseEntity<>(update, HttpStatus.OK);
    }

    @Operation(summary = "Delete a resume by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        String delete = resumeService.deleteById(id);
        return new ResponseEntity<>(delete, HttpStatus.OK);
    }

    @Operation(summary = "Generate and save AI summary for a resume")
    @PutMapping("/{id}/generate-summary")
    public ResponseEntity<Resume> generateAndSaveSummary(@PathVariable Long id) {
        Resume updatedResume = resumeService.generateAndSaveSummary(id);
        return new ResponseEntity<>(updatedResume, HttpStatus.OK);
    }

    // =========================================================================
    // MODULE 2: ATS RESUME ANALYZER APIs
    // =========================================================================

    @Operation(summary = "Run AI ATS Analysis and scoring on a resume")
    @PostMapping("/{id}/analyze")
    public ResponseEntity<AtsAnalysisResponse> analyzeResume(@PathVariable Long id) {
        AtsAnalysisResponse analysis = resumeService.analyzeAndSaveAts(id);
        return new ResponseEntity<>(analysis, HttpStatus.OK);
    }

    @Operation(summary = "Get latest AI ATS Analysis for a resume")
    @GetMapping("/{id}/analysis")
    public ResponseEntity<AtsAnalysisResponse> getLatestAnalysis(@PathVariable Long id) {
        AtsAnalysisResponse analysis = resumeService.getLatestAnalysis(id);
        if (analysis == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(analysis, HttpStatus.OK);
    }

    // =========================================================================
    // MODULE 3: JOB DESCRIPTION MATCHER APIs
    // =========================================================================

    @Operation(summary = "Match resume against target Job Description")
    @PostMapping("/{id}/job-match")
    public ResponseEntity<JobMatchResponse> matchJobDescription(
            @PathVariable Long id,
            @Valid @RequestBody JobMatchRequest request) {
        JobMatchResponse match = resumeService.matchJobAndSave(id, request);
        return new ResponseEntity<>(match, HttpStatus.OK);
    }

    @Operation(summary = "Get all previous Job Matches for a resume")
    @GetMapping("/{id}/job-matches")
    public ResponseEntity<List<JobMatchResponse>> getJobMatches(@PathVariable Long id) {
        List<JobMatchResponse> matches = resumeService.getJobMatches(id);
        return new ResponseEntity<>(matches, HttpStatus.OK);
    }
}

