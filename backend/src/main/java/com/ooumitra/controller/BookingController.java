package com.ooumitra.controller;

import com.ooumitra.entity.Booking;
import com.ooumitra.enums.BookingStatus;
import com.ooumitra.enums.ListingType;
import com.ooumitra.service.BookingService;
import com.ooumitra.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<Booking>>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getMyBookings(page, size)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> create(
            @RequestParam Long listingId,
            @RequestParam ListingType listingType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate requiredDate,
            @RequestParam(required = false) BigDecimal amount,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(ApiResponse.ok(
                bookingService.create(listingId, listingType, requiredDate, amount, notes)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.updateStatus(id, status)));
    }
}
