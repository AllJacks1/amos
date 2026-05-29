import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { jwtVerify } from "jose";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);

    const role = payload.role as string;
    const type = payload.type as string;
    const email = payload.email as string;

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
      .order("publish_date", { ascending: true });

    // Role-based filtering
    if (type === "client") {
      const { data: client } = await supabase
        .from("amos_clients")
        .select("id")
        .eq("email", email)
        .single();

      if (!client) {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 },
        );
      }

      query = query.eq("client", client.id);
    }
    // Admin / internal users see everything (no additional filter)

    // Optional filters
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.ilike("content_title", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // === NORMALIZER (matches Zustand mapContent) ===
    const contents = data.map((item: any) => ({
      id: item.id,

      title: item.content_title ?? item.title ?? "",
      caption: item.caption ?? "",

      // Updated: Support both legacy single value and new array format
      platforms: Array.isArray(item.platforms)
        ? item.platforms
        : item.platform
          ? [item.platform]
          : [],

      contentTypes:
        Array.isArray(item.contentTypes) || Array.isArray(item.content_types)
          ? (item.contentTypes ?? item.content_types ?? [])
          : item.contentType || item.content_type
            ? [item.contentType ?? item.content_type]
            : [],

      status: item.status ?? "review",
      publishDate: item.publish_date ?? "",

      client: item.client?.company_name ?? "",
      assignedTo: item.assigned_to?.fullname ?? "",

      driveLinks: Array.isArray(item.gdrive_links) ? item.gdrive_links : [],
      pillar: item.content_pillar ?? item.pillar ?? "",

      priority: item.priority ?? null,
      revisionDueDate: item.revision_due_date ?? null,
      revisionCount: item.revision_count ?? 0,
      revisionNotes: Array.isArray(item.revision_notes)
        ? item.revision_notes
        : [],
    }));

    return NextResponse.json({ contents }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
