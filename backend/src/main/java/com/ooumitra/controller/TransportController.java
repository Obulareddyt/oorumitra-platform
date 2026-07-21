package com.ooumitra.controller;

import com.ooumitra.dto.request.TransportRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.TransportResponse;
import com.ooumitra.enums.TransportVehicleType;
import com.ooumitra.service.TransportService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/transport")
@RequiredArgsConstructor
@Tag(name = "Transport Vehicles")
public class TransportController {

    private final TransportService transportService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TransportResponse>>> getAll(
            @RequestParam(required = false) TransportVehicleType vehicleType,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(transportService.getAll(vehicleType, sortBy, page, size)));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<TransportResponse>>> getNearby(
            @RequestParam double lat, @RequestParam double lng,
            @RequestParam(defaultValue = "0") double radiusKm,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(transportService.getNearby(lat, lng, radiusKm, limit)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransportResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(transportService.getById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<TransportResponse>>> getMyListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(transportService.getMyListings(page, size)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<TransportResponse>> create(
            @Valid @RequestPart("data") TransportRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "voiceNote", required = false) MultipartFile voiceNote) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Created", transportService.create(req, images, voiceNote)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransportResponse>> update(
            @PathVariable Long id, @Valid @RequestBody TransportRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", transportService.update(id, req)));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<TransportResponse>> updateAvailability(
            @PathVariable Long id, @RequestParam boolean available) {
        return ResponseEntity.ok(ApiResponse.ok("Transport availability updated", transportService.updateAvailability(id, available)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        transportService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted"));
    }
}
