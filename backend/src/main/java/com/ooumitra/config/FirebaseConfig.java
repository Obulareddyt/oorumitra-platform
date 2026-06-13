package com.ooumitra.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
@Slf4j
public class FirebaseConfig {

    // On Render (and other cloud platforms), pass the entire service-account JSON
    // as the FIREBASE_SERVICE_ACCOUNT_JSON env var — no file mounting needed.
    @Value("${FIREBASE_SERVICE_ACCOUNT_JSON:}")
    private String serviceAccountJson;

    @Value("${firebase.service-account-path:classpath:firebase-service-account.json}")
    private String serviceAccountPath;

    @PostConstruct
    public void init() {
        if (!FirebaseApp.getApps().isEmpty()) return;
        try {
            GoogleCredentials credentials;
            if (serviceAccountJson != null && !serviceAccountJson.isBlank()) {
                credentials = GoogleCredentials.fromStream(
                        new ByteArrayInputStream(serviceAccountJson.getBytes(StandardCharsets.UTF_8)));
            } else {
                String path = serviceAccountPath.startsWith("classpath:")
                        ? serviceAccountPath.substring("classpath:".length())
                        : serviceAccountPath;
                try (InputStream is = new ClassPathResource(path).getInputStream()) {
                    credentials = GoogleCredentials.fromStream(is);
                }
            }
            FirebaseApp.initializeApp(FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build());
            log.info("Firebase initialized successfully");
        } catch (Exception e) {
            log.warn("Firebase not initialized — FCM notifications disabled. Set FIREBASE_SERVICE_ACCOUNT_JSON to enable. ({})", e.getMessage());
        }
    }
}
