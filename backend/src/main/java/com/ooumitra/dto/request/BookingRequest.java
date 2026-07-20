package com.ooumitra.dto.request;

import com.ooumitra.enums.ListingType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    @NotNull private Long listingId;
    @NotNull private ListingType listingType;
    // Service bookings only — ignored (and not required) for PRODUCT interest.
    private LocalDate serviceDate;
    private LocalTime serviceTime;
    private String notes;
}
