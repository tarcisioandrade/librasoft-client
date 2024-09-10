import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSession, getSession } from "./services/session.service";
import { EUserRole } from "./enums/EUserRole";
import { Constants } from "./constants";

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  const validate = await validateSession();
  const session = await getSession();

  let currentUrl = new URL(request.url);

  headers.set("x-current-path", pathname);

  if (pathname.endsWith("/")) {
    const pageNumber = currentUrl.searchParams.get("pageNumber");
    if (!pageNumber) {
      currentUrl.searchParams.set("pageNumber", "1");
      return NextResponse.redirect(currentUrl.href);
    }
  }

  const isProtectedRoute = Constants.PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/signin", currentUrl.href));
  }

  if (isProtectedRoute && session) {
    if (!validate) {
      return NextResponse.redirect(new URL("/signin", currentUrl.href));
    }
  }

  const isAuthenticateRoutes = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isOnlyAdminRoutes = pathname.startsWith("/dashboard");

  if (session && isAuthenticateRoutes) {
    return NextResponse.redirect(new URL("/", currentUrl.href));
  }

  if (isOnlyAdminRoutes && session?.user.role !== EUserRole.Admin) {
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
