package com.ooumitra.dto.response;

import com.ooumitra.entity.CategoryManagement;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String keyName;
    private String label;
    private String desc;
    private String icon;
    private String to;
    private String modalKey;
    private String status;
    private int displayOrder;
    private String color;
    private String iconBg;

    public static CategoryResponse from(CategoryManagement cat) {
        if (cat == null) return null;
        return CategoryResponse.builder()
                .id(cat.getId())
                .keyName(cat.getKeyName())
                .label(cat.getLabel())
                .desc(cat.getDescription())
                .icon(cat.getIcon())
                .to(cat.getToUrl())
                .modalKey(cat.getModalKey())
                .status(cat.getStatus())
                .displayOrder(cat.getDisplayOrder())
                .color(cat.getColorClass())
                .iconBg(cat.getIconBg())
                .build();
    }
}
