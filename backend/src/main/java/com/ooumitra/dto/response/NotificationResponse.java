package com.ooumitra.dto.response;

import com.ooumitra.entity.Notification;
import com.ooumitra.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data @Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String body;
    private NotificationType type;
    private String data;
    private boolean read;
    private Instant createdAt;

    public static NotificationResponse from(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId()).title(n.getTitle()).body(n.getBody())
                .type(n.getType()).data(n.getData()).read(n.isRead())
                .createdAt(n.getCreatedAt()).build();
    }
}
