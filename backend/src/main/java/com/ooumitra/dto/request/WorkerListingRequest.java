package com.ooumitra.dto.request;

import com.ooumitra.enums.PriceType;
import com.ooumitra.enums.WorkType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WorkerListingRequest {
    @NotBlank @Size(max = 100) private String groupName;
    @NotBlank @Size(max = 100) private String ownerName;
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$") private String mobileNumber;
    @NotBlank @Size(max = 100) private String village;
    @NotNull @Min(1) @Max(5000) private Integer availableWorkers;
    @NotNull private PriceType priceType;
    @NotNull @DecimalMin("0.01") private BigDecimal amount;
    @NotNull private WorkType workType;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String description;
    private String voiceNoteUrl;
    private String whatsappNumber;
}
