package com.ooumitra.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssignRoleRequest {
    private Long villageId;

    @NotBlank(message = "Role is required")
    private String role;
}
