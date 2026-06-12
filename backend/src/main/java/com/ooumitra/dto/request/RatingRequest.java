package com.ooumitra.dto.request;

import com.ooumitra.enums.ListingType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class RatingRequest {
    @NotNull private ListingType listingType;
    @NotNull private Long listingId;
    @NotNull @Min(1) @Max(5) private Integer stars;
    @Size(max = 1000) private String review;
    private List<String> tags;
}
