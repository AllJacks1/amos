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
  first_login?: boolean;
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      type,
      newPassword,
      confirmPassword,
    }: {
      id: string;
      type: UserType;
      newPassword: string;
      confirmPassword: string;
    } = body;

    // ─── VALIDATE INPUT ──────────────────────────────
    if (!id || !type || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          error: "ID, type, new password, and confirm password are required",
        },
        { status: 400 },
      );
    }

    if (type !== "user" && type !== "client") {
      return NextResponse.json(
        { error: "Invalid account type" },
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

    // ─── DETERMINE TARGET TABLE ──────────────────────
    const targetTable = type === "client" ? "amos_clients" : "amos_users";

    console.log("================================");
    console.log("Incoming ID:", id);
    console.log("Account Type:", type);
    console.log("Target Table:", targetTable);
    console.log("================================");

    // ─── FETCH ACCOUNT FROM CORRECT TABLE ────────────
    const { data: account, error: accountError } = await supabase
      .from(targetTable)
      .select("id, email, first_login")
      .eq("id", id)
      .single<AccountRecord>();

    if (accountError || !account) {
      console.error("Account lookup error:", accountError);

      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // ─── HASH PASSWORD ───────────────────────────────
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ─── UPDATE ACCOUNT ──────────────────────────────
    const { data: updatedAccount, error: updateError } = await supabase
      .from(targetTable)
      .update({
        secret: hashedPassword,
        first_login: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, email, first_login")
      .single();

    if (updateError) {
      console.error("Password update error:", updateError);

      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // ─── LOG ACTIVITY ────────────────────────────────
    await supabase.from("amos_logs").insert([
      {
        activity: `${type === "client" ? "Client" : "User"} ${
          account.email
        } changed temporary password`,
      },
    ]);

    return NextResponse.json(
      {
        message: "Password updated successfully",
        account: updatedAccount,
        type,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Password change error:", error);

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
