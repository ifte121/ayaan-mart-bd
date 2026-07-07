import { pgTable, serial, text, integer, decimal, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";

// ==================== USERS ====================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("customer"), // customer, admin
  address: text("address"),
  city: varchar("city", { length: 100 }),
  area: varchar("area", { length: 100 }),
  postal_code: varchar("postal_code", { length: 20 }),
  is_blocked: boolean("is_blocked").notNull().default(false),
  is_verified: boolean("is_verified").notNull().default(false),
  email_otp: varchar("email_otp", { length: 10 }),
  mobile_otp: varchar("mobile_otp", { length: 10 }),
  otp_expires_at: timestamp("otp_expires_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ==================== EMAIL_ALERTS (Login alerts) ====================
export const emailAlerts = pgTable("email_alerts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  message: text("message").notNull(),
  sent_at: timestamp("sent_at").notNull().defaultNow(),
});

// ==================== CATEGORIES ====================
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name_bn: varchar("name_bn", { length: 255 }).notNull(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 500 }),
  icon: varchar("icon", { length: 50 }),
  parent_id: integer("parent_id"),
  sort_order: integer("sort_order").notNull().default(0),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ==================== PRODUCTS ====================
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name_bn: varchar("name_bn", { length: 500 }).notNull(),
  name_en: varchar("name_en", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  description: text("description"),
  category_id: integer("category_id").notNull(),
  sub_category_id: integer("sub_category_id"),
  brand: varchar("brand", { length: 200 }),
  sku: varchar("sku", { length: 100 }),
  regular_price: decimal("regular_price", { precision: 10, scale: 2 }).notNull(),
  sale_price: decimal("sale_price", { precision: 10, scale: 2 }).notNull(),
  discount_percent: integer("discount_percent").notNull().default(0),
  stock_quantity: integer("stock_quantity").notNull().default(0),
  images: text("images").array().default([]),
  main_image: varchar("main_image", { length: 500 }),
  tags: text("tags").array().default([]),
  is_featured: boolean("is_featured").notNull().default(false),
  is_new_arrival: boolean("is_new_arrival").notNull().default(false),
  is_active: boolean("is_active").notNull().default(true),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, inactive, out_of_stock
  meta_title: varchar("meta_title", { length: 255 }),
  meta_description: text("meta_description"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ==================== REVIEWS ====================
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").notNull(),
  user_id: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  is_approved: boolean("is_approved").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ==================== CART ====================
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  product_id: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ==================== WISHLIST ====================
export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  product_id: integer("product_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ==================== ORDERS ====================
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  order_number: varchar("order_number", { length: 50 }).notNull().unique(),
  user_id: integer("user_id").notNull(),
  customer_name: varchar("customer_name", { length: 255 }).notNull(),
  customer_email: varchar("customer_email", { length: 255 }).notNull(),
  customer_phone: varchar("customer_phone", { length: 20 }).notNull(),
  shipping_address: text("shipping_address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  area: varchar("area", { length: 100 }),
  delivery_type: varchar("delivery_type", { length: 50 }).notNull().default("inside_dhaka"), // inside_dhaka, outside_dhaka
  delivery_charge: decimal("delivery_charge", { precision: 10, scale: 2 }).notNull().default("0"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  coupon_code: varchar("coupon_code", { length: 50 }),
  coupon_discount: decimal("coupon_discount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  payment_method: varchar("payment_method", { length: 50 }).notNull(), // cod, bkash, nagad, rocket
  payment_status: varchar("payment_status", { length: 50 }).notNull().default("pending"), // pending, paid, failed
  transaction_id: varchar("transaction_id", { length: 200 }),
  order_status: varchar("order_status", { length: 50 }).notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  notes: text("notes"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ==================== ORDER ITEMS ====================
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").notNull(),
  product_id: integer("product_id").notNull(),
  product_name: varchar("product_name", { length: 500 }).notNull(),
  product_image: varchar("product_image", { length: 500 }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
});

// ==================== COUPONS ====================
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discount_type: varchar("discount_type", { length: 20 }).notNull().default("percentage"), // percentage, fixed
  discount_value: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  min_order_amount: decimal("min_order_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  max_usage: integer("max_usage").notNull().default(0), // 0 = unlimited
  used_count: integer("used_count").notNull().default(0),
  expiry_date: timestamp("expiry_date"),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ==================== BANNERS ====================
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  image: varchar("image", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }),
  sort_order: integer("sort_order").notNull().default(0),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ==================== SETTINGS ====================
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
});

// ==================== PASSWORD RESETS ====================
export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ==================== NOTIFICATIONS ====================
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"), // order, stock, info
  is_read: boolean("is_read").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ==================== DELIVERY AREAS ====================
export const deliveryAreas = pgTable("delivery_areas", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // inside_dhaka, outside_dhaka
  charge: decimal("charge", { precision: 10, scale: 2 }).notNull(),
  is_active: boolean("is_active").notNull().default(true),
});
