import { NextRequest, NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";

function isSafeNext(path: string | null) {
  return Boolean(path && path.startsWith("/portal") && !path.startsWith("//"));
}

export function middleware(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/portal") && !session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (pathname === "/login" && session) {
    const next = request.nextUrl.searchParams.get("next");
    const dest = isSafeNext(next) ? next! : "/portal";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal", "/portal/:path*", "/login"],
};
