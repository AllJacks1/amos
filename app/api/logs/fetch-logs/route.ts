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

    const type = payload.type as string;
    const email = payload.email as string;

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") ?? "";
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "20");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("amos_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    /**
     * CLIENT FILTERING
     */
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

      query = query.eq("client_id", client.id);
    }

    /**
     * SEARCH
     */
    if (search.trim()) {
      query = query.ilike("activity", `%${search.trim()}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("Supabase error:", error);

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const logs =
      data?.map((log) => ({
        id: log.id,
        activity: log.activity,
        created_at: log.created_at,
      })) ?? [];

    return NextResponse.json(
      {
        logs,
        pagination: {
          page,
          limit,
          total: count ?? 0,
          totalPages: Math.ceil((count ?? 0) / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logs API Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
