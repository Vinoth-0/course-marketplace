package com.CourseMkp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.CourseMkp.dto.ApplicationRequest;
import com.CourseMkp.dto.ApplicationResponse;
import com.CourseMkp.entity.ApplicationStatus;
import com.CourseMkp.entity.InstructorApplication;
import com.CourseMkp.entity.Role;
import com.CourseMkp.entity.User;
import com.CourseMkp.exception.ResourceNotFoundException;
import com.CourseMkp.repository.InstructorApplicationRepository;
import com.CourseMkp.repository.UserRepository;

@Service
public class InstructorApplicationService {

    private final InstructorApplicationRepository appRepo;
    private final UserRepository userRepository;

    public InstructorApplicationService(InstructorApplicationRepository appRepo,
                                        UserRepository userRepository) {
        this.appRepo = appRepo;
        this.userRepository = userRepository;
    }

    public void submitApplication(ApplicationRequest request, User applicant) {
        if (appRepo.existsByApplicantId(applicant.getId())) {
            throw new IllegalStateException("You have already submitted an application.");
        }
        InstructorApplication app = InstructorApplication.builder()
                .applicant(applicant)
                .bio(request.getBio())
                .expertise(request.getExpertise())
                .reason(request.getReason())
                .status(ApplicationStatus.PENDING)
                .build();
        appRepo.save(app);
    }

    public List<ApplicationResponse> getAllApplications() {
        return appRepo.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void approveApplication(Long appId) {
        InstructorApplication app = appRepo.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + appId));
        app.setStatus(ApplicationStatus.APPROVED);
        appRepo.save(app);

        // Promote user role to INSTRUCTOR
        User user = app.getApplicant();
        user.setRole(Role.INSTRUCTOR);
        userRepository.save(user);
    }

    public void rejectApplication(Long appId) {
        InstructorApplication app = appRepo.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + appId));
        app.setStatus(ApplicationStatus.REJECTED);
        appRepo.save(app);
    }

    private ApplicationResponse toResponse(InstructorApplication app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .applicantName(app.getApplicant().getName())
                .userEmail(app.getApplicant().getEmail())
                .bio(app.getBio())
                .expertise(app.getExpertise())
                .reason(app.getReason())
                .status(app.getStatus().name())
                .build();
    }
}
