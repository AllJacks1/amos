import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, adminName } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 },
      );
    }

    // Optional: fetch first (for logging safety / existence check)
    const { data: existing, error: fetchError } = await supabase
      .from("amos_contents")
      .select("id, content_title")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Delete content
    const { error } = await supabase
      .from("amos_contents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("amos_logs").insert([
      {
        activity: `${adminName || "User"} deleted content #${id} (${existing.content_title})`,
      },
    ]);

    return NextResponse.json(
      {
        message: "Content deleted successfully",
        id,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Content delete error:", error);

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
