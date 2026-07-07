package com.ooumitra.service;

import com.ooumitra.entity.LanguageMaster;
import com.ooumitra.entity.TranslationEntry;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.LanguageMasterRepository;
import com.ooumitra.repository.TranslationEntryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TranslationService {

    private final LanguageMasterRepository languageRepo;
    private final TranslationEntryRepository translationRepo;
    private final RestTemplate restTemplate;

    @Value("${google.api.key:}")
    private String googleApiKey;

    public TranslationService(LanguageMasterRepository languageRepo,
                              TranslationEntryRepository translationRepo) {
        this.languageRepo = languageRepo;
        this.translationRepo = translationRepo;
        this.restTemplate = new RestTemplate();
    }

    public List<LanguageMaster> getActiveLanguages() {
        return languageRepo.findByActiveStatusTrue();
    }

    public List<LanguageMaster> getAllLanguages() {
        return languageRepo.findAll();
    }

    public Map<String, String> getTranslationsForLanguage(String langCode) {
        return translationRepo.findByLanguageCode(langCode).stream()
                .collect(Collectors.toMap(
                        TranslationEntry::getTranslationKey,
                        TranslationEntry::getTranslationValue,
                        (existing, replacement) -> existing
                ));
    }

    @Transactional
    public LanguageMaster addLanguage(String code, String name, String nativeName) {
        if (languageRepo.findByLanguageCode(code).isPresent()) {
            throw new OoruMitraException("Language code already exists", HttpStatus.BAD_REQUEST);
        }
        LanguageMaster master = LanguageMaster.builder()
                .languageCode(code)
                .languageName(name)
                .nativeName(nativeName)
                .activeStatus(true)
                .build();
        return languageRepo.save(master);
    }

    @Transactional
    public LanguageMaster toggleLanguage(String code, boolean active) {
        LanguageMaster master = languageRepo.findByLanguageCode(code)
                .orElseThrow(() -> OoruMitraException.notFound("Language"));
        master.setActiveStatus(active);
        return languageRepo.save(master);
    }

    @Transactional
    public void addTranslationKey(String key, String defaultEnglishValue) {
        // Add English source entry first
        Optional<TranslationEntry> existingEn = translationRepo.findByTranslationKeyAndLanguageCode(key, "en");
        if (existingEn.isPresent()) {
            throw new OoruMitraException("Translation key already exists", HttpStatus.BAD_REQUEST);
        }

        translationRepo.save(TranslationEntry.builder()
                .translationKey(key)
                .languageCode("en")
                .translationValue(defaultEnglishValue)
                .build());

        // Auto translate for all other active languages
        List<LanguageMaster> activeLangs = languageRepo.findByActiveStatusTrue();
        for (LanguageMaster lang : activeLangs) {
            if ("en".equalsIgnoreCase(lang.getLanguageCode())) continue;

            String translatedValue = translateText(defaultEnglishValue, lang.getLanguageCode());
            translationRepo.save(TranslationEntry.builder()
                    .translationKey(key)
                    .languageCode(lang.getLanguageCode())
                    .translationValue(translatedValue)
                    .build());
        }
    }

    @Transactional
    public TranslationEntry updateTranslationValue(String key, String langCode, String value) {
        TranslationEntry entry = translationRepo.findByTranslationKeyAndLanguageCode(key, langCode)
                .orElseGet(() -> TranslationEntry.builder()
                        .translationKey(key)
                        .languageCode(langCode)
                        .build());
        entry.setTranslationValue(value);
        return translationRepo.save(entry);
    }

    public Map<String, Integer> getTranslationCompletionPercent() {
        List<TranslationEntry> allEntries = translationRepo.findAll();
        List<LanguageMaster> allLangs = languageRepo.findAll();

        long enKeyCount = allEntries.stream()
                .filter(e -> "en".equalsIgnoreCase(e.getLanguageCode()))
                .count();

        Map<String, Integer> completionMap = new HashMap<>();
        if (enKeyCount == 0) {
            for (LanguageMaster l : allLangs) {
                completionMap.put(l.getLanguageCode(), 100);
            }
            return completionMap;
        }

        for (LanguageMaster lang : allLangs) {
            long translatedCount = allEntries.stream()
                    .filter(e -> lang.getLanguageCode().equalsIgnoreCase(e.getLanguageCode()) 
                            && e.getTranslationValue() != null 
                            && !e.getTranslationValue().isBlank())
                    .count();
            int percent = (int) Math.min(100, (translatedCount * 100) / enKeyCount);
            completionMap.put(lang.getLanguageCode(), percent);
        }
        return completionMap;
    }

    // Google Cloud Translation REST API integration with developer mock fallbacks
    public String translateText(String sourceText, String targetLangCode) {
        if (googleApiKey == null || googleApiKey.isBlank()) {
            return "[" + targetLangCode.toUpperCase() + "] " + sourceText;
        }
        try {
            String url = "https://translation.googleapis.com/language/translate/v2?key=" + googleApiKey;
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("q", Collections.singletonList(sourceText));
            requestBody.put("target", targetLangCode);

            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            if (response != null && response.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                List<Map<String, Object>> translations = (List<Map<String, Object>>) data.get("translations");
                if (translations != null && !translations.isEmpty()) {
                    return String.valueOf(translations.get(0).get("translatedText"));
                }
            }
        } catch (Exception e) {
            System.err.println("[WARN] Google Translate API failed: " + e.getMessage());
        }
        // Fallback placeholder
        return "[" + targetLangCode.toUpperCase() + "] " + sourceText;
    }

    public List<TranslationEntry> getAllTranslationEntries() {
        return translationRepo.findAll();
    }
}
