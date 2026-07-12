package com.ooumitra.dto.response;

import com.ooumitra.entity.Product;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.ProductCategory;
import com.ooumitra.enums.ProductAvailabilityStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data @Builder
public class ProductResponse {
    private Long id;
    private Long userId;
    private String productName;
    private ProductCategory category;
    private String subCategory;
    private String ownerName;
    private String mobileNumber;
    private BigDecimal amount;
    private boolean negotiable;
    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String availability;
    private Integer quantity;
    private String description;
    private String voiceNoteUrl;
    private List<String> imageUrls;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private ApprovalStatus approvalStatus;
    private boolean availableStatus;
    private String adminRemarks;
    private Instant decidedAt;
    private String decidedBy;
    private Instant createdAt;
    private Instant updatedAt;
    private ProductAvailabilityStatus availabilityStatus;
    private String statusUpdatedBy;
    private Instant statusUpdatedDate;
    private String statusUpdatedRole;

    public static ProductResponse from(Product p) {
        return ProductResponse.builder()
                .id(p.getId()).userId(p.getUser().getId())
                .productName(p.getProductName()).category(p.getCategory())
                .subCategory(p.getSubCategory()).ownerName(p.getOwnerName())
                .mobileNumber(p.getMobileNumber()).amount(p.getAmount())
                .negotiable(p.isNegotiable()).location(p.getLocation())
                .latitude(p.getLatitude()).longitude(p.getLongitude())
                .availability(p.getAvailability()).quantity(p.getQuantity()).description(p.getDescription())
                .voiceNoteUrl(p.getVoiceNoteUrl())
                .imageUrls(p.getImageUrls())
                .averageRating(p.getAverageRating()).ratingCount(p.getRatingCount())
                .approvalStatus(p.getApprovalStatus())
                .availableStatus(p.isAvailableStatus())
                .adminRemarks(p.getAdminRemarks())
                .decidedAt(p.getDecidedAt())
                .decidedBy(p.getDecidedBy())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .availabilityStatus(p.getAvailabilityStatus())
                .statusUpdatedBy(p.getStatusUpdatedBy())
                .statusUpdatedDate(p.getStatusUpdatedDate())
                .statusUpdatedRole(p.getStatusUpdatedRole())
                .build();
    }
}
