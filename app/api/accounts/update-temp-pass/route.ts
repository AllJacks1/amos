import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type UserType = "user" | "client";

interface AccountRecord {
  id: string;
  email: string;
  table: UserType;
  first_login?: boolean;
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, newPassword, confirmPassword } = body;

    // ─── VALIDATE INPUT ──────────────────────────────
    if (!id || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "ID, new password, and confirm password are required" },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // ─── CHECK BOTH TABLES ───────────────────────────
    let account: AccountRecord | null = null;
    let tableName: UserType | null = null;

    // Try amos_users first
    const { data: userData, error: userError } = await supabase
      .from("amos_users")
      .select("id, email, first_login")
      .eq("id", id)
      .single();

    if (userData) {
      account = { ...userData, table: "user" };
      tableName = "user";
    }

    // If not found in users, try amos_clients
    if (!account) {
      const { data: clientData, error: clientError } = await supabase
        .from("amos_clients")
        .select("id, email, first_login")
        .eq("id", id)
        .single();

      if (clientData) {
        account = { ...clientData, table: "client" };
        tableName = "client";
      }
    }

    // Account not found in either table
    if (!account || !tableName) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // ─── HASH & UPDATE PASSWORD ──────────────────────
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const targetTable = tableName === "user" ? "amos_users" : "amos_clients";

    const { data: updatedAccount, error: updateError } = await supabase
      .from(targetTable)
      .update({
        secret: hashedPassword,
        first_login: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, email, first_login");

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await supabase.from("amos_logs").insert([
      {
        activity: `User ${account.email} changed temporary password`,
      },
    ]);

    return NextResponse.json(
      {
        message: "Password updated successfully",
        account: updatedAccount,
        type: tableName,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
