package com.CourseMkp.controller;

import com.CourseMkp.dto.ApiResponse;
import com.CourseMkp.dto.ApplicationResponse;
import com.CourseMkp.dto.UserResponse;
import com.CourseMkp.service.InstructorApplicationService;
import com.CourseMkp.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints:
 *   GET  /api/admin/users
 *   GET  /api/admin/applications
 *   PUT  /api/admin/applications/{id}/approve
 *   PUT  /api/admin/applications/{id}/reject
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final InstructorApplicationService applicationService;

    public AdminController(AdminService adminService,
                           InstructorApplicationService applicationService) {
        this.adminService = adminService;
        this.applicationService = applicationService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @PutMapping("/applications/{id}/approve")
    public ResponseEntity<ApiResponse> approve(@PathVariable Long id) {
        applicationService.approveApplication(id);
        return ResponseEntity.ok(ApiResponse.builder().message("Application approved").build());
    }

    @PutMapping("/applications/{id}/reject")
    public ResponseEntity<ApiResponse> reject(@PathVariable Long id) {
        applicationService.rejectApplication(id);
        return ResponseEntity.ok(ApiResponse.builder().message("Application rejected").build());
    }
}
