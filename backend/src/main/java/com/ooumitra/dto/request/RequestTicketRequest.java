package com.ooumitra.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RequestTicketRequest {
    @NotBlank @Size(max = 200) private String title;
    private String description;
    @Size(max = 150) private String location;
    private LocalDate requiredDate;
    @DecimalMin("0") private BigDecimal budget;
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$") private String mobileNumber;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
