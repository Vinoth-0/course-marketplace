package com.CourseMkp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CourseMkp.dto.ApiResponse;
import com.CourseMkp.dto.CourseResponse;
import com.CourseMkp.dto.EnrollmentRequest;
import com.CourseMkp.entity.User;
import com.CourseMkp.service.EnrollmentService;

import jakarta.validation.Valid;

/**
 * Controller for student enrollment operations.
 * Only users with the STUDENT role may access these endpoints.
 */
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    /**
     * POST /api/enrollments
     *
     * Enroll the currently authenticated student in the specified course.
     * The student identity is derived from the JWT token (not from the request body).
     *
     * @param request        validated enrollment payload containing courseId
     * @param authentication Spring Security authentication context (set by JwtAuthFilter)
     * @return 201 Created on success
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse> enroll(
            @Valid @RequestBody EnrollmentRequest request,
            Authentication authentication) {

        User student = (User) authentication.getPrincipal();
        enrollmentService.enrollStudent(student, request.getCourseId());

        ApiResponse response = ApiResponse.builder()
                .message("Enrolled successfully")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/enrollments/my-courses
     *
     * Return a list of all courses the authenticated student is enrolled in.
     *
     * @param authentication Spring Security authentication context
     * @return 200 OK with list of CourseResponse DTOs
     */
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseResponse>> getMyCourses(Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        List<CourseResponse> courses = enrollmentService.getEnrolledCourses(student);
        return ResponseEntity.ok(courses);
    }
}
