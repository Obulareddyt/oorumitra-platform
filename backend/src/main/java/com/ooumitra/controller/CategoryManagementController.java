package com.ooumitra.controller;

import com.ooumitra.dto.request.CategoryRequest;
import com.ooumitra.dto.response.CategoryResponse;
import com.ooumitra.service.CategoryManagementService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Category Management")
public class CategoryManagementController {

    private final CategoryManagementService categoryService;

    @GetMapping("/categories")
    @Operation(summary = "Get enabled categories in display order")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getEnabledCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getEnabledCategories()));
    }

    @GetMapping("/admin/categories")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all categories (Super Admin only)")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getAllCategories()));
    }

    @PostMapping("/admin/categories")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create category (Super Admin only)")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.createCategory(req)));
    }

    @PutMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update category (Super Admin only)")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.updateCategory(id, req)));
    }

    @DeleteMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete category (Super Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok("Category deleted successfully"));
    }
}
