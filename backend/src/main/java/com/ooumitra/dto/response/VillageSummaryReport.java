package com.ooumitra.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VillageSummaryReport {
    private Long villageId;
    private String villageName;
    private String district;
    private long totalUsers;
    private long farmers;
    private long vendors;
    private long serviceProviders;
    private long villageAdmins;
    private long members;
    private long moderators;
}
