package com.ooumitra.repository;

import com.ooumitra.entity.AdvertisementSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvertisementScheduleRepository extends JpaRepository<AdvertisementSchedule, Long> {
    List<AdvertisementSchedule> findByAdvertisementId(Long advertisementId);
    void deleteByAdvertisementId(Long advertisementId);
}
