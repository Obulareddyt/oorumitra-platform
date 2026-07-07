package com.ooumitra.dto.response;

import com.ooumitra.entity.Advertisement;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class AdvertisementResponse {
    private Long id;
    private String title;
    private String description;
    private String mediaUrl;
    private String mediaType;
    private String redirectUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private int priority;
    private String status;
    private String adType;

    // Schedule details
    private LocalTime startTime;
    private LocalTime endTime;
    private String dayOfWeek;

    public static AdvertisementResponse from(Advertisement ad, LocalTime startTime, LocalTime endTime, String dayOfWeek) {
        if (ad == null) return null;
        return AdvertisementResponse.builder()
                .id(ad.getId())
                .title(ad.getTitle())
                .description(ad.getDescription())
                .mediaUrl(ad.getMediaUrl())
                .mediaType(ad.getMediaType())
                .redirectUrl(ad.getRedirectUrl())
                .startDate(ad.getStartDate())
                .endDate(ad.getEndDate())
                .priority(ad.getPriority())
                .status(ad.getStatus())
                .adType(ad.getAdType())
                .startTime(startTime)
                .endTime(endTime)
                .dayOfWeek(dayOfWeek)
                .build();
    }
}
