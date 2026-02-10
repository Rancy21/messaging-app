package com.larr.message_app.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.larr.message_app.security.jwt.JwtFilter;
import com.larr.message_app.security.jwt.JwtUtils;

import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtUtils jwtUtils;

    // Define Bean for JwtFilter
    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter(jwtUtils);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource configurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow Request from frontend
        configuration.setAllowedOriginPatterns(List.of("http://localhost:5173"));

        // Allow sending cookies / credentials
        configuration.setAllowCredentials(true);

        // Allow common HTTP methods
        configuration.setAllowedMethods(List.of("POST", "GET", "PATCH", "DELETE", "OPTIONS"));

        // Allow specific headers in request
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

        // Apply the configuration to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // Main securtity filter
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.csrf(AbstractHttpConfigurer::disable).authorizeHttpRequests(auth ->

        auth.dispatcherTypeMatchers(DispatcherType.ERROR, DispatcherType.FORWARD).permitAll()
                // allow public endpoints access for login / register
                .requestMatchers("/api/auth/**").permitAll()
                // allow Spring's error endpoint
                .requestMatchers("/error").permitAll()
                // require authenticaion for everything else
                .anyRequest().authenticated());

        // Add jwt filter to the filter chain
        http.addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);

        http.cors(cors -> cors.configurationSource(configurationSource()));

        return http.build();

    }
}
