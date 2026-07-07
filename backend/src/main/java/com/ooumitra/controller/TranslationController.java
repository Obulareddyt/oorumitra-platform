package com.ooumitra.controller;

import com.ooumitra.entity.LanguageMaster;
import com.ooumitra.entity.TranslationEntry;
import com.ooumitra.service.TranslationService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/translations")
@Tag(name = "Translation Management")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @GetMapping("/languages")
    public ResponseEntity<ApiResponse<List<LanguageMaster>>> getActiveLanguages() {
        return ResponseEntity.ok(ApiResponse.ok(translationService.getActiveLanguages()));
    }

    @GetMapping("/languages/all")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<LanguageMaster>>> getAllLanguages() {
        return ResponseEntity.ok(ApiResponse.ok(translationService.getAllLanguages()));
    }

    @GetMapping("/{langCode}")
    public ResponseEntity<ApiResponse<Map<String, String>>> getTranslations(@PathVariable String langCode) {
        return ResponseEntity.ok(ApiResponse.ok(translationService.getTranslationsForLanguage(langCode)));
    }

    @PostMapping("/add-key")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> addTranslationKey(@RequestParam String key, @RequestParam String defaultValue) {
        translationService.addTranslationKey(key, defaultValue);
        return ResponseEntity.ok(ApiResponse.ok("Translation key added successfully"));
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TranslationEntry>> updateTranslationValue(@RequestParam String key, 
                                                                                @RequestParam String langCode, 
                                                                                @RequestParam String value) {
        TranslationEntry updated = translationService.updateTranslationValue(key, langCode, value);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @PutMapping("/languages/{code}/toggle")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<LanguageMaster>> toggleLanguage(@PathVariable String code, @RequestParam boolean active) {
        LanguageMaster toggled = translationService.toggleLanguage(code, active);
        return ResponseEntity.ok(ApiResponse.ok(toggled));
    }

    @GetMapping("/completion-stats")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getCompletionStats() {
        return ResponseEntity.ok(ApiResponse.ok(translationService.getTranslationCompletionPercent()));
    }

    @PostMapping("/languages/add")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<LanguageMaster>> addLanguage(@RequestParam String code, 
                                                                   @RequestParam String name, 
                                                                   @RequestParam String nativeName) {
        LanguageMaster added = translationService.addLanguage(code, name, nativeName);
        return ResponseEntity.ok(ApiResponse.ok(added));
    }

    @GetMapping("/entries")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<TranslationEntry>>> getEntries() {
        return ResponseEntity.ok(ApiResponse.ok(translationService.getAllTranslationEntries()));
    }

    @PostMapping("/import/{langCode}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> importTranslations(@PathVariable String langCode, 
                                                                  @RequestBody Map<String, String> translationMap) {
        for (Map.Entry<String, String> entry : translationMap.entrySet()) {
            translationService.updateTranslationValue(entry.getKey(), langCode, entry.getValue());
        }
        return ResponseEntity.ok(ApiResponse.ok("Translations imported successfully"));
    }

    @GetMapping("/export/{langCode}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> exportTranslations(@PathVariable String langCode) {
        return ResponseEntity.ok(ApiResponse.ok(translationService.getTranslationsForLanguage(langCode)));
    }
}
