import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    let foundUser: {
      id: string;
      email: string;
      secret: string;
      role?: string | null;
      [key: string]: unknown;
    } | null = null;
    let type: "client" | "user" | null = null;

    // 1. Try CLIENTS table
    const { data: client } = await supabase
      .from("amos_clients")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (client) {
      const isValid = await bcrypt.compare(password, client.secret);

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      foundUser = client;
      type = "client";
    }

    // 2. Try USERS table
    if (!foundUser) {
      const { data: user } = await supabase
        .from("amos_users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (user) {
        const isValid = await bcrypt.compare(password, user.secret);

        if (!isValid) {
          return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 },
          );
        }

        foundUser = user;
        type = "user";
      }
    }

    // 3. Not found
    if (!foundUser || !type) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // 🔐 CREATE JWT
    const token = jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role ?? null,
        type,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // 🍪 SET HTTP-ONLY COOKIE
    const response = NextResponse.json({
      message: "Login successful",
      type,
      user: {
        ...foundUser,
        secret: undefined, // 🚨 never expose password hash
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
