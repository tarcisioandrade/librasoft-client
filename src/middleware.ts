import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logout, validateSession } from "./services/session";

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  const cookieStore = request.cookies;
  const access_token = cookieStore.get("access_token")?.value;
  const protectedRoutes = ["/teste"];
  const validate = await validateSession();

  headers.set("x-current-path", pathname);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !access_token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isProtectedRoute && access_token) {
    if (!validate) {
      logout();
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  const isAuthenticateRoutes =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  if (validate && isAuthenticateRoutes) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next({
    request: { headers: headers },
  });

  return response;
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
