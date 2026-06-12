package com.ooumitra.dto.response;

import com.ooumitra.entity.ChatMessage;
import com.ooumitra.enums.MessageType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data @Builder
public class ChatMessageResponse {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String content;
    private MessageType messageType;
    private String mediaUrl;
    private boolean read;
    private Instant createdAt;

    public static ChatMessageResponse from(ChatMessage m) {
        return ChatMessageResponse.builder()
                .id(m.getId())
                .conversationId(m.getConversation().getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFirstName() + " " + m.getSender().getLastName())
                .content(m.getContent())
                .messageType(m.getMessageType())
                .mediaUrl(m.getMediaUrl())
                .read(m.isRead())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
