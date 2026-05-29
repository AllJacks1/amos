import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id, // ← Required for update
      content_title,
      caption,
      platforms,
      content_types,
      client,
      assigned_to,
      content_pillar,
      publish_date,
      gdrive_links,
      adminName,
    } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 },
      );
    }

    if (
      !content_title ||
      !platforms ||
      !Array.isArray(platforms) ||
      platforms.length === 0 ||
      !content_types ||
      !Array.isArray(content_types) ||
      content_types.length === 0 ||
      !client ||
      !assigned_to ||
      !publish_date
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (platforms and content_types must be non-empty arrays)",
        },
        { status: 400 },
      );
    }

    if (gdrive_links && !Array.isArray(gdrive_links)) {
      return NextResponse.json(
        { error: "gdrive_links must be an array" },
        { status: 400 },
      );
    }

    // Update the content
    const { data, error } = await supabase
      .from("amos_contents")
      .update({
        content_title,
        caption,
        platforms,
        content_types,
        client,
        assigned_to,
        content_pillar,
        publish_date,
        gdrive_links: gdrive_links || [],
      })
      .eq("id", id)
      .select(
        `
        *,
        client:amos_clients (
          id,
          company_name,
          company_logo
        ),
        assigned_to:amos_users (
          id,
          fullname,
          email
        )
      `,
      )
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Normalized response (same shape as create)
    const normalizedContent = {
      id: data.id,
      title: data.content_title,
      caption: data.caption,
      platforms: data.platforms || [],
      contentTypes: data.content_types || [],
      status: data.status ?? "review",
      publishDate: data.publish_date,

      client: data.client?.company_name ?? "",
      assignedTo: data.assigned_to?.fullname ?? "",

      driveLinks: data.gdrive_links ?? [],
      pillar: data.content_pillar,

      priority: data.priority ?? null,
      revisionDueDate: data.revision_due_date ?? null,
      revisionCount: data.revision_count ?? null,
      revisionNotes: data.revision_notes ?? [],
    };

    // Log activity
    await supabase.from("amos_logs").insert([
      {
        activity: `${adminName} updated content #${data.id}`,
      },
    ]);

    return NextResponse.json(
      {
        message: "Content updated successfully",
        content: normalizedContent,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Content update error:", error);

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
