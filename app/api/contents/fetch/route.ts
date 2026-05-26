import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type DbContent = {
  id: string;
  content_title: string;
  caption: string;
  platform: string;
  content_type: string;
  status: string;
  publish_date: string;
  gdrive_links: string[];
  content_pillar: string;
  client: { company_name: string } | null;
  assigned_to: { fullname: string } | null;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = supabase
      .from("amos_contents")
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
      .order("publish_date", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.ilike("content_title", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const contents = (data as DbContent[]).map((item) => ({
      id: item.id,
      title: item.content_title,
      caption: item.caption,
      platform: item.platform,
      contentType: item.content_type,
      status: item.status ?? "draft",
      publishDate: item.publish_date,
      client: item.client?.company_name ?? "",
      assignedTo: item.assigned_to?.fullname ?? "",
      driveLinks: item.gdrive_links ?? [],
      pillar: item.content_pillar,
    }));

    return NextResponse.json({ contents }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
