<?php
/**
 * ClipPremium Update Check API
 * Semi-Automatic Update System
 * 
 * Endpoints:
 *   GET /api/update-check.php?action=check&current_version=3.4.3
 *   GET /api/update-check.php?action=download&version=3.4.4
 * 
 * Version: 1.0.0
 */

// Security Headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-cache, must-revalidate');

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Load version info
$versionFile = __DIR__ . '/version.json';
if (!file_exists($versionFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Version info not available']);
    exit;
}

$versionData = json_decode(file_get_contents($versionFile), true);
if (!$versionData) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid version data']);
    exit;
}

// Get action
$action = isset($_GET['action']) ? $_GET['action'] : 'check';

switch ($action) {
    case 'check':
        handleCheckUpdate($versionData);
        break;
    
    case 'download':
        handleDownloadInfo($versionData);
        break;
    
    case 'changelog':
        handleChangelog($versionData);
        break;
    
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        exit;
}

/**
 * Handle update check request
 */
function handleCheckUpdate($versionData) {
    $currentVersion = isset($_GET['current_version']) ? $_GET['current_version'] : '0.0.0';
    $hwid = isset($_GET['hwid']) ? $_GET['hwid'] : '';
    
    // Parse versions for comparison
    $latestVersion = $versionData['version'];
    
    // Compare versions
    $updateAvailable = version_compare($latestVersion, $currentVersion, '>');
    
    // Check if current version is too old (below min_version_required)
    $minRequired = isset($versionData['min_version_required']) ? $versionData['min_version_required'] : '1.0.0';
    $forceUpdate = version_compare($currentVersion, $minRequired, '<');
    
    // Log check (for analytics)
    logUpdateCheck($currentVersion, $hwid, $updateAvailable);
    
    // Build response
    $response = [
        'status' => 'success',
        'update_available' => $updateAvailable,
        'force_update' => $forceUpdate,
        'current_version' => $currentVersion,
        'latest_version' => $latestVersion,
        'is_critical' => $versionData['is_critical'] ?? false,
        'release_date' => $versionData['release_date'] ?? '',
        'download_url' => $versionData['download_url'] ?? '',
        'download_size_mb' => $versionData['download_size_mb'] ?? 0,
        'changelog' => $versionData['changelog'] ?? '',
        'update_notes' => $versionData['update_notes'] ?? null,
        'checked_at' => date('c')
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

/**
 * Handle download info request
 */
function handleDownloadInfo($versionData) {
    $requestedVersion = isset($_GET['version']) ? $_GET['version'] : $versionData['version'];
    $type = isset($_GET['type']) ? $_GET['type'] : 'installer'; // installer or portable
    
    $files = $versionData['files'] ?? [];
    $fileInfo = $files[$type] ?? $files['installer'] ?? null;
    
    if (!$fileInfo) {
        http_response_code(404);
        echo json_encode(['error' => 'Download not found']);
        exit;
    }
    
    $response = [
        'status' => 'success',
        'version' => $versionData['version'],
        'type' => $type,
        'filename' => $fileInfo['filename'],
        'download_url' => $fileInfo['url'],
        'size_mb' => $fileInfo['size_mb'],
        'sha256' => $fileInfo['sha256'] ?? '',
        'instructions' => [
            'step1' => 'Download file installer',
            'step2' => 'Tutup ClipPremium jika sedang berjalan',
            'step3' => 'Jalankan installer',
            'step4' => 'Ikuti wizard instalasi',
            'step5' => 'Buka ClipPremium versi baru'
        ]
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

/**
 * Handle changelog request
 */
function handleChangelog($versionData) {
    $format = isset($_GET['format']) ? $_GET['format'] : 'text'; // text or html
    
    $response = [
        'status' => 'success',
        'version' => $versionData['version'],
        'release_date' => $versionData['release_date'],
        'changelog' => $format === 'html' 
            ? ($versionData['changelog_html'] ?? $versionData['changelog']) 
            : $versionData['changelog'],
        'update_notes' => $versionData['update_notes'] ?? null
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

/**
 * Log update check for analytics
 */
function logUpdateCheck($currentVersion, $hwid, $updateAvailable) {
    $logDir = __DIR__ . '/../data/';
    $logFile = $logDir . 'update_checks.log';
    
    // Create directory if not exists
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    $logEntry = sprintf(
        "[%s] IP: %s | Version: %s | HWID: %s | Update: %s | UA: %s\n",
        date('Y-m-d H:i:s'),
        $ip,
        $currentVersion,
        substr($hwid, 0, 16) . '...',
        $updateAvailable ? 'YES' : 'NO',
        substr($userAgent, 0, 50)
    );
    
    @file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}
