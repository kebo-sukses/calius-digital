<?php
/**
 * ClipPremium License System - Database Configuration
 * Version: 3.2.2
 * 
 * SECURITY WARNING: Keep this file secret!
 * Add to .gitignore if using version control
 */

// Database Connection
define('DB_HOST', 'localhost');
define('DB_NAME', 'clippremium_license');
define('DB_USER', 'YOUR_DB_USER_HERE');  // ← GANTI dengan user dari cPanel MySQL Databases
define('DB_PASS', 'YOUR_DB_PASS_HERE');  // ← GANTI dengan password database
define('DB_CHARSET', 'utf8mb4');

// Security Settings
define('API_SECRET_KEY', 'clip_premium_2026_secret_key_change_this');  // ← GANTI dengan random string
define('MAX_REQUESTS_PER_HOUR', 100);   // Per HWID
define('MAX_REQUESTS_PER_IP', 500);     // Per IP address
define('ENABLE_REQUEST_LOGGING', true); // Log all API requests

// Trial Settings
define('TRIAL_VIDEO_LIMIT', 5);         // Free trial limit

// License Prices (IDR)
define('PRICE_PERSONAL', 3000000);      // Rp 3 juta
define('PRICE_AGENCY', 15000000);       // Rp 15 juta

// Timezone
date_default_timezone_set('Asia/Jakarta');

// Error Reporting (DISABLE in production!)
ini_set('display_errors', 0);           // 0 = OFF, 1 = ON for debugging
error_reporting(E_ALL);

// CORS Settings (if needed)
define('ALLOW_CORS', true);
define('CORS_ORIGIN', '*');             // Change to specific domain in production

/**
 * Get Database Connection
 * @return mysqli|null
 */
function get_db_connection() {
    static $conn = null;
    
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            error_log("Database connection failed: " . $conn->connect_error);
            return null;
        }
        
        $conn->set_charset(DB_CHARSET);
    }
    
    return $conn;
}

/**
 * Send JSON Response
 * @param array $data Response data
 * @param int $http_code HTTP status code
 */
function send_json_response($data, $http_code = 200) {
    http_response_code($http_code);
    header('Content-Type: application/json; charset=utf-8');
    
    if (ALLOW_CORS) {
        header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
    
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Get Client IP Address
 * @return string
 */
function get_client_ip() {
    $ip_keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    
    foreach ($ip_keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = $_SERVER[$key];
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    
    return 'UNKNOWN';
}

/**
 * Validate HWID Format
 * @param string $hwid
 * @return bool
 */
function validate_hwid($hwid) {
    return preg_match('/^[a-f0-9]{32}$/i', $hwid);
}
?>
