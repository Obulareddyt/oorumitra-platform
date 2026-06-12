package com.ooumitra.dto.request;

import com.ooumitra.enums.TransportVehicleType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransportRequest {
    @NotNull private TransportVehicleType vehicleType;
    @NotBlank @Size(max = 100) private String ownerName;
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$") private String mobileNumber;
    private BigDecimal ratePerKm;
    private BigDecimal ratePerHour;
    @Size(max = 40) private String weightCapacity;
    private boolean negotiable;
    @Size(max = 80) private String availability;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
