<?php
/**
 * ClipPremium License Check Endpoint
 * POST /api/license/check
 * 
 * Request: { "hwid": "abc123...", "version": "3.2.2" }
 * Response: { "status": "trial", "videos_remaining": 5, ... }
 */

require_once __DIR__ . '/functions.php';

$start_time = microtime(true);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    log_api_request('/license/check', null, [], 405);
    send_json_response([
        'ok' => false,
        'error' => 'Method not allowed. Use POST.'
    ], 405);
}

// Get request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    log_api_request('/license/check', null, [], 400);
    send_json_response([
        'ok' => false,
        'error' => 'Invalid JSON request'
    ], 400);
}

// Validate required fields
$hwid = $data['hwid'] ?? '';
$version = $data['version'] ?? '';

if (empty($hwid) || !validate_hwid($hwid)) {
    log_api_request('/license/check', $hwid, $data, 400);
    send_json_response([
        'ok' => false,
        'error' => 'Invalid or missing HWID (must be 32 hex characters)'
    ], 400);
}

// Check rate limit
$ip = get_client_ip();
$rate_check = check_rate_limit($hwid, $ip);

if (!$rate_check['allowed']) {
    log_api_request('/license/check', $hwid, $data, 429);
    send_json_response([
        'ok' => false,
        'error' => $rate_check['message']
    ], 429);
}

// Get or create license
$license = get_or_create_license($hwid);

if (!$license) {
    log_api_request('/license/check', $hwid, $data, 500);
    send_json_response([
        'ok' => false,
        'error' => 'Database error. Please try again later.'
    ], 500);
}

// Check if blocked
if ($license['license_type'] === 'blocked') {
    log_api_request('/license/check', $hwid, $data, 403);
    send_json_response([
        'ok' => false,
        'error' => 'License blocked. Contact support@calius.digital'
    ], 403);
}

// Format response
$response = [
    'ok' => true,
    'license' => format_license_response($license),
    'server_time' => date('Y-m-d H:i:s'),
    'version_checked' => $version
];

// Log request
$response_time = round((microtime(true) - $start_time) * 1000);
log_api_request('/license/check', $hwid, $data, 200, $response_time);

// Send response
send_json_response($response, 200);
?>
