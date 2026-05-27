import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      content_title,
      caption,
      platform,
      content_type,
      client,
      assigned_to,
      content_pillar,
      publish_date,
      gdrive_links,
    } = body;

    // validation
    if (
      !content_title ||
      !platform ||
      !content_type ||
      !client ||
      !assigned_to ||
      !publish_date
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // optional:
    // validate gdrive_links is array
    if (gdrive_links && !Array.isArray(gdrive_links)) {
      return NextResponse.json(
        {
          error: "gdrive_links must be an array",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("amos_contents")
      .insert([
        {
          content_title,
          caption,
          platform,
          content_type,
          client,
          assigned_to,
          content_pillar,
          publish_date,
          gdrive_links,
        },
      ])
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
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
      );
    }

    const normalizedContent = {
      id: data.id,
      title: data.content_title,
      caption: data.caption,
      platform: data.platform,
      contentType: data.content_type,
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

    return NextResponse.json(
      {
        message: "Content created successfully",
        content: normalizedContent,
      },
      { status: 201 },
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
