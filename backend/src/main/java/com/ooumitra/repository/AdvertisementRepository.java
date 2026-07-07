package com.ooumitra.repository;

import com.ooumitra.entity.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    List<Advertisement> findByStatusOrderByPriorityDesc(String status);

    List<Advertisement> findByStatusAndAdTypeOrderByPriorityDesc(String status, String adType);

    List<Advertisement> findAllByOrderByPriorityDesc();

    @Query("SELECT a FROM Advertisement a WHERE a.status = 'ACTIVE' " +
           "AND (a.startDate IS NULL OR a.startDate <= :today) " +
           "AND (a.endDate IS NULL OR a.endDate >= :today) " +
           "ORDER BY a.priority DESC")
    List<Advertisement> findActiveAdvertisements(LocalDate today);

    @Query("SELECT a FROM Advertisement a WHERE a.status = 'ACTIVE' AND a.adType = :adType " +
           "AND (a.startDate IS NULL OR a.startDate <= :today) " +
           "AND (a.endDate IS NULL OR a.endDate >= :today) " +
           "ORDER BY a.priority DESC")
    List<Advertisement> findActiveAdvertisementsByType(String adType, LocalDate today);
}
