package com.resumebuilder.resume_builder.dto;

import java.time.LocalDateTime;
import java.util.List;

public class JobMatchResponse {

    private int matchScore;
    private String matchSummary;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> partialMatches;
    private List<String> resumeStrengths;
    private List<String> recommendations;
    private List<String> tailoringSuggestions;
    private ScoreBreakdownDto scoreBreakdown;
    private LocalDateTime createdAt;

    public JobMatchResponse() {
    }

    public JobMatchResponse(int matchScore, String matchSummary, List<String> matchedSkills,
                            List<String> missingSkills, List<String> partialMatches,
                            List<String> resumeStrengths, List<String> recommendations,
                            List<String> tailoringSuggestions, ScoreBreakdownDto scoreBreakdown,
                            LocalDateTime createdAt) {
        this.matchScore = matchScore;
        this.matchSummary = matchSummary;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.partialMatches = partialMatches;
        this.resumeStrengths = resumeStrengths;
        this.recommendations = recommendations;
        this.tailoringSuggestions = tailoringSuggestions;
        this.scoreBreakdown = scoreBreakdown;
        this.createdAt = createdAt;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public String getMatchSummary() {
        return matchSummary;
    }

    public void setMatchSummary(String matchSummary) {
        this.matchSummary = matchSummary;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getPartialMatches() {
        return partialMatches;
    }

    public void setPartialMatches(List<String> partialMatches) {
        this.partialMatches = partialMatches;
    }

    public List<String> getResumeStrengths() {
        return resumeStrengths;
    }

    public void setResumeStrengths(List<String> resumeStrengths) {
        this.resumeStrengths = resumeStrengths;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public List<String> getTailoringSuggestions() {
        return tailoringSuggestions;
    }

    public void setTailoringSuggestions(List<String> tailoringSuggestions) {
        this.tailoringSuggestions = tailoringSuggestions;
    }

    public ScoreBreakdownDto getScoreBreakdown() {
        return scoreBreakdown;
    }

    public void setScoreBreakdown(ScoreBreakdownDto scoreBreakdown) {
        this.scoreBreakdown = scoreBreakdown;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
