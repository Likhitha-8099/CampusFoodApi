package com.resumebuilder.resume_builder.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.resume_builder.dto.AiSummaryRequest;
import com.resumebuilder.resume_builder.dto.AiSummaryResponse;
import com.resumebuilder.resume_builder.dto.AtsAnalysisResponse;
import com.resumebuilder.resume_builder.dto.JobMatchRequest;
import com.resumebuilder.resume_builder.dto.JobMatchResponse;
import com.resumebuilder.resume_builder.dto.ResumeDto;
import com.resumebuilder.resume_builder.dto.ScoreBreakdownDto;
import com.resumebuilder.resume_builder.exception.ResumeNotFoundException;
import com.resumebuilder.resume_builder.model.JobMatch;
import com.resumebuilder.resume_builder.model.Resume;
import com.resumebuilder.resume_builder.model.ResumeAnalysis;
import com.resumebuilder.resume_builder.repository.JobMatchRepository;
import com.resumebuilder.resume_builder.repository.ResumeAnalysisRepository;
import com.resumebuilder.resume_builder.repository.ResumeRepository;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final JobMatchRepository jobMatchRepository;
    private final AiService aiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeService(ResumeRepository resumeRepository,
                         ResumeAnalysisRepository resumeAnalysisRepository,
                         JobMatchRepository jobMatchRepository,
                         AiService aiService) {
        this.resumeRepository = resumeRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.jobMatchRepository = jobMatchRepository;
        this.aiService = aiService;
    }

    public Resume createResume(ResumeDto resumeDto) {
        Resume resume = new Resume();
        mapDtoToEntity(resumeDto, resume);
        return resumeRepository.save(resume);
    }

    public List<Resume> getResumes() {
        return resumeRepository.findAll();
    }

    public Resume resumeById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + id));
    }

    public Resume updateById(Long id, ResumeDto resumeDto) {
        Resume existingResume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + id));

        mapDtoToEntity(resumeDto, existingResume);
        return resumeRepository.save(existingResume);
    }

    public String deleteById(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + id));

        resumeRepository.delete(resume);
        return "Resume deleted successfully with id: " + id;
    }

    public Resume generateAndSaveSummary(Long id) {
        Resume resume = resumeById(id);

        AiSummaryRequest request = new AiSummaryRequest();
        request.setFullName(resume.getFullName());

        String combinedSkills = "";
        if (resume.getSkills() != null && !resume.getSkills().isBlank()) combinedSkills += resume.getSkills();
        if (resume.getTechnologies() != null && !resume.getTechnologies().isBlank()) combinedSkills += ", " + resume.getTechnologies();
        if (resume.getLibraries() != null && !resume.getLibraries().isBlank()) combinedSkills += ", " + resume.getLibraries();
        if (resume.getSoftSkills() != null && !resume.getSoftSkills().isBlank()) combinedSkills += ", " + resume.getSoftSkills();

        request.setSkills(combinedSkills);
        request.setExperience(resume.getExperience());
        request.setProjects(resume.getProjects());

        AiSummaryResponse response = aiService.generateSummary(request);
        String generatedSummary = response.getSummary();

        if (generatedSummary != null && !generatedSummary.isBlank() && !generatedSummary.startsWith("AI service error")) {
            resume.setSummary(generatedSummary);
            return resumeRepository.save(resume);
        }

        return resume;
    }

    /**
     * MODULE 2: Run ATS Analysis, persist to DB, and return DTO
     */
    public AtsAnalysisResponse analyzeAndSaveAts(Long id) {
        Resume resume = resumeById(id);
        AtsAnalysisResponse response = aiService.analyzeResume(resume);

        try {
            ResumeAnalysis analysis = new ResumeAnalysis();
            analysis.setResume(resume);
            analysis.setScore(response.getScore());
            analysis.setSummary(response.getSummary());
            analysis.setStrengths(objectMapper.writeValueAsString(response.getStrengths()));
            analysis.setWeaknesses(objectMapper.writeValueAsString(response.getWeaknesses()));
            analysis.setMissingKeywords(objectMapper.writeValueAsString(response.getMissingKeywords()));
            analysis.setSuggestions(objectMapper.writeValueAsString(response.getSuggestions()));
            analysis.setSectionFeedback(objectMapper.writeValueAsString(response.getSectionFeedback()));

            resumeAnalysisRepository.save(analysis);
        } catch (Exception ex) {
            System.err.println("Failed to persist ResumeAnalysis: " + ex.getMessage());
        }

        return response;
    }

    public AtsAnalysisResponse getLatestAnalysis(Long id) {
        resumeById(id); // validates existence

        return resumeAnalysisRepository.findTopByResumeIdOrderByCreatedAtDesc(id)
                .map(this::mapAnalysisEntityToDto)
                .orElse(null);
    }

    /**
     * MODULE 2: Match against Job Description, persist to DB, and return DTO
     */
    public JobMatchResponse matchJobAndSave(Long id, JobMatchRequest request) {
        Resume resume = resumeById(id);
        JobMatchResponse response = aiService.matchJobDescription(resume, request.getJobDescription());

        try {
            JobMatch match = new JobMatch();
            match.setResume(resume);
            match.setJobDescription(request.getJobDescription());
            match.setMatchScore(response.getMatchScore());
            match.setMatchSummary(response.getMatchSummary());
            match.setMatchedSkills(objectMapper.writeValueAsString(response.getMatchedSkills()));
            match.setMissingSkills(objectMapper.writeValueAsString(response.getMissingSkills()));
            match.setPartialMatches(objectMapper.writeValueAsString(response.getPartialMatches()));
            match.setResumeStrengths(objectMapper.writeValueAsString(response.getResumeStrengths()));
            match.setRecommendations(objectMapper.writeValueAsString(response.getRecommendations()));
            match.setTailoringSuggestions(objectMapper.writeValueAsString(response.getTailoringSuggestions()));
            if (response.getScoreBreakdown() != null) {
                match.setScoreBreakdown(objectMapper.writeValueAsString(response.getScoreBreakdown()));
            }

            jobMatchRepository.save(match);
        } catch (Exception ex) {
            System.err.println("Failed to persist JobMatch: " + ex.getMessage());
        }

        return response;
    }

    public List<JobMatchResponse> getJobMatches(Long id) {
        resumeById(id); // validates existence
        List<JobMatch> matches = jobMatchRepository.findByResumeIdOrderByCreatedAtDesc(id);
        List<JobMatchResponse> dtoList = new ArrayList<>();

        for (JobMatch match : matches) {
            dtoList.add(mapJobMatchEntityToDto(match));
        }

        return dtoList;
    }

    // Helper mappings
    private void mapDtoToEntity(ResumeDto dto, Resume entity) {
        entity.setFullName(dto.getFullName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setLinkedin(dto.getLinkedin());
        entity.setGithub(dto.getGithub());
        entity.setSummary(dto.getSummary());
        entity.setSkills(dto.getSkills());
        entity.setEducation(dto.getEducation());
        entity.setExperience(dto.getExperience());
        entity.setProjects(dto.getProjects());
        entity.setTechnologies(dto.getTechnologies());
        entity.setLibraries(dto.getLibraries());
        entity.setSoftSkills(dto.getSoftSkills());
        entity.setCertifications(dto.getCertifications());
        entity.setEducationInstitution(dto.getEducationInstitution());
    }

    private AtsAnalysisResponse mapAnalysisEntityToDto(ResumeAnalysis entity) {
        try {
            List<String> strengths = objectMapper.readValue(entity.getStrengths(), new TypeReference<List<String>>() {});
            List<String> weaknesses = objectMapper.readValue(entity.getWeaknesses(), new TypeReference<List<String>>() {});
            List<String> missingKeywords = objectMapper.readValue(entity.getMissingKeywords(), new TypeReference<List<String>>() {});
            List<String> suggestions = objectMapper.readValue(entity.getSuggestions(), new TypeReference<List<String>>() {});
            Map<String, String> sectionFeedback = objectMapper.readValue(entity.getSectionFeedback(), new TypeReference<Map<String, String>>() {});

            return new AtsAnalysisResponse(entity.getScore(), entity.getSummary(), strengths, weaknesses, missingKeywords, suggestions, sectionFeedback, entity.getCreatedAt());
        } catch (Exception ex) {
            return new AtsAnalysisResponse(entity.getScore(), entity.getSummary(), List.of(), List.of(), List.of(), List.of(), Map.of(), entity.getCreatedAt());
        }
    }

    private JobMatchResponse mapJobMatchEntityToDto(JobMatch entity) {
        try {
            List<String> matchedSkills = entity.getMatchedSkills() != null ? objectMapper.readValue(entity.getMatchedSkills(), new TypeReference<List<String>>() {}) : List.of();
            List<String> missingSkills = entity.getMissingSkills() != null ? objectMapper.readValue(entity.getMissingSkills(), new TypeReference<List<String>>() {}) : List.of();
            List<String> partialMatches = entity.getPartialMatches() != null ? objectMapper.readValue(entity.getPartialMatches(), new TypeReference<List<String>>() {}) : List.of();
            List<String> resumeStrengths = entity.getResumeStrengths() != null ? objectMapper.readValue(entity.getResumeStrengths(), new TypeReference<List<String>>() {}) : List.of();
            List<String> recommendations = entity.getRecommendations() != null ? objectMapper.readValue(entity.getRecommendations(), new TypeReference<List<String>>() {}) : List.of();
            List<String> tailoringSuggestions = entity.getTailoringSuggestions() != null ? objectMapper.readValue(entity.getTailoringSuggestions(), new TypeReference<List<String>>() {}) : List.of();
            ScoreBreakdownDto scoreBreakdown = entity.getScoreBreakdown() != null ? objectMapper.readValue(entity.getScoreBreakdown(), ScoreBreakdownDto.class) : null;

            return new JobMatchResponse(entity.getMatchScore(), entity.getMatchSummary(), matchedSkills, missingSkills, partialMatches, resumeStrengths, recommendations, tailoringSuggestions, scoreBreakdown, entity.getCreatedAt());
        } catch (Exception ex) {
            return new JobMatchResponse(entity.getMatchScore(), entity.getMatchSummary(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), null, entity.getCreatedAt());
        }
    }
}