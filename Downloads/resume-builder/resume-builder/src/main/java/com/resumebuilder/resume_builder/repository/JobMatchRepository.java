package com.resumebuilder.resume_builder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.resumebuilder.resume_builder.model.JobMatch;

@Repository
public interface JobMatchRepository extends JpaRepository<JobMatch, Long> {

    List<JobMatch> findByResumeIdOrderByCreatedAtDesc(Long resumeId);
}
