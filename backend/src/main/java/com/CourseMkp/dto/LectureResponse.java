package com.CourseMkp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LectureResponse {
    private Long id;
    private String title;
    private String videoUrl;
    private String duration;
}
