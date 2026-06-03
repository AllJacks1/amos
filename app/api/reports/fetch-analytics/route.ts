import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const platform = searchParams.get("platform");
    const contentType = searchParams.get("contentType");

    let query = supabase
      .from("amos_analytics")
      .select("*")
      .order("publish_date", { ascending: false });

    if (platform) {
      query = query.eq("platform", platform);
    }

    if (contentType) {
      query = query.eq("content_type", contentType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase fetch error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    const records = data.map((item) => {
      const interactions =
        (item.likes ?? 0) +
        (item.comments ?? 0) +
        (item.shares ?? 0) +
        (item.saves ?? 0) +
        (item.clicks ?? 0);

      const engagementRate =
        item.reach > 0
          ? Number(((interactions / item.reach) * 100).toFixed(2))
          : 0;

      return {
        id: item.id,
        contentTitle: item.content_title,
        platform: item.platform,
        contentType: item.content_type,
        publishDate: item.publish_date,

        reach: item.reach,
        impressions: item.impressions,
        views: item.views,
        likes: item.likes,
        comments: item.comments,
        shares: item.shares,
        saves: item.saves,
        clicks: item.clicks,
        profileVisits: item.profile_visits,

        isVideoContent: item.is_video_content,
        watchTimeSeconds: item.watch_time_seconds,
        avgWatchTimeSeconds: item.avg_watch_time_seconds,

        interactions,
        engagementRate,
      };
    });

    return NextResponse.json(
      {
        total: records.length,
        records,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch organic performance error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 },
    );
  }
}