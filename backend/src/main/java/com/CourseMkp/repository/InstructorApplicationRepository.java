package com.CourseMkp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CourseMkp.entity.ApplicationStatus;
import com.CourseMkp.entity.InstructorApplication;

@Repository
public interface InstructorApplicationRepository extends JpaRepository<InstructorApplication, Long> {
    List<InstructorApplication> findByStatus(ApplicationStatus status);
    boolean existsByApplicantId(Long applicantId);
}
