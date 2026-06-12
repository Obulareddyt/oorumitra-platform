package com.ooumitra.repository;

import com.ooumitra.entity.WorkerListing;
import com.ooumitra.enums.WorkType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerListingRepository extends JpaRepository<WorkerListing, Long>,
        JpaSpecificationExecutor<WorkerListing> {

    Page<WorkerListing> findByIsActiveTrue(Pageable pageable);

    Page<WorkerListing> findByUserIdAndIsActiveTrue(Long userId, Pageable pageable);

    Page<WorkerListing> findByWorkTypeAndIsActiveTrue(WorkType workType, Pageable pageable);

    @Query(value = """
            SELECT w.*, (6371 * acos(cos(radians(:lat)) * cos(radians(w.latitude))
                * cos(radians(w.longitude) - radians(:lng)) + sin(radians(:lat))
                * sin(radians(w.latitude)))) AS distance
            FROM worker_listings w
            WHERE w.is_active = true
              AND w.latitude IS NOT NULL
            HAVING distance <= :radiusKm
            ORDER BY distance
            """, nativeQuery = true)
    List<WorkerListing> findNearby(@Param("lat") double lat, @Param("lng") double lng,
                                   @Param("radiusKm") double radiusKm, Pageable pageable);
}
