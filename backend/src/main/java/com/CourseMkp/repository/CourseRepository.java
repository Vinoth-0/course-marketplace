package com.CourseMkp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CourseMkp.entity.Course;

/**
 * Spring Data JPA repository for the Course entity.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * Find all courses created by a specific instructor.
     *
     * @param instructorId the ID of the instructor (User) who created the courses
     * @return list of courses owned by that instructor
     */
    List<Course> findByInstructorId(Long instructorId);
}
