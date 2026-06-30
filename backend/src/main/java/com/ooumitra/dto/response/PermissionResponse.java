package com.ooumitra.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PermissionResponse {
    private Long id;
    private String name;
    private String category;
    private String description;
}
