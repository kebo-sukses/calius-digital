<?php
// Copy this file to smtp-config.php and fill in your SMTP credentials.
// Place smtp-config.php in the same folder as send-contact.php (api/).

// SMTP server host (e.g., mail.calius.digital or calius.digital)
define('SMTP_HOST', 'mail.calius.digital');

// SMTP port — use 465 for SSL, 587 for TLS
define('SMTP_PORT', 465);

// SMTP encryption: 'ssl' or 'tls'
define('SMTP_SECURE', 'ssl');

// SMTP auth username and password
define('SMTP_USER', 'admin@calius.digital');
define('SMTP_PASS', 'your-email-password-here');

// Optional: set to true to enable verbose PHPMailer debugging (don't enable on production)
// define('SMTP_DEBUG', 0);

?>
