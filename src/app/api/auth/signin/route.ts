import { NextRequest, NextResponse } from "next/server";

import pool from "@/utils/lib/database";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET;

const SigninSchema = z.object({
  emailOrName: z.string().min(1, "Email atau nama harus diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = SigninSchema.safeParse(json);
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
    const { emailOrName, password } = parsed.data;

    const [rows] = await pool.execute(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = ? OR name = ?",
      [emailOrName, emailOrName]
    );

    const users = rows as Array<{
      id: number;
      name: string;
      email: string;
      password_hash: string;
      role: "admin" | "user";
    }>;
    if (!users.length) {
      return NextResponse.json(
        { success: false, error: "Email/nama atau password tidak valid" },
        { status: 401 }
      );
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Email/nama atau password tidak valid" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const res = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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
