import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig, isSupabaseConfigured } from "./config";

const authRoutes = new Set(["/login", "/register"]);

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname === "/app" || pathname.startsWith("/app/");

  if (!isSupabaseConfigured()) {
    if (isProtectedRoute) {
      const target = request.nextUrl.clone();
      target.pathname = "/login";
      target.searchParams.set("status", "configuration");
      return NextResponse.redirect(target);
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabasePublicConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    const target = request.nextUrl.clone();
    target.pathname = "/login";
    target.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(target);
  }

  if (user && authRoutes.has(pathname)) {
    const target = request.nextUrl.clone();
    target.pathname = "/app";
    target.search = "";
    return NextResponse.redirect(target);
  }

  return response;
}
