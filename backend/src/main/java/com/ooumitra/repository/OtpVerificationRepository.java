package com.ooumitra.repository;

import com.ooumitra.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByMobileNumberAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String mobileNumber, Instant now);

    @Modifying
    @Transactional
    @Query("UPDATE OtpVerification o SET o.isUsed = true WHERE o.mobileNumber = :mobile AND o.isUsed = false")
    void invalidateAllForMobile(String mobile);

    @Modifying
    @Transactional
    @Query("DELETE FROM OtpVerification o WHERE o.expiresAt < :cutoff")
    void deleteExpired(Instant cutoff);

    @Query("SELECT COUNT(o) FROM OtpVerification o WHERE o.mobileNumber = :mobileNumber AND o.createdAt >= :cutoff")
    long countOtpsSentInLastFiveMinutes(String mobileNumber, Instant cutoff);
}
