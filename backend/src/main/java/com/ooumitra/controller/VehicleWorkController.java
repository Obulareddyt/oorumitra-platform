package com.ooumitra.controller;

import com.ooumitra.dto.request.VehicleWorkRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.VehicleWorkResponse;
import com.ooumitra.enums.VehicleWorkType;
import com.ooumitra.service.VehicleWorkService;
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
@RequestMapping("/api/vehicle-work")
@RequiredArgsConstructor
@Tag(name = "Vehicle Work Services")
public class VehicleWorkController {

    private final VehicleWorkService vehicleWorkService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<VehicleWorkResponse>>> getAll(
            @RequestParam(required = false) VehicleWorkType vehicleType,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleWorkService.getAll(vehicleType, sortBy, page, size)));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<VehicleWorkResponse>>> getNearby(
            @RequestParam double lat, @RequestParam double lng,
            @RequestParam(defaultValue = "0") double radiusKm,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleWorkService.getNearby(lat, lng, radiusKm, limit)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleWorkResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleWorkService.getById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<VehicleWorkResponse>>> getMyListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleWorkService.getMyListings(page, size)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<VehicleWorkResponse>> create(
            @Valid @RequestPart("data") VehicleWorkRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Vehicle work listing created", vehicleWorkService.create(req, images)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleWorkResponse>> update(
            @PathVariable Long id, @Valid @RequestBody VehicleWorkRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", vehicleWorkService.update(id, req)));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<VehicleWorkResponse>> updateAvailability(
            @PathVariable Long id, @RequestParam boolean available) {
        return ResponseEntity.ok(ApiResponse.ok("Vehicle work availability updated", vehicleWorkService.updateAvailability(id, available)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        vehicleWorkService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted"));
    }
}
