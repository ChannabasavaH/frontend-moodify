import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/",
    "/signup",
    "/login",
    "/dashboard",
    "/user-profile",
    "/history",
    "/favorites",
  ],
};

export const middleware = (req: NextRequest) => {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const url = req.nextUrl;

  if (
    refreshToken &&
    (url.pathname.startsWith("/signup") || url.pathname.startsWith("/login"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  // Redirect unauthenticated users trying to access protected pages
  if (
    !refreshToken &&
    (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/user-profile") ||
      url.pathname.startsWith("/history") ||
      url.pathname.startsWith("/favorites")
    )
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

};
