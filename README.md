# Ayaan Mart BD 🇧🇩

**আপনার বিশ্বস্ত অনলাইন শপ**

---

> ⚠️ **গুরুত্বপূর্ণ নোট:** এই প্রজেক্টের **লাইভ/চলমান ভার্সন** তৈরি হয়েছে **Next.js + PostgreSQL (Drizzle ORM)** দিয়ে — PHP দিয়ে না। কনফিগারেশনের জন্য root ফোল্ডারে থাকা **`.env`** ফাইল ব্যবহার করুন।
>
> এই প্রজেক্টে যে **`config.php`** এবং **`database.sql`** ফাইল আছে, সেগুলো **শুধুমাত্র PHP + MySQL (cPanel শেয়ার্ড হোস্টিং)** ভার্সনে ডিপ্লয় করতে চাইলে ব্যবহার করার জন্য — বিকল্প রেফারেন্স হিসেবে দেওয়া হয়েছে। বর্তমান Next.js অ্যাপ এই দুটো ফাইল ব্যবহার করে না।

> 🚀 **ফ্রি অনলাইনে Publish/Deploy করতে চাইলে** এবং **Frontend + Backend (`/cpanel`) কিভাবে চেক করবে** তার সম্পূর্ণ ধাপে ধাপে গাইডের জন্য **[`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)** ফাইলটি দেখুন।

---

## 📋 সূচিপত্র

1. [cPanel-এ কিভাবে আপলোড করবেন](#cpanel-আপলোড)
2. [MySQL ডাটাবেজ তৈরি](#mysql-তৈরি)
3. [database.sql ইম্পোর্ট](#sql-ইম্পোর্ট)
4. [config.php এডিট](#config-এডিট)
5. [Admin লগইন](#admin-লগইন)
6. [প্রথম প্রোডাক্ট যোগ করুন](#প্রোডাক্ট-যোগ)
7. [লোগো ও কালার পরিবর্তন](#লোগো-কালার)
8. [কমন সমস্যা ও সমাধান](#সমস্যা-সমাধান)

---

<a name="cpanel-আপলোড"></a>
## 1. cPanel-এ কিভাবে আপলোড করবেন

### ধাপ ১: ZIP ফাইল আপলোড

1. আপনার cPanel-এ লগইন করুন (যেমন: `yourdomain.com/cpanel`)
2. **File Manager** → **public_html** ফোল্ডারে যান
3. **Upload** বাটনে ক্লিক করে `ayaan-mart.zip` ফাইল সিলেক্ট করুন
4. আপলোড শেষ হলে ফাইলটির উপর রাইট ক্লিক করে **Extract** করুন
5. সব ফাইল `public_html/ayaan-mart/` ফোল্ডারের মধ্যে আনজিপ হবে

### ধাপ ২: ফাইল সরানো (optional)

আপনি যদি চান সাইট সরাসরি `yourdomain.com` এ দেখতে:
- `public_html/ayaan-mart/` এর সব ফাইল কেট করে `public_html/` এ পেস্ট করুন

অথবা:
- আপনার সাইট দেখতে পারবেন `yourdomain.com/ayaan-mart/` এ — এটাই সহজ।

---

<a name="mysql-তৈরি"></a>
## 2. MySQL ডাটাবেজ তৈরি করুন

### cPanel থেকে:

1. **MySQL® Databases** এ যান
2. **Create New Database** → নাম দিন: `ayaan_mart_db`
3. **Create New User** → ইউজার: `ayaan_user`, পাসওয়ার্ড: একটি শক্ত পাসওয়ার্ড দিন
4. **Add User to Database** → ইউজার সিলেক্ট করে `ALL PRIVILEGES` দিন

### তথ্য সংরক্ষণ করুন:
```
Database Name: yourcpanel_ayaan_mart_db
Username:      yourcpanel_ayaan_user
Password:      (আপনার দেয়া পাসওয়ার্ড)
Host:          localhost
```

---

<a name="sql-ইম্পোর্ট"></a>
## 3. database.sql ইম্পোর্ট করুন

### phpMyAdmin দিয়ে (সবচেয়ে সহজ):

1. cPanel → **phpMyAdmin** ওপেন করুন
2. বাম সাইড থেকে আপনার ডাটাবেজ (`ayaan_mart_db`) সিলেক্ট করুন
3. উপরের মেনু থেকে **Import** ট্যাবে ক্লিক করুন
4. **Choose File** → `database.sql` সিলেক্ট করুন
5. **Go** বাটনে ক্লিক করুন

✅ "Import has been successfully finished" মেসেজ দেখলে বুঝবেন সব টেবিল তৈরি হয়েছে।

### চেক করুন:
- বাম সাইডে টেবিলগুলো দেখুন:
  - `users` (admin/customer)
  - `products` (১০টি স্যাম্পল প্রোডাক্ট)
  - `categories`
  - `orders`
  - বাকি সব টেবিল

---

<a name="config-এডিট"></a>
## 4. config.php এডিট করুন

### `config.php` ফাইলটি ওপেন করুন (root ফোল্ডারে):

```php
<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'yourcpanel_ayaan_mart_db');   // ← আপনার ডাটাবেজের নাম
define('DB_USER', 'yourcpanel_ayaan_user');     // ← আপনার ইউজারনেম
define('DB_PASS', 'your_password_here');         // ← আপনার পাসওয়ার্ড

