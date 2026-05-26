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
      status,
      priority,
      revision_notes,
      revision_due_date,
      revision_count,
    } = body;

    // validation
    if (!id) {
      return NextResponse.json(
        {
          error: "Content ID is required",
        },
        { status: 400 },
      );
    }

    // validate revision_notes
    if (revision_notes && !Array.isArray(revision_notes)) {
      return NextResponse.json(
        {
          error: "revision_notes must be an array",
        },
        { status: 400 },
      );
    }

    interface UpdateContent {
      status?: string | null;
      priority?: string | null;
      revision_notes?: unknown[] | null;
      revision_due_date?: string | null;
      revision_count?: number | null;
    }

    const updateData: Partial<UpdateContent> = {};

    if (status !== undefined) updateData.status = status;

    if (priority !== undefined) updateData.priority = priority;

    if (revision_notes !== undefined)
      updateData.revision_notes = revision_notes;

    if (revision_due_date !== undefined)
      updateData.revision_due_date = revision_due_date;

    if (revision_count !== undefined)
      updateData.revision_count = revision_count;

    const { data, error } = await supabase
      .from("amos_contents")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Content updated successfully",
        content: data,
      },
      { status: 200 },
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
