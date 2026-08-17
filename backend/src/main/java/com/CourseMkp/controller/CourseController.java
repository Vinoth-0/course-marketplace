package com.CourseMkp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CourseMkp.dto.ApiResponse;
import com.CourseMkp.dto.CourseRequest;
import com.CourseMkp.dto.CourseResponse;
import com.CourseMkp.entity.User;
import com.CourseMkp.service.CourseService;

import jakarta.validation.Valid;

/**
 * Controller for course management.
 * Creating/editing a course requires INSTRUCTOR role.
 * Viewing courses is public (security layer allows GET /api/courses*).
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /**
     * POST /api/courses — Create a new course (INSTRUCTOR only).
     */
    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse> createCourse(
            @Valid @RequestBody CourseRequest request,
            Authentication authentication) {

        User instructor = (User) authentication.getPrincipal();
        com.CourseMkp.entity.Course savedCourse = courseService.createCourse(request, instructor);

        ApiResponse response = ApiResponse.builder()
                .message("Course created")
                .courseId(savedCourse.getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/courses — Retrieve all courses (public — no auth needed).
     */
    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    /**
     * GET /api/courses/my — Retrieve courses created by the logged-in instructor.
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<CourseResponse>> getMyCourses(Authentication authentication) {
        User instructor = (User) authentication.getPrincipal();
        List<CourseResponse> courses = courseService.getCoursesByInstructor(instructor);
        return ResponseEntity.ok(courses);
    }

    /**
     * GET /api/courses/{id} — Retrieve a single course by ID (public).
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        CourseResponse course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    /**
     * PUT /api/courses/{id} — Update a course (INSTRUCTOR only, must own it).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse> updateCourse(
            @PathVariable Long id,
            @RequestBody CourseRequest request,
            Authentication authentication) {

        User instructor = (User) authentication.getPrincipal();
        courseService.updateCourse(id, request, instructor);

        ApiResponse response = ApiResponse.builder()
                .message("Course updated successfully")
                .courseId(id)
                .build();

        return ResponseEntity.ok(response);
    }
}