// Site URL
define('SITE_URL', 'https://yourdomain.com/ayaan-mart/');
define('ADMIN_URL', SITE_URL . 'admin/');

// Session
session_start();
?>
```

### পরিবর্তন করুন:
| কি | কোথায় |
|----|--------|
| `DB_NAME` | আপনার ডাটাবেজের পুরো নাম |
| `DB_USER` | আপনার ডাটাবেজ ইউজারনেম |
| `DB_PASS` | আপনার ডাটাবেজ পাসওয়ার্ড |
| `SITE_URL` | আপনার ওয়েবসাইটের URL |

---

<a name="admin-লগইন"></a>
## 5. Admin হিসেবে লগইন করুন

> ⚠️ **নোট:** নিচের URL শুধুমাত্র PHP+MySQL ভার্সনের জন্য প্রযোজ্য। **বর্তমান লাইভ Next.js ভার্সনে Admin Panel URL হলো `/cpanel`** (যেমন: `https://yourdomain.com/cpanel`) — বিস্তারিত জানতে **`DEPLOYMENT_GUIDE.md`** ফাইল দেখুন।

### Login URL (PHP ভার্সন):
```
yourdomain.com/ayaan-mart/admin/login.php
```

### Login URL (Next.js লাইভ ভার্সন):
```
yourdomain.com/cpanel/login
```

### ডিফল্ট লগইন তথ্য:
| কি | মান |
|----|-----|
| **ইমেইল** | `admin@ayaanmartbd.com` |
| **পাসওয়ার্ড** | `admin123` |

> ⚠️ **গুরুত্বপূর্ণ:** প্রথম লগইনের পর Admin Panel → Settings থেকে পাসওয়ার্ড পরিবর্তন করে নিন!

### Admin Dashboard:
লগইন করার পর দেখতে পাবেন:
- 📊 আজকের/সপ্তাহের/মাসের অর্ডার ও রেভিনিউ
- 📦 সর্বশেষ অর্ডারসমূহ
- ⚠️ লো স্টক অ্যালার্ট
- 📈 সেলস চার্ট

---

<a name="প্রোডাক্ট-যোগ"></a>
## 6. প্রথম প্রোডাক্ট কীভাবে যোগ করবেন

### Admin Panel থেকে:

1. Left sidebar → **Products** → **Add Product** ক্লিক করুন
2. ফর্ম পূরণ করুন:

| ফিল্ড | বিবরণ |
|-------|--------|
| **নাম (বাংলা)** | পণ্যের বাংলা নাম — যেমন: "স্যামসাং গ্যালাক্সি S24" |
| **নাম (ইংরেজি)** | English name — like: "Samsung Galaxy S24" |
| **ক্যাটাগরি** | ড্রপডাউন থেকে সিলেক্ট করুন |
| **রেগুলার প্রাইস** | আগের দাম (মূল্য) — যেমন: 115000 |
| **সেল প্রাইস** | বর্তমান/অফার দাম — যেমন: 99999 |
| **স্টক** | কতটি আছে — যেমন: 20 |
| **মেইন ইমেজ** | আপলোড বা URL দিন |
| **বিবরণ** | পণ্যের ডিটেইলস (Rich Text Editor) |
| **Featured** | হোমপেজে দেখাতে চাইলে Yes দিন |
| **New Arrival** | নতুন পণ্য হিসেবে ট্যাগ করতে চাইলে Yes দিন |

3. **Save** ক্লিক করুন

✅ আপনার প্রোডাক্ট এখন ওয়েবসাইটে দেখা যাবে!

---

<a name="লোগো-কালার"></a>
## 7. লোগো, কালার ও ব্যানার পরিবর্তন

### Settings পেজে যান: `Admin → Settings`

#### লোগো পরিবর্তন:
1. **Site Logo** ফিল্ডে আপনার লোগোর URL দিন
2. অথবা **Upload** করে সিলেক্ট করুন
3. Save করুন

