package com.ooumitra.config;

import com.ooumitra.entity.OtpVerification;
import com.ooumitra.entity.User;
import com.ooumitra.enums.Role;
import com.ooumitra.repository.OtpVerificationRepository;
import com.ooumitra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DevDataInitializer implements CommandLineRunner {

    private static final String ADMIN_MOBILE = "9000000000";
    private static final String ADMIN_OTP    = "123456";

    private final UserRepository userRepo;
    private final OtpVerificationRepository otpRepo;

    @Override
    public void run(String... args) {
        if (userRepo.findByMobileNumber(ADMIN_MOBILE).isEmpty()) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("OoruMitra")
                    .mobileNumber(ADMIN_MOBILE)
                    .role(Role.ADMIN)
                    .isVerified(true)
                    .isActive(true)
                    .village("Headquarters")
                    .build();
            userRepo.save(admin);
        }

        // Seed a long-lived OTP so the dev server can be logged in immediately
        OtpVerification otp = OtpVerification.builder()
                .mobileNumber(ADMIN_MOBILE)
                .otp(ADMIN_OTP)
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .build();
        otpRepo.save(otp);

        log.info("");
        log.info("══════════════════════════════════════════════════");
        log.info("  DEV ADMIN CREDENTIALS");
        log.info("  Mobile : {}", ADMIN_MOBILE);
        log.info("  OTP    : {}  (valid 24 h, reseeded every restart)", ADMIN_OTP);
        log.info("  POST /api/auth/login  { \"mobileNumber\": \"{}\", \"otp\": \"{}\" }", ADMIN_MOBILE, ADMIN_OTP);
        log.info("  Swagger : http://localhost:8080/swagger-ui.html");
        log.info("  H2 DB   : http://localhost:8080/h2-console  (JDBC URL above)");
        log.info("══════════════════════════════════════════════════");
        log.info("");
    }
}
