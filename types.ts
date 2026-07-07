export interface Product {
  id: number;
  name_bn: string;
  name_en: string;
  slug: string;
  description: string;
  category_id: number;
  sub_category_id: number | null;
  brand: string;
  sku: string;
  regular_price: string;
  sale_price: string;
  discount_percent: number;
  stock_quantity: number;
  main_image: string;
  images: string[];
  tags: string[];
  is_featured: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  status: string;
  created_at: Date;
}

export interface Category {
  id: number;
  name_bn: string;
  name_en: string;
  slug: string;
  image: string | null;
  icon: string | null;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  address: string | null;
  city: string | null;
  area: string | null;
}

export interface CartItem {
  id: number;
  name_bn: string;
  name_en: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: string;
  total: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  area: string | null;
  delivery_type: string;
  delivery_charge: string;
  subtotal: string;
  coupon_code: string | null;
  coupon_discount: string;
  total: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  order_status: string;
  notes: string | null;
  created_at: Date;
  items?: OrderItem[];
}

export interface Banner {
  id: number;
  title: string;
  image: string;
  link: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: Date;
  user_name?: string;
}

export interface Coupon {
  id: number;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: string;
  min_order_amount: string;
  max_usage: number;
  used_count: number;
  expiry_date: Date | null;
  is_active: boolean;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
}
