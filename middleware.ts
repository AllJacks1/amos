import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// 🚧 Routes still in development (BLOCK ALL USERS)
const blockedRoutes = [
  "/analytics",
  "/client-approvals",
  "/client-dashboard",
  "/content-calendar",
  "/dashboard",
  "/media-library",
  "/performance-tracker",
  "/reports",
];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 🚫 BLOCK THESE ROUTES EVEN IF LOGGED IN
  const isBlocked = blockedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isBlocked) {
    return NextResponse.redirect(new URL("/coming-soon", req.url));
  }

  // 🔒 Require auth for everything else protected
  const protectedRoutes = ["/content", "/approvals", "/clients", "/settings"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/analytics/:path*",
    "/client-approvals/:path*",
    "/client-dashboard/:path*",
    "/content-calendar/:path*",
    "/dashboard/:path*",
    "/media-library/:path*",
    "/performance-tracker/:path*",
    "/reports/:path*",
    "/content/:path*",
    "/approvals/:path*",
    "/clients/:path*",
    "/settings/:path*",
  ],
};