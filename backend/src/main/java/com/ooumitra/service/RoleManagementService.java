package com.ooumitra.service;

import com.ooumitra.dto.request.AppRoleRequest;
import com.ooumitra.dto.response.AppRoleResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.PermissionResponse;
import com.ooumitra.dto.response.RoleAuditLogResponse;
import com.ooumitra.entity.AppRole;
import com.ooumitra.entity.Permission;
import com.ooumitra.entity.RoleAuditLog;
import com.ooumitra.entity.User;
import com.ooumitra.enums.Role;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.AppRoleRepository;
import com.ooumitra.repository.PermissionRepository;
import com.ooumitra.repository.RoleAuditLogRepository;
import com.ooumitra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleManagementService {

    private final AppRoleRepository roleRepo;
    private final PermissionRepository permRepo;
    private final RoleAuditLogRepository auditRepo;
    private final UserRepository userRepo;

    // ── List ─────────────────────────────────────────────────────────────────

    public PagedResponse<AppRoleResponse> listRoles(String search, String status, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String searchParam = (search == null || search.isBlank()) ? null : search.trim();
        String statusParam = (status == null || status.isBlank()) ? null : status.trim();
        Page<AppRole> result = roleRepo.search(searchParam, statusParam, pageable);
        List<AppRoleResponse> content = result.getContent().stream()
                .map(r -> toResponse(r, false))
                .collect(Collectors.toList());
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    // ── Get single ───────────────────────────────────────────────────────────

    public AppRoleResponse getRole(Long id) {
        AppRole role = findById(id);
        return toResponse(role, true);
    }

    // ── Create ───────────────────────────────────────────────────────────────

    @Transactional
    public AppRoleResponse createRole(AppRoleRequest req) {
        if (roleRepo.existsByNameIgnoreCase(req.getName())) {
            throw OoruMitraException.conflict("A role with the name '" + req.getName() + "' already exists.");
        }
        User actor = currentUser();
        AppRole role = AppRole.builder()
                .name(req.getName().trim())
                .description(req.getDescription())
                .status(req.getStatus() != null ? req.getStatus() : "ACTIVE")
                .createdBy(actor.getId())
                .build();

        if (req.getPermissionIds() != null && !req.getPermissionIds().isEmpty()) {
            Set<Permission> perms = new HashSet<>(permRepo.findAllById(req.getPermissionIds()));
            role.setPermissions(perms);
        }

        role = roleRepo.save(role);
        audit("ROLE_CREATED", role.getName(), actor, "Created role with status " + role.getStatus());
        return toResponse(role, true);
    }

    // ── Update ───────────────────────────────────────────────────────────────

    @Transactional
    public AppRoleResponse updateRole(Long id, AppRoleRequest req) {
        AppRole role = findById(id);
        if (roleRepo.existsByNameIgnoreCaseAndIdNot(req.getName(), id)) {
            throw OoruMitraException.conflict("A role with the name '" + req.getName() + "' already exists.");
        }
        User actor = currentUser();
        String oldName = role.getName();
        role.setName(req.getName().trim());
        if (req.getDescription() != null) role.setDescription(req.getDescription());
        if (req.getStatus() != null) role.setStatus(req.getStatus());
        role.setUpdatedBy(actor.getId());

        if (req.getPermissionIds() != null) {
            Set<Permission> perms = new HashSet<>(permRepo.findAllById(req.getPermissionIds()));
            role.setPermissions(perms);
        }

        role = roleRepo.save(role);
        audit("ROLE_UPDATED", oldName, actor, "Updated to name='" + role.getName() + "', status=" + role.getStatus());
        return toResponse(role, true);
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    @Transactional
    public void deleteRole(Long id) {
        AppRole role = findById(id);
        if (role.isSystem()) {
            throw OoruMitraException.badRequest("System roles cannot be deleted.");
        }

        // Check if any users have this role assigned (by enum name match)
        try {
            String enumName = role.getName().toUpperCase().replace(' ', '_');
            Role enumRole = Role.valueOf(enumName);
            long count = userRepo.countByRole(enumRole);
            if (count > 0) {
                throw OoruMitraException.badRequest(
                        "This role is currently assigned to " + count + " user(s) and cannot be deleted.");
            }
        } catch (IllegalArgumentException ignored) {
            // No matching enum role — safe to delete
        }

        User actor = currentUser();
        String roleName = role.getName();
        roleRepo.delete(role);
        audit("ROLE_DELETED", roleName, actor, "Role permanently deleted");
    }

    // ── Permissions ──────────────────────────────────────────────────────────

    @Transactional
    public AppRoleResponse updatePermissions(Long id, List<Long> permissionIds) {
        AppRole role = findById(id);
        User actor = currentUser();
        Set<Permission> perms = permissionIds != null
                ? new HashSet<>(permRepo.findAllById(permissionIds))
                : new HashSet<>();
        role.setPermissions(perms);
        role.setUpdatedBy(actor.getId());
        role = roleRepo.save(role);
        audit("PERMISSIONS_UPDATED", role.getName(), actor,
              "Assigned " + perms.size() + " permission(s)");
        return toResponse(role, true);
    }

    public List<Map<String, Object>> getAllPermissionsGrouped() {
        List<Permission> all = permRepo.findAllByOrderByCategoryAscNameAsc();
        Map<String, List<PermissionResponse>> grouped = new LinkedHashMap<>();
        for (Permission p : all) {
            grouped.computeIfAbsent(p.getCategory(), k -> new ArrayList<>())
                   .add(toPermResponse(p));
        }
        List<Map<String, Object>> result = new ArrayList<>();
        grouped.forEach((cat, perms) -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("category", cat);
            entry.put("permissions", perms);
            result.add(entry);
        });
        return result;
    }

    // ── Audit Log ────────────────────────────────────────────────────────────

    public PagedResponse<RoleAuditLogResponse> getAuditLog(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<RoleAuditLog> result = auditRepo.findAllByOrderByPerformedAtDesc(pageable);
        List<RoleAuditLogResponse> content = result.getContent().stream()
                .map(l -> RoleAuditLogResponse.builder()
                        .id(l.getId())
                        .action(l.getAction())
                        .roleName(l.getRoleName())
                        .performedBy(l.getPerformedBy())
                        .performedAt(l.getPerformedAt())
                        .details(l.getDetails())
                        .build())
                .collect(Collectors.toList());
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private AppRole findById(Long id) {
        return roleRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Role with id " + id));
    }

    private User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void audit(String action, String roleName, User actor, String details) {
        String name = actor.getFirstName() + " " + actor.getLastName()
                + " (" + actor.getMobileNumber() + ")";
        auditRepo.save(RoleAuditLog.builder()
                .action(action)
                .roleName(roleName)
                .performedBy(name)
                .performedAt(Instant.now())
                .details(details)
                .build());
    }

    private AppRoleResponse toResponse(AppRole r, boolean includePermissions) {
        return AppRoleResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .status(r.getStatus())
                .isSystem(r.isSystem())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .createdBy(r.getCreatedBy())
                .updatedBy(r.getUpdatedBy())
                .permissions(includePermissions
                        ? r.getPermissions().stream().map(this::toPermResponse).collect(Collectors.toList())
                        : null)
                .build();
    }

    private PermissionResponse toPermResponse(Permission p) {
        return PermissionResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .category(p.getCategory())
                .description(p.getDescription())
                .build();
    }
}
