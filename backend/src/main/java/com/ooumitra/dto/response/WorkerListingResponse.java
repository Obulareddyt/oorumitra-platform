package com.ooumitra.dto.response;

import com.ooumitra.entity.WorkerListing;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.PriceType;
import com.ooumitra.enums.WorkType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data @Builder
public class WorkerListingResponse {
    private Long id;
    private Long userId;
    private String groupName;
    private String ownerName;
    private String mobileNumber;
    private String village;
    private Integer availableWorkers;
    private PriceType priceType;
    private BigDecimal amount;
    private WorkType workType;
    private String description;
    private String voiceNoteUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private List<String> imageUrls;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private ApprovalStatus approvalStatus;
    private boolean availableStatus;
    private String adminRemarks;
    private Instant decidedAt;
    private String decidedBy;
    private Instant createdAt;

    public static WorkerListingResponse from(WorkerListing w) {
        return WorkerListingResponse.builder()
                .id(w.getId()).userId(w.getUser().getId())
                .groupName(w.getGroupName()).ownerName(w.getOwnerName())
                .mobileNumber(w.getMobileNumber()).village(w.getVillage())
                .availableWorkers(w.getAvailableWorkers()).priceType(w.getPriceType())
                .amount(w.getAmount()).workType(w.getWorkType())
                .description(w.getDescription())
                .voiceNoteUrl(w.getVoiceNoteUrl())
                .latitude(w.getLatitude()).longitude(w.getLongitude())
                .imageUrls(w.getImageUrls())
                .averageRating(w.getAverageRating()).ratingCount(w.getRatingCount())
                .approvalStatus(w.getApprovalStatus())
                .availableStatus(w.isAvailableStatus())
                .adminRemarks(w.getAdminRemarks())
                .decidedAt(w.getDecidedAt())
                .decidedBy(w.getDecidedBy())
                .createdAt(w.getCreatedAt()).build();
    }
}
