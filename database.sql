-- Ayaan Mart Database
-- Ayaan Mart BD - Complete E-Commerce Database
-- Version: 1.0
-- Created: 2025

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00";

-- --------------------------------------------------------
-- Database: `ayaan_mart_db`
-- --------------------------------------------------------

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT 0,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `email_otp` varchar(10) DEFAULT NULL,
  `mobile_otp` varchar(10) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_bn` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_bn` varchar(500) NOT NULL,
  `name_en` varchar(500) NOT NULL,
  `slug` varchar(500) NOT NULL,
  `description` text,
  `category_id` int(11) NOT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `brand` varchar(200) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `regular_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sale_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_percent` int(11) NOT NULL DEFAULT 0,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `main_image` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive','out_of_stock') NOT NULL DEFAULT 'active',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_new_arrival` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  KEY `sub_category_id` (`sub_category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`sub_category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `product_images`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `orders`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `shipping_address` text NOT NULL,
  `city` varchar(100) NOT NULL DEFAULT 'Dhaka',
  `area` varchar(100) DEFAULT NULL,
  `delivery_type` enum('inside_dhaka','outside_dhaka') NOT NULL DEFAULT 'inside_dhaka',
  `delivery_charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `coupon_code` varchar(50) DEFAULT NULL,
  `coupon_discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_method` enum('cod','bkash','nagad','rocket') NOT NULL DEFAULT 'cod',
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(200) DEFAULT NULL,
  `order_status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `order_items`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(500) NOT NULL,
  `product_image` varchar(500) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `cart`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `wishlist`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `coupons`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `min_order_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `max_usage` int(11) NOT NULL DEFAULT 0,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `expiry_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `banners`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `image` varchar(500) NOT NULL,
  `link` varchar(500) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `reviews`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `settings`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `notifications`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('order','stock','info') NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `password_resets`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `delivery_areas`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `delivery_areas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('inside_dhaka','outside_dhaka') NOT NULL,
  `charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- INSERT SAMPLE DATA
-- --------------------------------------------------------

-- Insert Admin User (pre-verified, no OTP needed)
-- Password: admin123 (bcrypt hash)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `address`, `city`, `area`, `is_blocked`, `is_verified`) VALUES
(1, 'Admin', 'admin@ayaanmart.shop', '+8801911602590', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Aftabnagar, Badda, Dhaka, Bangladesh', 'Dhaka', 'Badda', 0, 1);

-- Insert Demo Customer (pre-verified, no OTP needed)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `address`, `city`, `area`, `is_blocked`, `is_verified`) VALUES
(2, 'Demo Customer', 'demo@example.com', '+8801911602590', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'House 123, Road 5, Dhanmondi', 'Dhaka', 'Dhanmondi', 0, 1);

-- Insert Categories (Parent + Sub)
INSERT INTO `categories` (`id`, `name_bn`, `name_en`, `slug`, `icon`, `parent_id`, `sort_order`, `is_active`) VALUES
(1, 'ইলেকট্রনিক্স', 'Electronics', 'electronics', 'fa-mobile-alt', NULL, 1, 1),
(2, 'ফ্যাশন ও কাপড়', 'Fashion & Clothing', 'fashion-clothing', 'fa-tshirt', NULL, 2, 1),
(3, 'ঘর ও রান্নাঘর', 'Home & Kitchen', 'home-kitchen', 'fa-home', NULL, 3, 1),
(4, 'স্বাস্থ্য ও সৌন্দর্য', 'Health & Beauty', 'health-beauty', 'fa-heart', NULL, 4, 1),
(5, 'মুদি ও খাবার', 'Grocery & Food', 'grocery-food', 'fa-shopping-basket', NULL, 5, 1),

-- Sub Categories
(6, 'মোবাইল ফোন', 'Mobile Phones', 'mobile-phones', 'fa-mobile', 1, 1, 1),
(7, 'ল্যাপটপ ও কম্পিউটার', 'Laptops & Computers', 'laptops-computers', 'fa-laptop', 1, 2, 1),
(8, 'ইয়ারবাড ও হেডফোন', 'Earbuds & Headphones', 'earbuds-headphones', 'fa-headphones', 1, 3, 1),
(9, 'পুরুষদের ফ্যাশন', 'Mens Fashion', 'mens-fashion', 'fa-male', 2, 1, 1),
(10, 'মহিলাদের ফ্যাশন', 'Womens Fashion', 'womens-fashion', 'fa-female', 2, 2, 1),
(11, 'রান্নাঘরের সরঞ্জাম', 'Kitchen Appliances', 'kitchen-appliances', 'fa-blender', 3, 1, 1),
(12, 'শিশুদের ফ্যাশন', 'Kids Fashion', 'kids-fashion', 'fa-child', 2, 3, 1);

