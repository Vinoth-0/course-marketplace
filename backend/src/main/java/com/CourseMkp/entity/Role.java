package com.CourseMkp.entity;

/**
 * Enum representing the possible roles a user can have in the system.
 * STUDENT  — can browse and enroll in courses.
 * INSTRUCTOR — can create and manage their own courses.
 * ADMIN    — has full system access.
 */
public enum Role {
    STUDENT,
    INSTRUCTOR,
    ADMIN
}
