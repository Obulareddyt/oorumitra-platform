package com.ooumitra.dto.response;

import com.ooumitra.entity.VehicleWorkListing;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.PriceType;
import com.ooumitra.enums.VehicleWorkType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data @Builder
public class VehicleWorkResponse {
    private Long id;
    private Long userId;
    private VehicleWorkType vehicleType;
    private String ownerName;
    private String mobileNumber;
    private PriceType priceType;
    private BigDecimal amount;
    private String village;
    private boolean availableStatus;
    private LocalDate availableUntil;
    private String description;
    private String voiceNoteUrl;
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

    public static VehicleWorkResponse from(VehicleWorkListing v) {
        return VehicleWorkResponse.builder()
                .id(v.getId()).userId(v.getUser().getId())
                .vehicleType(v.getVehicleType()).ownerName(v.getOwnerName())
                .mobileNumber(v.getMobileNumber()).priceType(v.getPriceType())
                .amount(v.getAmount()).village(v.getVillage())
                .availableStatus(v.isAvailableStatus()).availableUntil(v.getAvailableUntil())
                .description(v.getDescription())
                .voiceNoteUrl(v.getVoiceNoteUrl())
                .latitude(v.getLatitude()).longitude(v.getLongitude())
                .imageUrls(v.getImageUrls())
                .averageRating(v.getAverageRating()).ratingCount(v.getRatingCount())
                .approvalStatus(v.getApprovalStatus())
                .adminRemarks(v.getAdminRemarks())
                .decidedAt(v.getDecidedAt())
                .decidedBy(v.getDecidedBy())
                .createdAt(v.getCreatedAt()).build();
    }
}
