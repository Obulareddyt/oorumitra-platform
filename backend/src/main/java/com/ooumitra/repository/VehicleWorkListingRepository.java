package com.ooumitra.repository;

import com.ooumitra.entity.VehicleWorkListing;
import com.ooumitra.enums.ApprovalStatus;
import com.ooumitra.enums.VehicleWorkType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleWorkListingRepository extends JpaRepository<VehicleWorkListing, Long>,
        JpaSpecificationExecutor<VehicleWorkListing> {

    Page<VehicleWorkListing> findByIsActiveTrue(Pageable pageable);

    Page<VehicleWorkListing> findByUserIdAndIsActiveTrue(Long userId, Pageable pageable);

    Page<VehicleWorkListing> findByVehicleTypeAndIsActiveTrue(VehicleWorkType vehicleType, Pageable pageable);

    List<VehicleWorkListing> findByApprovalStatus(ApprovalStatus approvalStatus);

    Page<VehicleWorkListing> findByIsActiveTrueAndApprovalStatus(ApprovalStatus approvalStatus, Pageable pageable);

    Page<VehicleWorkListing> findByVehicleTypeAndIsActiveTrueAndApprovalStatus(
            VehicleWorkType vehicleType, ApprovalStatus approvalStatus, Pageable pageable);

    @Query(value = """
            SELECT * FROM vehicle_work_listings v
            WHERE v.is_active = true AND v.approval_status = 'APPROVED' AND v.latitude IS NOT NULL
              AND (6371 * acos(cos(radians(:lat)) * cos(radians(v.latitude))
                * cos(radians(v.longitude) - radians(:lng)) + sin(radians(:lat))
                * sin(radians(v.latitude)))) <= :radiusKm
            ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(v.latitude))
                * cos(radians(v.longitude) - radians(:lng)) + sin(radians(:lat))
                * sin(radians(v.latitude))))
            """, nativeQuery = true)
    List<VehicleWorkListing> findNearby(@Param("lat") double lat, @Param("lng") double lng,
                                        @Param("radiusKm") double radiusKm, Pageable pageable);
}
