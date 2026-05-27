import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      content_title,
      caption,
      platforms, // ← New array field
      content_types, // ← New array field
      content_pillar,
      publish_date,
      gdrive_links,
      status,
      revision_notes,
      adminName,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 },
      );
    }

    // Basic validation
    if (!content_title?.trim() || !caption?.trim()) {
      return NextResponse.json(
        { error: "Title and caption are required" },
        { status: 400 },
      );
    }

    const updatePayload: any = {
      content_title: content_title.trim(),
      caption: caption.trim(),
      content_pillar,
      publish_date,
      gdrive_links: Array.isArray(gdrive_links) ? gdrive_links : [],
      status,
      revision_notes: Array.isArray(revision_notes) ? revision_notes : [],
      updated_at: new Date().toISOString(),
    };

    // Handle platforms (new array format)
    if (Array.isArray(platforms)) {
      updatePayload.platforms = platforms;
    } else if (body.platform) {
      updatePayload.platforms = [body.platform]; // backward compatibility
    }

    // Handle content types (new array format)
    if (Array.isArray(content_types)) {
      updatePayload.content_types = content_types;
    } else if (body.content_type) {
      updatePayload.content_types = [body.content_type]; // backward compatibility
    }

    const { data, error } = await supabase
      .from("amos_contents")
      .update(updatePayload)
      .eq("id", id)
      .select(
        `
        *,
        client:amos_clients(company_name),
        assigned_to:amos_users(fullname)
      `,
      )
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    if (adminName) {
      await supabase.from("amos_logs").insert([
        {
          activity: `${adminName} submitted a revision for content ${data.id}`,
        },
      ]);
    }

    return NextResponse.json(
      {
        success: true,
        content: data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/contents error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
