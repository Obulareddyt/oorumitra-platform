package com.ooumitra.entity;

import com.ooumitra.enums.BookingStatus;
import com.ooumitra.enums.ListingType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_user", columnList = "user_id"),
        @Index(name = "idx_booking_owner", columnList = "owner_id"),
        @Index(name = "idx_booking_status", columnList = "status"),
        @Index(name = "idx_booking_listing", columnList = "listing_type, listing_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The customer expressing interest / booking a service.
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The listing owner/provider — resolved server-side from the listing at
    // creation time so owner-facing queries don't need to join across all
    // four listing tables.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type", nullable = false, length = 15)
    private ListingType listingType;

    @Column(name = "listing_id", nullable = false)
    private Long listingId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 15)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "required_date")
    private LocalDate requiredDate;

    @Column(name = "service_time")
    private LocalTime serviceTime;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
