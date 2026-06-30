package com.ooumitra.repository;

import com.ooumitra.entity.Village;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VillageRepository extends JpaRepository<Village, Long> {

    boolean existsByNameIgnoreCaseAndDistrictIgnoreCase(String name, String district);

    boolean existsByNameIgnoreCaseAndDistrictIgnoreCaseAndIdNot(String name, String district, Long id);

    List<Village> findByStatusOrderByNameAsc(String status);

    @Query("SELECT v FROM Village v WHERE " +
           "(:search IS NULL OR LOWER(v.name) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(v.district) LIKE LOWER(CONCAT('%',:search,'%'))) AND " +
           "(:status IS NULL OR v.status = :status)")
    Page<Village> search(@Param("search") String search,
                         @Param("status") String status,
                         Pageable pageable);

    @Query("SELECT v FROM Village v JOIN v.admins a WHERE a.id = :userId")
    List<Village> findByAdminId(@Param("userId") Long userId);
}
