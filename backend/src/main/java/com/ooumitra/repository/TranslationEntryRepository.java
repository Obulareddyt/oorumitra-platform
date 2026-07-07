package com.ooumitra.repository;

import com.ooumitra.entity.TranslationEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TranslationEntryRepository extends JpaRepository<TranslationEntry, Long> {
    List<TranslationEntry> findByLanguageCode(String languageCode);
    Optional<TranslationEntry> findByTranslationKeyAndLanguageCode(String translationKey, String languageCode);
    List<TranslationEntry> findByTranslationKey(String translationKey);
}
