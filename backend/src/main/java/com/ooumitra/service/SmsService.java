package com.ooumitra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsService {

    private final WebClient.Builder webClientBuilder;

    @Value("${msg91.auth-key}")
    private String authKey;

    @Value("${msg91.sender-id}")
    private String senderId;

    @Value("${msg91.notification-template-id:}")
    private String notificationTemplateId;

    @Value("${msg91.base-url}")
    private String msg91BaseUrl;

    public void sendApprovalNotification(String mobile, String ownerName, String listingName, String status, String remarks) {
        String statusText = "APPROVED".equals(status) ? "Approved" : "Rejected";
        String message = String.format(
            "Hi %s, your listing \"%s\" has been %s. Remarks: %s. Thanks, OoruMitra Service",
            ownerName, listingName, statusText, remarks
        );
        log.info("[SMS] Notification for {}: {}", mobile, message);

        if (notificationTemplateId == null || notificationTemplateId.isBlank()
                || "your-notification-template-id".equals(notificationTemplateId)) {
            log.info("[SMS-FALLBACK] Template not configured — message logged only");
            return;
        }

        try {
            Map<String, Object> body = Map.of(
                "template_id", notificationTemplateId,
                "short_url", "0",
                "recipients", List.of(Map.of(
                    "mobiles", "91" + mobile,
                    "name", ownerName,
                    "listing", listingName,
                    "status", statusText,
                    "remarks", remarks
                ))
            );

            webClientBuilder.build()
                .post()
                .uri(msg91BaseUrl + "/flow/")
                .header("authkey", authKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(
                    res -> log.info("Notification SMS sent to {}: {}", mobile, res),
                    err -> log.error("SMS notification failed for {}: {}", mobile, err.getMessage())
                );
        } catch (Exception e) {
            log.error("Failed to send notification SMS: {}", e.getMessage());
        }
    }
}
