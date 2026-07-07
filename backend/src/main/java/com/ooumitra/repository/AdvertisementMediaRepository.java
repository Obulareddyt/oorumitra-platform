package com.ooumitra.repository;

import com.ooumitra.entity.AdvertisementMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvertisementMediaRepository extends JpaRepository<AdvertisementMedia, Long> {
    List<AdvertisementMedia> findByAdvertisementId(Long advertisementId);
    void deleteByAdvertisementId(Long advertisementId);
}
