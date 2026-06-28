-- Extend role column to support SUPER_ADMIN (11 chars)
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL DEFAULT 'BUYER';

-- Configurable roles
CREATE TABLE app_roles (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(500),
    status      VARCHAR(10)  NOT NULL DEFAULT 'ACTIVE',
    is_system   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NULL     ON UPDATE CURRENT_TIMESTAMP,
    created_by  BIGINT       NULL,
    updated_by  BIGINT       NULL
);

-- Permission catalogue
CREATE TABLE permissions (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(50)  NOT NULL,
    description VARCHAR(255)
);

-- Role-to-permission join
CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role       FOREIGN KEY (role_id)       REFERENCES app_roles(id)  ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Audit log
CREATE TABLE role_audit_logs (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    action       VARCHAR(50)  NOT NULL,
    role_name    VARCHAR(50)  NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    performed_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details      TEXT
);

-- ── Seed permissions ─────────────────────────────────────────────────────────
INSERT INTO permissions (name, category, description) VALUES
('CREATE_USER',      'User Management',       'Create new users'),
('EDIT_USER',        'User Management',       'Edit user details'),
('DELETE_USER',      'User Management',       'Delete users'),
('VIEW_USER',        'User Management',       'View user list and details'),
('CREATE_ROLE',      'Role Management',       'Create new roles'),
('EDIT_ROLE',        'Role Management',       'Edit roles'),
('DELETE_ROLE',      'Role Management',       'Delete roles'),
('VIEW_ROLE',        'Role Management',       'View roles'),
('CREATE_PRODUCT',   'Product Management',    'Create product listings'),
('EDIT_PRODUCT',     'Product Management',    'Edit product listings'),
('DELETE_PRODUCT',   'Product Management',    'Delete product listings'),
('VIEW_PRODUCT',     'Product Management',    'View products'),
('CREATE_SERVICE',   'Service Management',    'Create service listings'),
('EDIT_SERVICE',     'Service Management',    'Edit service listings'),
('DELETE_SERVICE',   'Service Management',    'Delete service listings'),
('VIEW_SERVICE',     'Service Management',    'View services'),
('CREATE_COMPLAINT', 'Complaint Management',  'Create complaints'),
('UPDATE_COMPLAINT', 'Complaint Management',  'Update complaints'),
('CLOSE_COMPLAINT',  'Complaint Management',  'Close complaints'),
('VIEW_COMPLAINT',   'Complaint Management',  'View complaints'),
('VIEW_REPORTS',     'Reports',               'View reports'),
('EXPORT_REPORTS',   'Reports',               'Export reports');

-- ── Seed default roles ────────────────────────────────────────────────────────
INSERT INTO app_roles (name, description, status, is_system) VALUES
('Super Admin',       'Full system access',                                              'ACTIVE', TRUE),
('Village Admin',     'Manages village-level users, products, services and complaints',  'ACTIVE', TRUE),
('Member',            'Basic member access — view listings and raise complaints',         'ACTIVE', TRUE),
('Vendor',            'Manage own product listings',                                     'ACTIVE', TRUE),
('Service Provider',  'Manage own service listings',                                     'ACTIVE', TRUE);

-- Super Admin: all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM app_roles r, permissions p WHERE r.name = 'Super Admin';

-- Village Admin: User Mgmt + Product + Service + Complaint + Reports
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM app_roles r, permissions p
WHERE r.name = 'Village Admin'
  AND p.category IN ('User Management','Product Management','Service Management','Complaint Management','Reports');

-- Member: view products/services + create complaints
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM app_roles r, permissions p
WHERE r.name = 'Member'
  AND p.name IN ('VIEW_PRODUCT','VIEW_SERVICE','CREATE_COMPLAINT');

-- Vendor: full Product Management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM app_roles r, permissions p
WHERE r.name = 'Vendor'
  AND p.category = 'Product Management';

-- Service Provider: full Service Management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM app_roles r, permissions p
WHERE r.name = 'Service Provider'
  AND p.category = 'Service Management';
