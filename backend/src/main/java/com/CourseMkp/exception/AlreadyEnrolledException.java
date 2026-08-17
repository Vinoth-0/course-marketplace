package com.CourseMkp.exception;

/**
 * Thrown when a student tries to enroll in a course they are already enrolled in.
 * Maps to HTTP 409 Conflict.
 */
public class AlreadyEnrolledException extends RuntimeException {

    public AlreadyEnrolledException(String message) {
        super(message);
    }
}
