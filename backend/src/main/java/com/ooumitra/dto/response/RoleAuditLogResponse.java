package com.ooumitra.dto.response;

import lombok.*;

import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RoleAuditLogResponse {
    private Long id;
    private String action;
    private String roleName;
    private String performedBy;
    private Instant performedAt;
    private String details;
}
