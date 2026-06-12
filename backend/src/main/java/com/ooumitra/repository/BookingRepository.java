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

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.userId = :userId AND b.status = 'COMPLETED'")
    long countCompletedByUser(@Param("userId") Long userId);
}
