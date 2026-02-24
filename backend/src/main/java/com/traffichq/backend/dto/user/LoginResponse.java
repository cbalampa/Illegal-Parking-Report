package com.traffichq.backend.dto.user;

import com.traffichq.backend.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String email;
    private UserRole role;
    private String token;
}