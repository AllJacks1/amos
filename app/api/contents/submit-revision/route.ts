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
      platform,
      content_type,
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

    const { data, error } = await supabase
      .from("amos_contents")
      .update({
        content_title,
        caption,
        platform,
        content_type,
        content_pillar,
        publish_date,
        gdrive_links,
        status,
        revision_notes,

        // optional:
        // updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("amos_logs").insert([
      {
        activity: `${adminName} submitted a revision for content ${data.id}`,
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        content: data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
