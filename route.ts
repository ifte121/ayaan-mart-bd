import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, passwordResets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token, password } = body;

    if (token && password) {
      // Reset password
      const [resetEntry] = await db
        .select()
        .from(passwordResets)
        .where(eq(passwordResets.email, email));

      if (!resetEntry || resetEntry.token !== token) {
        return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
      }

      if (resetEntry.expires_at < new Date()) {
        return NextResponse.json({ error: "Reset token has expired" }, { status: 400 });
      }

      const hashedPassword = await hashPassword(password);
      await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email));
      await db.delete(passwordResets).where(eq(passwordResets.email, email));

      return NextResponse.json({ success: true });
    }

    if (email) {
      // Request password reset
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (user.length === 0) {
        return NextResponse.json({ success: true }); // Don't reveal if email exists
      }

      const resetToken = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.delete(passwordResets).where(eq(passwordResets.email, email));
      await db.insert(passwordResets).values({
        email,
        token: resetToken,
        expires_at: expiresAt,
      });

      return NextResponse.json({ success: true, resetToken }); // In production, send email instead
    }

    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
