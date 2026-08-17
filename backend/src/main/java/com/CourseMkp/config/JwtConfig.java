package com.CourseMkp.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Component responsible for JWT token generation and validation.
 *
 * Uses JJWT 0.12.x API — key construction via Keys.hmacShaKeyFor().
 * The secret must be at least 256 bits (32 ASCII characters).
 */
@Component
public class JwtConfig {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    /**
     * Derive a SecretKey from the configured secret string.
     * This is called on every operation to avoid storing a mutable field.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate a signed JWT token for the given email and role.
     *
     * @param email the user's email — used as the JWT subject
     * @param role  the user's role — stored as a custom claim
     * @return signed JWT string
     */
    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract all claims from a token.
     * Throws a JwtException if the token is invalid or expired.
     *
     * @param token the JWT string
     * @return Claims object containing subject, role, and timestamps
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extract the email (subject) from a token.
     *
     * @param token the JWT string
     * @return email address stored as the subject claim
     */
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract the role claim from a token.
     *
     * @param token the JWT string
     * @return role string (e.g., "STUDENT", "INSTRUCTOR", "ADMIN")
     */
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    /**
     * Validate that a token has not expired.
     *
     * @param token the JWT string
     * @return true if the token is still valid
     */
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }
}
