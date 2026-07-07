package com.ooumitra.repository;

import com.ooumitra.entity.CategoryManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryManagementRepository extends JpaRepository<CategoryManagement, Long> {

    List<CategoryManagement> findByStatusOrderByDisplayOrderAsc(String status);

    List<CategoryManagement> findAllByOrderByDisplayOrderAsc();

    Optional<CategoryManagement> findByKeyName(String keyName);
}
