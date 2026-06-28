package com.ooumitra.service;

import com.ooumitra.dto.request.VillageRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.UserSummaryResponse;
import com.ooumitra.dto.response.VillageResponse;
import com.ooumitra.dto.response.VillageSummaryReport;
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

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VillageService {

    private final VillageRepository villageRepo;
    private final UserRepository userRepo;

    // ── List ─────────────────────────────────────────────────────────────────

    public PagedResponse<VillageResponse> listVillages(String search, String status, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        String s = (search == null || search.isBlank()) ? null : search.trim();
        String st = (status == null || status.isBlank()) ? null : status.trim();
        Page<Village> result = villageRepo.search(s, st, pageable);
        List<VillageResponse> content = result.getContent().stream()
                .map(v -> toResponse(v, false))
                .collect(Collectors.toList());
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    public List<VillageResponse> getAllActive() {
        return villageRepo.findByStatusOrderByNameAsc("ACTIVE").stream()
                .map(v -> VillageResponse.builder()
                        .id(v.getId()).name(v.getName())
                        .mandal(v.getMandal()).district(v.getDistrict())
                        .state(v.getState()).status(v.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    // ── Get ──────────────────────────────────────────────────────────────────

    public VillageResponse getVillage(Long id) {
        return toResponse(findById(id), true);
    }

    // ── Create ───────────────────────────────────────────────────────────────

    @Transactional
    public VillageResponse createVillage(VillageRequest req) {
        if (villageRepo.existsByNameIgnoreCaseAndDistrictIgnoreCase(req.getName(), req.getDistrict())) {
            throw OoruMitraException.conflict(
                    "A village named '" + req.getName() + "' already exists in " + req.getDistrict() + ".");
        }
        User actor = currentUser();
        Village v = Village.builder()
                .name(req.getName().trim())
                .mandal(req.getMandal())
                .district(req.getDistrict().trim())
                .state(req.getState().trim())
                .pincode(req.getPincode())
                .status(req.getStatus() != null ? req.getStatus() : "ACTIVE")
                .createdBy(actor.getId())
                .build();
        return toResponse(villageRepo.save(v), false);
    }

    // ── Update ───────────────────────────────────────────────────────────────

    @Transactional
    public VillageResponse updateVillage(Long id, VillageRequest req) {
        Village v = findById(id);
        if (villageRepo.existsByNameIgnoreCaseAndDistrictIgnoreCaseAndIdNot(req.getName(), req.getDistrict(), id)) {
            throw OoruMitraException.conflict(
                    "A village named '" + req.getName() + "' already exists in " + req.getDistrict() + ".");
        }
        v.setName(req.getName().trim());
        if (req.getMandal() != null) v.setMandal(req.getMandal());
        v.setDistrict(req.getDistrict().trim());
        v.setState(req.getState().trim());
        if (req.getPincode() != null) v.setPincode(req.getPincode());
        if (req.getStatus() != null) v.setStatus(req.getStatus());
        return toResponse(villageRepo.save(v), false);
    }

    // ── Toggle status ─────────────────────────────────────────────────────────

    @Transactional
    public VillageResponse toggleStatus(Long id) {
        Village v = findById(id);
        v.setStatus("ACTIVE".equals(v.getStatus()) ? "INACTIVE" : "ACTIVE");
        return toResponse(villageRepo.save(v), false);
    }

    // ── Admin assignment ──────────────────────────────────────────────────────

    @Transactional
    public VillageResponse assignAdmin(Long villageId, Long userId) {
        Village v = findById(villageId);
        User user = userRepo.findById(userId)
                .orElseThrow(() -> OoruMitraException.notFound("User " + userId));
        v.getAdmins().add(user);
        // Also promote user to ADMIN role
        user.setRole(Role.ADMIN);
        user.setVillageRef(v);
        userRepo.save(user);
        return toResponse(villageRepo.save(v), true);
    }

    @Transactional
    public VillageResponse removeAdmin(Long villageId, Long userId) {
        Village v = findById(villageId);
        v.getAdmins().removeIf(u -> u.getId().equals(userId));
        return toResponse(villageRepo.save(v), true);
    }

    // ── Village Summary Report ────────────────────────────────────────────────

    public List<VillageSummaryReport> getSummaryReport() {
        return villageRepo.findAll(Sort.by("name")).stream().map(v -> {
            long total = userRepo.countByVillageRefId(v.getId());
            Map<Role, Long> counts = roleCounts(v.getId());
            return VillageSummaryReport.builder()
                    .villageId(v.getId())
                    .villageName(v.getName())
                    .district(v.getDistrict())
                    .totalUsers(total)
                    .farmers(counts.getOrDefault(Role.FARMER, 0L))
                    .vendors(counts.getOrDefault(Role.SELLER, 0L))
                    .serviceProviders(counts.getOrDefault(Role.SERVICE_PROVIDER, 0L))
                    .villageAdmins(counts.getOrDefault(Role.ADMIN, 0L))
                    .members(counts.getOrDefault(Role.BUYER, 0L))
                    .moderators(counts.getOrDefault(Role.MODERATOR, 0L))
                    .build();
        }).collect(Collectors.toList());
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Village findById(Long id) {
        return villageRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Village " + id));
    }

    private User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private Map<Role, Long> roleCounts(Long villageId) {
        Map<Role, Long> map = new EnumMap<>(Role.class);
        userRepo.countByRoleForVillage(villageId)
                .forEach(row -> map.put((Role) row[0], (Long) row[1]));
        return map;
    }

    VillageResponse toResponse(Village v, boolean includeAdmins) {
        long total = userRepo.countByVillageRefId(v.getId());
        return VillageResponse.builder()
                .id(v.getId())
                .name(v.getName())
                .mandal(v.getMandal())
                .district(v.getDistrict())
                .state(v.getState())
                .pincode(v.getPincode())
                .status(v.getStatus())
                .totalUsers(total)
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .admins(includeAdmins
                        ? v.getAdmins().stream().map(this::userSummary).collect(Collectors.toList())
                        : null)
                .build();
    }

    UserSummaryResponse userSummary(User u) {
        Village vr = u.getVillageRef();
        return UserSummaryResponse.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .username(u.getUsername())
                .mobileNumber(u.getMobileNumber())
                .villageId(vr != null ? vr.getId() : null)
                .villageName(vr != null ? vr.getName() : u.getVillage())
                .role(u.getRole().name())
                .isActive(u.isActive())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
