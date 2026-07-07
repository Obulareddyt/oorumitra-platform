package com.ooumitra.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "language_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "language_code", nullable = false, unique = true, length = 10)
    private String languageCode;

    @Column(name = "language_name", nullable = false, length = 100)
    private String languageName;

    @Column(name = "native_name", nullable = false, length = 100)
    private String nativeName;

    @Column(name = "active_status", nullable = false)
    @Builder.Default
    private boolean activeStatus = true;
}
