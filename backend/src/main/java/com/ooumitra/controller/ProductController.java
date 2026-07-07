package com.ooumitra.controller;

import com.ooumitra.dto.request.ProductRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.ProductResponse;
import com.ooumitra.dto.response.ProductStatusHistoryResponse;
import com.ooumitra.enums.ProductCategory;
import com.ooumitra.enums.ProductAvailabilityStatus;
import com.ooumitra.service.ProductService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Sales")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "List products with optional filters")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getAll(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) Boolean negotiable,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAll(category, negotiable, sortBy, page, size)));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getNearby(
            @RequestParam double lat, @RequestParam double lng,
            @RequestParam(defaultValue = "0") double radiusKm,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getNearby(lat, lng, radiusKm, limit)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getMyProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getMyProducts(page, size)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> create(
            @Valid @RequestPart("data") ProductRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "voiceNote", required = false) MultipartFile voiceNote) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Product created", productService.create(req, images, voiceNote)));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable Long id,
            @Valid @RequestPart("data") ProductRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "voiceNote", required = false) MultipartFile voiceNote) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Product updated", productService.update(id, req, images, voiceNote)));
    }

    @PutMapping("/{id}/sold")
    @Operation(summary = "Mark a product listing as sold")
    public ResponseEntity<ApiResponse<ProductResponse>> markAsSold(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Product marked as sold", productService.markAsSold(id)));
    }

    @PutMapping("/{id}/availability")
    @Operation(summary = "Update product listing availability status")
    public ResponseEntity<ApiResponse<ProductResponse>> updateAvailability(
            @PathVariable Long id, @RequestParam boolean available) {
        return ResponseEntity.ok(ApiResponse.ok("Product availability updated", productService.updateAvailability(id, available)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted"));
    }

    @PutMapping("/{id}/availability-status")
    @Operation(summary = "Update product availability status by seller")
    public ResponseEntity<ApiResponse<ProductResponse>> updateAvailabilityStatus(
            @PathVariable Long id, @RequestParam ProductAvailabilityStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Product availability status updated", 
                productService.updateAvailabilityStatus(id, status)));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active products")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getActiveProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getActiveProducts(page, size)));
    }

    @GetMapping("/inactive")
    @Operation(summary = "Get inactive products")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getInactiveProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getInactiveProducts(page, size)));
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update product availability status by Admin")
    public ResponseEntity<ApiResponse<ProductResponse>> adminUpdateProductStatus(
            @PathVariable Long id, 
            @RequestParam ProductAvailabilityStatus status, 
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(ApiResponse.ok("Product status updated by admin", 
                productService.adminUpdateProductStatus(id, status, remarks)));
    }

    @GetMapping("/{id}/status-history")
    @Operation(summary = "Get product status audit history")
    public ResponseEntity<ApiResponse<List<ProductStatusHistoryResponse>>> getStatusHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getStatusHistory(id)));
    }
}
