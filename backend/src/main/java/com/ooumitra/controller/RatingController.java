package com.ooumitra.controller;

import com.ooumitra.dto.request.RatingRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.RatingResponse;
import com.ooumitra.enums.ListingType;
import com.ooumitra.service.RatingService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@Tag(name = "Ratings & Reviews")
public class RatingController {

    private final RatingService ratingService;

    @GetMapping("/{type}/{listingId}")
    public ResponseEntity<ApiResponse<PagedResponse<RatingResponse>>> getRatings(
            @PathVariable ListingType type, @PathVariable Long listingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(ratingService.getRatings(type, listingId, page, size)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RatingResponse>> submit(@Valid @RequestBody RatingRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Rating submitted", ratingService.submit(req)));
    }
}
