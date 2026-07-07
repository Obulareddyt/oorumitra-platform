package com.ooumitra.repository;

import com.ooumitra.entity.ProductStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductStatusHistoryRepository extends JpaRepository<ProductStatusHistory, Long> {
    List<ProductStatusHistory> findByProductIdOrderByChangedDateDesc(Long productId);
}
