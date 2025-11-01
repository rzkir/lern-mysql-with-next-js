import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;
const encoder = new TextEncoder();

async function getUserRoleFromToken(
  token?: string
): Promise<"admin" | "user" | "pemilik" | null> {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    const role = payload.role;
    if (role === "admin" || role === "user" || role === "pemilik") {
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

  if (pathname.startsWith("/dashboard")) {
    // Cek role bukan pemilik, bukan admin: redirect ke /
    if (role === "user" || !role) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // admin & pemilik bisa akses
    return NextResponse.next();
  }
  // Redirect setelah login
  if ((pathname === "/" || pathname === "/signin") && role) {
    if (role === "admin" || role === "pemilik") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    // user: hanya dari /signin saja diarahkan ke /
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
