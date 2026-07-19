package com.ooumitra.dto.request;

import com.ooumitra.enums.PriceType;
import com.ooumitra.enums.TransportVehicleType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransportRequest {
    @NotNull private TransportVehicleType vehicleType;
    @NotBlank @Size(max = 100) private String ownerName;
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$") private String mobileNumber;
    @NotNull private PriceType priceType;
    @NotNull @DecimalMin("0.01") private BigDecimal amount;
    @Size(max = 40) private String weightCapacity;
    private boolean negotiable;
    @Size(max = 80) private String availability;
    private BigDecimal latitude;
    private BigDecimal longitude;
    @Size(max = 100) private String village;
    private String description;
    private String whatsappNumber;
}