-- Insert Products
INSERT INTO `products` (`id`, `name_bn`, `name_en`, `slug`, `description`, `category_id`, `sub_category_id`, `brand`, `sku`, `regular_price`, `sale_price`, `discount_percent`, `stock_quantity`, `main_image`, `status`, `is_featured`, `is_new_arrival`, `is_active`) VALUES
(1, 'স্যামসাং গ্যালাক্সি A15', 'Samsung Galaxy A15', 'samsung-galaxy-a15', '<p>Samsung Galaxy A15 4G - 6GB RAM, 128GB Storage, 6.5 inch Display, 50MP Camera. Original Samsung product with official warranty in Bangladesh.</p><ul><li>Super AMOLED Display</li><li>MediaTek Helio G99 Processor</li><li>5000mAh Battery</li><li>6GB RAM + 128GB Storage</li><li>50MP Main Camera</li></ul>', 1, 6, 'Samsung', 'SAM-A15-128', 18990.00, 15990.00, 16, 25, 'uploads/products/samsung-a15.jpg', 'active', 1, 1, 1),

(2, 'রেডমি নোট ১৩', 'Redmi Note 13', 'redmi-note-13', '<p>Xiaomi Redmi Note 13 - 8GB RAM, 256GB Storage, 108MP Camera. Best budget smartphone in Bangladesh.</p><ul><li>6.67 inch AMOLED Display</li><li>Snapdragon 685 Processor</li><li>5000mAh Battery, 33W Fast Charging</li><li>108MP Triple Camera</li></ul>', 1, 6, 'Xiaomi', 'RED-N13-256', 22990.00, 19490.00, 15, 18, 'uploads/products/redmi-note13.jpg', 'active', 1, 0, 1),

(3, 'টি-শার্ট পুরুষদের কটন', 'Men\'s Cotton T-Shirt', 'mens-cotton-tshirt', '<p>Premium quality 100% cotton t-shirt for men. Available in multiple colors (Black, White, Navy, Gray). Comfortable fit for daily wear.</p><ul><li>100% Cotton</li><li>Machine Washable</li><li>Available Sizes: M, L, XL, XXL</li><li>Made in Bangladesh</li></ul>', 2, 9, 'Local Brand', 'MTS-001', 899.00, 499.00, 44, 150, 'uploads/products/cotton-tshirt.jpg', 'active', 1, 1, 1),

(4, 'শাড়ি জামদানি ডিজাইন', 'Jamdani Design Saree', 'jamdani-design-saree', '<p>Beautiful traditional Jamdani saree. Hand-woven design, premium cotton fabric. Perfect for weddings, parties, and festivals.</p><ul><li>Hand-woven Jamdani</li><li>Premium Cotton</li><li>Length: 6 Yards</li><li>With Blouse Piece</li></ul>', 2, 10, 'Aarong', 'SAR-JMD-001', 3500.00, 2800.00, 20, 30, 'uploads/products/jamdani-saree.jpg', 'active', 1, 0, 1),

(5, 'ব্লুটুথ ইয়ারবাড TWS', 'Bluetooth TWS Earbuds', 'bluetooth-tws-earbuds', '<p>Premium TWS Bluetooth earbuds with noise cancellation. 24 hours battery life, IPX5 waterproof.</p><ul><li>Bluetooth 5.3</li><li>Active Noise Cancellation</li><li>24h Battery with Case</li><li>IPX5 Waterproof</li><li>Touch Control</li></ul>', 1, 8, 'Baseus', 'EAR-TWS-001', 2500.00, 1299.00, 48, 75, 'uploads/products/tws-earbuds.jpg', 'active', 1, 1, 1),

(6, 'নন-স্টিক ফ্রাইং প্যান সেট (৩ পিস)', 'Non-Stick Frying Pan Set (3 Pcs)', 'non-stick-frying-pan-set', '<p>Premium non-stick frying pan set. Granite coating, induction compatible. Heat-resistant handles.</p><ul><li>3 Pieces: 20cm, 24cm, 28cm</li><li>Granite Non-Stick Coating</li><li>Induction Compatible</li><li>Dishwasher Safe</li></ul>', 3, 11, 'Munaz', 'PAN-NS-003', 2800.00, 1999.00, 29, 40, 'uploads/products/frying-pan.jpg', 'active', 0, 1, 1),

(7, 'ফেসওয়াশ অ্যালোভেরা', 'Aloe Vera Face Wash', 'aloe-vera-face-wash', '<p>Natural aloe vera face wash for all skin types. Deep cleansing, moisturizing formula.</p><ul><li>150ml</li><li>Paraben-Free</li><li>Dermatologically Tested</li><li>For All Skin Types</li></ul>', 4, NULL, 'Himalaya', 'FW-ALO-150', 350.00, 280.00, 20, 200, 'uploads/products/face-wash.jpg', 'active', 0, 0, 1),

