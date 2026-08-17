package com.CourseMkp.exception;

/**
 * Thrown when a requested resource (User, Course, etc.) cannot be found.
 * Maps to HTTP 404 Not Found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
