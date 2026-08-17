package com.CourseMkp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CourseMkp.dto.ApiResponse;
import com.CourseMkp.dto.LoginRequest;
import com.CourseMkp.dto.RegisterRequest;
import com.CourseMkp.entity.User;
import com.CourseMkp.service.UserService;

import jakarta.validation.Valid;

/**
 * Controller handling user registration and authentication.
 * Both endpoints are public — no JWT token is required.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/auth/register
     *
     * Register a new user account.
     *
     * @param request validated registration payload
     * @return 201 Created with userId on success
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        User savedUser = userService.registerUser(request);

        ApiResponse response = ApiResponse.builder()
                .message("User registered successfully")
                .userId(savedUser.getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     *
     * Authenticate and obtain a JWT token.
     *
     * @param request validated login credentials
     * @return 200 OK with JWT token on success
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.loginUser(request);

        ApiResponse response = ApiResponse.builder()
                .token(user.getJwtToken())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();

        return ResponseEntity.ok(response);
    }
}
