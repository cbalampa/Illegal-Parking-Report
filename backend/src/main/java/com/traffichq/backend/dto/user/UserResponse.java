package com.traffichq.backend.dto.user;

import com.traffichq.backend.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String email;
    private UserRole role;
    private LocalDateTime createdAt;
}