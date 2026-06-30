package com.ooumitra.dto.response;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VillageResponse {
    private Long id;
    private String name;
    private String mandal;
    private String district;
    private String state;
    private String pincode;
    private String status;
    private long totalUsers;
    private Instant createdAt;
    private Instant updatedAt;
    private List<UserSummaryResponse> admins;
}
