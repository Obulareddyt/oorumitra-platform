package com.ooumitra.dto.request;

import com.ooumitra.enums.ListingType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavouriteRequest {
    @NotNull private ListingType listingType;
    @NotNull private Long listingId;
}
