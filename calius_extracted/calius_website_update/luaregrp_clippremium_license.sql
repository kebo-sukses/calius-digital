-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 08, 2026 at 10:10 PM
-- Server version: 11.4.9-MariaDB-cll-lve-log
-- PHP Version: 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `luaregrp_clippremium_license`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_requests`
--

CREATE TABLE `api_requests` (
  `id` int(11) NOT NULL,
  `hwid` varchar(32) DEFAULT NULL COMMENT 'Hardware ID (if available)',
  `endpoint` varchar(100) NOT NULL COMMENT 'API endpoint called',
  `ip_address` varchar(45) NOT NULL COMMENT 'Request IP',
  `user_agent` varchar(255) DEFAULT NULL COMMENT 'User agent string',
  `request_method` varchar(10) NOT NULL DEFAULT 'POST' COMMENT 'HTTP method',
  `request_data` text DEFAULT NULL COMMENT 'Request payload (JSON)',
  `response_code` int(11) DEFAULT NULL COMMENT 'HTTP response code',
  `response_time_ms` int(11) DEFAULT NULL COMMENT 'Response time in milliseconds',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Request timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='API access logs';

--
-- Dumping data for table `api_requests`
--

INSERT INTO `api_requests` (`id`, `hwid`, `endpoint`, `ip_address`, `user_agent`, `request_method`, `request_data`, `response_code`, `response_time_ms`, `created_at`) VALUES
(1, 'test888777666555444333222111000', '/license/check', '182.9.34.11', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'POST', '{\"version\":\"3.2.2\",\"hwid\":\"test888777666555444333222111000\"}', 400, 0, '2026-01-08 04:10:16'),
(2, 'test888777666555444333222111000', '/license/check', '182.9.34.11', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'POST', '{\"version\":\"3.2.2\",\"hwid\":\"test888777666555444333222111000\"}', 400, 0, '2026-01-08 04:14:32'),
(3, '88877766655544433322211100AABBCC', '/license/check', '182.9.34.11', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'POST', '{\"version\":\"3.2.2\",\"hwid\":\"88877766655544433322211100AABBCC\"}', 200, 3, '2026-01-08 04:14:46'),
(4, '88877766655544433322211100AABBCC', '/license/increment', '182.9.34.11', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'POST', '{\"hwid\":\"88877766655544433322211100AABBCC\",\"video_url\":\"https:\\/\\/youtube.com\\/watch?v=test123\"}', 200, 4, '2026-01-08 04:14:59');

-- --------------------------------------------------------

--
-- Table structure for table `licenses`
--

CREATE TABLE `licenses` (
  `hwid` varchar(32) NOT NULL COMMENT 'Hardware ID (SHA256, 32 chars)',
  `license_type` enum('trial','personal','agency','blocked') NOT NULL DEFAULT 'trial' COMMENT 'License tier',
  `videos_used` int(11) NOT NULL DEFAULT 0 COMMENT 'Total videos processed',
  `videos_remaining` int(11) NOT NULL DEFAULT 5 COMMENT 'Remaining video quota',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'First seen',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last activity',
  `expires_at` timestamp NULL DEFAULT NULL COMMENT 'License expiration (NULL = lifetime)',
  `email` varchar(255) DEFAULT NULL COMMENT 'User email (optional)',
  `payment_status` varchar(50) NOT NULL DEFAULT 'unpaid' COMMENT 'Payment status',
  `payment_amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Paid amount (IDR)',
  `payment_date` timestamp NULL DEFAULT NULL COMMENT 'Payment timestamp',
  `notes` text DEFAULT NULL COMMENT 'Admin notes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='License management';

--
-- Dumping data for table `licenses`
--

INSERT INTO `licenses` (`hwid`, `license_type`, `videos_used`, `videos_remaining`, `created_at`, `updated_at`, `expires_at`, `email`, `payment_status`, `payment_amount`, `payment_date`, `notes`) VALUES
('88877766655544433322211100AABBCC', 'trial', 1, 4, '2026-01-08 04:14:46', '2026-01-08 04:14:59', NULL, NULL, 'unpaid', 0.00, NULL, NULL),
('demo123456789abcdef0123456789ab', 'personal', 15, -1, '2026-01-08 02:24:27', '2026-01-08 02:50:34', NULL, 'demo@calius.digital', 'unpaid', 0.00, NULL, 'Demo personal license (unlimited)'),
('test123456789abcdef0123456789ab', 'trial', 0, 5, '2026-01-08 02:24:27', '2026-01-08 02:50:34', NULL, 'test@example.com', 'unpaid', 0.00, NULL, 'Test trial license');

-- --------------------------------------------------------

--
-- Table structure for table `usage_logs`
--

CREATE TABLE `usage_logs` (
  `id` int(11) NOT NULL,
  `hwid` varchar(32) NOT NULL COMMENT 'Hardware ID',
  `video_url` varchar(500) NOT NULL COMMENT 'YouTube video URL',
  `processed_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Processing timestamp',
  `processing_status` enum('success','failed','pending') NOT NULL DEFAULT 'success' COMMENT 'Processing result',
  `error_message` text DEFAULT NULL COMMENT 'Error details if failed',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'User IP address'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Video processing logs';

--
-- Dumping data for table `usage_logs`
--

INSERT INTO `usage_logs` (`id`, `hwid`, `video_url`, `processed_at`, `processing_status`, `error_message`, `ip_address`) VALUES
(1, '88877766655544433322211100AABBCC', 'https://youtube.com/watch?v=test123', '2026-01-08 04:14:59', 'success', NULL, '182.9.34.11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_requests`
--
ALTER TABLE `api_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hwid` (`hwid`),
  ADD KEY `idx_endpoint` (`endpoint`),
  ADD KEY `idx_ip_address` (`ip_address`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_response_code` (`response_code`);

--
-- Indexes for table `licenses`
--
ALTER TABLE `licenses`
  ADD PRIMARY KEY (`hwid`),
  ADD KEY `idx_license_type` (`license_type`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_payment_status` (`payment_status`);

--
-- Indexes for table `usage_logs`
--
ALTER TABLE `usage_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hwid` (`hwid`),
  ADD KEY `idx_processed_at` (`processed_at`),
  ADD KEY `idx_status` (`processing_status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_requests`
--
ALTER TABLE `api_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usage_logs`
--
ALTER TABLE `usage_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `usage_logs`
--
ALTER TABLE `usage_logs`
  ADD CONSTRAINT `usage_logs_ibfk_1` FOREIGN KEY (`hwid`) REFERENCES `licenses` (`hwid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
