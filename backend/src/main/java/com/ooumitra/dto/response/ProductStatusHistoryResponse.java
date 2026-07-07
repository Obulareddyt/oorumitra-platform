package com.ooumitra.dto.response;

import com.ooumitra.entity.ProductStatusHistory;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data @Builder
public class ProductStatusHistoryResponse {
    private Long id;
    private Long productId;
    private String oldStatus;
    private String newStatus;
    private String changedBy;
    private Long changedById;
    private String remarks;
    private Instant changedDate;

    public static ProductStatusHistoryResponse from(ProductStatusHistory history) {
        return ProductStatusHistoryResponse.builder()
                .id(history.getId())
                .productId(history.getProduct().getId())
                .oldStatus(history.getOldStatus())
                .newStatus(history.getNewStatus())
                .changedBy(history.getChangedBy().getFirstName() + " " + history.getChangedBy().getLastName())
                .changedById(history.getChangedBy().getId())
                .remarks(history.getRemarks())
                .changedDate(history.getChangedDate())
                .build();
    }
}
