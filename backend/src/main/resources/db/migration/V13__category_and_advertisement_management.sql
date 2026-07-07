-- Create category_management table
CREATE TABLE category_management (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon VARCHAR(50),
    to_url VARCHAR(100),
    modal_key VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'ENABLED',
    display_order INT NOT NULL DEFAULT 0,
    color_class VARCHAR(150),
    icon_bg VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial categories into category_management matching Home.jsx
INSERT INTO category_management (key_name, label, description, icon, to_url, modal_key, status, display_order, color_class, icon_bg) VALUES
('AGRICULTURE', 'Agriculture', 'Buy & sell farm equipment, seeds, fertilizers & crop yields', '🌾', '/products', NULL, 'ENABLED', 1, 'from-emerald-50 to-teal-100/40 border-emerald-200/50 hover:from-emerald-100 hover:to-teal-200 hover:shadow-emerald-500/10 hover:border-emerald-400', 'bg-emerald-100 text-emerald-700'),
('MARKETPLACE', 'Marketplace', 'Browse and purchase goods, groceries & livestock locally', '🏪', '/products', NULL, 'ENABLED', 2, 'from-amber-50 to-orange-100/40 border-amber-200/50 hover:from-amber-100 hover:to-orange-200 hover:shadow-amber-500/10 hover:border-amber-400', 'bg-amber-100 text-amber-700'),
('JOBS', 'Jobs', 'Hire local workers, farmhands & skilled craftsmen near you', '👷', '/workers', NULL, 'ENABLED', 3, 'from-blue-50 to-indigo-100/40 border-blue-200/60 hover:from-blue-100 hover:to-indigo-200 hover:shadow-blue-500/10 hover:border-blue-400', 'bg-blue-100 text-blue-700'),
('SERVICES', 'Services', 'Book tractor ploughing, transport trucks & local vehicles', '🚜', '/vehicle-work', NULL, 'ENABLED', 4, 'from-purple-50 to-fuchsia-100/40 border-purple-200/60 hover:from-purple-100 hover:to-fuchsia-200 hover:shadow-purple-500/10 hover:border-purple-400', 'bg-purple-100 text-purple-700'),
('SCHEMES', 'Govt Schemes', 'Check and apply for state & central rural welfare initiatives', '🏛️', 'modal', 'schemes', 'ENABLED', 5, 'from-orange-50/50 to-yellow-100/30 border-orange-200/50 hover:from-orange-100 hover:to-yellow-200 hover:shadow-orange-500/10 hover:border-orange-400', 'bg-orange-100 text-orange-700'),
('EDUCATION', 'Education', 'Smart classes, study centers & coaching in the panchayat', '📚', 'modal', 'education', 'ENABLED', 6, 'from-cyan-50 to-sky-100/40 border-cyan-200/50 hover:from-cyan-100 hover:to-sky-200 hover:shadow-cyan-500/10 hover:border-cyan-400', 'bg-cyan-100 text-cyan-700'),
('HEALTHCARE', 'Healthcare', 'Village clinics, health camps & medicine availability listings', '🏥', 'modal', 'healthcare', 'ENABLED', 7, 'from-rose-50 to-red-100/40 border-rose-200/50 hover:from-rose-100 hover:to-red-200 hover:shadow-rose-500/10 hover:border-rose-400', 'bg-rose-100 text-rose-700'),
('EVENTS', 'Events', 'Temple festivals, agricultural meets & community gatherings', '🎉', 'modal', 'events', 'ENABLED', 8, 'from-yellow-50 to-amber-100/40 border-yellow-200/50 hover:from-yellow-100 hover:to-amber-200 hover:shadow-yellow-500/10 hover:border-yellow-400', 'bg-yellow-100 text-yellow-700'),
('COMMUNITY', 'Community', 'Panchayat announcements, self-help groups & discussions', '🤝', 'modal', 'community', 'ENABLED', 9, 'from-green-50 to-lime-100/40 border-green-200/50 hover:from-green-100 hover:to-lime-200 hover:shadow-green-500/10 hover:border-green-400', 'bg-green-100 text-green-700'),
('BUSINESSES', 'Local Businesses', 'Discover rural micro-enterprises, shops & local artisans', '💼', 'modal', 'businesses', 'ENABLED', 10, 'from-teal-50 to-emerald-100/40 border-teal-200/50 hover:from-teal-100 hover:to-emerald-200 hover:shadow-teal-500/10 hover:border-teal-400', 'bg-teal-100 text-teal-700');

-- Create advertisements table
CREATE TABLE advertisements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    media_url VARCHAR(255),
    media_type VARCHAR(50) NOT NULL,
    redirect_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    priority INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    ad_type VARCHAR(30) NOT NULL DEFAULT 'BANNER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Create advertisement_media table
CREATE TABLE advertisement_media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    advertisement_id BIGINT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_ad_media FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE
);

-- Create advertisement_schedule table
CREATE TABLE advertisement_schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    advertisement_id BIGINT NOT NULL,
    start_time TIME,
    end_time TIME,
    day_of_week VARCHAR(20),
    CONSTRAINT fk_ad_sched FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE
);
