package com.ooumitra.dto.response;

import com.ooumitra.entity.Product;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.ProductCategory;
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
    private String description;
    private List<String> imageUrls;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private ApprovalStatus approvalStatus;
    private Instant createdAt;

    public static ProductResponse from(Product p) {
        return ProductResponse.builder()
                .id(p.getId()).userId(p.getUser().getId())
                .productName(p.getProductName()).category(p.getCategory())
                .subCategory(p.getSubCategory()).ownerName(p.getOwnerName())
                .mobileNumber(p.getMobileNumber()).amount(p.getAmount())
                .negotiable(p.isNegotiable()).location(p.getLocation())
                .latitude(p.getLatitude()).longitude(p.getLongitude())
                .availability(p.getAvailability()).description(p.getDescription())
                .imageUrls(p.getImageUrls())
                .averageRating(p.getAverageRating()).ratingCount(p.getRatingCount())
                .approvalStatus(p.getApprovalStatus())
                .createdAt(p.getCreatedAt()).build();
    }
}
