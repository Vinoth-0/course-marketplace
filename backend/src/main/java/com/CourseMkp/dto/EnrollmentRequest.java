package com.CourseMkp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for the POST /api/enrollments request body.
 * The student identity is resolved from the JWT token, NOT from this body.
 */
@Getter
@Setter
@NoArgsConstructor
public class EnrollmentRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;
}
