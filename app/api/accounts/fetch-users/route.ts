import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  try {
    console.log("Fetching users from Supabase...");
    const { data, error } = await supabase
      .from("amos_users")
      .select("id, fullname, email, role, created_at, status, first_login")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
