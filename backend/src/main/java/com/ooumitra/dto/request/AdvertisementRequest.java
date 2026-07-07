package com.ooumitra.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AdvertisementRequest {
    @NotBlank
    private String title;
    private String description;
    private String redirectUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private int priority;
    private String status;
    private String adType;
    private String mediaType; // e.g. "IMAGE", "VIDEO"

    // Schedule properties
    private LocalTime startTime;
    private LocalTime endTime;
    private String dayOfWeek;
}
