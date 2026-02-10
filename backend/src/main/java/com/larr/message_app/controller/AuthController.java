package com.larr.message_app.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.larr.message_app.dto.AuthResponse;
import com.larr.message_app.dto.LoginRequest;
import com.larr.message_app.dto.RegisterRequest;
import com.larr.message_app.model.User;
import com.larr.message_app.security.jwt.JwtUtils;
import com.larr.message_app.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService service;

    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = service.loginUser(request);

        ResponseCookie cookie = jwtUtils.generateCookie(user.getId());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(user.getId(), user.getUsername()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = service.saveUser(request);

        return ResponseEntity.ok(new AuthResponse(user.getId(), user.getUsername()));
    }

}