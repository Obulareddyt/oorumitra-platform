package com.ooumitra.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VillageRequest {

    @NotBlank(message = "Village name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 100)
    private String mandal;

    @NotBlank(message = "District is required")
    @Size(max = 100)
    private String district;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @Size(max = 10)
    private String pincode;

    @Pattern(regexp = "ACTIVE|INACTIVE", message = "Status must be ACTIVE or INACTIVE")
    private String status = "ACTIVE";
}
