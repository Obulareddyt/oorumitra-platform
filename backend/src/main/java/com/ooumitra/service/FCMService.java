package com.ooumitra.service;

import com.google.firebase.messaging.*;
import com.ooumitra.entity.Notification;
import com.ooumitra.entity.User;
import com.ooumitra.enums.NotificationType;
import com.ooumitra.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FCMService {

    private final NotificationRepository notificationRepo;

    @Async
    public void sendToUser(User user, String title, String body,
                           NotificationType type, Map<String, String> data) {
        saveNotification(user, title, body, type, data);

        if (user.getFcmToken() == null || user.getFcmToken().isBlank()) return;

        try {
            var messageBuilder = Message.builder()
                    .setToken(user.getFcmToken())
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putData("type", type.name());

            if (data != null) data.forEach(messageBuilder::putData);

            FirebaseMessaging.getInstance().sendAsync(messageBuilder.build());
        } catch (Exception e) {
            log.warn("FCM send failed for user {}: {}", user.getId(), e.getMessage());
        }
    }

    private void saveNotification(User user, String title, String body,
                                  NotificationType type, Map<String, String> data) {
        String dataJson = data != null ? data.toString() : null;
        notificationRepo.save(Notification.builder()
                .user(user)
                .title(title)
                .body(body)
                .type(type)
                .data(dataJson)
                .build());
    }
}
