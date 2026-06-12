package com.ooumitra.repository;

import com.ooumitra.entity.ChatConversation;
import com.ooumitra.enums.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {

    @Query("SELECT c FROM ChatConversation c WHERE c.buyer.id = :userId OR c.seller.id = :userId ORDER BY c.lastMessageAt DESC")
    Page<ChatConversation> findByParticipant(@Param("userId") Long userId, Pageable pageable);

    Optional<ChatConversation> findByBuyerIdAndSellerIdAndListingTypeAndListingId(
            Long buyerId, Long sellerId, ListingType listingType, Long listingId);
}
