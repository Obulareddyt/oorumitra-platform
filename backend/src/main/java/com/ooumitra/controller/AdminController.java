package com.ooumitra.controller;

import com.ooumitra.dto.response.AdminPendingResponse;
import com.ooumitra.dto.response.ProductResponse;
import com.ooumitra.dto.response.TransportResponse;
import com.ooumitra.dto.response.VehicleWorkResponse;
import com.ooumitra.dto.response.WorkerListingResponse;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.service.AdminService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/pending")
    @Operation(summary = "Get all listings awaiting approval")
    public ResponseEntity<ApiResponse<AdminPendingResponse>> getPending() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getPending()));
    }

    @PostMapping("/products/{id}/approve")
    public ResponseEntity<ApiResponse<ProductResponse>> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Product approved", adminService.decideProduct(id, ApprovalStatus.APPROVED)));
    }

    @PostMapping("/products/{id}/reject")
    public ResponseEntity<ApiResponse<ProductResponse>> rejectProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Product rejected", adminService.decideProduct(id, ApprovalStatus.REJECTED)));
    }

    @PostMapping("/workers/{id}/approve")
    public ResponseEntity<ApiResponse<WorkerListingResponse>> approveWorker(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Worker listing approved", adminService.decideWorker(id, ApprovalStatus.APPROVED)));
    }

    @PostMapping("/workers/{id}/reject")
    public ResponseEntity<ApiResponse<WorkerListingResponse>> rejectWorker(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Worker listing rejected", adminService.decideWorker(id, ApprovalStatus.REJECTED)));
    }

    @PostMapping("/transport/{id}/approve")
    public ResponseEntity<ApiResponse<TransportResponse>> approveTransport(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Transport listing approved", adminService.decideTransport(id, ApprovalStatus.APPROVED)));
    }

    @PostMapping("/transport/{id}/reject")
    public ResponseEntity<ApiResponse<TransportResponse>> rejectTransport(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Transport listing rejected", adminService.decideTransport(id, ApprovalStatus.REJECTED)));
    }

    @PostMapping("/vehicle-work/{id}/approve")
    public ResponseEntity<ApiResponse<VehicleWorkResponse>> approveVehicleWork(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Vehicle work listing approved", adminService.decideVehicleWork(id, ApprovalStatus.APPROVED)));
    }

    @PostMapping("/vehicle-work/{id}/reject")
    public ResponseEntity<ApiResponse<VehicleWorkResponse>> rejectVehicleWork(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Vehicle work listing rejected", adminService.decideVehicleWork(id, ApprovalStatus.REJECTED)));
    }
}
