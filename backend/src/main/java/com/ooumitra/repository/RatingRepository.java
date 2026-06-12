package com.ooumitra.repository;

import com.ooumitra.entity.Rating;
import com.ooumitra.enums.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Page<Rating> findByListingTypeAndListingId(ListingType type, Long listingId, Pageable pageable);

    Optional<Rating> findByReviewerIdAndListingTypeAndListingId(Long reviewerId, ListingType type, Long listingId);

    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.listingType = :type AND r.listingId = :id")
    Double findAverageRating(@Param("type") ListingType type, @Param("id") Long listingId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.listingType = :type AND r.listingId = :id")
    Long countByListing(@Param("type") ListingType type, @Param("id") Long listingId);
}
