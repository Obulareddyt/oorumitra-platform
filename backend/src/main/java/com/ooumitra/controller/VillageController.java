package com.ooumitra.controller;

import com.ooumitra.dto.request.VillageRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.VillageResponse;
import com.ooumitra.dto.response.VillageSummaryReport;
import com.ooumitra.service.VillageService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/villages")
@RequiredArgsConstructor
@Tag(name = "Village Management")
public class VillageController {

    private final VillageService service;

    @GetMapping("/all")
    @Operation(summary = "Get all active villages (dropdown)")
    public ResponseEntity<ApiResponse<List<VillageResponse>>> getAllActive() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllActive()));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "List villages with search, filter and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<VillageResponse>>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(service.listVillages(search, status, page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get village by ID with admins")
    public ResponseEntity<ApiResponse<VillageResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getVillage(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create village")
    public ResponseEntity<ApiResponse<VillageResponse>> create(@Valid @RequestBody VillageRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.createVillage(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update village")
    public ResponseEntity<ApiResponse<VillageResponse>> update(
            @PathVariable Long id, @Valid @RequestBody VillageRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(service.updateVillage(id, req)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Toggle village active/inactive status")
    public ResponseEntity<ApiResponse<VillageResponse>> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.toggleStatus(id)));
    }

    @PostMapping("/{id}/admins/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Assign a Village Admin to a village")
    public ResponseEntity<ApiResponse<VillageResponse>> assignAdmin(
            @PathVariable Long id, @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(service.assignAdmin(id, userId)));
    }

    @DeleteMapping("/{id}/admins/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Remove a Village Admin from a village")
    public ResponseEntity<ApiResponse<VillageResponse>> removeAdmin(
            @PathVariable Long id, @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(service.removeAdmin(id, userId)));
    }

    @GetMapping("/reports/summary")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Village summary report")
    public ResponseEntity<ApiResponse<List<VillageSummaryReport>>> summaryReport() {
        return ResponseEntity.ok(ApiResponse.ok(service.getSummaryReport()));
    }
}
