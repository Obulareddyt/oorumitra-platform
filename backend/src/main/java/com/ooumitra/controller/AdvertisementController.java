package com.ooumitra.controller;

import com.ooumitra.dto.request.AdvertisementRequest;
import com.ooumitra.dto.response.AdvertisementResponse;
import com.ooumitra.service.AdvertisementService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Advertisement Management")
public class AdvertisementController {

    private final AdvertisementService adService;

    @GetMapping("/advertisements")
    @Operation(summary = "Get active advertisements based on current date range and type")
    public ResponseEntity<ApiResponse<List<AdvertisementResponse>>> getActiveAdvertisements(
            @RequestParam(required = false) String adType) {
        return ResponseEntity.ok(ApiResponse.ok(adService.getActiveAdvertisements(adType)));
    }

    @GetMapping("/admin/advertisements")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all advertisements (Super Admin only)")
    public ResponseEntity<ApiResponse<List<AdvertisementResponse>>> getAllAdvertisements() {
        return ResponseEntity.ok(ApiResponse.ok(adService.getAllAdvertisements()));
    }

    @PostMapping(value = "/admin/advertisements", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create advertisement (Super Admin only)")
    public ResponseEntity<ApiResponse<AdvertisementResponse>> createAdvertisement(
            @Valid @RequestPart("data") AdvertisementRequest req,
            @RequestPart(value = "mediaFile", required = false) MultipartFile mediaFile) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Advertisement created", adService.createAdvertisement(req, mediaFile)));
    }

    @PutMapping(value = "/admin/advertisements/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update advertisement (Super Admin only)")
    public ResponseEntity<ApiResponse<AdvertisementResponse>> updateAdvertisement(
            @PathVariable Long id,
            @Valid @RequestPart("data") AdvertisementRequest req,
            @RequestPart(value = "mediaFile", required = false) MultipartFile mediaFile) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Advertisement updated", adService.updateAdvertisement(id, req, mediaFile)));
    }

    @DeleteMapping("/admin/advertisements/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete advertisement (Super Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteAdvertisement(@PathVariable Long id) {
        adService.deleteAdvertisement(id);
        return ResponseEntity.ok(ApiResponse.ok("Advertisement deleted successfully"));
    }
}
