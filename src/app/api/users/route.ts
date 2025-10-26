import { NextRequest, NextResponse } from "next/server";

import pool from "@/utils/lib/database";

export async function GET() {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users ORDER BY created_at DESC"
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Buat user baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone || null]
    );

    const insertResult = result as { insertId: number };
    return NextResponse.json({
      success: true,
      data: { id: insertResult.insertId, name, email, phone },
    });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
