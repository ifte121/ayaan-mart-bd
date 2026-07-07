import "dotenv/config";
import { db } from "@/db";
import { users, categories, products, banners, settings, coupons, deliveryAreas } from "@/db/schema";
import bcrypt from "bcryptjs";

import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data to avoid conflicts (order matters due to FK)
  await db.execute(sql`TRUNCATE TABLE email_alerts, password_resets, reviews, order_items, cart, wishlist, notifications RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE orders, products, banners, coupons, delivery_areas RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE categories, settings RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);

  // Create admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({
    name: "Admin",
    email: "admin@ayaanmartbd.com",
    phone: "+8801911602590",
    password: hashedPassword,
    role: "admin",
    is_verified: true,
    address: "Aftabnagar, Badda, Dhaka, Bangladesh",
  });

  // Create demo customer
  const customerPassword = await bcrypt.hash("demo123", 10);
  await db.insert(users).values({
    name: "Demo Customer",
    email: "demo@ayaanmartbd.com",
    phone: "+8801911602590",
    password: customerPassword,
    role: "customer",
    is_verified: true,
    address: "House 123, Road 5, Dhanmondi, Dhaka-1205",
    city: "Dhaka",
    area: "Dhanmondi",
  });

  // Categories
  const cats = await db.insert(categories).values([
    { name_bn: "ইলেকট্রনিক্স", name_en: "Electronics", slug: "electronics", icon: "smartphone", sort_order: 1 },
    { name_bn: "ফ্যাশন ও কাপড়", name_en: "Fashion & Clothing", slug: "fashion", icon: "shirt", sort_order: 2 },
    { name_bn: "ঘর ও রান্নাঘর", name_en: "Home & Kitchen", slug: "home-kitchen", icon: "home", sort_order: 3 },
    { name_bn: "স্বাস্থ্য ও সৌন্দর্য", name_en: "Health & Beauty", slug: "health-beauty", icon: "heart", sort_order: 4 },
    { name_bn: "মুদি ও খাবার", name_en: "Grocery & Food", slug: "grocery", icon: "shopping-bag", sort_order: 5 },
  ]).returning({ id: categories.id });

  // Sub-categories (parent categories)
  const subCats = await db.insert(categories).values([
    { name_bn: "মোবাইল ফোন", name_en: "Mobile Phones", slug: "mobile-phones", icon: "phone", parent_id: cats[0].id, sort_order: 1 },
    { name_bn: "ল্যাপটপ ও কম্পিউটার", name_en: "Laptops & Computers", slug: "laptops", icon: "monitor", parent_id: cats[0].id, sort_order: 2 },
    { name_bn: "ইয়ারবাড ও হেডফোন", name_en: "Earbuds & Headphones", slug: "earbuds", icon: "headphones", parent_id: cats[0].id, sort_order: 3 },
    { name_bn: "পুরুষদের ফ্যাশন", name_en: "Men's Fashion", slug: "mens-fashion", icon: "user", parent_id: cats[1].id, sort_order: 1 },
    { name_bn: "মহিলাদের ফ্যাশন", name_en: "Women's Fashion", slug: "womens-fashion", icon: "user", parent_id: cats[1].id, sort_order: 2 },
    { name_bn: "রান্নাঘরের সরঞ্জাম", name_en: "Kitchen Appliances", slug: "kitchen-appliances", icon: "utensils", parent_id: cats[2].id, sort_order: 1 },
    { name_bn: "শিশুদের ফ্যাশন", name_en: "Kids Fashion", slug: "kids-fashion", icon: "baby", parent_id: cats[1].id, sort_order: 3 },
  ]).returning({ id: categories.id });

  // Products
  const productData = [
    {
      name_bn: "স্যামসাং গ্যালাক্সি A15",
      name_en: "Samsung Galaxy A15",
      slug: "samsung-galaxy-a15",
      description: "Samsung Galaxy A15 4G - 6GB RAM, 128GB Storage, 6.5 inch Display, 50MP Camera. Original Samsung product with official warranty. Super AMOLED Display, MediaTek Helio G99 Processor, 5000mAh Battery.",
      category_id: cats[0].id,
      sub_category_id: subCats[0].id,
      brand: "Samsung",
      sku: "SAM-A15-128",
      regular_price: "18990",
      sale_price: "15990",
      discount_percent: 16,
      stock_quantity: 25,
      main_image: "https://placehold.co/500x500/f8f9fa/333?text=Samsung+A15",
      images: ["https://placehold.co/500x500/f8f9fa/333?text=Samsung+A15", "https://placehold.co/500x500/e9ecef/333?text=Samsung+A15+Back"],
      tags: ["mobile", "samsung", "smartphone"],
      is_featured: true,
      is_new_arrival: true,
    },
    {
      name_bn: "রেডমি নোট ১৩",
      name_en: "Redmi Note 13",
      slug: "redmi-note-13",
      description: "Xiaomi Redmi Note 13 - 8GB RAM, 256GB Storage, 108MP Camera, 6.67 inch AMOLED Display. Fast charging 33W. Best budget smartphone in Bangladesh.",
      category_id: cats[0].id,
      sub_category_id: subCats[0].id,
      brand: "Xiaomi",
      sku: "RED-N13-256",
      regular_price: "22990",
      sale_price: "19490",
      discount_percent: 15,
      stock_quantity: 18,
      main_image: "https://placehold.co/500x500/f8f9fa/333?text=Redmi+Note+13",
      images: ["https://placehold.co/500x500/f8f9fa/333?text=Redmi+Note+13"],
      tags: ["mobile", "xiaomi", "redmi"],
      is_featured: true,
      is_new_arrival: false,
    },
    {
      name_bn: "টি-শার্ট পুরুষদের কটন",
      name_en: "Men's Cotton T-Shirt",
      slug: "mens-cotton-tshirt",
      description: "Premium quality 100% cotton t-shirt for men. Available in multiple colors. Comfortable fit for daily wear. Machine washable.",
      category_id: cats[1].id,
      sub_category_id: subCats[3].id,
      brand: "Local",
      sku: "MTS-001",
      regular_price: "899",
      sale_price: "499",
      discount_percent: 44,
      stock_quantity: 150,
      main_image: "https://placehold.co/500x500/e8f5e9/333?text=Cotton+T-Shirt",
      images: ["https://placehold.co/500x500/e8f5e9/333?text=Cotton+T-Shirt"],
      tags: ["fashion", "tshirt", "men"],
      is_featured: true,
      is_new_arrival: true,
    },
    {
      name_bn: "শাড়ি জামদানি ডিজাইন",
      name_en: "Jamdani Design Saree",
      slug: "jamdani-design-saree",
      description: "Beautiful traditional Jamdani saree. Hand-woven design, premium cotton fabric. Perfect for special occasions and festivals.",
      category_id: cats[1].id,
      sub_category_id: subCats[4].id,
      brand: "Aarong",
      sku: "SAR-JMD-001",
      regular_price: "3500",
      sale_price: "2800",
      discount_percent: 20,
      stock_quantity: 30,
      main_image: "https://placehold.co/500x500/fff3e0/333?text=Jamdani+Saree",
      images: ["https://placehold.co/500x500/fff3e0/333?text=Jamdani+Saree"],
      tags: ["fashion", "saree", "women", "jamdani"],
      is_featured: true,
      is_new_arrival: false,
    },
    {
      name_bn: "ব্লুটুথ ইয়ারবাড TWS",
      name_en: "Bluetooth TWS Earbuds",
      slug: "bluetooth-tws-earbuds",
      description: "Premium TWS Bluetooth earbuds with noise cancellation. 24 hours battery life, IPX5 waterproof. Touch control, HD microphone.",
      category_id: cats[0].id,
      sub_category_id: subCats[2].id,
      brand: "Baseus",
      sku: "EAR-TWS-001",
      regular_price: "2500",
      sale_price: "1299",
      discount_percent: 48,
      stock_quantity: 75,
      main_image: "https://placehold.co/500x500/e3f2fd/333?text=TWS+Earbuds",
      images: ["https://placehold.co/500x500/e3f2fd/333?text=TWS+Earbuds"],
      tags: ["earbuds", "bluetooth", "audio"],
      is_featured: true,
      is_new_arrival: true,
    },
    {
      name_bn: "নন-স্টিক ফ্রাইং প্যান সেট",
      name_en: "Non-Stick Frying Pan Set",
      slug: "non-stick-frying-pan-set",
      description: "Premium non-stick frying pan set (3 pieces). Granite coating, induction compatible. Heat-resistant handles. Dishwasher safe.",
      category_id: cats[2].id,
      sub_category_id: subCats[5].id,
      brand: "Munaz",
      sku: "PAN-NS-003",
      regular_price: "2800",
      sale_price: "1999",
      discount_percent: 29,
      stock_quantity: 40,
      main_image: "https://placehold.co/500x500/fce4ec/333?text=Frying+Pan+Set",
      images: ["https://placehold.co/500x500/fce4ec/333?text=Frying+Pan+Set"],
      tags: ["kitchen", "pan", "cooking"],
      is_featured: false,
      is_new_arrival: true,
    },
    {
      name_bn: "ফেসওয়াশ অ্যালোভেরা",
      name_en: "Aloe Vera Face Wash",
      slug: "aloe-vera-face-wash",
      description: "Natural aloe vera face wash for all skin types. Deep cleansing, moisturizing formula. Paraben-free, dermatologically tested. 150ml.",
      category_id: cats[3].id,
      sub_category_id: null,
      brand: "Himalaya",
      sku: "FW-ALO-150",
      regular_price: "350",
      sale_price: "280",
      discount_percent: 20,
      stock_quantity: 200,
      main_image: "https://placehold.co/500x500/e8f5e9/333?text=Face+Wash",
      images: ["https://placehold.co/500x500/e8f5e9/333?text=Face+Wash"],
      tags: ["beauty", "skincare", "facewash"],
      is_featured: false,
      is_new_arrival: false,
    },
    {
      name_bn: "বাসমতি চাল ৫ কেজি",
      name_en: "Basmati Rice 5kg",
      slug: "basmati-rice-5kg",
      description: "Premium quality Indian Basmati Rice. Extra long grain, aromatic. Perfect for biryani and pulao. 5kg pack.",
      category_id: cats[4].id,
      sub_category_id: null,
      brand: "India Gate",
      sku: "RIC-BAS-5KG",
      regular_price: "1200",
      sale_price: "950",
      discount_percent: 21,
      stock_quantity: 500,
      main_image: "https://placehold.co/500x500/fff8e1/333?text=Basmati+Rice+5kg",
      images: ["https://placehold.co/500x500/fff8e1/333?text=Basmati+Rice+5kg"],
      tags: ["rice", "grocery", "basmati"],
      is_featured: false,
      is_new_arrival: false,
    },
    {
      name_bn: "ল্যাপটপ স্ট্যান্ড অ্যালুমিনিয়াম",
      name_en: "Aluminum Laptop Stand",
      slug: "aluminum-laptop-stand",
      description: "Ergonomic aluminum laptop stand. Adjustable height, foldable design. Compatible with all laptops 10-17 inches. Improves posture and cooling.",
      category_id: cats[0].id,
      sub_category_id: subCats[1].id,
      brand: "Baseus",
      sku: "LPS-ALU-001",
      regular_price: "2200",
      sale_price: "1499",
      discount_percent: 32,
      stock_quantity: 60,
      main_image: "https://placehold.co/500x500/e0e0e0/333?text=Laptop+Stand",
      images: ["https://placehold.co/500x500/e0e0e0/333?text=Laptop+Stand"],
      tags: ["laptop", "accessories", "stand"],
      is_featured: true,
      is_new_arrival: false,
    },
    {
      name_bn: "পাঞ্জাবি ইদ কালেকশন",
      name_en: "Eid Collection Panjabi",
      slug: "eid-collection-panjabi",
      description: "Premium Eid special Panjabi for men. Cotton blend fabric, elegant design. Available in multiple colors and sizes (M-XXL).",
      category_id: cats[1].id,
      sub_category_id: subCats[3].id,
      brand: "Ecstasy",
      sku: "PNJ-EID-001",
      regular_price: "1800",
      sale_price: "1200",
      discount_percent: 33,
      stock_quantity: 80,
      main_image: "https://placehold.co/500x500/e8eaf6/333?text=Eid+Panjabi",
      images: ["https://placehold.co/500x500/e8eaf6/333?text=Eid+Panjabi"],
      tags: ["fashion", "panjabi", "eid", "men"],
      is_featured: true,
      is_new_arrival: true,
    },
    {
      name_bn: "শিশুদের ব্লেজার (কিডস ব্লেজার সেট)",
      name_en: "Kids Blazer Suit Set",
      slug: "kids-blazer-suit-set",
      description: "<p>প্রিমিয়াম কোয়ালিটির শিশুদের ৩-পিস ব্লেজার সুট সেট। বিশেষ অনুষ্ঠান, পার্টি, ওয়েডিং ও ঈদের জন্য পারফেক্ট।</p><ul><li>উন্নত মানের ফেব্রিক</li><li>ব্লেজার + শার্ট + টাই সেট</li><li>Available Sizes: 2-10 বছর বয়সীদের জন্য</li><li>এলিগেন্ট গ্রে কালার ডিজাইন</li><li>আরামদায়ক ফিটিং</li></ul>",
      category_id: cats[1].id,
      sub_category_id: subCats[6].id,
      brand: "Ayaan Kids",
      sku: "KID-BLZ-001",
      regular_price: "15000",
      sale_price: "10000",
      discount_percent: 33,
      stock_quantity: 20,
      main_image: "/images/products/kids-blazer.jpg",
      images: ["/images/products/kids-blazer.jpg"],
      tags: ["kids", "blazer", "fashion", "formal"],
      is_featured: true,
      is_new_arrival: true,
    },
  ];

  for (const p of productData) {
    await db.insert(products).values(p);
  }

  // Banners
  await db.insert(banners).values([
    {
      title: "Big Sale - Up to 50% OFF!",
      image: "https://placehold.co/1200x400/dc2626/ffffff?text=Big+Sale+50%25+OFF",
      link: "/shop?sort=discount",
      sort_order: 1,
    },
    {
      title: "New Arrivals - Summer Collection 2025",
      image: "https://placehold.co/1200x400/059669/ffffff?text=New+Summer+Collection",
      link: "/shop?new=true",
      sort_order: 2,
    },
    {
      title: "Free Delivery Inside Dhaka on Orders Over ৳999",
      image: "https://placehold.co/1200x400/2563eb/ffffff?text=Free+Delivery+Dhaka",
      link: "/shop",
      sort_order: 3,
    },
  ]);

  // Settings
  const defaultSettings = [
    { key: "site_name", value: "Ayaan Mart BD" },
    { key: "site_tagline", value: "আপনার বিশ্বস্ত অনলাইন শপ" },
    { key: "site_logo", value: "" },
    { key: "site_favicon", value: "" },
    { key: "primary_color", value: "#dc2626" },
    { key: "secondary_color", value: "#059669" },
    { key: "contact_phone", value: "+8801911602590" },
    { key: "contact_email", value: "info@ayaanmartbd.com" },
    { key: "contact_address", value: "Aftabnagar, Badda, Dhaka, Bangladesh" },
    { key: "facebook_url", value: "https://facebook.com/ayaanmartbd" },
    { key: "instagram_url", value: "https://instagram.com/ayaanmartbd" },
    { key: "youtube_url", value: "https://youtube.com/@ayaanmartbd" },
    { key: "whatsapp_number", value: "+8801911602590" },
    { key: "bkash_number", value: "01911602590" },
    { key: "nagad_number", value: "01911602590" },
    { key: "rocket_number", value: "01911602590" },
    { key: "delivery_inside_dhaka", value: "60" },
    { key: "delivery_outside_dhaka", value: "120" },
    { key: "footer_text", value: "© 2025 Ayaan Mart BD. সর্বস্বত্ব সংরক্ষিত।" },
    { key: "about_text", value: "Ayaan Mart BD is Bangladesh's trusted online shopping destination. We provide quality products at the best prices with fast delivery across the country." },
  ];

  for (const s of defaultSettings) {
    await db.insert(settings).values(s);
  }

  // Coupons
  await db.insert(coupons).values([
    {
      code: "WELCOME10",
      description: "10% off on first order",
      discount_type: "percentage",
      discount_value: "10",
      min_order_amount: "500",
      max_usage: 100,
      expiry_date: new Date("2026-12-31"),
    },
    {
      code: "SAVE200",
      description: "৳200 off on orders above ৳1000",
      discount_type: "fixed",
      discount_value: "200",
      min_order_amount: "1000",
      max_usage: 50,
      expiry_date: new Date("2026-06-30"),
    },
  ]);

  // Delivery Areas
  await db.insert(deliveryAreas).values([
    { name: "Inside Dhaka", type: "inside_dhaka", charge: "60" },
    { name: "Outside Dhaka", type: "outside_dhaka", charge: "120" },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
