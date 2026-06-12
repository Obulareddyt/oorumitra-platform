package com.ooumitra.dto.response;

import com.ooumitra.entity.Favourite;
import com.ooumitra.enums.ListingType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data @Builder
public class FavouriteResponse {
    private Long id;
    private ListingType listingType;
    private Long listingId;
    private Instant createdAt;

    public static FavouriteResponse from(Favourite f) {
        return FavouriteResponse.builder()
                .id(f.getId()).listingType(f.getListingType())
                .listingId(f.getListingId()).createdAt(f.getCreatedAt()).build();
    }
}
