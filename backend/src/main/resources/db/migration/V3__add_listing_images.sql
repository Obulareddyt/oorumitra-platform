-- Image support for Worker/Transport/VehicleWork listings, mirroring the
-- existing product_images table pattern.

CREATE TABLE worker_images (
    worker_listing_id BIGINT NOT NULL REFERENCES worker_listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE transport_images (
    transport_listing_id BIGINT NOT NULL REFERENCES transport_listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE vehicle_work_images (
    vehicle_work_listing_id BIGINT NOT NULL REFERENCES vehicle_work_listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);
