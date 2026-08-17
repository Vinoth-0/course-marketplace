package com.CourseMkp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LectureRequest {
    private String title;
    private String videoUrl;
    private String duration;
    private Long courseId;
}
