package com.ooumitra.controller;

import com.ooumitra.dto.request.ChatMessageRequest;
import com.ooumitra.dto.request.StartChatRequest;
import com.ooumitra.dto.response.ChatConversationResponse;
import com.ooumitra.dto.response.ChatMessageResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.service.ChatService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@Tag(name = "Chat")
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ChatConversationResponse>>> getConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.getConversations(page, size)));
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<ChatConversationResponse>> startConversation(
            @Valid @RequestBody StartChatRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.startConversation(req)));
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<PagedResponse<ChatMessageResponse>>> getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.getMessages(conversationId, page, size)));
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @PathVariable Long conversationId,
            @RequestBody ChatMessageRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.sendMessage(conversationId, req)));
    }

    @MessageMapping("/chat/{conversationId}")
    public void handleWebSocketMessage(@DestinationVariable Long conversationId, ChatMessageRequest req) {
        chatService.sendMessage(conversationId, req);
    }
}
