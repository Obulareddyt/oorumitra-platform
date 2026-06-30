package com.ooumitra.repository;

import com.ooumitra.entity.RoleAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleAuditLogRepository extends JpaRepository<RoleAuditLog, Long> {
    Page<RoleAuditLog> findAllByOrderByPerformedAtDesc(Pageable pageable);
}
