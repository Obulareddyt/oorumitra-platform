package com.ooumitra.controller;

import com.ooumitra.dto.request.CredentialLoginRequest;
import com.ooumitra.dto.request.LoginRequest;
import com.ooumitra.dto.request.OtpRequest;
import com.ooumitra.dto.request.RegisterRequest;
import com.ooumitra.dto.response.AuthResponse;
import com.ooumitra.service.AuthService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP to mobile number")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody OtpRequest req) {
        authService.sendOtp(req.getMobileNumber(), req.getChannel());
        return ResponseEntity.ok(ApiResponse.ok("OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP code only")
    public ResponseEntity<ApiResponse<Void>> verifyOtpOnly(@RequestParam String mobileNumber, @RequestParam String otp) {
        authService.verifyOtpOnly(mobileNumber, otp);
        return ResponseEntity.ok(ApiResponse.ok("Mobile number verified successfully."));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user with OTP verification")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.register(req)));
    }

    @GetMapping("/check-mobile")
    @Operation(summary = "Check whether a mobile number is already registered")
    public ResponseEntity<ApiResponse<Boolean>> checkMobile(@RequestParam String mobileNumber) {
        return ResponseEntity.ok(ApiResponse.ok(authService.isMobileRegistered(mobileNumber)));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with OTP")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.loginWithOtp(req.getMobileNumber(), req.getOtp())));
    }

    @PostMapping("/login-credentials")
    @Operation(summary = "Login with username and password")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithCredentials(@Valid @RequestBody CredentialLoginRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.loginWithCredentials(req.getUsername(), req.getPassword())));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestParam String refreshToken) {
        return ResponseEntity.ok(ApiResponse.ok(authService.refreshToken(refreshToken)));
    }
}
