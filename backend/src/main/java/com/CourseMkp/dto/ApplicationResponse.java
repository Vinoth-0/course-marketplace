package com.CourseMkp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApplicationResponse {
    private Long id;
    private String applicantName;
    private String userEmail;
    private String bio;
    private String expertise;
    private String reason;
    private String status;
}
