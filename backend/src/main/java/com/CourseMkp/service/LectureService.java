package com.CourseMkp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.CourseMkp.dto.LectureRequest;
import com.CourseMkp.dto.LectureResponse;
import com.CourseMkp.entity.Course;
import com.CourseMkp.entity.Lecture;
import com.CourseMkp.entity.User;
import com.CourseMkp.exception.ResourceNotFoundException;
import com.CourseMkp.repository.CourseRepository;
import com.CourseMkp.repository.LectureRepository;

@Service
public class LectureService {

    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;

    public LectureService(LectureRepository lectureRepository, CourseRepository courseRepository) {
        this.lectureRepository = lectureRepository;
        this.courseRepository = courseRepository;
    }

    public void addLecture(LectureRequest request, User instructor) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + request.getCourseId()));

        Lecture lecture = Lecture.builder()
                .title(request.getTitle())
                .videoUrl(request.getVideoUrl())
                .duration(request.getDuration())
                .course(course)
                .build();

        lectureRepository.save(lecture);
    }

    public List<LectureResponse> getLecturesByCourse(Long courseId) {
        return lectureRepository.findByCourseId(courseId).stream()
                .map(l -> LectureResponse.builder()
                        .id(l.getId())
                        .title(l.getTitle())
                        .videoUrl(l.getVideoUrl())
                        .duration(l.getDuration())
                        .build())
                .collect(Collectors.toList());
    }
}
