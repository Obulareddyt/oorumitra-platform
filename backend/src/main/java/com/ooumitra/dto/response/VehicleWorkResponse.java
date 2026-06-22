package com.ooumitra.dto.response;

import com.ooumitra.entity.VehicleWorkListing;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.VehicleWorkType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data @Builder
public class VehicleWorkResponse {
    private Long id;
    private Long userId;
    private VehicleWorkType vehicleType;
    private String ownerName;
    private String mobileNumber;
    private BigDecimal pricePerAcre;
    private BigDecimal pricePerHour;
    private String village;
    private boolean availableStatus;
    private LocalDate availableUntil;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private ApprovalStatus approvalStatus;
    private Instant createdAt;

    public static VehicleWorkResponse from(VehicleWorkListing v) {
        return VehicleWorkResponse.builder()
                .id(v.getId()).userId(v.getUser().getId())
                .vehicleType(v.getVehicleType()).ownerName(v.getOwnerName())
                .mobileNumber(v.getMobileNumber()).pricePerAcre(v.getPricePerAcre())
                .pricePerHour(v.getPricePerHour()).village(v.getVillage())
                .availableStatus(v.isAvailableStatus()).availableUntil(v.getAvailableUntil())
                .latitude(v.getLatitude()).longitude(v.getLongitude())
                .averageRating(v.getAverageRating()).ratingCount(v.getRatingCount())
                .approvalStatus(v.getApprovalStatus())
                .createdAt(v.getCreatedAt()).build();
    }
}
