import { NextRequest, NextResponse } from "next/server";

import pool from "@/utils/lib/database";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and password_hash are required",
        },
        { status: 400 }
      );
    }

    // Check existing user
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    const exists = Array.isArray(existing) && existing.length > 0;
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [insertResult] = await pool.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash]
    );

    const insertedId = (insertResult as { insertId: number }).insertId;

    const token = jwt.sign({ sub: insertedId, email, name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const res = NextResponse.json({
      success: true,
      data: { id: insertedId, name, email },
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to signup" },
      { status: 500 }
    );
  }
}
