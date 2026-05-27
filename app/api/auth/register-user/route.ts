import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { fullName, email, role, password, actor } = body;

    // Basic validation
    if (!fullName || !email || !role || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("amos_users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to Supabase
    const { data, error } = await supabase
      .from("amos_users")
      .insert([
        {
          fullname: fullName,
          email,
          role,
          secret: hashedPassword,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("amos_logs").insert([
      {
        activity: `${actor || "SYSTEM"} created user ${fullName} (${email}) with role ${role}`,
      },
    ]);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: data,
      },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
