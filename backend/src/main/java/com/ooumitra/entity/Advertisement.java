package com.ooumitra.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "advertisements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "media_url", length = 255)
    private String mediaUrl;

    @Column(name = "media_type", nullable = false, length = 50)
    private String mediaType; // e.g. "IMAGE", "VIDEO"

    @Column(name = "redirect_url", length = 255)
    private String redirectUrl;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    @Builder.Default
    private int priority = 0;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // e.g. "ACTIVE", "INACTIVE"

    @Column(name = "ad_type", nullable = false, length = 30)
    @Builder.Default
    private String adType = "BANNER"; // e.g. "BANNER", "VIDEO", "POPUP", "FEATURED"

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
