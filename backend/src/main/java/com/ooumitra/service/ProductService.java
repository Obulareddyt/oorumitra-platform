package com.ooumitra.service;

import com.ooumitra.dto.request.ProductRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.ProductResponse;
import com.ooumitra.dto.response.ProductStatusHistoryResponse;
import com.ooumitra.entity.Product;
import com.ooumitra.entity.ProductStatusHistory;
import com.ooumitra.entity.User;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.ProductCategory;
import com.ooumitra.enums.ProductAvailabilityStatus;
import com.ooumitra.enums.NotificationType;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.ProductRepository;
import com.ooumitra.repository.ProductStatusHistoryRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;
    private final S3Service s3Service;
    private final com.ooumitra.repository.CategoryManagementRepository categoryManagementRepo;
    private final ProductStatusHistoryRepository productStatusHistoryRepo;
    private final FCMService fcmService;

    @Value("${app.pagination.default-page-size}")
    private int defaultPageSize;

    @Value("${app.search.default-radius-km}")
    private double defaultRadiusKm;

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getAll(ProductCategory category, Boolean negotiable,
                                                  String sortBy, int page, int size) {
        if (size <= 0) size = defaultPageSize;
        Sort sort = resolveSort(sortBy);
        PageRequest pageReq = PageRequest.of(page, size, sort);

        Page<Product> result = (category != null)
                ? productRepo.findByCategoryAndIsActiveTrueAndApprovalStatusAndAvailabilityStatus(category, ApprovalStatus.APPROVED, ProductAvailabilityStatus.ACTIVE, pageReq)
                : productRepo.findByIsActiveTrueAndApprovalStatusAndAvailabilityStatus(ApprovalStatus.APPROVED, ProductAvailabilityStatus.ACTIVE, pageReq);

        var content = result.getContent().stream()
                .filter(Product::isAvailableStatus)
                .filter(p -> negotiable == null || p.isNegotiable() == negotiable)
                .map(ProductResponse::from)
                .toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getNearby(double lat, double lng, double radiusKm, int limit) {
        if (radiusKm <= 0) radiusKm = defaultRadiusKm;
        return productRepo.findNearby(lat, lng, radiusKm, PageRequest.of(0, limit))
                .stream()
                .filter(Product::isAvailableStatus)
                .map(ProductResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        Product p = productRepo.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> OoruMitraException.notFound("Product"));
        
        if (p.getAvailabilityStatus() == ProductAvailabilityStatus.INACTIVE) {
            Long currentUserId = SecurityUtils.currentUserIdOrNull();
            boolean isOwner = currentUserId != null && p.getUser().getId().equals(currentUserId);
            boolean isAdmin = currentUserId != null && SecurityUtils.currentUser().getRole().name().contains("ADMIN");
            if (!isOwner && !isAdmin) {
                throw OoruMitraException.notFound("Product");
            }
        }
        return ProductResponse.from(p);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getMyProducts(int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        if (size <= 0) size = defaultPageSize;
        Page<Product> result = productRepo.findByUserIdAndIsActiveTrue(userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        var content = result.getContent().stream().map(ProductResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public ProductResponse create(ProductRequest req, List<MultipartFile> images, MultipartFile voiceNote) throws IOException {
        validateCategoryEnabled(req.getCategory());
        User user = SecurityUtils.currentUser();
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            imageUrls = s3Service.uploadFiles(images, "products");
        }
        String voiceNoteUrl = null;
        if (voiceNote != null && !voiceNote.isEmpty()) {
            voiceNoteUrl = s3Service.uploadFile(voiceNote, "products/audio");
        }
        ProductAvailabilityStatus availabilityStatus = req.getAvailabilityStatus() != null ? req.getAvailabilityStatus() : ProductAvailabilityStatus.ACTIVE;
        String userFullName = user.getFirstName() + " " + user.getLastName();
        String updaterRole = (user.getRole() == com.ooumitra.enums.Role.SUPER_ADMIN || user.getRole() == com.ooumitra.enums.Role.ADMIN) ? "Super Admin" : "User";

        Product product = Product.builder()
                .user(user)
                .productName(req.getProductName())
                .category(req.getCategory())
                .subCategory(req.getSubCategory())
                .ownerName(req.getOwnerName())
                .mobileNumber(req.getMobileNumber())
                .amount(req.getAmount())
                .negotiable(req.isNegotiable())
                .location(req.getLocation())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .availability(req.getAvailability())
                .quantity(req.getQuantity())
                .description(req.getDescription())
                .voiceNoteUrl(voiceNoteUrl)
                .imageUrls(imageUrls)
                .availabilityStatus(availabilityStatus)
                .statusUpdatedBy(userFullName)
                .statusUpdatedDate(java.time.Instant.now())
                .statusUpdatedRole(updaterRole)
                .build();
        return ProductResponse.from(productRepo.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req, List<MultipartFile> images, MultipartFile voiceNote) throws IOException {
        validateCategoryEnabled(req.getCategory());
        Product product = getOwnedProduct(id);
        if (images != null && !images.isEmpty()) {
            product.getImageUrls().forEach(s3Service::deleteFile);
            product.setImageUrls(s3Service.uploadFiles(images, "products"));
        }
        if (voiceNote != null && !voiceNote.isEmpty()) {
            if (product.getVoiceNoteUrl() != null) {
                s3Service.deleteFile(product.getVoiceNoteUrl());
            }
            product.setVoiceNoteUrl(s3Service.uploadFile(voiceNote, "products/audio"));
        }
        if (req.getAvailabilityStatus() != null) {
            ProductAvailabilityStatus oldStatus = product.getAvailabilityStatus();
            ProductAvailabilityStatus newStatus = req.getAvailabilityStatus();
            if (oldStatus != newStatus) {
                product.setAvailabilityStatus(newStatus);
                product.setStatusUpdatedBy(product.getUser().getFirstName() + " " + product.getUser().getLastName());
                product.setStatusUpdatedDate(java.time.Instant.now());
                product.setStatusUpdatedRole("User");
                productStatusHistoryRepo.save(ProductStatusHistory.builder()
                        .product(product)
                        .oldStatus(oldStatus.name())
                        .newStatus(newStatus.name())
                        .changedBy(product.getUser())
                        .role("User")
                        .remarks("Updated availability status by owner via edit to " + (newStatus == ProductAvailabilityStatus.ACTIVE ? "Active" : "Inactive"))
                        .build());
            }
        }
        product.setProductName(req.getProductName());
        product.setCategory(req.getCategory());
        product.setSubCategory(req.getSubCategory());
        product.setOwnerName(req.getOwnerName());
        product.setMobileNumber(req.getMobileNumber());
        product.setAmount(req.getAmount());
        product.setNegotiable(req.isNegotiable());
        product.setLocation(req.getLocation());
        product.setLatitude(req.getLatitude());
        product.setLongitude(req.getLongitude());
        product.setAvailability(req.getAvailability());
        product.setQuantity(req.getQuantity());
        product.setDescription(req.getDescription());
        return ProductResponse.from(productRepo.save(product));
    }

    @Transactional
    public ProductResponse markAsSold(Long id) {
        Product product = getOwnedProduct(id);
        product.setApprovalStatus(ApprovalStatus.SOLD);
        product.setAvailableStatus(false);
        return ProductResponse.from(productRepo.save(product));
    }

    @Transactional
    public ProductResponse updateAvailability(Long id, boolean available) {
        Product product = getOwnedProduct(id);
        product.setAvailableStatus(available);
        return ProductResponse.from(productRepo.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = getOwnedProduct(id);
        product.setActive(false);
        productRepo.save(product);
    }

    private Product getOwnedProduct(Long id) {
        Long userId = SecurityUtils.currentUserId();
        Product product = productRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Product"));
        if (!product.getUser().getId().equals(userId)) {
            throw OoruMitraException.forbidden("Not your product");
        }
        return product;
    }

    private Sort resolveSort(String sortBy) {
        return switch (sortBy == null ? "" : sortBy) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "amount");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "amount");
            case "rating" -> Sort.by(Sort.Direction.DESC, "averageRating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private void validateCategoryEnabled(ProductCategory category) {
        if (category == null) return;
        String key = (category == ProductCategory.AGRICULTURE || category == ProductCategory.SEEDS)
                ? "AGRICULTURE" : "MARKETPLACE";
        categoryManagementRepo.findByKeyName(key).ifPresent(c -> {
            if ("DISABLED".equalsIgnoreCase(c.getStatus())) {
                throw OoruMitraException.badRequest("New listings are disabled under the " + c.getLabel() + " category.");
            }
        });
    }

    @Transactional
    public ProductResponse updateAvailabilityStatus(Long id, ProductAvailabilityStatus status) {
        Product product = getOwnedProduct(id);
        ProductAvailabilityStatus oldStatus = product.getAvailabilityStatus();
        if (oldStatus != status) {
            product.setAvailabilityStatus(status);
            product.setStatusUpdatedBy(product.getUser().getFirstName() + " " + product.getUser().getLastName());
            product.setStatusUpdatedDate(java.time.Instant.now());
            product.setStatusUpdatedRole("User");
            product = productRepo.save(product);
            
            productStatusHistoryRepo.save(ProductStatusHistory.builder()
                    .product(product)
                    .oldStatus(oldStatus.name())
                    .newStatus(status.name())
                    .changedBy(product.getUser())
                    .role("User")
                    .remarks("Updated availability status by owner to " + (status == ProductAvailabilityStatus.ACTIVE ? "Active" : "Inactive"))
                    .build());
        }
        return ProductResponse.from(product);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getActiveProducts(int page, int size) {
        PageRequest pageReq = PageRequest.of(page, size <= 0 ? 20 : size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> result = productRepo.findByIsActiveTrueAndApprovalStatusAndAvailabilityStatus(
                ApprovalStatus.APPROVED, ProductAvailabilityStatus.ACTIVE, pageReq);
        var content = result.getContent().stream()
                .filter(Product::isAvailableStatus)
                .map(ProductResponse::from)
                .toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getInactiveProducts(int page, int size) {
        User currentUser = SecurityUtils.currentUser();
        PageRequest pageReq = PageRequest.of(page, size <= 0 ? 20 : size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> result;
        if (currentUser.getRole().name().contains("ADMIN")) {
            result = productRepo.findByIsActiveTrueAndAvailabilityStatus(ProductAvailabilityStatus.INACTIVE, pageReq);
        } else {
            result = productRepo.findByUserIdAndIsActiveTrueAndAvailabilityStatus(currentUser.getId(), ProductAvailabilityStatus.INACTIVE, pageReq);
        }
        var content = result.getContent().stream().map(ProductResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public ProductResponse adminUpdateProductStatus(Long id, ProductAvailabilityStatus status, String remarks) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Product"));
        ProductAvailabilityStatus oldStatus = product.getAvailabilityStatus();
        User currentUser = SecurityUtils.currentUser();
        String adminFullName = currentUser.getFirstName() + " " + currentUser.getLastName();
        String roleStr = (currentUser.getRole() == com.ooumitra.enums.Role.SUPER_ADMIN || currentUser.getRole() == com.ooumitra.enums.Role.ADMIN) ? "Super Admin" : "User";
        
        product.setAvailabilityStatus(status);
        product.setStatusUpdatedBy(adminFullName);
        product.setStatusUpdatedDate(java.time.Instant.now());
        product.setStatusUpdatedRole(roleStr);
        product = productRepo.save(product);

        productStatusHistoryRepo.save(ProductStatusHistory.builder()
                .product(product)
                .oldStatus(oldStatus.name())
                .newStatus(status.name())
                .changedBy(currentUser)
                .role(roleStr)
                .remarks(remarks != null && !remarks.isBlank() ? remarks : "Updated availability status by administrator to " + (status == ProductAvailabilityStatus.ACTIVE ? "Active" : "Inactive"))
                .build());

        String messageBody = "Your product status has been changed to " + 
                (status == ProductAvailabilityStatus.ACTIVE ? "Active" : "Inactive") + 
                " by the Administrator." +
                (remarks != null && !remarks.isBlank() ? "\nRemarks: " + remarks : "");

        fcmService.sendToUser(product.getUser(), "Product Status Updated", messageBody, 
                NotificationType.PRODUCT_AVAILABILITY, Map.of("productId", String.valueOf(product.getId())));

        return ProductResponse.from(product);
    }

    @Transactional(readOnly = true)
    public List<ProductStatusHistoryResponse> getStatusHistory(Long id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Product"));
        
        Long currentUserId = SecurityUtils.currentUserIdOrNull();
        if (currentUserId == null) {
            throw new OoruMitraException("Unauthorized", org.springframework.http.HttpStatus.UNAUTHORIZED);
        }
        boolean isOwner = product.getUser().getId().equals(currentUserId);
        boolean isAdmin = SecurityUtils.currentUser().getRole().name().contains("ADMIN");
        if (!isOwner && !isAdmin) {
            throw OoruMitraException.forbidden("Cannot view status history of another user's product");
        }

        return productStatusHistoryRepo.findByProductIdOrderByChangedDateDesc(id).stream()
                .map(ProductStatusHistoryResponse::from)
                .toList();
    }
}
