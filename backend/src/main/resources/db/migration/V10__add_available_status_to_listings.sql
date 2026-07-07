-- Add available_status to listings for unified availability management
ALTER TABLE products ADD COLUMN available_status BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE worker_listings ADD COLUMN available_status BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE transport_listings ADD COLUMN available_status BOOLEAN NOT NULL DEFAULT TRUE;
