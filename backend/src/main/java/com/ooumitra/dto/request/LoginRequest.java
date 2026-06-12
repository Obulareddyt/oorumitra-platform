package com.ooumitra.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$")
    private String mobileNumber;

    @NotBlank @Pattern(regexp = "^\\d{6}$")
    private String otp;
}
