package com.resumebuilder.resume_builder.dto;

import jakarta.validation.constraints.NotBlank;

public class JobMatchRequest {

    @NotBlank(message = "Job description cannot be blank")
    private String jobDescription;

    public JobMatchRequest() {
    }

    public JobMatchRequest(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}
