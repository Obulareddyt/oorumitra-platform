package com.ooumitra.entity;

import com.ooumitra.enums.ListingType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "chat_conversations", indexes = {
        @Index(name = "idx_conv_buyer", columnList = "buyer_id"),
        @Index(name = "idx_conv_seller", columnList = "seller_id"),
        @Index(name = "idx_conv_listing", columnList = "listing_type, listing_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_conv", columnNames = {"buyer_id", "seller_id", "listing_type", "listing_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type", length = 15)
    private ListingType listingType;

    @Column(name = "listing_id")
    private Long listingId;

    @Column(name = "last_message", columnDefinition = "TEXT")
    private String lastMessage;

    @UpdateTimestamp
    @Column(name = "last_message_at")
    private Instant lastMessageAt;

    @Column(name = "buyer_unread_count")
    @Builder.Default
    private int buyerUnreadCount = 0;

    @Column(name = "seller_unread_count")
    @Builder.Default
    private int sellerUnreadCount = 0;
}
