-- Increase otp column length to support secure hashing values
ALTER TABLE otp_verifications MODIFY COLUMN otp VARCHAR(255) NOT NULL;
