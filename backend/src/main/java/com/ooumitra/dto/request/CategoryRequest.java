package com.ooumitra.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank
    private String keyName;
    @NotBlank
    private String label;
    private String description;
    private String icon;
    private String toUrl;
    private String modalKey;
    private String status;
    private int displayOrder;
    private String colorClass;
    private String iconBg;
}
