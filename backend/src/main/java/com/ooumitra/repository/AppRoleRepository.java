package com.ooumitra.repository;

import com.ooumitra.entity.AppRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppRoleRepository extends JpaRepository<AppRole, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    Optional<AppRole> findByNameIgnoreCase(String name);

    @Query("SELECT r FROM AppRole r WHERE " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR r.status = :status)")
    Page<AppRole> search(@Param("search") String search,
                         @Param("status") String status,
                         Pageable pageable);
}
