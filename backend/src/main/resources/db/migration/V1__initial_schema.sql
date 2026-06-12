-- OoruMitra — Initial Schema
-- Version 1.0 | 10 June 2026

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(120),
    gender VARCHAR(10),
    role VARCHAR(10) NOT NULL DEFAULT 'BUYER',
    profile_photo_url TEXT,
    fcm_token TEXT,
    language VARCHAR(5) NOT NULL DEFAULT 'EN',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    village VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_users_mobile ON users (mobile_number);

CREATE TABLE otp_verifications (
    id BIGSERIAL PRIMARY KEY,
    mobile_number VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_otp_mobile ON otp_verifications (mobile_number);

CREATE TABLE worker_listings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    group_name VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    village VARCHAR(100) NOT NULL,
    available_workers INT NOT NULL,
    price_type VARCHAR(10) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    work_type VARCHAR(30) NOT NULL,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    average_rating NUMERIC(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_worker_user ON worker_listings (user_id);
CREATE INDEX idx_worker_work_type ON worker_listings (work_type);
CREATE INDEX idx_worker_village ON worker_listings (village);
CREATE INDEX idx_worker_location ON worker_listings (latitude, longitude);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(20) NOT NULL,
    sub_category VARCHAR(60),
    owner_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    negotiable BOOLEAN NOT NULL DEFAULT FALSE,
    location VARCHAR(150),
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    availability VARCHAR(60),
    description TEXT,
    average_rating NUMERIC(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_product_user ON products (user_id);
CREATE INDEX idx_product_category ON products (category);
CREATE INDEX idx_product_location ON products (latitude, longitude);

CREATE TABLE product_images (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE vehicle_work_listings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    vehicle_type VARCHAR(20) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    price_per_acre NUMERIC(10,2),
    price_per_hour NUMERIC(10,2),
    village VARCHAR(100) NOT NULL,
    available_status BOOLEAN NOT NULL DEFAULT TRUE,
    available_until DATE,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    average_rating NUMERIC(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_vw_user ON vehicle_work_listings (user_id);
CREATE INDEX idx_vw_type ON vehicle_work_listings (vehicle_type);
CREATE INDEX idx_vw_village ON vehicle_work_listings (village);
CREATE INDEX idx_vw_location ON vehicle_work_listings (latitude, longitude);

CREATE TABLE transport_listings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    vehicle_type VARCHAR(15) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    rate_per_km NUMERIC(8,2),
    rate_per_hour NUMERIC(8,2),
    weight_capacity VARCHAR(40),
    negotiable BOOLEAN NOT NULL DEFAULT FALSE,
    availability VARCHAR(80),
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    average_rating NUMERIC(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_tl_user ON transport_listings (user_id);
CREATE INDEX idx_tl_type ON transport_listings (vehicle_type);
CREATE INDEX idx_tl_location ON transport_listings (latitude, longitude);

CREATE TABLE request_tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    required_date DATE,
    budget NUMERIC(12,2),
    mobile_number VARCHAR(15) NOT NULL,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    response_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_ticket_user ON request_tickets (user_id);
CREATE INDEX idx_ticket_status ON request_tickets (status);
CREATE INDEX idx_ticket_location ON request_tickets (latitude, longitude);

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    listing_type VARCHAR(15) NOT NULL,
    listing_id BIGINT NOT NULL,
    provider_name VARCHAR(100),
    provider_mobile VARCHAR(15),
    status VARCHAR(15) NOT NULL DEFAULT 'PENDING',
    amount NUMERIC(12,2),
    required_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_booking_user ON bookings (user_id);
CREATE INDEX idx_booking_status ON bookings (status);
CREATE INDEX idx_booking_listing ON bookings (listing_type, listing_id);

CREATE TABLE chat_conversations (
    id BIGSERIAL PRIMARY KEY,
    buyer_id BIGINT NOT NULL REFERENCES users(id),
    seller_id BIGINT NOT NULL REFERENCES users(id),
    listing_type VARCHAR(15),
    listing_id BIGINT,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    buyer_unread_count INT DEFAULT 0,
    seller_unread_count INT DEFAULT 0,
    CONSTRAINT uq_conv UNIQUE (buyer_id, seller_id, listing_type, listing_id)
);
CREATE INDEX idx_conv_buyer ON chat_conversations (buyer_id);
CREATE INDEX idx_conv_seller ON chat_conversations (seller_id);

CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id),
    content TEXT,
    message_type VARCHAR(10) NOT NULL DEFAULT 'TEXT',
    media_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_msg_conv ON chat_messages (conversation_id);
CREATE INDEX idx_msg_sender ON chat_messages (sender_id);
CREATE INDEX idx_msg_created ON chat_messages (created_at);

CREATE TABLE ratings (
    id BIGSERIAL PRIMARY KEY,
    reviewer_id BIGINT NOT NULL REFERENCES users(id),
    listing_type VARCHAR(15) NOT NULL,
    listing_id BIGINT NOT NULL,
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_rating UNIQUE (reviewer_id, listing_type, listing_id)
);
CREATE INDEX idx_rating_reviewer ON ratings (reviewer_id);
CREATE INDEX idx_rating_listing ON ratings (listing_type, listing_id);

CREATE TABLE rating_tags (
    rating_id BIGINT NOT NULL REFERENCES ratings(id) ON DELETE CASCADE,
    tag VARCHAR(60) NOT NULL
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    body TEXT,
    type VARCHAR(25) NOT NULL,
    data TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notif_user ON notifications (user_id);
CREATE INDEX idx_notif_read ON notifications (is_read);
CREATE INDEX idx_notif_created ON notifications (created_at DESC);

CREATE TABLE favourites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    listing_type VARCHAR(15) NOT NULL,
    listing_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_favourite UNIQUE (user_id, listing_type, listing_id)
);
CREATE INDEX idx_fav_user ON favourites (user_id);
