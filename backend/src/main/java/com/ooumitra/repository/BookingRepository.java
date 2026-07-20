package com.ooumitra.repository;

import com.ooumitra.entity.Booking;
import com.ooumitra.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    Page<Booking> findByUserIdAndStatus(Long userId, BookingStatus status, Pageable pageable);

    Page<Booking> findByOwnerId(Long ownerId, Pageable pageable);

    Page<Booking> findByOwnerIdAndStatus(Long ownerId, BookingStatus status, Pageable pageable);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.user.id = :userId AND b.status = com.ooumitra.enums.BookingStatus.COMPLETED")
    long countCompletedByUser(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b WHERE " +
            "(:status IS NULL OR b.status = :status) AND " +
            "(:search IS NULL OR " +
            " LOWER(b.user.firstName) LIKE %:search% OR LOWER(b.user.lastName) LIKE %:search% OR " +
            " LOWER(b.owner.firstName) LIKE %:search% OR LOWER(b.owner.lastName) LIKE %:search% OR " +
            " b.user.mobileNumber LIKE %:search% OR b.owner.mobileNumber LIKE %:search%)")
    Page<Booking> searchForAdmin(@Param("status") BookingStatus status, @Param("search") String search, Pageable pageable);
}
