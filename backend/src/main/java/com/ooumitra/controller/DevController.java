package com.ooumitra.controller;

import com.ooumitra.dto.response.AuthResponse;
import com.ooumitra.entity.User;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.UserRepository;
import com.ooumitra.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dev")
@Profile("dev")
@RequiredArgsConstructor
public class DevController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    /** Dev-only: issue a JWT for any registered mobile without OTP verification. */
    @PostMapping("/token/{mobile}")
    public ResponseEntity<AuthResponse> devToken(@PathVariable String mobile) {
        User user = userRepo.findByMobileNumber(mobile)
                .orElseThrow(() -> OoruMitraException.notFound("User with mobile " + mobile));
        String access  = jwtUtil.generateToken(user.getId(), user.getMobileNumber(), user.getRole().name());
        String refresh = jwtUtil.generateRefreshToken(user.getId(), user.getMobileNumber());
        return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .mobileNumber(user.getMobileNumber())
                .role(user.getRole().name())
                .language(user.getLanguage().name())
                .build());
    }
}
