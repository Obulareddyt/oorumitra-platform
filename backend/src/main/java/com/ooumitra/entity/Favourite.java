package com.ooumitra.entity;

import com.ooumitra.enums.ListingType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "favourites", indexes = {
        @Index(name = "idx_fav_user", columnList = "user_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_favourite", columnNames = {"user_id", "listing_type", "listing_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Favourite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type", nullable = false, length = 15)
    private ListingType listingType;

    @Column(name = "listing_id", nullable = false)
    private Long listingId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
