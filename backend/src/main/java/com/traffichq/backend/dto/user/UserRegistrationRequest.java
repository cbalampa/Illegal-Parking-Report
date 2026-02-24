package com.traffichq.backend.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationRequest {
    private String email;
    private String password;
}