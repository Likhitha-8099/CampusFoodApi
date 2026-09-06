package com.resumebuilder.resume_builder.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AtsAnalysisResponse {

    private int score;
    private String summary;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> missingKeywords;
    private List<String> suggestions;
    private Map<String, String> sectionFeedback;
    private LocalDateTime createdAt;

    public AtsAnalysisResponse() {
    }

    public AtsAnalysisResponse(int score, String summary, List<String> strengths, List<String> weaknesses,
                               List<String> missingKeywords, List<String> suggestions,
                               Map<String, String> sectionFeedback, LocalDateTime createdAt) {
        this.score = score;
        this.summary = summary;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.missingKeywords = missingKeywords;
        this.suggestions = suggestions;
        this.sectionFeedback = sectionFeedback;
        this.createdAt = createdAt;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public List<String> getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(List<String> missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public Map<String, String> getSectionFeedback() {
        return sectionFeedback;
    }

    public void setSectionFeedback(Map<String, String> sectionFeedback) {
        this.sectionFeedback = sectionFeedback;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
