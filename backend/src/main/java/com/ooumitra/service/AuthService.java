package com.ooumitra.service;

import com.ooumitra.dto.request.RegisterRequest;
import com.ooumitra.dto.response.AuthResponse;
import com.ooumitra.entity.User;
import com.ooumitra.enums.Role;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.UserRepository;
import com.ooumitra.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;

    @Transactional
    public void sendOtp(String mobileNumber) {
        otpService.sendOtp(mobileNumber);
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByMobileNumber(req.getMobileNumber())) {
            throw OoruMitraException.conflict("Mobile number already registered");
        }
        otpService.verifyOtp(req.getMobileNumber(), req.getOtp());

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .mobileNumber(req.getMobileNumber())
                .email(req.getEmail())
                .gender(req.getGender())
                .role(Role.BUYER)
                .isVerified(true)
                .village(req.getVillage())
                .build();
        user = userRepo.save(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse loginWithOtp(String mobileNumber, String otp) {
        User user = userRepo.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> OoruMitraException.notFound("User"));
        otpService.verifyOtp(mobileNumber, otp);
        return buildAuthResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.isRefreshTokenValid(refreshToken)) {
            throw OoruMitraException.badRequest("Invalid refresh token");
        }
        Long userId = jwtUtil.extractUserId(refreshToken);
        User user = userRepo.findById(userId)
                .orElseThrow(() -> OoruMitraException.notFound("User"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateToken(user.getId(), user.getMobileNumber(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getMobileNumber());
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .mobileNumber(user.getMobileNumber())
                .role(user.getRole().name())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .language(user.getLanguage().name())
                .build();
    }
}
