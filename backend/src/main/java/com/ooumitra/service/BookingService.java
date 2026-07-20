package com.ooumitra.service;

import com.ooumitra.dto.request.BookingRequest;
import com.ooumitra.dto.response.BookingResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.entity.*;
import com.ooumitra.enums.BookingStatus;
import com.ooumitra.enums.ListingType;
import com.ooumitra.enums.NotificationType;
import com.ooumitra.enums.Role;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.*;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final WorkerListingRepository workerListingRepository;
    private final TransportListingRepository transportListingRepository;
    private final VehicleWorkListingRepository vehicleWorkListingRepository;
    private final FCMService fcmService;

    private record ListingInfo(String name, User owner, String mobile) {}

    private ListingInfo resolveListing(ListingType type, Long listingId) {
        ListingInfo info = switch (type) {
            case PRODUCT -> {
                Product p = productRepository.findById(listingId)
                        .orElseThrow(() -> OoruMitraException.notFound("Product"));
                yield new ListingInfo(p.getProductName(), p.getUser(), p.getMobileNumber());
            }
            case WORKER -> {
                WorkerListing w = workerListingRepository.findById(listingId)
                        .orElseThrow(() -> OoruMitraException.notFound("Worker listing"));
                yield new ListingInfo(w.getGroupName(), w.getUser(), w.getMobileNumber());
            }
            case TRANSPORT -> {
                TransportListing t = transportListingRepository.findById(listingId)
                        .orElseThrow(() -> OoruMitraException.notFound("Transport listing"));
                yield new ListingInfo(t.getVehicleType().name(), t.getUser(), t.getMobileNumber());
            }
            case VEHICLE_WORK -> {
                VehicleWorkListing v = vehicleWorkListingRepository.findById(listingId)
                        .orElseThrow(() -> OoruMitraException.notFound("Vehicle work listing"));
                yield new ListingInfo(v.getVehicleType().name(), v.getUser(), v.getMobileNumber());
            }
        };
        // The listing's `user` association is lazy; force it fully loaded here,
        // synchronously, on this thread — otherwise the @Async FCM notification
        // thread and this thread can race to initialize the same proxy on the
        // same Hibernate session, corrupting Hibernate's internal load state.
        Hibernate.initialize(info.owner());
        return info;
    }

    // Forward-only transition maps. CANCELLED is reachable from every
    // non-terminal state in both flows and is handled separately.
    private static final Map<BookingStatus, BookingStatus> PRODUCT_FLOW = Map.of(
            BookingStatus.INTERESTED, BookingStatus.CONTACTED,
            BookingStatus.CONTACTED, BookingStatus.PURCHASED
    );
    private static final Map<BookingStatus, BookingStatus> SERVICE_FLOW = Map.of(
            BookingStatus.PENDING, BookingStatus.ACCEPTED,
            BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS,
            BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED
    );
    private static final Set<BookingStatus> TERMINAL = EnumSet.of(
            BookingStatus.PURCHASED, BookingStatus.COMPLETED, BookingStatus.CANCELLED);

    private Map<BookingStatus, BookingStatus> flowFor(ListingType type) {
        return type == ListingType.PRODUCT ? PRODUCT_FLOW : SERVICE_FLOW;
    }

    public PagedResponse<BookingResponse> getMyBookings(int page, int size, BookingStatus status) {
        User current = SecurityUtils.currentUser();
        Page<Booking> result = status != null
                ? bookingRepository.findByUserIdAndStatus(current.getId(), status, PageRequest.of(page, size))
                : bookingRepository.findByUserId(current.getId(), PageRequest.of(page, size));
        return toPagedResponse(result);
    }

    public PagedResponse<BookingResponse> getOwnerBookings(int page, int size, BookingStatus status) {
        User current = SecurityUtils.currentUser();
        Page<Booking> result = status != null
                ? bookingRepository.findByOwnerIdAndStatus(current.getId(), status, PageRequest.of(page, size))
                : bookingRepository.findByOwnerId(current.getId(), PageRequest.of(page, size));
        return toPagedResponse(result);
    }

    public PagedResponse<BookingResponse> searchForAdmin(BookingStatus status, String search, int page, int size) {
        String normalizedSearch = (search == null || search.isBlank()) ? null : "%" + search.trim().toLowerCase() + "%";
        Page<Booking> result = bookingRepository.searchForAdmin(status, normalizedSearch, PageRequest.of(page, size));
        return toPagedResponse(result);
    }

    public BookingResponse getById(Long id) {
        Booking booking = findOwned(id);
        ListingInfo info = resolveListing(booking.getListingType(), booking.getListingId());
        return BookingResponse.from(booking, info.name(), info.mobile());
    }

    @Transactional
    public BookingResponse create(BookingRequest req) {
        User customer = SecurityUtils.currentUser();
        ListingInfo info = resolveListing(req.getListingType(), req.getListingId());

        if (info.owner() != null && info.owner().getId().equals(customer.getId())) {
            throw OoruMitraException.badRequest("You can't book or express interest in your own listing.");
        }

        BookingStatus initialStatus = req.getListingType() == ListingType.PRODUCT
                ? BookingStatus.INTERESTED
                : BookingStatus.PENDING;

        Booking booking = Booking.builder()
                .user(customer)
                .owner(info.owner())
                .listingId(req.getListingId())
                .listingType(req.getListingType())
                .requiredDate(req.getServiceDate())
                .serviceTime(req.getServiceTime())
                .notes(req.getNotes())
                .status(initialStatus)
                .build();
        booking = bookingRepository.save(booking);

        if (info.owner() != null) {
            String verb = req.getListingType() == ListingType.PRODUCT ? "is interested in" : "booked";
            fcmService.sendToUser(info.owner(),
                    "New " + (req.getListingType() == ListingType.PRODUCT ? "interest" : "booking"),
                    customer.getFirstName() + " " + customer.getLastName() + " " + verb + " your " + info.name(),
                    NotificationType.BOOKING_UPDATE,
                    Map.of("bookingId", String.valueOf(booking.getId())));
        }

        return BookingResponse.from(booking, info.name(), info.mobile());
    }

    @Transactional
    public BookingResponse updateStatus(Long id, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Booking"));
        User current = SecurityUtils.currentUser();

        boolean isCustomer = booking.getUser().getId().equals(current.getId());
        boolean isOwner = booking.getOwner() != null && booking.getOwner().getId().equals(current.getId());
        boolean isAdmin = current.getRole() == Role.ADMIN || current.getRole() == Role.SUPER_ADMIN;
        if (!isCustomer && !isOwner && !isAdmin) {
            throw OoruMitraException.forbidden("Not authorized to update this booking");
        }

        if (TERMINAL.contains(booking.getStatus())) {
            throw OoruMitraException.badRequest("This booking is already " + booking.getStatus() + " and can't be updated further.");
        }

        if (newStatus == BookingStatus.CANCELLED) {
            // Either side (or admin) may cancel a non-terminal booking.
        } else if (isOwner || isAdmin) {
            BookingStatus expectedNext = flowFor(booking.getListingType()).get(booking.getStatus());
            if (expectedNext != newStatus) {
                throw OoruMitraException.badRequest(
                        "Invalid status transition: " + booking.getStatus() + " -> " + newStatus);
            }
        } else {
            throw OoruMitraException.forbidden("Only the listing owner can advance a booking's status.");
        }

        booking.setStatus(newStatus);
        booking = bookingRepository.save(booking);

        ListingInfo info = resolveListing(booking.getListingType(), booking.getListingId());
        User notifyTarget = isCustomer ? booking.getOwner() : booking.getUser();
        if (notifyTarget != null) {
            String title = newStatus == BookingStatus.COMPLETED ? "Booking completed" : "Booking status updated";
            fcmService.sendToUser(notifyTarget, title,
                    info.name() + " is now " + newStatus,
                    NotificationType.BOOKING_UPDATE,
                    Map.of("bookingId", String.valueOf(booking.getId())));
        }

        return BookingResponse.from(booking, info.name(), info.mobile());
    }

    private Booking findOwned(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Booking"));
        User current = SecurityUtils.currentUser();
        boolean isCustomer = booking.getUser().getId().equals(current.getId());
        boolean isOwner = booking.getOwner() != null && booking.getOwner().getId().equals(current.getId());
        boolean isAdmin = current.getRole() == Role.ADMIN || current.getRole() == Role.SUPER_ADMIN;
        if (!isCustomer && !isOwner && !isAdmin) {
            throw OoruMitraException.forbidden("Not authorized to view this booking");
        }
        return booking;
    }

    private PagedResponse<BookingResponse> toPagedResponse(Page<Booking> page) {
        var content = page.getContent().stream()
                .map(b -> {
                    ListingInfo info = resolveListing(b.getListingType(), b.getListingId());
                    return BookingResponse.from(b, info.name(), info.mobile());
                })
                .toList();
        return new PagedResponse<>(content, page.getTotalElements(), page.getTotalPages(), page.getNumber(), page.getSize());
    }
}
