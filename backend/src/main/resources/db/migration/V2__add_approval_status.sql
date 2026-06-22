-- Admin approval workflow for listings.
-- Existing rows default to APPROVED so pre-existing prod listings remain visible;
-- new application-level inserts explicitly default to PENDING via entity @Builder.Default.

ALTER TABLE products              ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE worker_listings        ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE transport_listings     ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE vehicle_work_listings  ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';

CREATE INDEX idx_product_approval ON products (approval_status);
CREATE INDEX idx_worker_approval ON worker_listings (approval_status);
CREATE INDEX idx_tl_approval ON transport_listings (approval_status);
CREATE INDEX idx_vw_approval ON vehicle_work_listings (approval_status);
