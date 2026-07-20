package com.ooumitra.controller;

import com.ooumitra.dto.request.BookingRequest;
import com.ooumitra.dto.response.BookingResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.enums.BookingStatus;
import com.ooumitra.service.BookingService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings")
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/my")
    @Operation(summary = "Get the current user's own bookings/interest records")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getMyBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getMyBookings(page, size, status)));
    }

    @GetMapping("/owner")
    @Operation(summary = "Get bookings/interest records for the current user's own listings")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getOwnerBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getOwnerBookings(page, size, status)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single booking (customer, owner, or admin only)")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Express interest in a product or book a service")
    public ResponseEntity<ApiResponse<BookingResponse>> create(@Valid @RequestBody BookingRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.create(req)));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update a booking's status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.updateStatus(id, status)));
    }
}
