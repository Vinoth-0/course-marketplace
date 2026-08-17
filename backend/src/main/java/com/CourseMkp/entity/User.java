package com.CourseMkp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA entity representing a user in the system.
 * A user can be a STUDENT, INSTRUCTOR, or ADMIN.
 * Instructors own a list of courses they have created.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "email", length = 150, unique = true, nullable = false)
    private String email;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Courses created by this user (relevant only when role = INSTRUCTOR).
     * Cascade REMOVE ensures orphan courses are cleaned up if an instructor is deleted.
     */
    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Course> createdCourses = new ArrayList<>();

    /** Transient — not persisted. Carries the generated JWT token back to the controller after login. */
    @Transient
    private String jwtToken;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
