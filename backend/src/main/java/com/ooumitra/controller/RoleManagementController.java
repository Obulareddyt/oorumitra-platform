package com.ooumitra.controller;

import com.ooumitra.dto.request.AppRoleRequest;
import com.ooumitra.dto.response.AppRoleResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.RoleAuditLogResponse;
import com.ooumitra.service.RoleManagementService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
@Tag(name = "Role Management")
public class RoleManagementController {

    private final RoleManagementService service;

    @GetMapping
    @Operation(summary = "List roles with search, filter and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<AppRoleResponse>>> listRoles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(service.listRoles(search, status, page, size)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get role by ID (includes permissions)")
    public ResponseEntity<ApiResponse<AppRoleResponse>> getRole(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getRole(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new role")
    public ResponseEntity<ApiResponse<AppRoleResponse>> createRole(@Valid @RequestBody AppRoleRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.createRole(req)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update role name, description or status")
    public ResponseEntity<ApiResponse<AppRoleResponse>> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody AppRoleRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(service.updateRole(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete role (blocked if users are assigned)")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        service.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.ok("Role deleted successfully"));
    }

    @PutMapping("/{id}/permissions")
    @Operation(summary = "Assign permissions to a role")
    public ResponseEntity<ApiResponse<AppRoleResponse>> updatePermissions(
            @PathVariable Long id,
            @RequestBody List<Long> permissionIds) {
        return ResponseEntity.ok(ApiResponse.ok(service.updatePermissions(id, permissionIds)));
    }

    @GetMapping("/permissions/all")
    @Operation(summary = "Get all permissions grouped by category")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllPermissions() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllPermissionsGrouped()));
    }

    @GetMapping("/audit-log")
    @Operation(summary = "Role management audit log")
    public ResponseEntity<ApiResponse<PagedResponse<RoleAuditLogResponse>>> getAuditLog(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAuditLog(page, size)));
    }
}
