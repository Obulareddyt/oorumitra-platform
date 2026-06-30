package com.ooumitra.controller;

import com.ooumitra.dto.request.AssignRoleRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.UserSummaryResponse;
import com.ooumitra.service.UserManagementService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/management/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
@Tag(name = "User Management")
public class UserManagementController {

    private final UserManagementService service;

    @GetMapping
    @Operation(summary = "List users with village, role, status, and search filters")
    public ResponseEntity<ApiResponse<PagedResponse<UserSummaryResponse>>> listUsers(
            @RequestParam(required = false) Long villageId,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.ok(service.listUsers(villageId, role, status, search, page, size)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user details")
    public ResponseEntity<ApiResponse<UserSummaryResponse>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getUser(id)));
    }

    @PutMapping("/{id}/assign-role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Assign village and role to a user")
    public ResponseEntity<ApiResponse<UserSummaryResponse>> assignRole(
            @PathVariable Long id,
            @Valid @RequestBody AssignRoleRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(service.assignRole(id, req)));
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Activate or deactivate a user")
    public ResponseEntity<ApiResponse<UserSummaryResponse>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.toggleActive(id)));
    }
}
