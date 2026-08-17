package com.CourseMkp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for the POST /api/courses request body.
 * The instructor is resolved from the JWT token, NOT from the request body.
 */
@Getter
@Setter
@NoArgsConstructor
public class CourseRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be at most 200 characters")
    private String title;

    private String description;
}
