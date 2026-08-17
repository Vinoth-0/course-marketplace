package com.CourseMkp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.CourseMkp.dto.CourseResponse;
import com.CourseMkp.entity.Course;
import com.CourseMkp.entity.Enrollment;
import com.CourseMkp.entity.User;
import com.CourseMkp.exception.AlreadyEnrolledException;
import com.CourseMkp.exception.ResourceNotFoundException;
import com.CourseMkp.repository.CourseRepository;
import com.CourseMkp.repository.EnrollmentRepository;

/**
 * Service layer for enrolling students in courses and querying their enrolled courses.
 */
@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Enroll a student in a course.
     *
     * Business rules:
     *  1. The course must exist — throws ResourceNotFoundException if not.
     *  2. The student must not already be enrolled — throws AlreadyEnrolledException if so.
     *
     * @param student  the authenticated student User entity
     * @param courseId the ID of the course to enroll in
     */
    public void enrollStudent(User student, Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        Course course = courseOptional.orElseThrow(() ->
            new ResourceNotFoundException("Course not found with ID: " + courseId)
        );

        boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(
            student.getId(), courseId
        );

        if (alreadyEnrolled) {
            throw new AlreadyEnrolledException(
                "You are already enrolled in course: " + course.getTitle()
            );
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .build();

        enrollmentRepository.save(enrollment);
    }

    /**
     * Return all courses the authenticated student is enrolled in.
     *
     * @param student the authenticated student User entity
     * @return list of CourseResponse DTOs
     */
    public List<CourseResponse> getEnrolledCourses(User student) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        List<CourseResponse> result = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Course course = enrollment.getCourse();
            CourseResponse dto = CourseResponse.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .description(course.getDescription())
                    .instructorName(course.getInstructor().getName())
                    .build();
            result.add(dto);
        }

        return result;
    }
}
