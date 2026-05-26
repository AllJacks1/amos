import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const { id } = body;

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("amos_users")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update status instead of deleting
    const { data, error } = await supabase
      .from("amos_users")
      .update({
        status: "deactivated",
      })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "User deactivated successfully",
        user: data,
      },
      { status: 200 },
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
