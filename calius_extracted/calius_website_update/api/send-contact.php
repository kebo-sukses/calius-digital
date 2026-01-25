<?php
header('Content-Type: application/json; charset=utf-8');

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Simple helper to get POST value safely
function get_post($key) {
    return isset($_POST[$key]) ? trim($_POST[$key]) : '';
}

$firstName = strip_tags(get_post('firstName'));
$lastName = strip_tags(get_post('lastName'));
$email = filter_var(get_post('email'), FILTER_SANITIZE_EMAIL);
$subject = strip_tags(get_post('subject')) ?: 'Website Contact Form';
$message = strip_tags(get_post('message'));

if (empty($firstName) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address']);
    exit;
}

// Protect against header injection
$clean_email = str_replace(["\r", "\n"], '', $email);
$clean_first = str_replace(["\r", "\n"], '', $firstName);
$clean_last = str_replace(["\r", "\n"], '', $lastName);

$to = 'admin@calius.digital';
$mail_subject = '[Contact] ' . ($subject ?: 'Website Contact');

$body = "You have received a new message from the website contact form:\n\n";
$body .= "Name: " . $clean_first . ' ' . $clean_last . "\n";
$body .= "Email: " . $clean_email . "\n";
$body .= "Subject: " . $subject . "\n\n";
$body .= "Message:\n" . $message . "\n";

$headers = [];
// Do not set an explicit From header — allow the MTA/SMTP server to use the
// authenticated envelope sender. Keep Reply-To so replies still go to user.
$headers[] = 'Reply-To: ' . $clean_email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

// Try using PHPMailer + SMTP if configured, otherwise fallback to mail()
$sent = false;

// Load optional SMTP config if provided (create api/smtp-config.php with credentials)
$smtpConfigPath = __DIR__ . '/smtp-config.php';
$useSmtp = false;
if (file_exists($smtpConfigPath)) {
    include $smtpConfigPath; // should define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (ssl|tls) optionally
    $useSmtp = defined('SMTP_HOST') && defined('SMTP_USER') && defined('SMTP_PASS');
}

// If Composer autoload + PHPMailer available and SMTP configured, use it
$vendorAutoload = __DIR__ . '/../vendor/autoload.php';
if ($useSmtp && file_exists($vendorAutoload)) {
    require $vendorAutoload;
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        if (defined('SMTP_SECURE') && SMTP_SECURE) {
            $mail->SMTPSecure = SMTP_SECURE; // 'ssl' or 'tls'
        }
        if (defined('SMTP_PORT') && SMTP_PORT) {
            $mail->Port = SMTP_PORT;
        }

        // Recipients
        // Intentionally do NOT call setFrom() — let the SMTP server/authenticated
        // envelope sender be used. Add destination and reply-to so replies go to user.
        $mail->addAddress($to);
        $mail->addReplyTo($clean_email);

        // Content
        $mail->isHTML(false);
        $mail->Subject = $mail_subject;
        $mail->Body    = $body;

        $sent = $mail->send();
    } catch (Exception $e) {
        error_log('PHPMailer error: ' . $e->getMessage());
        $sent = false;
    }
} else {
    // Fallback to PHP mail()
    try {
        $sent = mail($to, $mail_subject, $body, implode("\r\n", $headers));
    } catch (Exception $e) {
        $sent = false;
    }
}

if ($sent) {
    echo json_encode(['ok' => true]);
    exit;
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to send email']);
    exit;
}

?>
