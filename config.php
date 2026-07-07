<?php
/**
 * ============================================================
 * Ayaan Mart BD - Configuration File
 * ============================================================
 * এই ফাইলটি PHP + MySQL ভার্সনের জন্য (database.sql এর সাথে ব্যবহৃত হয়)।
 * cPanel শেয়ার্ড হোস্টিং এ ডিপ্লয় করার সময় এই কনফিগারেশন ব্যবহার করুন।
 *
 * বি.দ্র: বর্তমানে লাইভ থাকা ওয়েবসাইটটি Next.js + PostgreSQL দিয়ে
 * তৈরি এবং এটি ".env" ফাইল থেকে DATABASE_URL রিড করে।
 * এই config.php শুধুমাত্র PHP/MySQL ভার্সনের জন্য ব্যবহার করা হবে।
 * ============================================================
 */

// ---------------------------------------------
// Error Reporting (Development only - Production এ বন্ধ রাখুন)
// ---------------------------------------------
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ---------------------------------------------
// Database Configuration (MySQL)
// ---------------------------------------------
define('DB_HOST', 'localhost');
define('DB_NAME', 'yourcpanel_ayaan_mart_db');   // ← cPanel এ তৈরি করা ডাটাবেজের নাম দিন
define('DB_USER', 'yourcpanel_ayaan_user');      // ← cPanel ডাটাবেজ ইউজারনেম দিন
define('DB_PASS', 'your_strong_password_here');  // ← cPanel ডাটাবেজ পাসওয়ার্ড দিন
define('DB_CHARSET', 'utf8mb4');

// ---------------------------------------------
// Database Connection (mysqli - PDO ও ব্যবহার করা যাবে)
// ---------------------------------------------
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $conn->set_charset(DB_CHARSET);

    if ($conn->connect_error) {
        die('ডাটাবেজ কানেকশন ব্যর্থ হয়েছে: ' . $conn->connect_error);
    }
} catch (Exception $e) {
    die('ডাটাবেজ এরর: ' . $e->getMessage());
}

// ---------------------------------------------
// Site Configuration
// ---------------------------------------------
define('SITE_NAME', 'Ayaan Mart BD');
define('SITE_TAGLINE', 'আপনার বিশ্বস্ত অনলাইন শপ');
define('SITE_URL', 'https://yourdomain.com/');          // ← আপনার ডোমেইন দিন
define('ADMIN_URL', SITE_URL . 'admin/');
define('UPLOAD_URL', SITE_URL . 'uploads/');
define('UPLOAD_PATH', __DIR__ . '/uploads/');

// ---------------------------------------------
// Currency & Locale
// ---------------------------------------------
define('CURRENCY_SYMBOL', '৳');
define('CURRENCY_CODE', 'BDT');
define('DEFAULT_TIMEZONE', 'Asia/Dhaka');
date_default_timezone_set(DEFAULT_TIMEZONE);

// ---------------------------------------------
// Contact Information
// ---------------------------------------------
define('CONTACT_PHONE', '+8801911602590');
define('CONTACT_EMAIL', 'info@ayaanmartbd.com');
define('CONTACT_ADDRESS', 'Aftabnagar, Badda, Dhaka, Bangladesh');
define('WHATSAPP_NUMBER', '+8801911602590');

// ---------------------------------------------
// Payment Numbers (Manual bKash / Nagad / Rocket)
// ---------------------------------------------
define('BKASH_NUMBER', '01911602590');
define('NAGAD_NUMBER', '01911602590');
define('ROCKET_NUMBER', '01911602590');

// ---------------------------------------------
// Delivery Charges
// ---------------------------------------------
define('DELIVERY_INSIDE_DHAKA', 60);
define('DELIVERY_OUTSIDE_DHAKA', 120);

// ---------------------------------------------
// Theme Colors (Admin Panel থেকে পরিবর্তনযোগ্য)
// ---------------------------------------------
define('PRIMARY_COLOR', '#dc2626');
define('SECONDARY_COLOR', '#059669');

// ---------------------------------------------
// Social Media Links
// ---------------------------------------------
define('FACEBOOK_URL', 'https://facebook.com/ayaanmartbd');
define('INSTAGRAM_URL', 'https://instagram.com/ayaanmartbd');
define('YOUTUBE_URL', 'https://youtube.com/@ayaanmartbd');

// ---------------------------------------------
// Security Keys
// ---------------------------------------------
define('JWT_SECRET', 'change_this_to_a_long_random_secret_key');
define('CSRF_SECRET', 'change_this_to_another_random_secret_key');
define('PASSWORD_RESET_EXPIRY', 3600); // 1 hour in seconds
define('OTP_EXPIRY', 600);             // 10 minutes in seconds

// ---------------------------------------------
// OTP / SMS Gateway Configuration
// ---------------------------------------------
// Mobile OTP is the primary verification channel.
// একই OTP মোবাইল এবং ইমেইল দুই জায়গাতেই পাঠানো হবে,
// কিন্তু ভেরিফিকেশন শুধুমাত্র মোবাইল OTP দিয়ে সম্পন্ন হবে।
define('SMS_GATEWAY_API_URL', 'https://your-sms-provider.com/api/send');  // ← আপনার SMS গেটওয়ে URL দিন
define('SMS_GATEWAY_API_KEY', 'your_sms_api_key_here');                   // ← SMS গেটওয়ে API Key দিন
define('SMS_GATEWAY_SENDER_ID', 'AyaanMart');

// ---------------------------------------------
// Email (SMTP) Configuration - Login Alert & OTP Email
// ---------------------------------------------
define('SMTP_HOST', 'smtp.yourhost.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'info@ayaanmartbd.com');
define('SMTP_PASSWORD', 'your_email_password_here');
define('SMTP_FROM_EMAIL', 'info@ayaanmartbd.com');
define('SMTP_FROM_NAME', SITE_NAME);
define('SMTP_ENCRYPTION', 'tls');

// ---------------------------------------------
// Session Configuration
// ---------------------------------------------
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ---------------------------------------------
// Helper Functions
// ---------------------------------------------

/**
 * XSS Protection - Sanitize output
 */
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * SQL Injection Protection - Escape input
 */
function escape($conn, $data) {
    return mysqli_real_escape_string($conn, trim($data));
}

/**
 * Format price with BDT currency symbol
 */
function formatPrice($price) {
    return CURRENCY_SYMBOL . number_format((float)$price, 0);
}

/**
 * Generate CSRF Token
 */
function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF Token
 */
function verifyCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Generate a random numeric OTP (used for both mobile & email — same code)
 */
function generateOTP($length = 6) {
    $min = pow(10, $length - 1);
    $max = pow(10, $length) - 1;
    return (string) random_int($min, $max);
}

/**
 * Generate unique order number
 */
function generateOrderNumber() {
    return 'AMBD' . date('Ymd') . rand(1000, 9999);
}

/**
 * Check if admin is logged in
 */
function isAdminLoggedIn() {
    return isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);
}

/**
 * Check if customer is logged in
 */
function isCustomerLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Redirect helper
 */
function redirect($path) {
    header('Location: ' . SITE_URL . $path);
    exit;
}
?>
