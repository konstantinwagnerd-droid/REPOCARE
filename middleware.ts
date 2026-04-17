import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;
  const isProtected = path.startsWith("/app") || path.startsWith("/admin") || path.startsWith("/family");

  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && req.auth?.user) {
    const role = req.auth.user.role;
    if (path.startsWith("/admin") && role !== "admin" && role !== "pdl") {
      return NextResponse.redirect(new URL("/app", nextUrl));
    }
    if (path.startsWith("/family") && role !== "angehoeriger") {
      return NextResponse.redirect(new URL("/app", nextUrl));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|webp|ico)).*)"],
};
