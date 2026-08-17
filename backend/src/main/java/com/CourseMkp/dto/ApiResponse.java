package com.CourseMkp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Generic API response wrapper used across all controller endpoints.
 * Fields are optional; populate only the fields relevant to the specific response.
 *
 * Examples:
 *   Register success → { "message": "User registered successfully", "userId": 1 }
 *   Login success    → { "token": "eyJ..." }
 *   Error            → { "error": "...", "status": 404 }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {

    /** Human-readable success message. */
    private String message;

    /** JWT token (populated on login). */
    private String token;

    /** Authenticated user's email (populated on login). */
    private String email;

    /** Authenticated user's role (populated on login). */
    private String role;

    /** ID of the newly created resource (user, course, etc.). */
    private Long userId;

    /** ID of the newly created course. */
    private Long courseId;

    /** Error description (populated on failure). */
    private String error;

    /** HTTP status code (populated on failure). */
    private Integer status;
}
