-- Add voice_note_url to worker/transport/vehicle-work listings, matching the
-- column products got in V9, so all four listing types can attach a voice
-- recording (see Sell.jsx voice recording UI + UploadController audio support).
ALTER TABLE worker_listings ADD COLUMN voice_note_url VARCHAR(255) DEFAULT NULL;
ALTER TABLE transport_listings ADD COLUMN voice_note_url VARCHAR(255) DEFAULT NULL;
ALTER TABLE vehicle_work_listings ADD COLUMN voice_note_url VARCHAR(255) DEFAULT NULL;
