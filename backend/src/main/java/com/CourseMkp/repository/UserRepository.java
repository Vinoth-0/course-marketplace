package com.CourseMkp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CourseMkp.entity.User;

/**
 * Spring Data JPA repository for the User entity.
 * Extends JpaRepository — no manual DAO implementation needed.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their unique email address.
     * Used during login and to check for duplicate registrations.
     *
     * @param email the email address to search for
     * @return an Optional containing the User if found, or empty if not found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check whether a user with the given email already exists.
     * Used to enforce email uniqueness during registration.
     *
     * @param email the email address to check
     * @return true if the email is already registered, false otherwise
     */
    boolean existsByEmail(String email);
}
