import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { jwtVerify } from "jose";

// jose only supports Uint8Array for the secret
const secret = process.env.JWT_SECRET;
const encoder = new TextEncoder();

async function getUserRoleFromToken(
  token?: string
): Promise<"admin" | "user" | null> {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    const role = payload.role;
    if (role === "admin" || role === "user") {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = await getUserRoleFromToken(token);

  // Protect /dashboard for admins only
  if (pathname.startsWith("/dashboard")) {
    if (!role) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Jika user sudah login arahkan ke route sesuai role
  if (pathname === "/" || pathname === "/signin") {
    if (role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    if (role === "user" && pathname === "/signin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/dashboard/:path*"],
};
