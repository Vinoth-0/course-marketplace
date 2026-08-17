package com.CourseMkp.exception;

/**
 * Thrown when a registration attempt uses an email address that already exists.
 * Maps to HTTP 409 Conflict.
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String message) {
        super(message);
    }
}
