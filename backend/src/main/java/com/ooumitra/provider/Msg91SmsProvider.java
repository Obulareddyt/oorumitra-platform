package com.ooumitra.provider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component("msg91Sms")
@RequiredArgsConstructor
@Slf4j
public class Msg91SmsProvider implements SmsProvider {

    private static final Pattern OTP_PATTERN = Pattern.compile("\\d{4,8}");

    private final WebClient.Builder webClientBuilder;

    @Value("${msg91.auth-key:}")
    private String authKey;

    @Value("${msg91.template-id:}")
    private String templateId;

    @Value("${msg91.base-url:https://api.msg91.com/api/v5}")
    private String baseUrl;

    @Override
    public void sendSms(String mobileNumber, String message) {
        // In dev/unconfigured environments, fall back to console-only delivery
        // (the OTP is already logged by OtpService via [OTP-FALLBACK]).
        if (isBlankOrPlaceholder(authKey) || isBlankOrPlaceholder(templateId)) {
            log.warn("[SMS-MSG91] MSG91 credentials not configured — SMS not sent, "
                    + "relying on console OTP fallback for 91{}", mobileNumber);
            return;
        }

        String otpCode = extractOtp(message);

        // MSG91 Send OTP endpoint. We supply our own `otp` value so MSG91 only
        // delivers it — OTP generation/verification stays in OtpService.
        String uri = UriComponentsBuilder.fromHttpUrl(baseUrl + "/otp")
                .queryParam("template_id", templateId)
                .queryParam("mobile", "91" + mobileNumber)
                .queryParam("otp", otpCode)
                .queryParam("authkey", authKey)
                .encode()
                .toUriString();

        try {
            String response = webClientBuilder.build()
                    .post()
                    .uri(uri)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(10));

            log.info("[SMS-MSG91] SMS dispatched to 91{}: {}", mobileNumber, response);

            // MSG91 returns HTTP 200 with a JSON body whose "type" is "error" on
            // failures (bad template, insufficient balance, invalid number, etc.).
            if (response != null && response.contains("\"type\":\"error\"")) {
                throw new RuntimeException("MSG91 rejected the SMS request: " + response);
            }
        } catch (Exception e) {
            log.error("[SMS-MSG91] Failed to dispatch SMS to 91{}: {}", mobileNumber, e.getMessage());
            throw new RuntimeException("Failed to send SMS via MSG91", e);
        }
    }

    private boolean isBlankOrPlaceholder(String value) {
        return value == null || value.isBlank() || value.startsWith("your-");
    }

    private String extractOtp(String message) {
        Matcher matcher = OTP_PATTERN.matcher(message);
        return matcher.find() ? matcher.group() : message;
    }
}
