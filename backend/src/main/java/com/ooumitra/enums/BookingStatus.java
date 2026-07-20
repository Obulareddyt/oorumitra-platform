package com.ooumitra.enums;

// Two flows share this enum, selected by ListingType at creation time:
//   Product interest:  INTERESTED -> CONTACTED -> PURCHASED (or CANCELLED)
//   Service booking:   PENDING -> ACCEPTED -> IN_PROGRESS -> COMPLETED (or CANCELLED)
public enum BookingStatus {
    INTERESTED, CONTACTED, PURCHASED,
    PENDING, ACCEPTED, IN_PROGRESS, COMPLETED,
    CANCELLED
}
