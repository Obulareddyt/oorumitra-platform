package com.ooumitra.dto.request;

import com.ooumitra.enums.PriceType;
import com.ooumitra.enums.VehicleWorkType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VehicleWorkRequest {
    @NotNull private VehicleWorkType vehicleType;
    @NotBlank @Size(max = 100) private String ownerName;
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$") private String mobileNumber;
    @NotNull private PriceType priceType;
    @NotNull @DecimalMin("0.01") private BigDecimal amount;
    @NotBlank @Size(max = 100) private String village;
    private boolean availableStatus = true;
    private LocalDate availableUntil;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String description;
    private String whatsappNumber;
}
