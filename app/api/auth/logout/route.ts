import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  let userEmail = "unknown";

  // 🔥 Extract user BEFORE deleting cookie
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      userEmail = (payload.email as string) || "unknown";
    } catch {
      // invalid token — still allow logout
    }
  }

  // 🔥 LOG logout activity
  await supabase.from("amos_logs").insert([
    {
      activity: `User ${userEmail} logged out`,
    },
  ]);

  // 🔥 clear cookie
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
