package com.ooumitra.dto.response;

import com.ooumitra.entity.Rating;
import com.ooumitra.enums.ListingType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data @Builder
public class RatingResponse {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private ListingType listingType;
    private Long listingId;
    private Integer stars;
    private String review;
    private List<String> tags;
    private Instant createdAt;

    public static RatingResponse from(Rating r) {
        return RatingResponse.builder()
                .id(r.getId())
                .reviewerId(r.getReviewer().getId())
                .reviewerName(r.getReviewer().getFirstName() + " " + r.getReviewer().getLastName())
                .listingType(r.getListingType()).listingId(r.getListingId())
                .stars(r.getStars()).review(r.getReview()).tags(r.getTags())
                .createdAt(r.getCreatedAt()).build();
    }
}
