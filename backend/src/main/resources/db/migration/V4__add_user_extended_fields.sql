ALTER TABLE users
  ADD COLUMN username        VARCHAR(50)  NULL UNIQUE,
  ADD COLUMN whatsapp_number VARCHAR(15)  NULL,
  ADD COLUMN password_hash   VARCHAR(255) NULL;
