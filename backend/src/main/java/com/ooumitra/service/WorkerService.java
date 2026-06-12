package com.ooumitra.service;

import com.ooumitra.dto.request.WorkerListingRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.WorkerListingResponse;
import com.ooumitra.entity.User;
import com.ooumitra.entity.WorkerListing;
import com.ooumitra.enums.WorkType;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.WorkerListingRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerListingRepository workerRepo;

    @Value("${app.pagination.default-page-size}")
    private int defaultPageSize;

    @Value("${app.search.default-radius-km}")
    private double defaultRadiusKm;

    @Transactional(readOnly = true)
    public PagedResponse<WorkerListingResponse> getAll(WorkType workType, String village,
                                                        BigDecimal minAmount, BigDecimal maxAmount,
                                                        String sortBy, int page, int size) {
        if (size <= 0) size = defaultPageSize;
        Sort sort = resolveSort(sortBy);
        PageRequest pageReq = PageRequest.of(page, size, sort);

        Page<WorkerListing> result;
        if (workType != null) {
            result = workerRepo.findByWorkTypeAndIsActiveTrue(workType, pageReq);
        } else {
            result = workerRepo.findByIsActiveTrue(pageReq);
        }

        var filtered = result.getContent().stream()
                .filter(w -> village == null || w.getVillage().equalsIgnoreCase(village))
                .filter(w -> minAmount == null || w.getAmount().compareTo(minAmount) >= 0)
                .filter(w -> maxAmount == null || w.getAmount().compareTo(maxAmount) <= 0)
                .map(WorkerListingResponse::from)
                .toList();

        return new PagedResponse<>(filtered, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public List<WorkerListingResponse> getNearby(double lat, double lng, double radiusKm, int limit) {
        if (radiusKm <= 0) radiusKm = defaultRadiusKm;
        return workerRepo.findNearby(lat, lng, radiusKm, PageRequest.of(0, limit))
                .stream().map(WorkerListingResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public WorkerListingResponse getById(Long id) {
        return WorkerListingResponse.from(workerRepo.findById(id)
                .filter(WorkerListing::isActive)
                .orElseThrow(() -> OoruMitraException.notFound("Worker listing")));
    }

    @Transactional(readOnly = true)
    public PagedResponse<WorkerListingResponse> getMyListings(int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        if (size <= 0) size = defaultPageSize;
        Page<WorkerListing> result = workerRepo.findByUserIdAndIsActiveTrue(userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        var content = result.getContent().stream().map(WorkerListingResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public WorkerListingResponse create(WorkerListingRequest req) {
        User user = SecurityUtils.currentUser();
        WorkerListing listing = WorkerListing.builder()
                .user(user)
                .groupName(req.getGroupName())
                .ownerName(req.getOwnerName())
                .mobileNumber(req.getMobileNumber())
                .village(req.getVillage())
                .availableWorkers(req.getAvailableWorkers())
                .priceType(req.getPriceType())
                .amount(req.getAmount())
                .workType(req.getWorkType())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .build();
        return WorkerListingResponse.from(workerRepo.save(listing));
    }

    @Transactional
    public WorkerListingResponse update(Long id, WorkerListingRequest req) {
        WorkerListing listing = getOwnedListing(id);
        listing.setGroupName(req.getGroupName());
        listing.setOwnerName(req.getOwnerName());
        listing.setMobileNumber(req.getMobileNumber());
        listing.setVillage(req.getVillage());
        listing.setAvailableWorkers(req.getAvailableWorkers());
        listing.setPriceType(req.getPriceType());
        listing.setAmount(req.getAmount());
        listing.setWorkType(req.getWorkType());
        listing.setLatitude(req.getLatitude());
        listing.setLongitude(req.getLongitude());
        return WorkerListingResponse.from(workerRepo.save(listing));
    }

    @Transactional
    public void delete(Long id) {
        WorkerListing listing = getOwnedListing(id);
        listing.setActive(false);
        workerRepo.save(listing);
    }

    private WorkerListing getOwnedListing(Long id) {
        Long userId = SecurityUtils.currentUserId();
        WorkerListing listing = workerRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Worker listing"));
        if (!listing.getUser().getId().equals(userId)) {
            throw OoruMitraException.forbidden("Not your listing");
        }
        return listing;
    }

    private Sort resolveSort(String sortBy) {
        return switch (sortBy == null ? "" : sortBy) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "amount");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "amount");
            case "rating" -> Sort.by(Sort.Direction.DESC, "averageRating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
