-- Add voice_note_url to products table for storing audio description recordings
ALTER TABLE products ADD COLUMN voice_note_url VARCHAR(255) DEFAULT NULL;
