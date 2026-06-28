ALTER TABLE products
  ADD COLUMN admin_remarks  TEXT         NULL,
  ADD COLUMN decided_at     DATETIME     NULL,
  ADD COLUMN decided_by     VARCHAR(100) NULL;

ALTER TABLE worker_listings
  ADD COLUMN description    TEXT         NULL,
  ADD COLUMN admin_remarks  TEXT         NULL,
  ADD COLUMN decided_at     DATETIME     NULL,
  ADD COLUMN decided_by     VARCHAR(100) NULL;

ALTER TABLE transport_listings
  ADD COLUMN description    TEXT         NULL,
  ADD COLUMN village        VARCHAR(100) NULL,
  ADD COLUMN admin_remarks  TEXT         NULL,
  ADD COLUMN decided_at     DATETIME     NULL,
  ADD COLUMN decided_by     VARCHAR(100) NULL;

ALTER TABLE vehicle_work_listings
  ADD COLUMN description    TEXT         NULL,
  ADD COLUMN admin_remarks  TEXT         NULL,
  ADD COLUMN decided_at     DATETIME     NULL,
  ADD COLUMN decided_by     VARCHAR(100) NULL;
