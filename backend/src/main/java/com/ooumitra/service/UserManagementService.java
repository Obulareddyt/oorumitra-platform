package com.ooumitra.service;

import com.ooumitra.dto.request.AssignRoleRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.UserSummaryResponse;
import com.ooumitra.entity.User;
import com.ooumitra.entity.Village;
import com.ooumitra.enums.Role;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.UserRepository;
import com.ooumitra.repository.VillageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepo;
    private final VillageRepository villageRepo;
    private final VillageService villageService;

    // ── List users ────────────────────────────────────────────────────────────

    public PagedResponse<UserSummaryResponse> listUsers(
            Long villageId, String roleStr, String statusStr, String search,
            int page, int size) {

        User actor = currentUser();
        Long effectiveVillageId = villageId;

        // Village Admins can only see their own village
        if (actor.getRole() == Role.ADMIN) {
            List<Village> myVillages = villageRepo.findByAdminId(actor.getId());
            if (myVillages.isEmpty()) {
                return new PagedResponse<>(List.of(), 0, 0, page, size);
            }
            effectiveVillageId = myVillages.get(0).getId();
        }

        Role roleFilter = null;
        if (roleStr != null && !roleStr.isBlank()) {
            try { roleFilter = Role.valueOf(roleStr.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        Boolean activeFilter = null;
        if ("ACTIVE".equalsIgnoreCase(statusStr))   activeFilter = true;
        if ("INACTIVE".equalsIgnoreCase(statusStr)) activeFilter = false;

        String searchParam = (search == null || search.isBlank()) ? null : search.trim();

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> result = userRepo.searchUsers(searchParam, effectiveVillageId, roleFilter, activeFilter, pageable);

        List<UserSummaryResponse> content = result.getContent().stream()
                .map(villageService::userSummary)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    // ── Assign role ───────────────────────────────────────────────────────────

    @Transactional
    public UserSummaryResponse assignRole(Long userId, AssignRoleRequest req) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> OoruMitraException.notFound("User " + userId));

        Role newRole;
        try {
            newRole = Role.valueOf(req.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw OoruMitraException.badRequest("Invalid role: " + req.getRole());
        }

        // Village required for all non-SUPER_ADMIN roles
        if (newRole != Role.SUPER_ADMIN && req.getVillageId() == null) {
            throw OoruMitraException.badRequest("Village must be selected before assigning a role.");
        }

        Village village = null;
        if (req.getVillageId() != null) {
            village = villageRepo.findById(req.getVillageId())
                    .orElseThrow(() -> OoruMitraException.notFound("Village " + req.getVillageId()));
        }

        user.setRole(newRole);
        user.setVillageRef(village);

        // If promoted to Village Admin, add to village_admins
        if (newRole == Role.ADMIN && village != null) {
            village.getAdmins().add(user);
            villageRepo.save(village);
        }

        return villageService.userSummary(userRepo.save(user));
    }

    // ── Get single user ───────────────────────────────────────────────────────

    public UserSummaryResponse getUser(Long id) {
        return villageService.userSummary(userRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("User " + id)));
    }

    // ── Toggle active ─────────────────────────────────────────────────────────

    @Transactional
    public UserSummaryResponse toggleActive(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> OoruMitraException.notFound("User " + userId));
        user.setActive(!user.isActive());
        return villageService.userSummary(userRepo.save(user));
    }

    private User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
