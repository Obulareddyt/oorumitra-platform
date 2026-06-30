package com.ooumitra.dto.response;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppRoleResponse {
    private Long id;
    private String name;
    private String description;
    private String status;
    private boolean isSystem;
    private Instant createdAt;
    private Instant updatedAt;
    private Long createdBy;
    private Long updatedBy;
    private List<PermissionResponse> permissions;
}
