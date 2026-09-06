package com.resumebuilder.resume_builder.dto;

import java.util.List;

public class ScoreBreakdownDto {
    private int skillsScore;
    private int keywordScore;
    private int experienceScore;
    private int educationScore;
    private int projectScore;
    private List<String> exactMatches;
    private List<String> semanticMatches;
    private String calculationExplanation;

    public ScoreBreakdownDto() {
    }

    public ScoreBreakdownDto(int skillsScore, int keywordScore, int experienceScore,
                             int educationScore, int projectScore, List<String> exactMatches,
                             List<String> semanticMatches, String calculationExplanation) {
        this.skillsScore = skillsScore;
        this.keywordScore = keywordScore;
        this.experienceScore = experienceScore;
        this.educationScore = educationScore;
        this.projectScore = projectScore;
        this.exactMatches = exactMatches;
        this.semanticMatches = semanticMatches;
        this.calculationExplanation = calculationExplanation;
    }

    public int getSkillsScore() {
        return skillsScore;
    }

    public void setSkillsScore(int skillsScore) {
        this.skillsScore = skillsScore;
    }

    public int getKeywordScore() {
        return keywordScore;
    }

    public void setKeywordScore(int keywordScore) {
        this.keywordScore = keywordScore;
    }

    public int getExperienceScore() {
        return experienceScore;
    }

    public void setExperienceScore(int experienceScore) {
        this.experienceScore = experienceScore;
    }

    public int getEducationScore() {
        return educationScore;
    }

    public void setEducationScore(int educationScore) {
        this.educationScore = educationScore;
    }

    public int getProjectScore() {
        return projectScore;
    }

    public void setProjectScore(int projectScore) {
        this.projectScore = projectScore;
    }

    public List<String> getExactMatches() {
        return exactMatches;
    }

    public void setExactMatches(List<String> exactMatches) {
        this.exactMatches = exactMatches;
    }

    public List<String> getSemanticMatches() {
        return semanticMatches;
    }

    public void setSemanticMatches(List<String> semanticMatches) {
        this.semanticMatches = semanticMatches;
    }

    public String getCalculationExplanation() {
        return calculationExplanation;
    }

    public void setCalculationExplanation(String calculationExplanation) {
        this.calculationExplanation = calculationExplanation;
    }
}
