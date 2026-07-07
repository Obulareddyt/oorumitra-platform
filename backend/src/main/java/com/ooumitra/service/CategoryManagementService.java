package com.ooumitra.service;

import com.ooumitra.dto.request.CategoryRequest;
import com.ooumitra.dto.response.CategoryResponse;
import com.ooumitra.entity.CategoryManagement;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.CategoryManagementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryManagementService {

    private final CategoryManagementRepository categoryRepo;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getEnabledCategories() {
        return categoryRepo.findByStatusOrderByDisplayOrderAsc("ENABLED")
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepo.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getByKeyName(String keyName) {
        CategoryManagement cat = categoryRepo.findByKeyName(keyName)
                .orElseThrow(() -> OoruMitraException.notFound("Category not found"));
        return CategoryResponse.from(cat);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest req) {
        if (categoryRepo.findByKeyName(req.getKeyName()).isPresent()) {
            throw OoruMitraException.conflict("Category with key_name already exists");
        }
        CategoryManagement cat = CategoryManagement.builder()
                .keyName(req.getKeyName())
                .label(req.getLabel())
                .description(req.getDescription())
                .icon(req.getIcon())
                .toUrl(req.getToUrl())
                .modalKey(req.getModalKey())
                .status(req.getStatus() != null ? req.getStatus() : "ENABLED")
                .displayOrder(req.getDisplayOrder())
                .colorClass(req.getColorClass())
                .iconBg(req.getIconBg())
                .build();
        cat = categoryRepo.save(cat);
        return CategoryResponse.from(cat);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest req) {
        CategoryManagement cat = categoryRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Category not found"));

        cat.setLabel(req.getLabel());
        cat.setDescription(req.getDescription());
        cat.setIcon(req.getIcon());
        cat.setToUrl(req.getToUrl());
        cat.setModalKey(req.getModalKey());
        if (req.getStatus() != null) {
            cat.setStatus(req.getStatus());
        }
        cat.setDisplayOrder(req.getDisplayOrder());
        cat.setColorClass(req.getColorClass());
        cat.setIconBg(req.getIconBg());

        cat = categoryRepo.save(cat);
        return CategoryResponse.from(cat);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepo.existsById(id)) {
            throw OoruMitraException.notFound("Category not found");
        }
        categoryRepo.deleteById(id);
    }
}
