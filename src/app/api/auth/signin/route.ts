import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/lib/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?",
      [email]
    );

    const users = rows as Array<{
      id: number;
      name: string;
      email: string;
      password_hash: string;
    }>;
    if (!users.length) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const res = NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to signin" },
      { status: 500 }
    );
  }
}
