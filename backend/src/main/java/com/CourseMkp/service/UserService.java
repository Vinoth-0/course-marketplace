package com.CourseMkp.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.CourseMkp.config.JwtConfig;
import com.CourseMkp.dto.LoginRequest;
import com.CourseMkp.dto.RegisterRequest;
import com.CourseMkp.entity.Role;
import com.CourseMkp.entity.User;
import com.CourseMkp.exception.DuplicateEmailException;
import com.CourseMkp.exception.ResourceNotFoundException;
import com.CourseMkp.exception.UnauthorizedException;
import com.CourseMkp.repository.UserRepository;

/**
 * Service layer for user registration and authentication.
 * All business logic lives here; the controller only handles HTTP concerns.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtConfig jwtConfig) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtConfig = jwtConfig;
    }

    /**
     * Register a new user.
     *
     * Business rules:
     *  1. Email must be unique — throws DuplicateEmailException if already in use.
     *  2. Password is BCrypt-hashed before persistence.
     *  3. Role defaults to STUDENT if not provided or blank.
     *
     * @param request registration details from the client
     * @return the persisted User entity (with generated ID)
     */
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(
                "Email address '" + request.getEmail() + "' is already registered."
            );
        }

        Role role;
        if (request.getRole() == null || request.getRole().isBlank()) {
            role = Role.STUDENT;
        } else {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException(
                    "Invalid role '" + request.getRole() + "'. Accepted values: STUDENT, INSTRUCTOR, ADMIN"
                );
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        return userRepository.save(user);
    }

    /**
     * Authenticate a user and return a signed JWT token.
     *
     * Business rules:
     *  1. Find the user by email — throws ResourceNotFoundException if not found.
     *  2. Verify BCrypt password — throws UnauthorizedException on mismatch.
     *  3. Generate and return a JWT carrying email and role claims.
     *
     * @param request login credentials from the client
     * @return a signed JWT string
     */
    public User loginUser(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        User user = userOptional.orElseThrow(() ->
            new ResourceNotFoundException("No account found for email: " + request.getEmail())
        );

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!passwordMatches) {
            throw new UnauthorizedException("Invalid password. Please try again.");
        }

        // Generate JWT and attach it to the User object via a transient field
        // (We return the full User so the controller can extract email + role)
        user.setJwtToken(jwtConfig.generateToken(user.getEmail(), user.getRole().name()));
        return user;
    }
}
