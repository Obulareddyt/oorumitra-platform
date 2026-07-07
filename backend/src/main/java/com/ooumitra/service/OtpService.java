package com.ooumitra.service;

import com.ooumitra.entity.OtpVerification;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.OtpVerificationRepository;
import com.ooumitra.provider.SmsProviderFactory;
import com.ooumitra.provider.WhatsAppProviderFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpVerificationRepository otpRepo;
    private final SmsProviderFactory smsProviderFactory;
    private final WhatsAppProviderFactory whatsAppProviderFactory;
    private final Environment environment;
    private final BCryptPasswordEncoder passwordEncoder;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public void sendOtp(String mobileNumber, String channel) {
        if (channel == null || channel.isBlank()) {
            channel = "SMS";
        }

        // Rate limit: Maximum 3 resend attempts in the last 5 minutes
        Instant cutoff = Instant.now().minus(5, ChronoUnit.MINUTES);
        long sentCount = otpRepo.countOtpsSentInLastFiveMinutes(mobileNumber, cutoff);
        if (sentCount >= 3) {
            log.warn("[AUDIT] Rate limit triggered for mobileNumber {}: attempted {} times in 5 minutes", mobileNumber, sentCount);
            throw OoruMitraException.badRequest("Too many OTP requests. Maximum 3 resend attempts allowed in 5 minutes.");
        }

        // Invalidate old active OTP codes
        otpRepo.invalidateAllForMobile(mobileNumber);

        // Generate secure 6-digit OTP code
        String rawOtp = String.format("%06d", random.nextInt(1_000_000));

        // Hashed OTP before storage
        String hashedOtp = passwordEncoder.encode(rawOtp);

        OtpVerification otpEntity = OtpVerification.builder()
                .mobileNumber(mobileNumber)
                .otp(hashedOtp)
                .expiresAt(Instant.now().plus(5, ChronoUnit.MINUTES)) // 5 minutes validity
                .channel(channel)
                .build();
        otpRepo.save(otpEntity);

        // Audit Log transaction
        log.info("[AUDIT] New OTP generated for mobile: {}, channel: {}, code length: 6", mobileNumber, channel);

        // Log fallback OTP for developer verification in console
        log.info("[OTP-FALLBACK] OTP code for {} [via {}]: {}", mobileNumber, channel, rawOtp);

        String message = "Your OoruMitra verification code is: " + rawOtp;
        try {
            if ("WHATSAPP".equalsIgnoreCase(channel)) {
                whatsAppProviderFactory.getActiveProvider().sendWhatsAppMessage(mobileNumber, message);
            } else {
                smsProviderFactory.getActiveProvider().sendSms(mobileNumber, message);
            }
        } catch (Exception e) {
            log.error("Failed to send OTP to {}: {}", mobileNumber, e.getMessage());
        }
    }

    // Fallback for older code signatures (e.g. login)
    @Transactional
    public void sendOtp(String mobileNumber) {
        sendOtp(mobileNumber, "SMS");
    }

    @Transactional
    public boolean verifyOtpOnly(String mobileNumber, String otp) {
        OtpVerification otpEntity = otpRepo.findTopByMobileNumberAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                mobileNumber, Instant.now()).orElse(null);

        if (otpEntity == null) {
            log.warn("[AUDIT] Verification attempt failed for {}: No active or unexpired OTP found", mobileNumber);
            throw OoruMitraException.badRequest("OTP has expired. Please request a new OTP.");
        }

        // Brute force prevention: block and invalidate if attempts exceed 3
        if (otpEntity.getAttempts() >= 3) {
            otpEntity.setUsed(true);
            otpRepo.save(otpEntity);
            log.warn("[AUDIT] Blocked verification for {}: Exceeded max failed verification attempts", mobileNumber);
            throw OoruMitraException.badRequest("OTP blocked due to too many failed attempts. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(otp, otpEntity.getOtp())) {
            otpEntity.setAttempts(otpEntity.getAttempts() + 1);
            if (otpEntity.getAttempts() >= 3) {
                otpEntity.setUsed(true);
            }
            otpRepo.save(otpEntity);
            log.warn("[AUDIT] Failed OTP verification for {}: Invalid code (attempt {}/3)", mobileNumber, otpEntity.getAttempts());
            throw OoruMitraException.badRequest("Invalid OTP. Please try again.");
        }

        log.info("[AUDIT] Verification successful (only check) for mobile: {}", mobileNumber);
        return true;
    }

    @Transactional
    public boolean verifyOtp(String mobileNumber, String otp) {
        OtpVerification otpEntity = otpRepo.findTopByMobileNumberAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                mobileNumber, Instant.now()).orElse(null);

        if (otpEntity == null) {
            log.warn("[AUDIT] Final verification failed for {}: No active or unexpired OTP found", mobileNumber);
            throw OoruMitraException.badRequest("OTP has expired. Please request a new OTP.");
        }

        if (otpEntity.getAttempts() >= 3) {
            otpEntity.setUsed(true);
            otpRepo.save(otpEntity);
            log.warn("[AUDIT] Blocked final verification for {}: Exceeded max failed attempts", mobileNumber);
            throw OoruMitraException.badRequest("OTP blocked due to too many failed attempts. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(otp, otpEntity.getOtp())) {
            otpEntity.setAttempts(otpEntity.getAttempts() + 1);
            if (otpEntity.getAttempts() >= 3) {
                otpEntity.setUsed(true);
            }
            otpRepo.save(otpEntity);
            log.warn("[AUDIT] Failed final verification for {}: Invalid code (attempt {}/3)", mobileNumber, otpEntity.getAttempts());
            throw OoruMitraException.badRequest("Invalid OTP. Please try again.");
        }

        otpEntity.setUsed(true);
        otpRepo.save(otpEntity);
        log.info("[AUDIT] Final OTP verified and invalidated for mobile: {}", mobileNumber);
        return true;
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void purgeExpiredOtps() {
        otpRepo.deleteExpired(Instant.now());
    }
}
