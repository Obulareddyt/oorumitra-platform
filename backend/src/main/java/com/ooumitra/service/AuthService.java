package com.ooumitra.service;

import com.ooumitra.dto.request.RegisterRequest;
import com.ooumitra.dto.response.AuthResponse;
import com.ooumitra.entity.User;
import com.ooumitra.enums.Role;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.UserRepository;
import com.ooumitra.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public void sendOtp(String mobileNumber, String channel) {
        otpService.sendOtp(mobileNumber, channel);
    }

    @Transactional
    public void verifyOtpOnly(String mobileNumber, String otp) {
        otpService.verifyOtpOnly(mobileNumber, otp);
    }

    public boolean isMobileRegistered(String mobileNumber) {
        return userRepo.existsByMobileNumber(mobileNumber);
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByMobileNumber(req.getMobileNumber())) {
            throw OoruMitraException.conflict("This mobile number is already registered. Please sign in instead.");
        }
        otpService.verifyOtp(req.getMobileNumber(), req.getOtp());

        String passwordHash = (req.getPassword() != null && !req.getPassword().isBlank())
                ? passwordEncoder.encode(req.getPassword())
                : null;

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .mobileNumber(req.getMobileNumber())
                .email(req.getEmail())
                .gender(req.getGender())
                .role(Role.BUYER)
                .isVerified(true)
                .village(req.getVillage())
                .username(req.getUsername())
                .whatsappNumber(req.getWhatsappNumber())
                .passwordHash(passwordHash)
                .build();
        user = userRepo.save(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse loginWithOtp(String mobileNumber, String otp) {
        User user = userRepo.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> OoruMitraException.notFound("This mobile number is not registered. Please create an account to continue. [Account]"));
        otpService.verifyOtp(mobileNumber, otp);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse loginWithCredentials(String username, String password) {
        // Allow login by username OR mobile number
        User user = userRepo.findByUsername(username)
                .or(() -> userRepo.findByMobileNumber(username))
                .orElseThrow(() -> OoruMitraException.notFound("This account is not registered. Please create an account to continue. [Account]"));

        if (user.getPasswordHash() == null) {
            throw OoruMitraException.badRequest("This account was registered without a password. Please use OTP login instead.");
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw OoruMitraException.badRequest("Incorrect password. Please try again.");
        }
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
