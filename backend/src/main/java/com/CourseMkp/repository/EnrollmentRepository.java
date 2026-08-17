package com.CourseMkp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CourseMkp.entity.Enrollment;

/**
 * Spring Data JPA repository for the Enrollment entity.
 */
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /**
     * Find all enrollments for a given student.
     *
     * @param studentId the ID of the student (User)
     * @return list of all enrollment records belonging to that student
     */
    List<Enrollment> findByStudentId(Long studentId);

    /**
     * Check whether a student is already enrolled in a specific course.
     * Prevents duplicate enrollment.
     *
     * @param studentId the student's ID
     * @param courseId  the course's ID
     * @return true if the enrollment already exists
     */
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
