<?php
/**
 * ClipPremium License Increment Endpoint
 * POST /api/license/increment
 * 
 * Request: { "hwid": "abc123...", "video_url": "https://youtube.com/..." }
 * Response: { "allowed": true, "videos_remaining": 4, ... }
 */

require_once __DIR__ . '/functions.php';

$start_time = microtime(true);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    log_api_request('/license/increment', null, [], 405);
    send_json_response([
        'ok' => false,
        'error' => 'Method not allowed. Use POST.'
    ], 405);
}

// Get request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    log_api_request('/license/increment', null, [], 400);
    send_json_response([
        'ok' => false,
        'error' => 'Invalid JSON request'
    ], 400);
}

// Validate required fields
$hwid = $data['hwid'] ?? '';
$video_url = $data['video_url'] ?? '';

if (empty($hwid) || !validate_hwid($hwid)) {
    log_api_request('/license/increment', $hwid, $data, 400);
    send_json_response([
        'ok' => false,
        'error' => 'Invalid or missing HWID'
    ], 400);
}

if (empty($video_url)) {
    log_api_request('/license/increment', $hwid, $data, 400);
    send_json_response([
        'ok' => false,
        'error' => 'Missing video_url'
    ], 400);
}

// Check rate limit
$ip = get_client_ip();
$rate_check = check_rate_limit($hwid, $ip);

if (!$rate_check['allowed']) {
    log_api_request('/license/increment', $hwid, $data, 429);
    send_json_response([
        'ok' => false,
        'error' => $rate_check['message']
    ], 429);
}

// Get license
$license = get_or_create_license($hwid);

if (!$license) {
    log_api_request('/license/increment', $hwid, $data, 500);
    send_json_response([
        'ok' => false,
        'error' => 'Database error'
    ], 500);
}

// Check if blocked
if ($license['license_type'] === 'blocked') {
    log_api_request('/license/increment', $hwid, $data, 403);
    send_json_response([
        'ok' => false,
        'allowed' => false,
        'error' => 'License blocked'
    ], 403);
}

// Check if trial expired
if ($license['license_type'] === 'trial' && $license['videos_remaining'] <= 0) {
    log_api_request('/license/increment', $hwid, $data, 403);
    send_json_response([
        'ok' => false,
        'allowed' => false,
        'error' => 'Trial limit reached (5 videos). Please upgrade to continue.',
        'videos_remaining' => 0,
        'upgrade_url' => 'https://calius.digital/checkout.html'
    ], 403);
}

// Check if paid license expired
if (is_license_expired($license)) {
    log_api_request('/license/increment', $hwid, $data, 403);
    send_json_response([
        'ok' => false,
        'allowed' => false,
        'error' => 'License expired',
        'expired_at' => $license['expires_at']
    ], 403);
}

// Update usage counter
$update_success = update_license_usage($hwid, $video_url);

if (!$update_success) {
    log_api_request('/license/increment', $hwid, $data, 500);
    send_json_response([
        'ok' => false,
        'error' => 'Failed to update license counter'
    ], 500);
}

// Get updated license
$license = get_or_create_license($hwid);

// Format response
$response = [
    'ok' => true,
    'allowed' => true,
    'message' => 'Processing allowed',
    'videos_used' => (int)$license['videos_used'],
    'videos_remaining' => ($license['license_type'] === 'trial') 
        ? (int)$license['videos_remaining'] 
        : -1,
    'license_type' => $license['license_type']
];

// Log request
$response_time = round((microtime(true) - $start_time) * 1000);
log_api_request('/license/increment', $hwid, $data, 200, $response_time);

// Send response
send_json_response($response, 200);
?>
