package com.CourseMkp.exception;

/**
 * Thrown when the requesting user does not have permission to perform an action.
 * Maps to HTTP 403 Forbidden.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
