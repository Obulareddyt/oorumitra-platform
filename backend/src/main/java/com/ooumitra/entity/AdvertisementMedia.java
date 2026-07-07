package com.ooumitra.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "advertisement_media")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdvertisementMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "advertisement_id", nullable = false)
    private Advertisement advertisement;

    @Column(name = "media_url", nullable = false, length = 255)
    private String mediaUrl;

    @Column(name = "media_type", nullable = false, length = 50)
    private String mediaType;
}
