package com.CourseMkp.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.CourseMkp.filter.JwtAuthFilter;

/**
 * Spring Security 6 configuration.
 *
 * Key design decisions:
 *  - Uses SecurityFilterChain bean (NOT the deprecated WebSecurityConfigurerAdapter).
 *  - Stateless session management — JWT replaces server-side sessions.
 *  - @EnableMethodSecurity allows @PreAuthorize annotations on controller methods.
 *  - CSRF is disabled — appropriate for a stateless REST API.
 *  - CORS enabled for React dev server at localhost:3000.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * BCrypt password encoder bean.
     * Used in UserService to hash passwords on registration and verify them on login.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS configuration — allows the React frontend (port 3000) to call the API.
     * In production, replace localhost:3000 with your deployed frontend URL.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Main security filter chain.
     *
     * Public routes:  /api/auth/register, /api/auth/login, GET /api/courses, GET /api/courses/{id}
     * Secured routes: everything else — JWT required
     *
     * Role-level checks are handled by @PreAuthorize on individual controller methods.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Public — no token needed
                .requestMatchers("/api/auth/*").permitAll()
                // Public course browsing — guests can see the catalog
                .requestMatchers(
                    org.springframework.http.HttpMethod.GET, "/api/courses", "/api/courses/**"
                ).permitAll()
                // Everything else requires a valid JWT
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
