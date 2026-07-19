-- V22: Replace per-unit rate columns on transport_listings and
-- vehicle_work_listings with a single mandatory price_type + amount pair,
-- matching worker_listings' existing pricing model. Both tables are empty
-- in production at the time of this migration, so no data backfill is needed.

ALTER TABLE transport_listings
    DROP COLUMN rate_per_km,
    DROP COLUMN rate_per_hour,
    ADD COLUMN price_type VARCHAR(10) NOT NULL,
    ADD COLUMN amount DECIMAL(10, 2) NOT NULL;

ALTER TABLE vehicle_work_listings
    DROP COLUMN price_per_acre,
    DROP COLUMN price_per_hour,
    ADD COLUMN price_type VARCHAR(10) NOT NULL,
    ADD COLUMN amount DECIMAL(10, 2) NOT NULL;
