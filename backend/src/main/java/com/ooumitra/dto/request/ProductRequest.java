package com.ooumitra.dto.request;

import com.ooumitra.enums.ProductCategory;
import com.ooumitra.enums.ProductAvailabilityStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank @Size(max = 150) private String productName;
    @NotNull private ProductCategory category;
    @Size(max = 60) private String subCategory;
    @NotBlank @Size(max = 100) private String ownerName;
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$") private String mobileNumber;
    @NotNull @DecimalMin("0.01") private BigDecimal amount;
    private boolean negotiable;
    @Size(max = 150) private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;
    @Size(max = 60) private String availability;
    @Min(0) private Integer quantity;
    private String description;
    private ProductAvailabilityStatus availabilityStatus;
}
