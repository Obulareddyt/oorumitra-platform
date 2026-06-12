package com.ooumitra.service;

import com.ooumitra.dto.request.ProductRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.ProductResponse;
import com.ooumitra.entity.Product;
import com.ooumitra.entity.User;
import com.ooumitra.enums.ProductCategory;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.ProductRepository;
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

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;
    private final S3Service s3Service;

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
                ? productRepo.findByCategoryAndIsActiveTrue(category, pageReq)
                : productRepo.findByIsActiveTrue(pageReq);

        var content = result.getContent().stream()
                .filter(p -> negotiable == null || p.isNegotiable() == negotiable)
                .map(ProductResponse::from)
                .toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getNearby(double lat, double lng, double radiusKm, int limit) {
        if (radiusKm <= 0) radiusKm = defaultRadiusKm;
        return productRepo.findNearby(lat, lng, radiusKm, PageRequest.of(0, limit))
                .stream().map(ProductResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return ProductResponse.from(productRepo.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> OoruMitraException.notFound("Product")));
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
    public ProductResponse create(ProductRequest req, List<MultipartFile> images) throws IOException {
        User user = SecurityUtils.currentUser();
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            imageUrls = s3Service.uploadFiles(images, "products");
        }
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
                .description(req.getDescription())
                .imageUrls(imageUrls)
                .build();
        return ProductResponse.from(productRepo.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req, List<MultipartFile> images) throws IOException {
        Product product = getOwnedProduct(id);
        if (images != null && !images.isEmpty()) {
            product.getImageUrls().forEach(s3Service::deleteFile);
            product.setImageUrls(s3Service.uploadFiles(images, "products"));
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
        product.setDescription(req.getDescription());
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
}
