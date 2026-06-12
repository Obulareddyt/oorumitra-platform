package com.ooumitra.dto.request;

import com.ooumitra.enums.ListingType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartChatRequest {
    @NotNull private Long sellerId;
    private ListingType listingType;
    private Long listingId;
}
