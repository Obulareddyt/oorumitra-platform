package com.ooumitra.repository;

import com.ooumitra.entity.TransportListing;
import com.ooumitra.enums.TransportVehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportListingRepository extends JpaRepository<TransportListing, Long>,
        JpaSpecificationExecutor<TransportListing> {

    Page<TransportListing> findByIsActiveTrue(Pageable pageable);

    Page<TransportListing> findByUserIdAndIsActiveTrue(Long userId, Pageable pageable);

    Page<TransportListing> findByVehicleTypeAndIsActiveTrue(TransportVehicleType vehicleType, Pageable pageable);

    @Query(value = """
            SELECT * FROM transport_listings t
            WHERE t.is_active = true AND t.latitude IS NOT NULL
              AND (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude))
                * cos(radians(t.longitude) - radians(:lng)) + sin(radians(:lat))
                * sin(radians(t.latitude)))) <= :radiusKm
            ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude))
                * cos(radians(t.longitude) - radians(:lng)) + sin(radians(:lat))
                * sin(radians(t.latitude))))
            """, nativeQuery = true)
    List<TransportListing> findNearby(@Param("lat") double lat, @Param("lng") double lng,
                                      @Param("radiusKm") double radiusKm, Pageable pageable);
}
