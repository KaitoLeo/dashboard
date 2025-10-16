CREATE DATABASE  IF NOT EXISTS `m-fit` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `m-fit`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: m-fit
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `viettel_config`
--

DROP TABLE IF EXISTS `viettel_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viettel_config` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `location_id` bigint unsigned NOT NULL,
  `supplier_tax_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seller_legal_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seller_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `seller_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seller_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seller_fax` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seller_website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seller_bank_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seller_bank_account` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `template_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_series` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `currency_code` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VND',
  `api_base_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token` text COLLATE utf8mb4_unicode_ci,
  `token_expires_at` datetime DEFAULT NULL,
  `payment_strategy` enum('FULL_PAYMENT_ONLY','EACH_PAYMENT','CONFIGURABLE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FULL_PAYMENT_ONLY',
  `auto_issue_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `require_customer_info` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_tested_at` datetime DEFAULT NULL,
  `test_result` enum('SUCCESS','FAILED','NOT_TESTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NOT_TESTED',
  `test_error_message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `viettel_config_location_id_unique` (`location_id`),
  KEY `idx_supplier_tax_code` (`supplier_tax_code`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `viettel_config_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-01  8:43:15
