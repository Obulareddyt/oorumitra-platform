package com.ooumitra.controller;

import com.ooumitra.dto.request.FavouriteRequest;
import com.ooumitra.dto.response.FavouriteResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.service.FavouriteService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
@Tag(name = "Favourites")
public class FavouriteController {

    private final FavouriteService favouriteService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<FavouriteResponse>>> getFavourites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(favouriteService.getFavourites(page, size)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FavouriteResponse>> add(@Valid @RequestBody FavouriteRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Added to favourites", favouriteService.add(req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> remove(@PathVariable Long id) {
        favouriteService.remove(id);
        return ResponseEntity.ok(ApiResponse.ok("Removed from favourites"));
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> check(@Valid FavouriteRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(favouriteService.isFavourite(req)));
    }
}
