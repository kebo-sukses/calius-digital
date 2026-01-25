<?php
/**
 * ClipPremium License Activation Endpoint
 * POST /api/license/activate
 * 
 * Purpose: Activate license with code + email
 * Version: 3.3.0
 * Date: 2026-01-09
 * 
 * Request Format:
 * {
 *   "email": "user@example.com",
 *   "license_code": "CLIPPREM-PERS-2026-0001",
 *   "hwid": "a8f3c2d1e4b5f6a7c8d9e0f1a2b3c4d5"
 * }
 * 
 * Response Success:
 * {
 *   "ok": true,
 *   "status": "success",
 *   "license_type": "personal",
 *   "message": "License activated successfully!",
 *   "videos_remaining": -1,
 *   "expires_at": null
 * }
 * 
 * Response Error:
 * {
 *   "ok": false,
 *   "status": "error",
 *   "code": "INVALID_LICENSE",
 *   "message": "Kode lisensi tidak valid atau sudah digunakan"
 * }
 */

require_once __DIR__ . '/functions.php';

$start_time = microtime(true);

// CORS headers for desktop app
if (ALLOW_CORS) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    log_api_request('/license/activate', null, [], 405);
    send_json_response([
        'ok' => false,
        'status' => 'error',
        'error' => 'Method not allowed. Use POST.'
    ], 405);
}

// Get request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    log_api_request('/license/activate', null, [], 400);
    send_json_response([
        'ok' => false,
        'status' => 'error',
        'error' => 'Invalid JSON request'
    ], 400);
}

// Validate required fields
$email = trim($data['email'] ?? '');
$license_code = strtoupper(trim($data['license_code'] ?? ''));
$hwid = trim($data['hwid'] ?? '');

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    log_api_request('/license/activate', $hwid, $data, 400);
    send_json_response([
        'ok' => false,
        'status' => 'error',
        'code' => 'INVALID_EMAIL',
        'message' => 'Email tidak valid'
    ], 400);
}

// Validate license code format
if (empty($license_code) || !validate_license_code($license_code)) {
    log_api_request('/license/activate', $hwid, $data, 400);
    send_json_response([
        'ok' => false,
        'status' => 'error',
        'code' => 'INVALID_FORMAT',
        'message' => 'Format kode lisensi tidak valid. Expected: CLIPPREM-XXXX-2026-0000'
    ], 400);
}

// Validate HWID
if (empty($hwid) || !validate_hwid($hwid)) {
    log_api_request('/license/activate', $hwid, $data, 400);
    send_json_response([
        'ok' => false,
        'status' => 'error',
        'code' => 'INVALID_HWID',
        'message' => 'Hardware ID tidak valid'
    ], 400);
}

// Check rate limit
$ip = get_client_ip();
$rate_check = check_rate_limit($hwid, $ip);

if (!$rate_check['allowed']) {
    log_api_request('/license/activate', $hwid, $data, 429);
    send_json_response([
        'ok' => false,
        'status' => 'error',
        'code' => 'RATE_LIMIT',
        'message' => $rate_check['message']
    ], 429);
}

// Activate license
$activation_result = activate_license($hwid, $email, $license_code);

if (!$activation_result['success']) {
    log_api_request('/license/activate', $hwid, $data, 400);
    send_json_response([
        'ok' => false,
        'status' => 'error',
        'code' => $activation_result['code'],
        'message' => $activation_result['message']
    ], 400);
}

// Get updated license info
$license = get_or_create_license($hwid);

// Success response
$response = [
    'ok' => true,
    'status' => 'success',
    'message' => 'Lisensi berhasil diaktivasi! 🎉',
    'license' => [
        'type' => $license['license_type'],
        'videos_remaining' => -1, // Unlimited
        'expires_at' => null,
        'email' => $email,
        'activated_at' => date('Y-m-d H:i:s')
    ]
];

// Log request
$response_time = round((microtime(true) - $start_time) * 1000);
log_api_request('/license/activate', $hwid, $data, 200, $response_time);

// Send response
send_json_response($response, 200);
?>
