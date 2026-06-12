package com.ooumitra.dto.response;

import com.ooumitra.entity.ChatConversation;
import com.ooumitra.enums.ListingType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data @Builder
public class ChatConversationResponse {
    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserPhoto;
    private ListingType listingType;
    private Long listingId;
    private String lastMessage;
    private Instant lastMessageAt;
    private int unreadCount;

    public static ChatConversationResponse from(ChatConversation c, Long currentUserId) {
        boolean isBuyer = c.getBuyer().getId().equals(currentUserId);
        var other = isBuyer ? c.getSeller() : c.getBuyer();
        return ChatConversationResponse.builder()
                .id(c.getId())
                .otherUserId(other.getId())
                .otherUserName(other.getFirstName() + " " + other.getLastName())
                .otherUserPhoto(other.getProfilePhotoUrl())
                .listingType(c.getListingType())
                .listingId(c.getListingId())
                .lastMessage(c.getLastMessage())
                .lastMessageAt(c.getLastMessageAt())
                .unreadCount(isBuyer ? c.getBuyerUnreadCount() : c.getSellerUnreadCount())
                .build();
    }
}
