package com.resumebuilder.resume_builder.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_matches")
public class JobMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private int matchScore;

    @Column(columnDefinition = "TEXT")
    private String matchSummary;

    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String partialMatches;

    @Column(columnDefinition = "TEXT")
    private String resumeStrengths;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(columnDefinition = "TEXT")
    private String tailoringSuggestions;

    @Column(columnDefinition = "TEXT")
    private String scoreBreakdown;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public JobMatch() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
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

    public String getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(String matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getPartialMatches() {
        return partialMatches;
    }

    public void setPartialMatches(String partialMatches) {
        this.partialMatches = partialMatches;
    }

    public String getResumeStrengths() {
        return resumeStrengths;
    }

    public void setResumeStrengths(String resumeStrengths) {
        this.resumeStrengths = resumeStrengths;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public String getTailoringSuggestions() {
        return tailoringSuggestions;
    }

    public void setTailoringSuggestions(String tailoringSuggestions) {
        this.tailoringSuggestions = tailoringSuggestions;
    }

    public String getScoreBreakdown() {
        return scoreBreakdown;
    }

    public void setScoreBreakdown(String scoreBreakdown) {
        this.scoreBreakdown = scoreBreakdown;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
