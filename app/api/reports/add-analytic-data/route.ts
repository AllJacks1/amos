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
      contentTitle,
      platform,
      contentType,
      publishDate,

      reach,
      impressions,
      views,
      likes,
      comments,
      shares,
      saves,
      clicks,
      profileVisits,

      isVideoContent,
      watchTimeSeconds,
      avgWatchTimeSeconds,

      adminName,
    } = body;

    // Validation
    if (!contentTitle?.trim()) {
      return NextResponse.json(
        { error: "Content title is required" },
        { status: 400 },
      );
    }

    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 },
      );
    }

    if (!contentType) {
      return NextResponse.json(
        { error: "Content type is required" },
        { status: 400 },
      );
    }

    if (!publishDate) {
      return NextResponse.json(
        { error: "Publish date is required" },
        { status: 400 },
      );
    }

    if (impressions < reach) {
      return NextResponse.json(
        { error: "Impressions must be greater than or equal to reach" },
        { status: 400 },
      );
    }

    if (isVideoContent) {
      if (!watchTimeSeconds || watchTimeSeconds <= 0) {
        return NextResponse.json(
          { error: "Watch time is required for video content" },
          { status: 400 },
        );
      }

      if (!avgWatchTimeSeconds || avgWatchTimeSeconds <= 0) {
        return NextResponse.json(
          { error: "Average watch time is required for video content" },
          { status: 400 },
        );
      }
    }

    const { data, error } = await supabase
      .from("amos_analytics")
      .insert([
        {
          content_title: contentTitle,
          platform,
          content_type: contentType,
          publish_date: publishDate,

          reach,
          impressions,
          views,
          likes,
          comments,
          shares,
          saves,
          clicks,
          profile_visits: profileVisits,

          is_video_content: isVideoContent,
          watch_time_seconds: watchTimeSeconds ?? 0,
          avg_watch_time_seconds: avgWatchTimeSeconds ?? 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    const interactions =
      (data.likes ?? 0) +
      (data.comments ?? 0) +
      (data.shares ?? 0) +
      (data.saves ?? 0) +
      (data.clicks ?? 0);

    const engagementRate =
      data.reach > 0
        ? Number(((interactions / data.reach) * 100).toFixed(2))
        : 0;

    await supabase.from("amos_logs").insert([
      {
        activity: `${adminName} added organic performance data for "${data.content_title}"`,
      },
    ]);

    return NextResponse.json(
      {
        message: "Performance data created successfully",
        record: {
          id: data.id,
          contentTitle: data.content_title,
          platform: data.platform,
          contentType: data.content_type,
          publishDate: data.publish_date,

          reach: data.reach,
          impressions: data.impressions,
          views: data.views,
          likes: data.likes,
          comments: data.comments,
          shares: data.shares,
          saves: data.saves,
          clicks: data.clicks,
          profileVisits: data.profile_visits,

          isVideoContent: data.is_video_content,
          watchTimeSeconds: data.watch_time_seconds,
          avgWatchTimeSeconds: data.avg_watch_time_seconds,

          interactions,
          engagementRate,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create organic post error:", error);

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