package com.ooumitra.dto.response;

import com.ooumitra.entity.TransportListing;
import com.ooumitra.enums.TransportVehicleType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data @Builder
public class TransportResponse {
    private Long id;
    private Long userId;
    private TransportVehicleType vehicleType;
    private String ownerName;
    private String mobileNumber;
    private BigDecimal ratePerKm;
    private BigDecimal ratePerHour;
    private String weightCapacity;
    private boolean negotiable;
    private String availability;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private Instant createdAt;

    public static TransportResponse from(TransportListing t) {
        return TransportResponse.builder()
                .id(t.getId()).userId(t.getUser().getId())
                .vehicleType(t.getVehicleType()).ownerName(t.getOwnerName())
                .mobileNumber(t.getMobileNumber()).ratePerKm(t.getRatePerKm())
                .ratePerHour(t.getRatePerHour()).weightCapacity(t.getWeightCapacity())
                .negotiable(t.isNegotiable()).availability(t.getAvailability())
                .latitude(t.getLatitude()).longitude(t.getLongitude())
                .averageRating(t.getAverageRating()).ratingCount(t.getRatingCount())
                .createdAt(t.getCreatedAt()).build();
    }
}
