package com.ooumitra.entity;

import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.VehicleWorkType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle_work_listings", indexes = {
        @Index(name = "idx_vw_user", columnList = "user_id"),
        @Index(name = "idx_vw_type", columnList = "vehicle_type"),
        @Index(name = "idx_vw_village", columnList = "village"),
        @Index(name = "idx_vw_location", columnList = "latitude, longitude")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleWorkListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 20)
    private VehicleWorkType vehicleType;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Column(name = "price_per_acre", precision = 10, scale = 2)
    private BigDecimal pricePerAcre;

    @Column(name = "price_per_hour", precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @Column(name = "village", nullable = false, length = 100)
    private String village;

    @Column(name = "available_status", nullable = false)
    @Builder.Default
    private boolean availableStatus = true;

    @Column(name = "available_until")
    private LocalDate availableUntil;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "average_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "rating_count")
    @Builder.Default
    private Integer ratingCount = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
