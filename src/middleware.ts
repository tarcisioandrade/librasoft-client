import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logout, validateSession } from "./services/session";

const protectedRoutes = ["/review", "/bag", "/rent"];

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  const cookieStore = request.cookies;
  const access_token = cookieStore.get("access_token")?.value;
  const validate = await validateSession();

  let currentUrl = new URL(request.url);

  headers.set("x-current-path", pathname);

  if (pathname.endsWith("/")) {
    const pageNumber = currentUrl.searchParams.get("pageNumber");

    if (!pageNumber) {
      if (!pageNumber) {
        currentUrl.searchParams.set("pageNumber", "1");
      }

      return NextResponse.redirect(currentUrl.href);
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !access_token) {
    return NextResponse.redirect(new URL("/signin", currentUrl.href));
  }

  if (isProtectedRoute && access_token) {
    if (!validate) {
      logout();
      return NextResponse.redirect(new URL("/signin", currentUrl.href));
    }
  }

  const isAuthenticateRoutes = pathname.startsWith("/signin") || pathname.startsWith("/signup");

  if (validate && isAuthenticateRoutes) {
    return NextResponse.redirect(new URL("/", currentUrl.href));
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
