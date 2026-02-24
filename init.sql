-- ENUM types
CREATE TYPE user_role AS ENUM ('CITIZEN', 'ADMIN');
CREATE TYPE report_status AS ENUM ('PENDING', 'IN_PROGRESS', 'FULFILLED', 'DECLINED');
CREATE TYPE violation_type AS ENUM (
    'ON_SIDEWALK',
    'DISABLED_SPACE_NO_PERMIT',
    'BLOCKING_CROSSWALK',
    'BLOCKING_RAMP',
    'DOUBLE_PARKED',
    'AT_BUS_STOP',
    'BLOCKING_DRIVEWAY',
    'NEAR_INTERSECTION',
    'LOADING_ZONE_UNAUTHORIZED',
    'NO_PARKING_AREA',
    'OTHER'
);

-- Users table
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    vehicle_manufacturer VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    vehicle_color VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE reports (
    report_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    violation_type violation_type NOT NULL,
    photo_url TEXT, -- Path to the uploaded evidence
    location_address VARCHAR(255) NOT NULL,
    location_latitude DECIMAL(10, 8) NOT NULL,
    location_longitude DECIMAL(11, 8) NOT NULL,
    description TEXT,
    status report_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_license_plate ON reports(license_plate);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert mock user data
INSERT INTO users (email, password_hash, role)
VALUES
    ('admin@traffichq.gov', '$2a$12$uSFABUlSC/tPUkj.7QzX.ej1KtDyb/0UKqNsTKSGgIG7QBSrRUCMy', 'ADMIN'),
    ('john.doe@email.com', '$2a$10$rFKLvYNEGzWHvLPQJVNqzOxpBvYCHLbU0mvqPvCMqXqHN1lCOYZEu', 'CITIZEN'),
    ('maria.smith@email.com', '$2a$10$rFKLvYNEGzWHvLPQJVNqzOxpBvYCHLbU0mvqPvCMqXqHN1lCOYZEu', 'CITIZEN');

-- Insert mock vehicle data
INSERT INTO vehicles (license_plate, owner_name, owner_email, vehicle_manufacturer, vehicle_model, vehicle_color)
VALUES
    ('ABC-1234', 'Dimitris Papadopoulos', 'dpapad@email.com', 'Toyota', 'Corolla', 'Silver'),
    ('XYZ-5678', 'Anna Georgiou', 'ageorgiou@email.com', 'BMW', 'X3', 'Black'),
    ('DEF-9012', 'Kostas Nikolaou', 'knikolaou@email.com', 'Mercedes', 'C-Class', 'White'),
    ('GHI-3456', 'Sofia Karagianni', 'skaragianni@email.com', 'Volkswagen', 'Golf', 'Blue'),
    ('JKL-7890', 'Nikos Ioannou', 'nioannou@email.com', 'Audi', 'A4', 'Gray');

-- Insert mock reports
INSERT INTO reports (user_id, license_plate, violation_type, location_address, location_latitude, location_longitude, description, status)
VALUES
    (2, 'ABC-1234', 'ON_SIDEWALK', 'Aristotelous Square, Thessaloniki', 40.6318, 22.9413, 'Car parked on pedestrian sidewalk', 'PENDING'),
    (2, 'XYZ-5678', 'DISABLED_SPACE_NO_PERMIT', 'Tsimiski Street 50, Thessaloniki', 40.6361, 22.9396, 'No disabled permit visible', 'IN_PROGRESS'),
    (3, 'DEF-9012', 'BLOCKING_CROSSWALK', 'Egnatia Avenue 100, Thessaloniki', 40.6370, 22.9350, 'Blocking pedestrian crossing', 'FULFILLED');
