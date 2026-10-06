import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import { readPageSettings } from "@/lib/page-routing-store";
import { routingDecision } from "@/lib/page-routing";
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(pathname)) return NextResponse.next();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (await isValidSessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();
    const url = req.nextUrl.clone(); url.pathname = "/admin/login"; url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const map = await readPageSettings();
  const decision = routingDecision(pathname, map);
  if (!decision) return NextResponse.next();
  const url = req.nextUrl.clone(); url.pathname = decision.path;
  // Temporary redirects avoid stale browser redirects when an admin restores an earlier URL.
  if (decision.kind === "redirect") return NextResponse.redirect(url, 307);
  return NextResponse.rewrite(url);
}
export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|_next|media|.*\\..*).*)"],
};
