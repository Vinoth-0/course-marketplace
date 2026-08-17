package com.CourseMkp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApplicationRequest {
    private String bio;
    private String expertise;
    private String reason;
}
