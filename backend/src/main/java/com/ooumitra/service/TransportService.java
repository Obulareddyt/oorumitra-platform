package com.ooumitra.service;

import com.ooumitra.dto.request.TransportRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.TransportResponse;
import com.ooumitra.entity.TransportListing;
import com.ooumitra.entity.User;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.TransportVehicleType;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.TransportListingRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final TransportListingRepository repo;

    @Value("${app.pagination.default-page-size}")
    private int defaultPageSize;

    @Value("${app.search.default-radius-km}")
    private double defaultRadiusKm;

    @Transactional(readOnly = true)
    public PagedResponse<TransportResponse> getAll(TransportVehicleType vehicleType, String sortBy, int page, int size) {
        if (size <= 0) size = defaultPageSize;
        Sort sort = resolveSort(sortBy);
        PageRequest pageReq = PageRequest.of(page, size, sort);
        Page<TransportListing> result = vehicleType != null
                ? repo.findByVehicleTypeAndIsActiveTrueAndApprovalStatus(vehicleType, ApprovalStatus.APPROVED, pageReq)
                : repo.findByIsActiveTrueAndApprovalStatus(ApprovalStatus.APPROVED, pageReq);
        var content = result.getContent().stream().map(TransportResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public List<TransportResponse> getNearby(double lat, double lng, double radiusKm, int limit) {
        if (radiusKm <= 0) radiusKm = defaultRadiusKm;
        return repo.findNearby(lat, lng, radiusKm, PageRequest.of(0, limit))
                .stream().map(TransportResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TransportResponse getById(Long id) {
        return TransportResponse.from(repo.findById(id)
                .filter(t -> t.isActive() && t.getApprovalStatus() == ApprovalStatus.APPROVED)
                .orElseThrow(() -> OoruMitraException.notFound("Transport listing")));
    }

    @Transactional(readOnly = true)
    public PagedResponse<TransportResponse> getMyListings(int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        if (size <= 0) size = defaultPageSize;
        Page<TransportListing> result = repo.findByUserIdAndIsActiveTrue(userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        var content = result.getContent().stream().map(TransportResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public TransportResponse create(TransportRequest req) {
        User user = SecurityUtils.currentUser();
        TransportListing listing = TransportListing.builder()
                .user(user).vehicleType(req.getVehicleType())
                .ownerName(req.getOwnerName()).mobileNumber(req.getMobileNumber())
                .ratePerKm(req.getRatePerKm()).ratePerHour(req.getRatePerHour())
                .weightCapacity(req.getWeightCapacity()).negotiable(req.isNegotiable())
                .availability(req.getAvailability())
                .latitude(req.getLatitude()).longitude(req.getLongitude())
                .build();
        return TransportResponse.from(repo.save(listing));
    }

    @Transactional
    public TransportResponse update(Long id, TransportRequest req) {
        TransportListing listing = getOwned(id);
        listing.setVehicleType(req.getVehicleType());
        listing.setOwnerName(req.getOwnerName()); listing.setMobileNumber(req.getMobileNumber());
        listing.setRatePerKm(req.getRatePerKm()); listing.setRatePerHour(req.getRatePerHour());
        listing.setWeightCapacity(req.getWeightCapacity()); listing.setNegotiable(req.isNegotiable());
        listing.setAvailability(req.getAvailability());
        listing.setLatitude(req.getLatitude()); listing.setLongitude(req.getLongitude());
        return TransportResponse.from(repo.save(listing));
    }

    @Transactional
    public void delete(Long id) {
        TransportListing listing = getOwned(id);
        listing.setActive(false);
        repo.save(listing);
    }

    private TransportListing getOwned(Long id) {
        Long userId = SecurityUtils.currentUserId();
        TransportListing listing = repo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Transport listing"));
        if (!listing.getUser().getId().equals(userId)) throw OoruMitraException.forbidden("Not your listing");
        return listing;
    }

    private Sort resolveSort(String sortBy) {
        return switch (sortBy == null ? "" : sortBy) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "ratePerKm");
            case "rating" -> Sort.by(Sort.Direction.DESC, "averageRating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
