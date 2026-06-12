package com.ooumitra.dto.response;

import com.ooumitra.entity.RequestTicket;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data @Builder
public class RequestTicketResponse {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String location;
    private LocalDate requiredDate;
    private BigDecimal budget;
    private String mobileNumber;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String status;
    private Integer responseCount;
    private Instant createdAt;

    public static RequestTicketResponse from(RequestTicket t) {
        return RequestTicketResponse.builder()
                .id(t.getId()).userId(t.getUser().getId())
                .title(t.getTitle()).description(t.getDescription())
                .location(t.getLocation()).requiredDate(t.getRequiredDate())
                .budget(t.getBudget()).mobileNumber(t.getMobileNumber())
                .latitude(t.getLatitude()).longitude(t.getLongitude())
                .status(t.getStatus()).responseCount(t.getResponseCount())
                .createdAt(t.getCreatedAt()).build();
    }
}
