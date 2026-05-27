import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const companyLogo = formData.get("company_logo") as File | null;
    const companyName = formData.get("company_name") as string;
    const industry = formData.get("industry") as string;
    const primaryContactName = formData.get("primary_contact_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const actor = formData.get("actor") as string | null;

    // Validation
    if (
      !companyName ||
      !industry ||
      !primaryContactName ||
      !email ||
      !password ||
      !companyLogo
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check existing client/user
    const { data: existing } = await supabase
      .from("amos_clients")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Client already exists" },
        { status: 409 },
      );
    }

    // Upload logo to Supabase Storage
    const fileExt = companyLogo.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("client-logos")
      .upload(fileName, companyLogo, {
        contentType: companyLogo.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("client-logos").getPublicUrl(fileName);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert client
    const { data, error } = await supabase
      .from("amos_clients")
      .insert([
        {
          company_logo: publicUrl,
          company_name: companyName,
          industry,
          primary_contact_name: primaryContactName,
          email,
          secret: hashedPassword,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("amos_logs").insert([
      {
        activity: `${actor || "SYSTEM"} created client ${companyName} (${email})`,
      },
    ]);

    return NextResponse.json(
      {
        message: "Client created successfully",
        client: data,
      },
      { status: 201 },
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
