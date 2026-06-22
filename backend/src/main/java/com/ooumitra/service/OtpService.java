package com.ooumitra.service;

import com.ooumitra.entity.OtpVerification;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.OtpVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpVerificationRepository otpRepo;
    private final WebClient.Builder webClientBuilder;
    private final Environment environment;

    @Value("${msg91.auth-key}")
    private String authKey;

    @Value("${msg91.template-id}")
    private String templateId;

    @Value("${msg91.sender-id}")
    private String senderId;

    @Value("${msg91.otp-expiry-minutes}")
    private int otpExpiryMinutes;

    @Value("${msg91.base-url}")
    private String msg91BaseUrl;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public void sendOtp(String mobileNumber) {
        otpRepo.invalidateAllForMobile(mobileNumber);
        String otp = String.format("%06d", random.nextInt(1_000_000));

        OtpVerification otpEntity = OtpVerification.builder()
                .mobileNumber(mobileNumber)
                .otp(otp)
                .expiresAt(Instant.now().plus(otpExpiryMinutes, ChronoUnit.MINUTES))
                .build();
        otpRepo.save(otpEntity);

        if (java.util.Arrays.asList(environment.getActiveProfiles()).contains("dev")) {
            log.info("[DEV] OTP for {}: {}", mobileNumber, otp);
        }

        sendViaMSG91(mobileNumber, otp);
    }

    @Transactional
    public boolean verifyOtp(String mobileNumber, String otp) {
        var otpEntity = otpRepo.findTopByMobileNumberAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                mobileNumber, Instant.now()).orElse(null);

        if (otpEntity == null || !otpEntity.getOtp().equals(otp)) {
            throw OoruMitraException.badRequest("Invalid or expired OTP");
        }
        otpEntity.setUsed(true);
        otpRepo.save(otpEntity);
        return true;
    }

    private void sendViaMSG91(String mobileNumber, String otp) {
        try {
            webClientBuilder.build()
                    .post()
                    .uri(msg91BaseUrl + "/otp")
                    .header("authkey", authKey)
                    .bodyValue(Map.of(
                            "template_id", templateId,
                            "mobile", "91" + mobileNumber,
                            "otp", otp
                    ))
                    .retrieve()
                    .bodyToMono(String.class)
                    .subscribe(
                            res -> log.info("OTP sent to {}", mobileNumber),
                            err -> log.error("MSG91 error for {}: {}", mobileNumber, err.getMessage())
                    );
        } catch (Exception e) {
            log.error("Failed to send OTP via MSG91: {}", e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void purgeExpiredOtps() {
        otpRepo.deleteExpired(Instant.now());
    }
}
