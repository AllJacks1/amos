import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type RevisionNote = {
  commenter: string;
  comment: string;
  created_at: string;
};

type UpdateContent = {
  status?: string;
  priority?: string | null;
  revision_notes?: RevisionNote[];
  revision_due_date?: string | null;
  revision_count?: number;
};

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      status,
      priority,
      revision_notes,
      revision_due_date,
      clientName,
    }: {
      id?: string;
      status?: string;
      priority?: string | null;
      revision_notes?: RevisionNote[];
      revision_due_date?: string | null;
      clientName?: string;
    } = body;

    // ======================
    // 1. VALIDATION
    // ======================
    if (!id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 },
      );
    }

    if (revision_notes && !Array.isArray(revision_notes)) {
      return NextResponse.json(
        { error: "revision_notes must be an array" },
        { status: 400 },
      );
    }

    // ======================
    // 2. GET EXISTING DATA
    // ======================
    const { data: existing, error: fetchError } = await supabase
      .from("amos_contents")
      .select("revision_notes, revision_count")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 },
      );
    }

    // ======================
    // 3. BUILD UPDATE PAYLOAD
    // ======================
    const updateData: UpdateContent = {};

    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (revision_due_date !== undefined)
      updateData.revision_due_date = revision_due_date;

    // ======================
    // 4. APPEND REVISION NOTES (JSONB SAFE)
    // ======================
    if (revision_notes?.length) {
      const existingNotes: RevisionNote[] = Array.isArray(
        existing?.revision_notes,
      )
        ? existing.revision_notes
        : [];

      updateData.revision_notes = [
        ...existingNotes,
        ...revision_notes,
      ];
    }

    // ======================
    // 5. INCREMENT REVISION COUNT SAFELY
    // ======================
    updateData.revision_count =
      (existing?.revision_count ?? 0) + (revision_notes?.length ?? 0);

    // ======================
    // 6. UPDATE DB
    // ======================
    const { data, error } = await supabase
      .from("amos_contents")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    // ======================
    // 7. RESPONSE
    // ======================

    await supabase.from("amos_logs").insert([
      {
        activity: `${clientName} requested a revision for content ${data.id}`,
      },
    ]);
    return NextResponse.json(
      {
        message: "Content updated successfully",
        content: data,
      },
      { status: 200 },
    );
  } catch (error) {
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