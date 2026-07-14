-- V21: Add quantity column to products (entity field was added in 744ce02e
-- without a matching migration, so it only ever worked against H2 dev's
-- auto-created schema).
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity INT DEFAULT NULL;
