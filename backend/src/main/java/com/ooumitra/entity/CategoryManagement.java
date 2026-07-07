package com.ooumitra.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "category_management")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CategoryManagement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "key_name", nullable = false, unique = true, length = 50)
    private String keyName;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(length = 255)
    private String description;

    @Column(length = 50)
    private String icon;

    @Column(name = "to_url", length = 100)
    private String toUrl;

    @Column(name = "modal_key", length = 50)
    private String modalKey;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ENABLED";

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;

    @Column(name = "color_class", length = 150)
    private String colorClass;

    @Column(name = "icon_bg", length = 100)
    private String iconBg;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
