package com.ooumitra.dto.response;

import com.ooumitra.entity.Booking;
import com.ooumitra.enums.BookingStatus;
import com.ooumitra.enums.ListingType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @Builder
public class BookingResponse {
    private Long id;
    private ListingType listingType;
    private Long listingId;
    private String listingName;

    private Long customerId;
    private String customerName;
    private String customerMobile;

    private Long ownerId;
    private String ownerName;
    private String ownerMobile;

    private BookingStatus status;
    private LocalDate requiredDate;
    private LocalTime serviceTime;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public static BookingResponse from(Booking b, String listingName, String ownerMobile) {
        return BookingResponse.builder()
                .id(b.getId())
                .listingType(b.getListingType())
                .listingId(b.getListingId())
                .listingName(listingName)
                .customerId(b.getUser().getId())
                .customerName(b.getUser().getFirstName() + " " + b.getUser().getLastName())
                .customerMobile(b.getUser().getMobileNumber())
                .ownerId(b.getOwner() != null ? b.getOwner().getId() : null)
                .ownerName(b.getOwner() != null ? b.getOwner().getFirstName() + " " + b.getOwner().getLastName() : null)
                .ownerMobile(ownerMobile)
                .status(b.getStatus())
                .requiredDate(b.getRequiredDate())
                .serviceTime(b.getServiceTime())
                .notes(b.getNotes())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