(8, 'বাসমতি চাল ৫ কেজি', 'Basmati Rice 5kg', 'basmati-rice-5kg', '<p>Premium quality Indian Basmati Rice. Extra long grain, aromatic. Perfect for biryani and pulao.</p><ul><li>5kg Pack</li><li>Extra Long Grain</li><li>Superior Aroma</li><li>Aged Rice</li></ul>', 5, NULL, 'India Gate', 'RIC-BAS-5KG', 1200.00, 950.00, 21, 500, 'uploads/products/basmati-rice.jpg', 'active', 0, 0, 1),

(9, 'ল্যাপটপ স্ট্যান্ড অ্যালুমিনিয়াম', 'Aluminum Laptop Stand', 'aluminum-laptop-stand', '<p>Ergonomic aluminum laptop stand. Adjustable height, foldable design. Compatible with all laptops 10-17 inches.</p><ul><li>Aluminum Alloy</li><li>6 Adjustable Heights</li><li>Foldable & Portable</li><li>Anti-Slip Silicone Pads</li></ul>', 1, 7, 'Baseus', 'LPS-ALU-001', 2200.00, 1499.00, 32, 60, 'uploads/products/laptop-stand.jpg', 'active', 1, 0, 1),

(10, 'পাঞ্জাবি ইদ কালেকশন', 'Eid Collection Panjabi', 'eid-collection-panjabi', '<p>Premium Eid special Panjabi for men. Cotton blend fabric, elegant design.</p><ul><li>Cotton Blend</li><li>Available Sizes: M-XXL</li><li>Multiple Colors</li><li>Made in Bangladesh</li></ul>', 2, 9, 'Ecstasy', 'PNJ-EID-001', 1800.00, 1200.00, 33, 80, 'uploads/products/panjabi.jpg', 'active', 1, 1, 1),

(11, 'শিশুদের ব্লেজার (কিডস ব্লেজার সেট)', 'Kids Blazer Suit Set', 'kids-blazer-suit-set', '<p>প্রিমিয়াম কোয়ালিটির শিশুদের ৩-পিস ব্লেজার সুট সেট। বিশেষ অনুষ্ঠান, পার্টি, ওয়েডিং ও ঈদের জন্য পারফেক্ট।</p><ul><li>উন্নত মানের ফেব্রিক</li><li>ব্লেজার + শার্ট + টাই সেট</li><li>Available Sizes: 2-10 বছর বয়সীদের জন্য</li><li>এলিগেন্ট গ্রে কালার ডিজাইন</li><li>আরামদায়ক ফিটিং</li></ul>', 2, 12, 'Ayaan Kids', 'KID-BLZ-001', 15000.00, 10000.00, 33, 20, 'uploads/products/kids-blazer.jpg', 'active', 1, 1, 1);

