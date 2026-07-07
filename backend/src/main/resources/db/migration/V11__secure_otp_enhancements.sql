-- Add security tracking columns to otp_verifications
ALTER TABLE otp_verifications 
ADD COLUMN attempts INT NOT NULL DEFAULT 0,
ADD COLUMN resend_count INT NOT NULL DEFAULT 0,
ADD COLUMN channel VARCHAR(20) DEFAULT 'SMS';
