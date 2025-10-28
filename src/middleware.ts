import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth pages and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next|favicon.ico|public).*)"],
};
