package com.CourseMkp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.CourseMkp.dto.CourseRequest;
import com.CourseMkp.dto.CourseResponse;
import com.CourseMkp.entity.Course;
import com.CourseMkp.entity.User;
import com.CourseMkp.exception.ResourceNotFoundException;
import com.CourseMkp.repository.CourseRepository;
import com.CourseMkp.repository.UserRepository;

/**
 * Service layer for course creation and retrieval.
 */
@Service
public class CourseService {

    private final CourseRepository courseRepository;
    public CourseService(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
    }

    /**
     * Create a new course owned by the authenticated instructor.
     *
     * @param request    course details (title, description)
     * @param instructor the User entity of the currently logged-in instructor
     * @return the persisted Course entity
     */
    public Course createCourse(CourseRequest request, User instructor) {
        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .instructor(instructor)
                .build();

        return courseRepository.save(course);
    }

    /**
     * Retrieve all courses with instructor names.
     *
     * @return list of CourseResponse DTOs (avoids circular serialization from entity graph)
     */
    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        List<CourseResponse> responseList = new ArrayList<>();

        for (Course course : courses) {
            CourseResponse dto = CourseResponse.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .description(course.getDescription())
                    .instructorName(course.getInstructor().getName())
                    .build();
            responseList.add(dto);
        }

        return responseList;
    }

    /**
     * Retrieve a single course by its ID.
     *
     * @param courseId the ID of the course to look up
     * @return a CourseResponse DTO
     * @throws ResourceNotFoundException if no course exists with the given ID
     */
    public CourseResponse getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() ->
            new ResourceNotFoundException("Course not found with ID: " + courseId)
        );

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .instructorName(course.getInstructor().getName())
                .build();
    }

    /**
     * Get all courses created by a specific instructor.
     */
    public List<CourseResponse> getCoursesByInstructor(User instructor) {
        List<Course> courses = courseRepository.findByInstructorId(instructor.getId());
        List<CourseResponse> responseList = new ArrayList<>();
        for (Course course : courses) {
            responseList.add(CourseResponse.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .description(course.getDescription())
                    .instructorName(instructor.getName())
                    .build());
        }
        return responseList;
    }

    /**
     * Update an existing course. Validates that the requester is the owner.
     */
    public void updateCourse(Long courseId, CourseRequest request, User instructor) {
        Course course = courseRepository.findById(courseId).orElseThrow(() ->
            new ResourceNotFoundException("Course not found with ID: " + courseId)
        );

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            course.setTitle(request.getTitle());
        }
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            course.setDescription(request.getDescription());
        }
        courseRepository.save(course);
    }
}
