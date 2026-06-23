-- Run this once against your local PostgreSQL instance (as the postgres superuser)
-- to create the database/user that application.yml's defaults expect.

CREATE USER ooumitra WITH PASSWORD 'ooumitra123';
CREATE DATABASE ooumitra OWNER ooumitra;
GRANT ALL PRIVILEGES ON DATABASE ooumitra TO ooumitra;
