package com.ooumitra.dto.response;

import lombok.*;

import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String mobileNumber;
    private Long villageId;
    private String villageName;
    private String role;
    private boolean isActive;
    private Instant createdAt;
}