-- Insert Product Images
INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_main`, `sort_order`) VALUES
(1, 1, 'uploads/products/samsung-a15-1.jpg', 1, 1),
(2, 1, 'uploads/products/samsung-a15-2.jpg', 0, 2),
(3, 2, 'uploads/products/redmi-note13-1.jpg', 1, 1),
(4, 2, 'uploads/products/redmi-note13-2.jpg', 0, 2),
(5, 3, 'uploads/products/tshirt-1.jpg', 1, 1),
(6, 4, 'uploads/products/saree-1.jpg', 1, 1),
(7, 5, 'uploads/products/earbuds-1.jpg', 1, 1),
(8, 5, 'uploads/products/earbuds-2.jpg', 0, 2),
(9, 6, 'uploads/products/pan-set-1.jpg', 1, 1),
(10, 7, 'uploads/products/face-wash-1.jpg', 1, 1),
(11, 8, 'uploads/products/rice-1.jpg', 1, 1),
(12, 9, 'uploads/products/laptop-stand-1.jpg', 1, 1),
(13, 10, 'uploads/products/panjabi-1.jpg', 1, 1),
(14, 10, 'uploads/products/panjabi-2.jpg', 0, 2),
(15, 11, 'uploads/products/kids-blazer.jpg', 1, 1);

-- Insert Banners
INSERT INTO `banners` (`id`, `title`, `image`, `link`, `sort_order`, `is_active`) VALUES
(1, 'বিশাল ছাড় - ৫০% পর্যন্ত!', 'uploads/banners/banner-sale.jpg', '/shop?sort=discount', 1, 1),
(2, 'নতুন কালেকশন - গ্রীষ্ম ২০২৫', 'uploads/banners/banner-summer.jpg', '/shop?new=true', 2, 1),
(3, 'ঢাকার ভিতরে ফ্রি ডেলিভারি', 'uploads/banners/banner-delivery.jpg', '/shop', 3, 1);

-- Insert Coupons
INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `max_usage`, `used_count`, `expiry_date`, `is_active`) VALUES
(1, 'WELCOME10', 'প্রথম অর্ডারে ১০% ছাড়!', 'percentage', 10.00, 500.00, 100, 5, '2026-12-31 23:59:59', 1),
(2, 'SAVE200', '১০০০ টাকার বেশি অর্ডারে ৳২০০ ছাড়', 'fixed', 200.00, 1000.00, 50, 2, '2026-06-30 23:59:59', 1),
(3, 'EID500', 'ঈদ স্পেশাল - ৳৫০০ ছাড়', 'fixed', 500.00, 3000.00, 200, 10, '2026-07-31 23:59:59', 1),
(4, 'FREESHIP', 'ফ্রি ডেলিভারি কুপন', 'fixed', 60.00, 0.00, 500, 15, '2026-12-31 23:59:59', 1);

-- Insert Delivery Areas
INSERT INTO `delivery_areas` (`id`, `name`, `type`, `charge`, `is_active`) VALUES
(1, 'ঢাকার ভিতরে (Inside Dhaka)', 'inside_dhaka', 60.00, 1),
(2, 'ঢাকার বাইরে (Outside Dhaka)', 'outside_dhaka', 120.00, 1);

-- Insert Settings
INSERT INTO `settings` (`id`, `setting_key`, `setting_value`) VALUES
(1, 'site_name', 'Ayaan Mart BD'),
(2, 'site_tagline', 'আপনার বিশ্বস্ত অনলাইন শপ'),
(3, 'site_logo', 'uploads/logos/logo.png'),
(4, 'site_favicon', 'uploads/logos/favicon.ico'),
(5, 'primary_color', '#dc2626'),
(6, 'secondary_color', '#059669'),
(7, 'contact_phone', '+8801911602590'),
(8, 'contact_email', 'info@ayaanmartbd.com'),
(9, 'contact_address', 'Aftabnagar, Badda, Dhaka, Bangladesh'),
(10, 'facebook_url', 'https://facebook.com/ayaanmartbd'),
(11, 'instagram_url', 'https://instagram.com/ayaanmartbd'),
(12, 'youtube_url', 'https://youtube.com/@ayaanmartbd'),
(13, 'whatsapp_number', '+8801700000000'),
(14, 'bkash_number', '01911602590'),
(15, 'nagad_number', '01911602590'),
(16, 'rocket_number', '01911602590'),
(17, 'bkash_instruction', 'Send money to 01700000000 (Bkash Personal). After sending, enter the Transaction ID (TrxID) in the box below.'),
(18, 'nagad_instruction', 'Send money to 01700000001 (Nagad Personal). After sending, enter the Transaction ID (TrxID) in the box below.'),
(19, 'rocket_instruction', 'Send money to 01700000002 (Rocket Personal). After sending, enter the Transaction ID (TrxID) in the box below.'),
(20, 'delivery_inside_dhaka', '60'),
(21, 'delivery_outside_dhaka', '120'),
(22, 'footer_text', '© 2025 Ayaan Mart BD. সর্বস্বত্ব সংরক্ষিত।'),
(23, 'about_text', 'Ayaan Mart BD is Bangladesh''s trusted online shopping destination. We provide quality products at the best prices with fast delivery across the country. আমাদের লক্ষ্য বাংলাদেশের প্রতিটি মানুষের কাছে মানসম্পন্ন পণ্য সহজলভ্য করে তোলা।'),
(24, 'google_analytics_id', ''),
(25, 'facebook_pixel_id', ''),
(26, 'meta_keywords', 'online shopping bangladesh, ayaan mart, ecommerce bd, daraz alternative, best price bangladesh'),
(27, 'meta_description', 'Ayaan Mart BD is Bangladesh''s trusted online shopping destination. Best prices, fast delivery across Dhaka and all Bangladesh. ইলেকট্রনিক্স, ফ্যশন, গ্রোসারি সবকিছু এক জায়গায়।');

-- Insert Sample Reviews
INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `is_approved`) VALUES
(1, 1, 2, 5, 'Very good phone! আমি অনেক খুশি। ডেলিভারি খুব ফাস্ট ছিলো।', 1),
(2, 3, 2, 4, 'কোয়ালিটি ভালো, সাইজ একদম পারফেক্ট।', 1),
(3, 5, 2, 5, 'Best earbuds in this price range. সাউন্ড কোয়ালিটি অসাধারণ!', 1);

COMMIT;
