package com.ooumitra.controller;

import com.ooumitra.dto.request.AdminDecisionRequest;
import com.ooumitra.dto.response.*;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.service.AdminService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "Admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/pending")
    @Operation(summary = "Get all listings awaiting approval")
    public ResponseEntity<ApiResponse<AdminPendingResponse>> getPending() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getPending()));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getStats()));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getProducts(
            @RequestParam(required = false) ApprovalStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getProducts(status, page, size)));
    }

    @GetMapping("/workers")
    public ResponseEntity<ApiResponse<PagedResponse<WorkerListingResponse>>> getWorkers(
            @RequestParam(required = false) ApprovalStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getWorkers(status, page, size)));
    }

    @GetMapping("/transport")
    public ResponseEntity<ApiResponse<PagedResponse<TransportResponse>>> getTransport(
            @RequestParam(required = false) ApprovalStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getTransport(status, page, size)));
    }

    @GetMapping("/vehicle-work")
    public ResponseEntity<ApiResponse<PagedResponse<VehicleWorkResponse>>> getVehicleWork(
            @RequestParam(required = false) ApprovalStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getVehicleWork(status, page, size)));
    }

    @PostMapping("/products/{id}/approve")
    public ResponseEntity<ApiResponse<ProductResponse>> approveProduct(
            @PathVariable Long id, @Valid @RequestBody AdminDecisionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Product approved",
                adminService.decideProduct(id, ApprovalStatus.APPROVED, req.getRemarks())));
    }

    @PostMapping("/products/{id}/reject")
    public ResponseEntity<ApiResponse<ProductResponse>> rejectProduct(
            @PathVariable Long id, @Valid @RequestBody AdminDecisionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Product rejected",
                adminService.decideProduct(id, ApprovalStatus.REJECTED, req.getRemarks())));
    }

    @PostMapping("/workers/{id}/approve")
    public ResponseEntity<ApiResponse<WorkerListingResponse>> approveWorker(
            @PathVariable Long id, @Valid @RequestBody AdminDecisionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Worker listing approved",
                adminService.decideWorker(id, ApprovalStatus.APPROVED, req.getRemarks())));
    }

    @PostMapping("/workers/{id}/reject")
    public ResponseEntity<ApiResponse<WorkerListingResponse>> rejectWorker(
            @PathVariable Long id, @Valid @RequestBody AdminDecisionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Worker listing rejected",
                adminService.decideWorker(id, ApprovalStatus.REJECTED, req.getRemarks())));
    }

    @PostMapping("/transport/{id}/approve")
    public ResponseEntity<ApiResponse<TransportResponse>> approveTransport(
            @PathVariable Long id, @Valid @RequestBody AdminDecisionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Transport listing approved",
                adminService.decideTransport(id, ApprovalStatus.APPROVED, req.getRemarks())));
    }

    @PostMapping("/transport/{id}/reject")
    public ResponseEntity<ApiResponse<TransportResponse>> rejectTransport(
            @PathVariable Long id, @Valid @RequestBody AdminDecisionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Transport listing rejected",
                adminService.decideTransport(id, ApprovalStatus.REJECTED, req.getRemarks())));
    }

    @PostMapping("/vehicle-work/{id}/approve")
    public ResponseEntity<ApiResponse<VehicleWorkResponse>> approveVehicleWork(
            @PathVariable Long id, @Valid @RequestBody AdminDecisionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Vehicle work listing approved",
                adminService.decideVehicleWork(id, ApprovalStatus.APPROVED, req.getRemarks())));
    }

    @PostMapping("/vehicle-work/{id}/reject")
    public ResponseEntity<ApiResponse<VehicleWorkResponse>> rejectVehicleWork(
            @PathVariable Long id, @Valid @RequestBody AdminDecisionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Vehicle work listing rejected",
                adminService.decideVehicleWork(id, ApprovalStatus.REJECTED, req.getRemarks())));
    }
}
