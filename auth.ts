import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ayaan-mart-bd-secret-key-2025";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

export async function getUserById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function registerUser(name: string, email: string, password: string, phone?: string) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ name, email, password: hashedPassword, phone: phone || "" })
    .returning();

  const token = generateToken(user.id, user.role);
  return { user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }, token };
}

export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return { error: "Invalid email or password" };
  }

  if (user.is_blocked) {
    return { error: "Your account has been blocked. Please contact support." };
  }

  if (!user.is_verified) {
    return { error: "Your account is not verified yet. Please check your email for the OTP." };
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  const token = generateToken(user.id, user.role);
  return { user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }, token };
}

export function generateOrderNumber(): string {
  const prefix = "AMBD";
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${dateStr}${random}`;
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return "৳" + numPrice.toLocaleString("en-BD");
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calculateDiscount(regular: number, sale: number): number {
  if (regular <= 0) return 0;
  return Math.round(((regular - sale) / regular) * 100);
}
