<?php
/**
 * ClipPremium Download Handler - Ultra Compatible
 * Version: 2.1.0 - Shared Hosting Edition
 */

// Disable error display (log only)
@ini_set('display_errors', '0');
@error_reporting(0);

// Try to increase limits (may fail on shared hosting - that's OK)
@set_time_limit(0);
@ini_set('memory_limit', '512M');
@ini_set('max_execution_time', '0');

// Only send headers if not already sent
if (!headers_sent()) {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
}

// Handle OPTIONS
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simple path detection
$baseDir = dirname(__FILE__);
$downloadsPath = $baseDir . '/../downloads/clip-premium/';

// Check if path exists, if not try alternative
if (!is_dir($downloadsPath)) {
    // Try alternative paths
    $altPaths = array(
        $baseDir . '/../downloads/clip/',
        $baseDir . '/../downloads/'
    );
    foreach ($altPaths as $path) {
        if (is_dir($path)) {
            $downloadsPath = $path;
            break;
        }
    }
}

define('DOWNLOADS_DIR', $downloadsPath);
define('LOG_FILE', $baseDir . '/../data/downloads.log');
define('DEBUG_MODE', false);

// Allowed files
$ALLOWED_FILES = array(
    // v3.4.4 LITE (Current Release - Cloud-based transcription)
    'ClipPremium_LITE_v3.4.4.exe' => array(
        'mime' => 'application/octet-stream',
        'description' => 'ClipPremium LITE v3.4.4 - Cloud-based transcription (75 MB)'
    ),
    // v3.2.2 (Legacy)
    'ClipPremium_v3.2.2_Setup.exe' => array(
        'mime' => 'application/octet-stream',
        'description' => 'ClipPremium Setup Installer (Legacy)'
    ),
    'ClipPremium_v3.2.2.bat' => array(
        'mime' => 'application/octet-stream',
        'description' => 'ClipPremium Portable Launcher'
    ),
    'ClipPremium_v3.2.2_Portable.zip' => array(
        'mime' => 'application/zip',
        'description' => 'ClipPremium Portable Edition'
    )
);

/**
 * Simple logging function
 */
function logDownload($filename, $ip, $status) {
    $logEntry = date('Y-m-d H:i:s') . " | IP: $ip | File: $filename | Status: $status\n";
    @file_put_contents(LOG_FILE, $logEntry, FILE_APPEND);
}

/**
 * Get client IP - simple version
 */
function getClientIP() {
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    if (isset($_SERVER['REMOTE_ADDR'])) {
        return $_SERVER['REMOTE_ADDR'];
    }
    return 'unknown';
}

/**
 * Send file download - simple and compatible
 */
function sendFile($filepath, $filename, $mimeType) {
    // Check file exists
    if (!file_exists($filepath)) {
        http_response_code(404);
        die(json_encode(array('error' => 'File not found on server')));
    }
    
    if (!is_readable($filepath)) {
        http_response_code(403);
        die(json_encode(array('error' => 'Cannot read file')));
    }
    
    // Get file size
    $filesize = @filesize($filepath);
    
    // Clear any output
    if (ob_get_level()) {
        ob_end_clean();
    }
    
    // Send headers
    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . $filesize);
    header('Content-Transfer-Encoding: binary');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    
    // Read and output file
    $handle = fopen($filepath, 'rb');
    if ($handle === false) {
        die(json_encode(array('error' => 'Cannot open file')));
    }
    
    // Stream in 8KB chunks (most compatible)
    while (!feof($handle)) {
        echo fread($handle, 8192);
        flush();
    }
    
    fclose($handle);
    exit;
}

// Main logic - Simple and compatible
$requestedFile = isset($_GET['file']) ? $_GET['file'] : '';

// Check if file parameter exists
if (empty($requestedFile)) {
    http_response_code(400);
    die(json_encode(array('error' => 'File parameter required')));
}

// Sanitize filename
$requestedFile = basename($requestedFile);

// Check if file is allowed
if (!isset($ALLOWED_FILES[$requestedFile])) {
    logDownload($requestedFile, getClientIP(), 'not_allowed');
    http_response_code(404);
    die(json_encode(array('error' => 'File not allowed')));
}

// Build file path
$filepath = DOWNLOADS_DIR . $requestedFile;

// Check file exists
if (!file_exists($filepath)) {
    // Try alternate locations
    $altPaths = array(
        dirname(__FILE__) . '/../downloads/' . $requestedFile,
        dirname(__FILE__) . '/../downloads/clip-premium/' . $requestedFile
    );
    
    $found = false;
    foreach ($altPaths as $altPath) {
        if (file_exists($altPath)) {
            $filepath = $altPath;
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        logDownload($requestedFile, getClientIP(), 'not_found');
        http_response_code(404);
        
        if (DEBUG_MODE) {
            die(json_encode(array(
                'error' => 'File not found',
                'path' => $filepath,
                'dir_exists' => is_dir(DOWNLOADS_DIR),
                'files' => is_dir(DOWNLOADS_DIR) ? scandir(DOWNLOADS_DIR) : array()
            )));
        } else {
            die(json_encode(array('error' => 'File not found')));
        }
    }
}

// Log successful request
logDownload($requestedFile, getClientIP(), 'success');

// Get file info
$fileInfo = $ALLOWED_FILES[$requestedFile];

// Send file
sendFile($filepath, $requestedFile, $fileInfo['mime']);
