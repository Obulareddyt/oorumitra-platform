package com.ooumitra.service;

import com.ooumitra.dto.request.RatingRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.RatingResponse;
import com.ooumitra.entity.Rating;
import com.ooumitra.entity.User;
import com.ooumitra.enums.ListingType;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.*;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepo;
    private final WorkerListingRepository workerRepo;
    private final ProductRepository productRepo;
    private final VehicleWorkListingRepository vehicleWorkRepo;
    private final TransportListingRepository transportRepo;

    @Transactional(readOnly = true)
    public PagedResponse<RatingResponse> getRatings(ListingType type, Long listingId, int page, int size) {
        var result = ratingRepo.findByListingTypeAndListingId(type, listingId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        var content = result.getContent().stream().map(RatingResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public RatingResponse submit(RatingRequest req) {
        User reviewer = SecurityUtils.currentUser();
        if (ratingRepo.findByReviewerIdAndListingTypeAndListingId(
                reviewer.getId(), req.getListingType(), req.getListingId()).isPresent()) {
            throw OoruMitraException.conflict("You have already rated this listing");
        }
        if (req.getStars() < 1 || req.getStars() > 5) {
            throw OoruMitraException.badRequest("Stars must be between 1 and 5");
        }
        Rating rating = Rating.builder()
                .reviewer(reviewer)
                .listingType(req.getListingType())
                .listingId(req.getListingId())
                .stars(req.getStars())
                .review(req.getReview())
                .tags(req.getTags())
                .build();
        rating = ratingRepo.save(rating);
        updateListingRating(req.getListingType(), req.getListingId());
        return RatingResponse.from(rating);
    }

    private void updateListingRating(ListingType type, Long listingId) {
        Double avg = ratingRepo.findAverageRating(type, listingId);
        Long count = ratingRepo.countByListing(type, listingId);
        if (avg == null) return;
        BigDecimal rating = BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP);
        int cnt = count.intValue();

        switch (type) {
            case WORKER -> workerRepo.findById(listingId).ifPresent(w -> {
                w.setAverageRating(rating); w.setRatingCount(cnt); workerRepo.save(w);
            });
            case PRODUCT -> productRepo.findById(listingId).ifPresent(p -> {
                p.setAverageRating(rating); p.setRatingCount(cnt); productRepo.save(p);
            });
            case VEHICLE_WORK -> vehicleWorkRepo.findById(listingId).ifPresent(v -> {
                v.setAverageRating(rating); v.setRatingCount(cnt); vehicleWorkRepo.save(v);
            });
            case TRANSPORT -> transportRepo.findById(listingId).ifPresent(t -> {
                t.setAverageRating(rating); t.setRatingCount(cnt); transportRepo.save(t);
            });
        }
    }
}
