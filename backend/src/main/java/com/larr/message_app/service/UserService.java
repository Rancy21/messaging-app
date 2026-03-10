package com.larr.message_app.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.larr.message_app.dto.LoginRequest;
import com.larr.message_app.dto.RegisterRequest;
import com.larr.message_app.dto.UserDTO;
import com.larr.message_app.exception.InvalidCredentialsException;
import com.larr.message_app.exception.UserExistsException;
import com.larr.message_app.model.User;
import com.larr.message_app.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder;

    public User saveUser(RegisterRequest request) {
        if (repository.existsByUsername(request.getUsername())) {
            throw new UserExistsException("User with username: " + request.getUsername() + " already exists");
        }

        String hash = encoder.encode(request.getPassword());

        User user = new User(request.getUsername(), hash);

        return repository.save(user);
    }

    public User loginUser(LoginRequest request) {
        User user = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Credentials"));

        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Wrong Credentials");
        }

        return user;
    }

    public User findByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("user with name: " + username + " does not exist"));
    }

    public List<UserDTO> getUsersByUsername(String username,
            String userId) {
        return repository.listByUsername(username, userId);
    }
}
