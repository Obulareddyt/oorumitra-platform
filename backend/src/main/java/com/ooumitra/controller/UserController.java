package com.ooumitra.controller;

import com.ooumitra.entity.User;
import com.ooumitra.enums.Language;
import com.ooumitra.entity.UserLanguagePreference;
import com.ooumitra.repository.UserLanguagePreferenceRepository;
import com.ooumitra.repository.UserRepository;
import com.ooumitra.service.S3Service;
import com.ooumitra.util.ApiResponse;
import com.ooumitra.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile")
public class UserController {

    private final UserRepository userRepo;
    private final UserLanguagePreferenceRepository langPrefRepo;
    private final S3Service s3Service;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile() {
        User user = SecurityUtils.currentUser();
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "id", user.getId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "mobileNumber", user.getMobileNumber(),
                "email", user.getEmail() != null ? user.getEmail() : "",
                "gender", user.getGender() != null ? user.getGender() : "",
                "role", user.getRole().name(),
                "language", user.getLanguage().name(),
                "profilePhotoUrl", user.getProfilePhotoUrl() != null ? user.getProfilePhotoUrl() : "",
                "village", user.getVillage() != null ? user.getVillage() : ""
        )));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(@RequestBody Map<String, String> body) {
        User user = SecurityUtils.currentUser();
        if (body.containsKey("firstName")) user.setFirstName(body.get("firstName"));
        if (body.containsKey("lastName")) user.setLastName(body.get("lastName"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("gender")) user.setGender(body.get("gender"));
        if (body.containsKey("village")) user.setVillage(body.get("village"));
        userRepo.save(user);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated"));
    }

    @PostMapping(value = "/profile/photo", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<String>> uploadProfilePhoto(@RequestPart("photo") MultipartFile photo) throws IOException {
        User user = SecurityUtils.currentUser();
        if (user.getProfilePhotoUrl() != null) {
            s3Service.deleteFile(user.getProfilePhotoUrl());
        }
        String url = s3Service.uploadFile(photo, "profile-photos");
        user.setProfilePhotoUrl(url);
        userRepo.save(user);
        return ResponseEntity.ok(ApiResponse.ok("Profile photo updated", url));
    }

    @PatchMapping("/fcm-token")
    public ResponseEntity<ApiResponse<Void>> updateFcmToken(@RequestBody Map<String, String> body) {
        User user = SecurityUtils.currentUser();
        user.setFcmToken(body.get("fcmToken"));
        userRepo.save(user);
        return ResponseEntity.ok(ApiResponse.ok("FCM token updated"));
    }

    @PatchMapping("/language")
    public ResponseEntity<ApiResponse<Void>> updateLanguage(@RequestBody Map<String, String> body) {
        User user = SecurityUtils.currentUser();
        String langCode = body.get("language").toUpperCase();
        user.setLanguage(Language.valueOf(langCode));
        userRepo.save(user);

        // Update preference table
        UserLanguagePreference pref = langPrefRepo.findByUserId(user.getId())
                .orElseGet(() -> UserLanguagePreference.builder().user(user).build());
        pref.setLanguageCode(langCode.toLowerCase());
        langPrefRepo.save(pref);

        return ResponseEntity.ok(ApiResponse.ok("Language updated"));
    }
}