#### কালার পরিবর্তন:
1. **Primary Color** — কালার পিকার থেকে পছন্দের রং সিলেক্ট করুন (ডিফল্ট: লাল #dc2626)
2. **Secondary Color** — সেকেন্ডারি রং দিন (ডিফল্ট: সবুজ #059669)
3. Save করুন — সাথে সাথে পুরো সাইটের কালার চেঞ্জ হবে!

#### ব্যানার পরিবর্তন:
1. Admin → **Banners** এ যান
2. Add/Edit/Delete করতে পারবেন
3. ব্যানার ইমেজ URL বা আপলোড দিন
4. ব্যানারে ক্লিক করলে যে লিংকে যাবে সেটা দিন

---

<a name="সমস্যা-সমাধান"></a>
## 8. কমন সমস্যা ও সমাধান

### ❌ "Connection failed / Database error"
**সমাধান:**
- `config.php` এ DB_HOST, DB_NAME, DB_USER, DB_PASS ঠিক আছে কিনা চেক করুন
- cPanel-এ ইউজারকে ডাটাবেজের সাথে অ্যাড করা হয়েছে কিনা চেক করুন
- পাসওয়ার্ডে special character থাকলে অবশ্যই কোটেশনের ভিতরে রাখুন

### ❌ "404 Not Found"
**সমাধান:**
- `.htaccess` ফাইল আছে কিনা চেক করুন
- cPanel-এ `public_html` এর root-এ `.htaccess` কাজ করছে কিনা দেখুন
- `SITE_URL` ঠিক আছে কিনা config.php চেক করুন

### ❌ "White screen / কিছুই দেখাচ্ছে না"
**সমাধান:**
- PHP version চেক করুন (PHP 8.0+ লাগবে)
- cPanel → Select PHP Version → 8.0 বা তার উপরের ভার্সন সিলেক্ট করুন
- Error reporting অন করুন (config.php-তে):
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

### ❌ ইমেজ দেখা যাচ্ছে না
**সমাধান:**
- `uploads/products/`, `uploads/banners/` ফোল্ডারগুলোর পারমিশন 755 দিন
- File Manager → ফোল্ডার সিলেক্ট → Permissions → 755
- ইমেজ URL সঠিক কিনা চেক করুন

### ❌ "Session problem / লগইন থাকছে না"
**সমাধান:**
- `session_start()` config.php-তে আছে কিনা চেক করুন
- কুকি ক্লিয়ার করে আবার ট্রাই করুন
- `.htaccess` ফাইলে session configuration চেক করুন

### ❌ bKash/Nagad নাম্বার কাজ করছে না
**সমাধান:**
- Admin → Settings → Payment Numbers
- সঠিক নাম্বার আপডেট করুন (০১৭XXXXXXXX ফরম্যাটে)
- Save করুন

---

## 📱 ফিচারসমূহ

### কাস্টমার:
- ✅ প্রোডাক্ট ব্রাউজ, সার্চ, ফিল্টার
- ✅ কার্টে যোগ করা, পরিমাণ পরিবর্তন
- ✅ চেকআউট (ঠিকানা, পেমেন্ট মাধ্যম)
- ✅ ক্যাশ অন ডেলিভারি / bKash / Nagad / Rocket
- ✅ কুপন কোড অ্যাপ্লাই
- ✅ অর্ডার ট্র্যাকিং
- ✅ কাস্টমার অ্যাকাউন্ট, অর্ডার হিস্ট্রি
- ✅ লগইন, রেজিস্ট্রেশন, পাসওয়ার্ড রিসেট
- ✅ পণ্য রিভিউ ও রেটিং

### Admin:
- ✅ ড্যাশবোর্ড (সেলস, রেভিনিউ, গ্রাহক সংখ্যা)
- ✅ প্রোডাক্ট ম্যানেজমেন্ট (যোগ, এডিট, ডিলিট)
- ✅ অর্ডার ম্যানেজমেন্ট (স্ট্যাটাস আপডেট)
- ✅ কাস্টমার ম্যানেজমেন্ট (ব্লক/আনব্লক)
- ✅ ক্যাটাগরি ম্যানেজমেন্ট
- ✅ কুপন ম্যানেজমেন্ট
- ✅ ব্যানার ম্যানেজমেন্ট
- ✅ সাইট সেটিংস (নাম, লোগো, কালার, কন্টাক্ট)
- ✅ পেমেন্ট নাম্বার ও ডেলিভারি চার্জ সেটিংস

---

## 📞 সাহায্য প্রয়োজন?

**ইমেইল:** info@ayaanmartbd.com  
**হোয়াটসঅ্যাপ:** +8801700000000  
**ওয়েবসাইট:** [ayaanmartbd.com](https://ayaanmartbd.com)

---

**Ayaan Mart BD — আপনার বিশ্বস্ত অনলাইন শপিং পার্টনার! 🇧🇩**
