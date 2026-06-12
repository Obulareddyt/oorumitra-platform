package com.ooumitra.repository;

import com.ooumitra.entity.RequestTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestTicketRepository extends JpaRepository<RequestTicket, Long>,
        JpaSpecificationExecutor<RequestTicket> {

    Page<RequestTicket> findByStatus(String status, Pageable pageable);

    Page<RequestTicket> findByUserId(Long userId, Pageable pageable);

    Page<RequestTicket> findByUserIdAndStatus(Long userId, String status, Pageable pageable);
}
