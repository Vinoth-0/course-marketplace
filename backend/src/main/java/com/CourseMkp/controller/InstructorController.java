package com.CourseMkp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CourseMkp.dto.ApiResponse;
import com.CourseMkp.dto.ApplicationRequest;
import com.CourseMkp.entity.User;
import com.CourseMkp.service.InstructorApplicationService;

/**
 * POST /api/instructor/apply — student submits an application to become instructor
 */
@RestController
@RequestMapping("/api/instructor")
public class InstructorController {

    private final InstructorApplicationService applicationService;

    public InstructorController(InstructorApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse> apply(
            @RequestBody ApplicationRequest request,
            Authentication authentication) {

        User student = (User) authentication.getPrincipal();
        applicationService.submitApplication(request, student);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .message("Application submitted successfully. We will review it shortly.")
                        .build());
    }
}
