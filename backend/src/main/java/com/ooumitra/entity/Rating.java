package com.ooumitra.entity;

import com.ooumitra.enums.ListingType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ratings", indexes = {
        @Index(name = "idx_rating_reviewer", columnList = "reviewer_id"),
        @Index(name = "idx_rating_listing", columnList = "listing_type, listing_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_rating", columnNames = {"reviewer_id", "listing_type", "listing_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type", nullable = false, length = 15)
    private ListingType listingType;

    @Column(name = "listing_id", nullable = false)
    private Long listingId;

    @Column(name = "stars", nullable = false)
    private Integer stars;

    @Column(name = "review", columnDefinition = "TEXT")
    private String review;

    @ElementCollection
    @CollectionTable(name = "rating_tags", joinColumns = @JoinColumn(name = "rating_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
