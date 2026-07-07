package com.ooumitra.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "translation_entry", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"translation_key", "language_code"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "translation_key", nullable = false)
    private String translationKey;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    @Column(name = "translation_value", nullable = false, columnDefinition = "TEXT")
    private String translationValue;
}
