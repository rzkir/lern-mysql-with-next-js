import { NextRequest, NextResponse } from "next/server";

import pool from "@/utils/lib/database";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET;

const SignupSchema = z.object({
  name: z.string().min(2, "Name minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = SignupSchema.safeParse(json);
    if (!parsed.success) {
      type ValidationIssue = { path: (string | number)[]; message: string };
      return NextResponse.json(
        {
          success: false,
          error: "Validasi gagal",
          issues: (parsed.error.issues as unknown as ValidationIssue[]).map(
            (i) => ({
              path: i.path.join("."),
              message: i.message,
            })
          ),
        },
        { status: 400 }
      );
    }
    const { name, email, password } = parsed.data;

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

    // dapatkan role user setelah insert
    const [rows] = await pool.execute("SELECT role FROM users WHERE id = ?", [
      insertedId,
    ]);
    const usersWithRole = rows as Array<{ role: string }>;
    const role = usersWithRole.length > 0 ? usersWithRole[0].role : "user";

    const token = jwt.sign({ sub: insertedId, email, name, role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const res = NextResponse.json({
      success: true,
      data: { id: insertedId, name, email, role },
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
