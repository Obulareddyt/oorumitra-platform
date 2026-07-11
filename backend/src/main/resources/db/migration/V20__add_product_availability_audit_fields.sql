-- V20: Add audit fields for product availability status updates
ALTER TABLE products ADD COLUMN IF NOT EXISTS status_updated_by VARCHAR(100) DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status_updated_date TIMESTAMP DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status_updated_role VARCHAR(20) DEFAULT NULL;

ALTER TABLE product_status_history ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'User';
