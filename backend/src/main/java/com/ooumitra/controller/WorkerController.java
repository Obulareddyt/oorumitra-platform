package com.ooumitra.controller;

import com.ooumitra.dto.request.WorkerListingRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.WorkerListingResponse;
import com.ooumitra.enums.WorkType;
import com.ooumitra.service.WorkerService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@Tag(name = "Worker Services")
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    @Operation(summary = "List worker services with optional filters")
    public ResponseEntity<ApiResponse<PagedResponse<WorkerListingResponse>>> getAll(
            @RequestParam(required = false) WorkType workType,
            @RequestParam(required = false) String village,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                workerService.getAll(workType, village, minAmount, maxAmount, sortBy, page, size)));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Get nearby worker services")
    public ResponseEntity<ApiResponse<List<WorkerListingResponse>>> getNearby(
            @RequestParam double lat, @RequestParam double lng,
            @RequestParam(defaultValue = "0") double radiusKm,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(workerService.getNearby(lat, lng, radiusKm, limit)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkerListingResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(workerService.getById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<WorkerListingResponse>>> getMyListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(workerService.getMyListings(page, size)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<WorkerListingResponse>> create(
            @Valid @RequestPart("data") WorkerListingRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "voiceNote", required = false) MultipartFile voiceNote) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Worker listing created", workerService.create(req, images, voiceNote)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkerListingResponse>> update(
            @PathVariable Long id, @Valid @RequestBody WorkerListingRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Worker listing updated", workerService.update(id, req)));
    }

    @PutMapping("/{id}/availability")
    @Operation(summary = "Update worker listing availability status")
    public ResponseEntity<ApiResponse<WorkerListingResponse>> updateAvailability(
            @PathVariable Long id, @RequestParam boolean available) {
        return ResponseEntity.ok(ApiResponse.ok("Worker availability updated", workerService.updateAvailability(id, available)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        workerService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Worker listing deleted"));
    }
}
