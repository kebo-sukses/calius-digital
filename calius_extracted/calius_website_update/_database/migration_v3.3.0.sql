-- ============================================================
-- ClipPremium License System - Database Migration
-- Version: 3.2.2 → 3.3.0 (License Activation Support)
-- Date: 2026-01-09
-- ============================================================

-- IMPORTANT: Backup database before running this!
-- Run in phpMyAdmin or MySQL CLI

USE luaregrp_clippremium_license;

-- ============================================================
-- STEP 1: Add license_code column to licenses table
-- ============================================================

ALTER TABLE licenses 
ADD COLUMN license_code VARCHAR(50) DEFAULT NULL 
  COMMENT 'License activation code (format: CLIPPREM-PERS-2026-0001)' 
  AFTER email;

-- Add index for faster lookup
ALTER TABLE licenses 
ADD INDEX idx_license_code (license_code);

-- ============================================================
-- STEP 2: Add activated_at timestamp
-- ============================================================

ALTER TABLE licenses 
ADD COLUMN activated_at TIMESTAMP NULL DEFAULT NULL 
  COMMENT 'License activation timestamp' 
  AFTER license_code;

-- ============================================================
-- STEP 3: Create license_codes table (for pre-generated codes)
-- ============================================================

CREATE TABLE IF NOT EXISTS license_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    license_code VARCHAR(50) UNIQUE NOT NULL 
        COMMENT 'Format: CLIPPREM-PERS-2026-0001',
    license_type ENUM('personal', 'agency') NOT NULL 
        COMMENT 'License tier',
    status ENUM('unused', 'active', 'revoked') DEFAULT 'unused' 
        COMMENT 'Code status',
    order_id VARCHAR(100) DEFAULT NULL 
        COMMENT 'Payment order reference',
    buyer_email VARCHAR(255) DEFAULT NULL 
        COMMENT 'Customer email',
    buyer_name VARCHAR(255) DEFAULT NULL 
        COMMENT 'Customer name',
    activated_by_hwid VARCHAR(32) DEFAULT NULL 
        COMMENT 'HWID that activated this code',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        COMMENT 'Code generation date',
    activated_at TIMESTAMP NULL DEFAULT NULL 
        COMMENT 'Code activation date',
    notes TEXT 
        COMMENT 'Admin notes',
    
    INDEX idx_code (license_code),
    INDEX idx_status (status),
    INDEX idx_type (license_type),
    INDEX idx_hwid (activated_by_hwid),
    INDEX idx_email (buyer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Pre-generated license codes inventory';

-- ============================================================
-- STEP 4: Insert sample license codes for testing
-- ============================================================

-- Personal License Codes (10 samples)
INSERT INTO license_codes (license_code, license_type, status, notes) VALUES
('CLIPPREM-PERS-2026-0001', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0002', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0003', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0004', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0005', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0006', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0007', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0008', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0009', 'personal', 'unused', 'Initial batch - Personal License'),
('CLIPPREM-PERS-2026-0010', 'personal', 'unused', 'Initial batch - Personal License');

-- Agency License Codes (5 samples)
INSERT INTO license_codes (license_code, license_type, status, notes) VALUES
('CLIPPREM-AGNC-2026-0001', 'agency', 'unused', 'Initial batch - Agency License'),
('CLIPPREM-AGNC-2026-0002', 'agency', 'unused', 'Initial batch - Agency License'),
('CLIPPREM-AGNC-2026-0003', 'agency', 'unused', 'Initial batch - Agency License'),
('CLIPPREM-AGNC-2026-0004', 'agency', 'unused', 'Initial batch - Agency License'),
('CLIPPREM-AGNC-2026-0005', 'agency', 'unused', 'Initial batch - Agency License');

-- Testing Code (for development)
INSERT INTO license_codes (license_code, license_type, status, notes) VALUES
('CLIPPREM-TEST-2026-9999', 'personal', 'unused', 'TEST CODE - Do not sell!');

-- ============================================================
-- STEP 5: Verification Queries
-- ============================================================

-- Check if columns added successfully
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'luaregrp_clippremium_license' 
  AND TABLE_NAME = 'licenses' 
  AND COLUMN_NAME IN ('license_code', 'activated_at');

-- Check license_codes table
SELECT 
    license_code, 
    license_type, 
    status, 
    notes 
FROM license_codes 
ORDER BY id ASC 
LIMIT 10;

-- ============================================================
-- MIGRATION COMPLETE!
-- ============================================================

-- Expected results:
-- ✓ licenses.license_code column added
-- ✓ licenses.activated_at column added
-- ✓ license_codes table created
-- ✓ 16 sample codes inserted (10 personal + 5 agency + 1 test)

-- Next steps:
-- 1. Upload activate.php to /api/license/
-- 2. Update functions.php with activation logic
-- 3. Test activation endpoint with Postman/cURL
-- 4. Generate more license codes as needed

SELECT 'Migration completed successfully! ✓' AS status;
