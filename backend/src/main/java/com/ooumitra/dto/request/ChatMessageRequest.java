package com.ooumitra.dto.request;

import com.ooumitra.enums.MessageType;
import lombok.Data;

@Data
public class ChatMessageRequest {
    private String content;
    private MessageType messageType = MessageType.TEXT;
    private String mediaUrl;
}
