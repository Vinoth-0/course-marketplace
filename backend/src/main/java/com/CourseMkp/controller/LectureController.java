package com.CourseMkp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CourseMkp.dto.ApiResponse;
import com.CourseMkp.dto.LectureRequest;
import com.CourseMkp.dto.LectureResponse;
import com.CourseMkp.entity.User;
import com.CourseMkp.service.LectureService;

/**
 * POST /api/lectures         — add a lecture to a course (INSTRUCTOR only)
 * GET  /api/lectures/course/{courseId} — list lectures for a course
 */
@RestController
@RequestMapping("/api/lectures")
public class LectureController {

    private final LectureService lectureService;

    public LectureController(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse> addLecture(
            @RequestBody LectureRequest request,
            Authentication authentication) {

        User instructor = (User) authentication.getPrincipal();
        lectureService.addLecture(request, instructor);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder().message("Lecture added successfully").build());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LectureResponse>> getLecturesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(lectureService.getLecturesByCourse(courseId));
    }
}
