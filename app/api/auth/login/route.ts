import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

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

    // 1. Try CLIENTS table first
    const { data: client } = await supabase
      .from("amos_clients")
      .select("*")
      .eq("email", email)
      .single();

    if (client) {
      const isValid = await bcrypt.compare(password, client.secret);

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      return NextResponse.json({
        message: "Login successful",
        type: "client",
        user: client,
      });
    }

    // 2. If not found, try USERS table
    const { data: user } = await supabase
      .from("amos_users")
      .select("*")
      .eq("email", email)
      .single();

    if (user) {
      const isValid = await bcrypt.compare(password, user.secret);

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      return NextResponse.json({
        message: "Login successful",
        type: "user",
        user,
      });
    }

    // 3. Not found in both tables
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
