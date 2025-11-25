// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  // if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const role = token;
    const pathname = req.nextUrl.pathname;

    // RBAC checks
    // if (pathname.startsWith("/dashboard/admin") && role !== "Admin") {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }

    // if (
    //   pathname.startsWith("/dashboard/business-owner") &&
    //   !["Admin", "BusinessOwner"].includes(role)
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
    // if (
    //   pathname.startsWith("/dashboard/client") &&
    //   !["Admin", "Client"].includes(role)
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
    // if (
    //   pathname.startsWith("/dashboard/content-creator") &&
    //   !["Admin", "ContentCreator"].includes(role)
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
    // if (
    //   pathname.startsWith("/dashboard/data-analyst") &&
    //   !["Admin", "DataAnalyst"].includes(role)
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
    // if (
    //   pathname.startsWith("/dashboard/data-engineer") &&
    //   !["Admin", "DataEngineer"].includes(role)
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
    // if (
    //   pathname.startsWith("/dashboard/executive-stakeholder") &&
    //   !["Admin", "Executive"].includes(role)
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
    // if (
    //   pathname.startsWith("/dashboard/marketing-manager") &&
    //   !["Admin", "Marketing"].includes(role)
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
    // if (
    //   pathname.startsWith("/dashboard/sales-rep") &&
    //   !["Admin", "SalesRep"].includes(role)
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply only to dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
