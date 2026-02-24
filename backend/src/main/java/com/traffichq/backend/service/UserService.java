package com.traffichq.backend.service;

import com.traffichq.backend.dto.user.LoginResponse;
import com.traffichq.backend.dto.user.UserLoginRequest;
import com.traffichq.backend.dto.user.UserRegistrationRequest;
import com.traffichq.backend.dto.user.UserResponse;
import com.traffichq.backend.entity.User;
import com.traffichq.backend.enums.UserRole;
import com.traffichq.backend.exception.NotFoundException;
import com.traffichq.backend.repository.UserRepository;
import com.traffichq.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.CITIZEN);

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public LoginResponse login(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(
                user.getUserId(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }

    public UserResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found: " + email));
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}