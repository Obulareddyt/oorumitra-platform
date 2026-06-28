package com.ooumitra.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Size(max = 60)
    private String firstName;

    @NotBlank @Size(max = 60)
    private String lastName;

    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String mobileNumber;

    @NotBlank @Size(min = 6, max = 6)
    private String otp;

    private String email;

    @NotBlank
    private String gender;

    private String village;

    @Size(min = 8, max = 50, message = "Username must be at least 8 characters")
    private String username;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid WhatsApp number")
    private String whatsappNumber;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
