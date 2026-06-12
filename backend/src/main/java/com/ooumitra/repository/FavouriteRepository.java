package com.ooumitra.repository;

import com.ooumitra.entity.Favourite;
import com.ooumitra.enums.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Long> {

    Page<Favourite> findByUserId(Long userId, Pageable pageable);

    Optional<Favourite> findByUserIdAndListingTypeAndListingId(Long userId, ListingType type, Long listingId);

    boolean existsByUserIdAndListingTypeAndListingId(Long userId, ListingType type, Long listingId);

    void deleteByUserIdAndListingTypeAndListingId(Long userId, ListingType type, Long listingId);
}
