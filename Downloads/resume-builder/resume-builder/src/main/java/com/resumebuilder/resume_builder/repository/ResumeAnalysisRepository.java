package com.resumebuilder.resume_builder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.resumebuilder.resume_builder.model.ResumeAnalysis;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {

    Optional<ResumeAnalysis> findTopByResumeIdOrderByCreatedAtDesc(Long resumeId);

    List<ResumeAnalysis> findByResumeIdOrderByCreatedAtDesc(Long resumeId);
}
