package com.ooumitra.service;

import com.ooumitra.entity.Booking;
import com.ooumitra.entity.User;
import com.ooumitra.enums.BookingStatus;
import com.ooumitra.enums.ListingType;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.BookingRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public Page<Booking> getMyBookings(int page, int size) {
        User current = SecurityUtils.currentUser();
        return bookingRepository.findByUserId(current.getId(), PageRequest.of(page, size));
    }

    @Transactional
    public Booking create(Long listingId, ListingType listingType,
                          LocalDate requiredDate, BigDecimal amount, String notes) {
        User buyer = SecurityUtils.currentUser();
        Booking booking = Booking.builder()
                .user(buyer)
                .listingId(listingId)
                .listingType(listingType)
                .requiredDate(requiredDate)
                .amount(amount)
                .notes(notes)
                .status(BookingStatus.PENDING)
                .build();
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Booking"));
        User current = SecurityUtils.currentUser();
        if (!booking.getUser().getId().equals(current.getId())) {
            throw OoruMitraException.forbidden("Not authorized to update this booking");
        }
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
