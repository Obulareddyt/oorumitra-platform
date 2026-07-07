-- Add availability_status to products table
ALTER TABLE products ADD COLUMN availability_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- Create product_status_history audit table
CREATE TABLE product_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    old_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    changed_by BIGINT NOT NULL,
    remarks TEXT,
    changed_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_psh_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_psh_user FOREIGN KEY (changed_by) REFERENCES users(id)
);
