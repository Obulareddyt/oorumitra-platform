package com.ooumitra.service;

import com.ooumitra.dto.request.VehicleWorkRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.VehicleWorkResponse;
import com.ooumitra.entity.User;
import com.ooumitra.entity.VehicleWorkListing;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.VehicleWorkType;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.VehicleWorkListingRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleWorkService {

    private final VehicleWorkListingRepository repo;
    private final S3Service s3Service;
    private final com.ooumitra.repository.CategoryManagementRepository categoryManagementRepo;

    @Value("${app.pagination.default-page-size}")
    private int defaultPageSize;

    @Value("${app.search.default-radius-km}")
    private double defaultRadiusKm;

    @Transactional(readOnly = true)
    public PagedResponse<VehicleWorkResponse> getAll(VehicleWorkType vehicleType, String sortBy, int page, int size) {
        if (size <= 0) size = defaultPageSize;
        Sort sort = resolveSort(sortBy);
        PageRequest pageReq = PageRequest.of(page, size, sort);
        Page<VehicleWorkListing> result = vehicleType != null
                ? repo.findByVehicleTypeAndIsActiveTrueAndApprovalStatus(vehicleType, ApprovalStatus.APPROVED, pageReq)
                : repo.findByIsActiveTrueAndApprovalStatus(ApprovalStatus.APPROVED, pageReq);
        var content = result.getContent().stream()
                .filter(VehicleWorkListing::isAvailableStatus)
                .map(VehicleWorkResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public List<VehicleWorkResponse> getNearby(double lat, double lng, double radiusKm, int limit) {
        if (radiusKm <= 0) radiusKm = defaultRadiusKm;
        return repo.findNearby(lat, lng, radiusKm, PageRequest.of(0, limit))
                .stream()
                .filter(VehicleWorkListing::isAvailableStatus)
                .map(VehicleWorkResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public VehicleWorkResponse getById(Long id) {
        return VehicleWorkResponse.from(repo.findById(id)
                .filter(VehicleWorkListing::isActive)
                .orElseThrow(() -> OoruMitraException.notFound("Vehicle work listing")));
    }

    @Transactional(readOnly = true)
    public PagedResponse<VehicleWorkResponse> getMyListings(int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        if (size <= 0) size = defaultPageSize;
        Page<VehicleWorkListing> result = repo.findByUserIdAndIsActiveTrue(userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        var content = result.getContent().stream().map(VehicleWorkResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public VehicleWorkResponse create(VehicleWorkRequest req, List<MultipartFile> images) throws IOException {
        validateServicesCategoryEnabled();
        User user = SecurityUtils.currentUser();
        List<String> imageUrls = (images != null && !images.isEmpty())
                ? s3Service.uploadFiles(images, "vehicle-work") : new ArrayList<>();
        VehicleWorkListing listing = VehicleWorkListing.builder()
                .user(user).vehicleType(req.getVehicleType())
                .ownerName(req.getOwnerName()).mobileNumber(req.getMobileNumber())
                .pricePerAcre(req.getPricePerAcre()).pricePerHour(req.getPricePerHour())
                .village(req.getVillage()).availableStatus(req.isAvailableStatus())
                .availableUntil(req.getAvailableUntil())
                .description(req.getDescription())
                .latitude(req.getLatitude()).longitude(req.getLongitude())
                .imageUrls(imageUrls)
                .build();
        return VehicleWorkResponse.from(repo.save(listing));
    }

    @Transactional
    public VehicleWorkResponse update(Long id, VehicleWorkRequest req) {
        validateServicesCategoryEnabled();
        VehicleWorkListing listing = getOwned(id);
        listing.setVehicleType(req.getVehicleType());
        listing.setOwnerName(req.getOwnerName()); listing.setMobileNumber(req.getMobileNumber());
        listing.setPricePerAcre(req.getPricePerAcre()); listing.setPricePerHour(req.getPricePerHour());
        listing.setVillage(req.getVillage()); listing.setAvailableStatus(req.isAvailableStatus());
        listing.setAvailableUntil(req.getAvailableUntil());
        listing.setLatitude(req.getLatitude()); listing.setLongitude(req.getLongitude());
        return VehicleWorkResponse.from(repo.save(listing));
    }

    @Transactional
    public void delete(Long id) {
        VehicleWorkListing listing = getOwned(id);
        listing.setActive(false);
        repo.save(listing);
    }

    @Transactional
    public VehicleWorkResponse updateAvailability(Long id, boolean available) {
        VehicleWorkListing listing = getOwned(id);
        listing.setAvailableStatus(available);
        return VehicleWorkResponse.from(repo.save(listing));
    }

    private VehicleWorkListing getOwned(Long id) {
        Long userId = SecurityUtils.currentUserId();
        VehicleWorkListing listing = repo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Vehicle work listing"));
        if (!listing.getUser().getId().equals(userId)) throw OoruMitraException.forbidden("Not your listing");
        return listing;
    }

    private Sort resolveSort(String sortBy) {
        return switch (sortBy == null ? "" : sortBy) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "pricePerHour");
            case "rating" -> Sort.by(Sort.Direction.DESC, "averageRating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private void validateServicesCategoryEnabled() {
        categoryManagementRepo.findByKeyName("SERVICES").ifPresent(c -> {
            if ("DISABLED".equalsIgnoreCase(c.getStatus())) {
                throw OoruMitraException.badRequest("New listings are disabled under the " + c.getLabel() + " category.");
            }
        });
    }
}
