<?php
/**
 * ClipPremium License System - Helper Functions (UPDATED)
 * Version: 3.3.0 - Added License Activation Support
 * Date: 2026-01-09
 * 
 * INSTALLATION INSTRUCTIONS:
 * 1. Backup original functions.php
 * 2. Replace with this file
 * 3. No other changes needed - fully backward compatible
 */

require_once __DIR__ . '/config.php';

/**
 * Log API Request
 * @param string $endpoint
 * @param string $hwid
 * @param array $request_data
 * @param int $response_code
 * @param int $response_time_ms
 */
function log_api_request($endpoint, $hwid = null, $request_data = [], $response_code = 200, $response_time_ms = 0) {
    if (!ENABLE_REQUEST_LOGGING) return;
    
    $conn = get_db_connection();
    if (!$conn) return;
    
    $ip = get_client_ip();
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $method = $_SERVER['REQUEST_METHOD'] ?? 'POST';
    $request_json = json_encode($request_data, JSON_UNESCAPED_UNICODE);
    
    $stmt = $conn->prepare("
        INSERT INTO api_requests 
        (hwid, endpoint, ip_address, user_agent, request_method, request_data, response_code, response_time_ms) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param('ssssssii', $hwid, $endpoint, $ip, $user_agent, $method, $request_json, $response_code, $response_time_ms);
    $stmt->execute();
    $stmt->close();
}

/**
 * Check Rate Limit
 * @param string $hwid
 * @param string $ip
 * @return array ['allowed' => bool, 'message' => string]
 */
function check_rate_limit($hwid, $ip) {
    $conn = get_db_connection();
    if (!$conn) {
        return ['allowed' => true, 'message' => 'Rate limit check skipped (DB error)'];
    }
    
    $one_hour_ago = date('Y-m-d H:i:s', strtotime('-1 hour'));
    
    // Check HWID rate limit
    if ($hwid) {
        $stmt = $conn->prepare("
            SELECT COUNT(*) as count 
            FROM api_requests 
            WHERE hwid = ? AND created_at > ?
        ");
        $stmt->bind_param('ss', $hwid, $one_hour_ago);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        if ($result['count'] >= MAX_REQUESTS_PER_HOUR) {
            return [
                'allowed' => false, 
                'message' => 'Rate limit exceeded: ' . $result['count'] . ' requests in last hour (max: ' . MAX_REQUESTS_PER_HOUR . ')'
            ];
        }
    }
    
    // Check IP rate limit
    $stmt = $conn->prepare("
        SELECT COUNT(*) as count 
        FROM api_requests 
        WHERE ip_address = ? AND created_at > ?
    ");
    $stmt->bind_param('ss', $ip, $one_hour_ago);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    
    if ($result['count'] >= MAX_REQUESTS_PER_IP) {
        return [
            'allowed' => false, 
            'message' => 'Rate limit exceeded for IP: ' . $result['count'] . ' requests in last hour (max: ' . MAX_REQUESTS_PER_IP . ')'
        ];
    }
    
    return ['allowed' => true, 'message' => 'Rate limit OK'];
}

/**
 * Validate HWID Format
 * @param string $hwid
 * @return bool
 */
function validate_hwid($hwid) {
    // HWID must be 32 hexadecimal characters
    return preg_match('/^[a-f0-9]{32}$/i', $hwid);
}

/**
 * Validate License Code Format
 * NEW FUNCTION for v3.3.0
 * 
 * @param string $code
 * @return bool
 */
function validate_license_code($code) {
    // Format: CLIPPREM-XXXX-2026-0000
    // XXXX = PERS (Personal) or AGNC (Agency) or TEST (Test)
    // 2026 = Year
    // 0000 = Sequential number (0001-9999)
    
    $pattern = '/^CLIPPREM-(PERS|AGNC|TEST)-\d{4}-\d{4}$/';
    return preg_match($pattern, $code);
}

/**
 * Get or Create License
 * @param string $hwid
 * @return array|null License data
 */
function get_or_create_license($hwid) {
    $conn = get_db_connection();
    if (!$conn) return null;
    
    // Try to get existing license
    $stmt = $conn->prepare("SELECT * FROM licenses WHERE hwid = ?");
    $stmt->bind_param('s', $hwid);
    $stmt->execute();
    $result = $stmt->get_result();
    $license = $result->fetch_assoc();
    $stmt->close();
    
    // If not exists, create new trial license
    if (!$license) {
        $stmt = $conn->prepare("
            INSERT INTO licenses (hwid, license_type, videos_used, videos_remaining) 
            VALUES (?, 'trial', 0, ?)
        ");
        $trial_limit = TRIAL_VIDEO_LIMIT;
        $stmt->bind_param('si', $hwid, $trial_limit);
        $stmt->execute();
        $stmt->close();
        
        // Get the newly created license
        $stmt = $conn->prepare("SELECT * FROM licenses WHERE hwid = ?");
        $stmt->bind_param('s', $hwid);
        $stmt->execute();
        $result = $stmt->get_result();
        $license = $result->fetch_assoc();
        $stmt->close();
    }
    
    return $license;
}

/**
 * Activate License with Code
 * NEW FUNCTION for v3.3.0
 * 
 * @param string $hwid Hardware ID
 * @param string $email User email
 * @param string $license_code License code to activate
 * @return array ['success' => bool, 'message' => string, 'code' => string]
 */
function activate_license($hwid, $email, $license_code) {
    $conn = get_db_connection();
    if (!$conn) {
        return [
            'success' => false,
            'code' => 'DB_ERROR',
            'message' => 'Database connection failed'
        ];
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // 1. Check if license code exists and is unused
        $stmt = $conn->prepare("
            SELECT * FROM license_codes 
            WHERE license_code = ? 
            FOR UPDATE
        ");
        $stmt->bind_param('s', $license_code);
        $stmt->execute();
        $result = $stmt->get_result();
        $code_data = $result->fetch_assoc();
        $stmt->close();
        
        if (!$code_data) {
            $conn->rollback();
            return [
                'success' => false,
                'code' => 'INVALID_CODE',
                'message' => 'Kode lisensi tidak ditemukan. Periksa kembali kode Anda.'
            ];
        }
        
        if ($code_data['status'] === 'active') {
            $conn->rollback();
            return [
                'success' => false,
                'code' => 'CODE_USED',
                'message' => 'Kode lisensi sudah digunakan. Hubungi support jika ini adalah kesalahan.'
            ];
        }
        
        if ($code_data['status'] === 'revoked') {
            $conn->rollback();
            return [
                'success' => false,
                'code' => 'CODE_REVOKED',
                'message' => 'Kode lisensi telah dibatalkan. Hubungi support@calius.digital'
            ];
        }
        
        // 2. Check if HWID already has an active license
        $stmt = $conn->prepare("
            SELECT license_type, license_code 
            FROM licenses 
            WHERE hwid = ? AND license_type IN ('personal', 'agency')
        ");
        $stmt->bind_param('s', $hwid);
        $stmt->execute();
        $result = $stmt->get_result();
        $existing_license = $result->fetch_assoc();
        $stmt->close();
        
        if ($existing_license) {
            $conn->rollback();
            return [
                'success' => false,
                'code' => 'ALREADY_ACTIVATED',
                'message' => 'Perangkat ini sudah memiliki lisensi aktif (' . $existing_license['license_type'] . ')'
            ];
        }
        
        // 3. Update license_codes table (mark as active)
        $stmt = $conn->prepare("
            UPDATE license_codes 
            SET status = 'active',
                activated_by_hwid = ?,
                activated_by_email = ?,
                activated_at = CURRENT_TIMESTAMP
            WHERE license_code = ?
        ");
        $stmt->bind_param('sss', $hwid, $email, $license_code);
        $stmt->execute();
        $stmt->close();
        
        // 4. Update or create license in licenses table
        $license_type = $code_data['license_type'];
        
        $stmt = $conn->prepare("
            INSERT INTO licenses 
            (hwid, license_type, email, license_code, activated_at, videos_used, videos_remaining, payment_status, payment_amount) 
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 0, -1, 'paid', ?)
            ON DUPLICATE KEY UPDATE
                license_type = VALUES(license_type),
                email = VALUES(email),
                license_code = VALUES(license_code),
                activated_at = CURRENT_TIMESTAMP,
                videos_remaining = -1,
                payment_status = 'paid',
                payment_amount = VALUES(payment_amount),
                updated_at = CURRENT_TIMESTAMP
        ");
        
        $payment_amount = ($license_type === 'personal') ? PRICE_PERSONAL : PRICE_AGENCY;
        $stmt->bind_param('ssssd', $hwid, $license_type, $email, $license_code, $payment_amount);
        $stmt->execute();
        $stmt->close();
        
        // 5. Commit transaction
        $conn->commit();
        
        return [
            'success' => true,
            'code' => 'SUCCESS',
            'message' => 'Lisensi ' . ucfirst($license_type) . ' berhasil diaktivasi! 🎉'
        ];
        
    } catch (Exception $e) {
        $conn->rollback();
        error_log("License activation failed: " . $e->getMessage());
        return [
            'success' => false,
            'code' => 'SERVER_ERROR',
            'message' => 'Terjadi kesalahan server. Silakan coba lagi.'
        ];
    }
}

/**
 * Update License Usage
 * @param string $hwid
 * @param string $video_url
 * @return bool Success status
 */
function update_license_usage($hwid, $video_url) {
    $conn = get_db_connection();
    if (!$conn) return false;
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Update license counter
        $stmt = $conn->prepare("
            UPDATE licenses 
            SET videos_used = videos_used + 1,
                videos_remaining = CASE 
                    WHEN license_type = 'trial' THEN GREATEST(videos_remaining - 1, 0)
                    ELSE -1 
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE hwid = ?
        ");
        $stmt->bind_param('s', $hwid);
        $stmt->execute();
        $stmt->close();
        
        // Log usage
        $ip = get_client_ip();
        $stmt = $conn->prepare("
            INSERT INTO usage_logs (hwid, video_url, processing_status, ip_address) 
            VALUES (?, ?, 'success', ?)
        ");
        $stmt->bind_param('sss', $hwid, $video_url, $ip);
        $stmt->execute();
        $stmt->close();
        
        $conn->commit();
        return true;
        
    } catch (Exception $e) {
        $conn->rollback();
        error_log("Update license usage failed: " . $e->getMessage());
        return false;
    }
}

/**
 * Check if License Expired
 * @param array $license
 * @return bool
 */
function is_license_expired($license) {
    if ($license['expires_at'] === null) {
        return false; // Lifetime license
    }
    
    return strtotime($license['expires_at']) < time();
}

/**
 * Format License Response
 * @param array $license
 * @return array
 */
function format_license_response($license) {
    $is_paid = in_array($license['license_type'], ['personal', 'agency']);
    
    return [
        'status' => $license['license_type'],
        'videos_used' => (int)$license['videos_used'],
        'videos_remaining' => $is_paid ? -1 : (int)$license['videos_remaining'],
        'license_type' => $license['license_type'],
        'expires_at' => $license['expires_at'],
        'is_expired' => is_license_expired($license),
        'created_at' => $license['created_at']
    ];
}
?>
