package com.ooumitra.service;

import com.ooumitra.dto.request.ChatMessageRequest;
import com.ooumitra.dto.request.StartChatRequest;
import com.ooumitra.dto.response.ChatConversationResponse;
import com.ooumitra.dto.response.ChatMessageResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.entity.ChatConversation;
import com.ooumitra.entity.ChatMessage;
import com.ooumitra.entity.User;
import com.ooumitra.enums.NotificationType;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.ChatConversationRepository;
import com.ooumitra.repository.ChatMessageRepository;
import com.ooumitra.repository.UserRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatConversationRepository convRepo;
    private final ChatMessageRepository msgRepo;
    private final UserRepository userRepo;
    private final FCMService fcmService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public PagedResponse<ChatConversationResponse> getConversations(int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        var result = convRepo.findByParticipant(userId, PageRequest.of(page, size));
        var content = result.getContent().stream()
                .map(c -> ChatConversationResponse.from(c, userId))
                .toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public ChatConversationResponse startConversation(StartChatRequest req) {
        Long buyerId = SecurityUtils.currentUserId();
        User seller = userRepo.findById(req.getSellerId())
                .orElseThrow(() -> OoruMitraException.notFound("Seller"));
        User buyer = userRepo.findById(buyerId)
                .orElseThrow(() -> OoruMitraException.notFound("User"));

        ChatConversation conversation = convRepo.findByBuyerIdAndSellerIdAndListingTypeAndListingId(
                buyerId, req.getSellerId(), req.getListingType(), req.getListingId())
                .orElseGet(() -> convRepo.save(ChatConversation.builder()
                        .buyer(buyer).seller(seller)
                        .listingType(req.getListingType())
                        .listingId(req.getListingId())
                        .build()));
        return ChatConversationResponse.from(conversation, buyerId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ChatMessageResponse> getMessages(Long conversationId, int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        validateParticipant(conversationId, userId);
        msgRepo.markAsRead(conversationId, userId);
        var result = msgRepo.findByConversationIdOrderByCreatedAtAsc(conversationId, PageRequest.of(page, size));
        var content = result.getContent().stream().map(ChatMessageResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public ChatMessageResponse sendMessage(Long conversationId, ChatMessageRequest req) {
        Long userId = SecurityUtils.currentUserId();
        ChatConversation conversation = validateParticipant(conversationId, userId);
        User sender = userRepo.findById(userId).orElseThrow();

        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .content(req.getContent())
                .messageType(req.getMessageType())
                .mediaUrl(req.getMediaUrl())
                .build();
        message = msgRepo.save(message);

        conversation.setLastMessage(req.getContent());
        boolean isBuyer = conversation.getBuyer().getId().equals(userId);
        if (isBuyer) conversation.setSellerUnreadCount(conversation.getSellerUnreadCount() + 1);
        else conversation.setBuyerUnreadCount(conversation.getBuyerUnreadCount() + 1);
        convRepo.save(conversation);

        ChatMessageResponse response = ChatMessageResponse.from(message);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(isBuyer ? conversation.getSeller().getId() : conversation.getBuyer().getId()),
                "/queue/messages", response);

        User recipient = isBuyer ? conversation.getSeller() : conversation.getBuyer();
        fcmService.sendToUser(recipient, "New message from " + sender.getFirstName(),
                req.getContent(), NotificationType.CHAT_MESSAGE,
                Map.of("conversationId", String.valueOf(conversationId)));

        return response;
    }

    private ChatConversation validateParticipant(Long conversationId, Long userId) {
        ChatConversation conv = convRepo.findById(conversationId)
                .orElseThrow(() -> OoruMitraException.notFound("Conversation"));
        if (!conv.getBuyer().getId().equals(userId) && !conv.getSeller().getId().equals(userId)) {
            throw OoruMitraException.forbidden("Not a participant of this conversation");
        }
        return conv;
    }
}
