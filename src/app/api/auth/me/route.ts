import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

import pool from "@/utils/lib/database";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: number;
      email: string;
      name: string;
    };

    const [rows] = await pool.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decoded.sub]
    );

    const users = rows as Array<{ id: number; name: string; email: string }>;
    if (!users.length) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: users[0] });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}
