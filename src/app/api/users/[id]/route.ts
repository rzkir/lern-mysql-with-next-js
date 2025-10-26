import { NextRequest, NextResponse } from "next/server";

import pool from "@/utils/lib/database";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

// GET - Ambil user berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      params.id,
    ]);

    const userRows = rows as User[];
    if (userRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: userRows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT - Update user berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const [existingRows] = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [params.id]
    );
    const existingUserRows = existingRows as User[];
    if (existingUserRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update user
    await pool.execute(
      "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone || null, params.id]
    );

    return NextResponse.json({
      success: true,
      data: { id: params.id, name, email, phone },
    });
  } catch (error: unknown) {
    console.error("Error updating user:", error);
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
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus user berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek apakah user ada
    const [existingRows] = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [params.id]
    );
    const existingUserRows = existingRows as User[];
    if (existingUserRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Hapus user
    await pool.execute("DELETE FROM users WHERE id = ?", [params.id]);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
