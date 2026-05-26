import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, newPassword, confirmPassword } = body;

    // ✅ Validate input
    if (!id || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          error: "ID, new password, and confirm password are required",
        },
        { status: 400 },
      );
    }

    // ✅ Check passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // ✅ Optional minimum length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // ✅ Check if client exists
    const { data: existingClient, error: fetchError } = await supabase
      .from("amos_clients")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existingClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update password
    const { data, error } = await supabase
      .from("amos_clients")
      .update({
        secret: hashedPassword,
      })
      .eq("id", id)
      .select("id, email, company_name");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Password updated successfully",
        client: data,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: `Internal server error: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}
