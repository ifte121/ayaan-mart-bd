import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "ayaan-mart-bd-secret-key-2025";
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function verifyAdminToken(token: string | undefined): Promise<{ userId: number; role: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ["HS256"] });
    return payload as { userId: number; role: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // ---------- Protect /cpanel/* (Admin Panel Pages) ----------
  if (pathname.startsWith("/cpanel")) {
    // Allow the login page itself to be accessed without a valid session
    if (pathname === "/cpanel/login") {
      // If already logged in as admin, skip past login page
      const decoded = await verifyAdminToken(token);
      if (decoded && decoded.role === "admin") {
        return NextResponse.redirect(new URL("/cpanel", request.url));
      }
      return NextResponse.next();
    }

    const decoded = await verifyAdminToken(token);
    if (!decoded || decoded.role !== "admin") {
      const loginUrl = new URL("/cpanel/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ---------- Protect /api/admin/* (Admin API Routes) ----------
  if (pathname.startsWith("/api/admin")) {
    const decoded = await verifyAdminToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cpanel/:path*", "/api/admin/:path*"],
};
