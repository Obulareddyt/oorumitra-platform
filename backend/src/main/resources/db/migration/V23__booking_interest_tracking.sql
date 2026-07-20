-- V23: Extend bookings into the full interest/booking-tracking module.
--
-- owner_id is nullable: existing rows (if any) predate owner tracking and
-- can't be safely backfilled from listing_type/listing_id in pure SQL across
-- four different listing tables. All new bookings always set it.

ALTER TABLE bookings
    ADD COLUMN owner_id BIGINT NULL,
    ADD COLUMN service_time TIME NULL,
    DROP COLUMN provider_name,
    DROP COLUMN provider_mobile,
    DROP COLUMN amount,
    ADD CONSTRAINT fk_booking_owner FOREIGN KEY (owner_id) REFERENCES users(id);

CREATE INDEX idx_booking_owner ON bookings (owner_id);
