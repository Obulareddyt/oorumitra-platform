package com.ooumitra.repository;

import com.ooumitra.entity.Product;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByUserIdAndIsActiveTrue(Long userId, Pageable pageable);

    Page<Product> findByCategoryAndIsActiveTrue(ProductCategory category, Pageable pageable);

    List<Product> findByApprovalStatus(ApprovalStatus approvalStatus);

    Page<Product> findByIsActiveTrueAndApprovalStatus(ApprovalStatus approvalStatus, Pageable pageable);

    Page<Product> findByCategoryAndIsActiveTrueAndApprovalStatus(
            ProductCategory category, ApprovalStatus approvalStatus, Pageable pageable);

    @Query(value = """
            SELECT * FROM products p
            WHERE p.is_active = true AND p.approval_status = 'APPROVED' AND p.latitude IS NOT NULL
              AND (6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude))
                * cos(radians(p.longitude) - radians(:lng)) + sin(radians(:lat))
                * sin(radians(p.latitude)))) <= :radiusKm
            ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude))
                * cos(radians(p.longitude) - radians(:lng)) + sin(radians(:lat))
                * sin(radians(p.latitude))))
            """, nativeQuery = true)
    List<Product> findNearby(@Param("lat") double lat, @Param("lng") double lng,
                             @Param("radiusKm") double radiusKm, Pageable pageable);
}
