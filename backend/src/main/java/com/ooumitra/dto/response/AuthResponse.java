package com.ooumitra.dto.response;

import lombok.*;

@Data @Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private Long userId;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String role;
    private String profilePhotoUrl;
    private String language;
}
