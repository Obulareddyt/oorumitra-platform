package com.ooumitra.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class AdminPendingResponse {
    private List<ProductResponse> products;
    private List<WorkerListingResponse> workers;
    private List<TransportResponse> transport;
    private List<VehicleWorkResponse> vehicleWork;
}
