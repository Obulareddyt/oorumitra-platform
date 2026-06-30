package com.ooumitra.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AdminStatsResponse {
    private long totalPosts;
    private long totalPending;
    private long totalApproved;
    private long totalRejected;

    private long totalProducts;
    private long pendingProducts;
    private long approvedProducts;
    private long rejectedProducts;

    private long totalWorkers;
    private long pendingWorkers;
    private long approvedWorkers;
    private long rejectedWorkers;

    private long totalTransport;
    private long pendingTransport;
    private long approvedTransport;
    private long rejectedTransport;

    private long totalVehicleWork;
    private long pendingVehicleWork;
    private long approvedVehicleWork;
    private long rejectedVehicleWork;
}
