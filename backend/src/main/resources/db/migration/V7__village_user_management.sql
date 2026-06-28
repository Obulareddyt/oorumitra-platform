-- Villages
CREATE TABLE villages (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    mandal     VARCHAR(100),
    district   VARCHAR(100) NOT NULL,
    state      VARCHAR(100) NOT NULL,
    pincode    VARCHAR(10),
    status     VARCHAR(10)  NOT NULL DEFAULT 'ACTIVE',
    created_by BIGINT       NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_village_district (name, district)
);

-- Village admin assignments
CREATE TABLE village_admins (
    village_id BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    PRIMARY KEY (village_id, user_id),
    CONSTRAINT fk_va_village FOREIGN KEY (village_id) REFERENCES villages(id) ON DELETE CASCADE,
    CONSTRAINT fk_va_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
);

-- Link users to a structured village
ALTER TABLE users ADD COLUMN village_id BIGINT NULL;
ALTER TABLE users ADD CONSTRAINT fk_user_village FOREIGN KEY (village_id) REFERENCES villages(id) ON UPDATE CASCADE;

-- New app_roles: Moderator, Farmer (Service Provider already seeded in V5)
INSERT INTO app_roles (name, description, status, is_system) VALUES
('Moderator', 'Moderates content within a village',              'ACTIVE', TRUE),
('Farmer',    'Farmer with access to agricultural services',     'ACTIVE', TRUE);

-- Moderator permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM app_roles r, permissions p
WHERE r.name = 'Moderator'
  AND p.category IN ('Product Management','Service Management','Complaint Management');

-- Farmer permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM app_roles r, permissions p
WHERE r.name = 'Farmer'
  AND p.name IN ('VIEW_PRODUCT','VIEW_SERVICE','CREATE_COMPLAINT');
