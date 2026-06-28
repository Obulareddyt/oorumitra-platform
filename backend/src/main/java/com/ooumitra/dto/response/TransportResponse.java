package com.ooumitra.dto.response;

import com.ooumitra.entity.TransportListing;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.TransportVehicleType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

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
    private String village;
    private String description;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private List<String> imageUrls;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private ApprovalStatus approvalStatus;
    private String adminRemarks;
    private Instant decidedAt;
    private String decidedBy;
    private Instant createdAt;

    public static TransportResponse from(TransportListing t) {
        return TransportResponse.builder()
                .id(t.getId()).userId(t.getUser().getId())
                .vehicleType(t.getVehicleType()).ownerName(t.getOwnerName())
                .mobileNumber(t.getMobileNumber()).ratePerKm(t.getRatePerKm())
                .ratePerHour(t.getRatePerHour()).weightCapacity(t.getWeightCapacity())
                .negotiable(t.isNegotiable()).availability(t.getAvailability())
                .village(t.getVillage()).description(t.getDescription())
                .latitude(t.getLatitude()).longitude(t.getLongitude())
                .imageUrls(t.getImageUrls())
                .averageRating(t.getAverageRating()).ratingCount(t.getRatingCount())
                .approvalStatus(t.getApprovalStatus())
                .adminRemarks(t.getAdminRemarks())
                .decidedAt(t.getDecidedAt())
                .decidedBy(t.getDecidedBy())
                .createdAt(t.getCreatedAt()).build();
    }
}
