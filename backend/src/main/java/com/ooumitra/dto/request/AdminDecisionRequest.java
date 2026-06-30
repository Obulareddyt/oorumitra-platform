package com.ooumitra.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminDecisionRequest {
    @NotBlank(message = "Remarks are required before approving or rejecting")
    private String remarks;
}
