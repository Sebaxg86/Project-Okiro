import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { sessionIsInactive, shouldRefreshActivity } from "@/lib/auth/session";
import { getSupabasePublicConfig, isSupabaseConfigured } from "./config";

const authRoutes = new Set(["/login", "/register"]);

function redirectWithSessionCookies(url: URL, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

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

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("last_active_at")
      .eq("id", user.id)
      .maybeSingle();

    if (sessionIsInactive(profile?.last_active_at)) {
      await supabase.auth.signOut();
      const target = request.nextUrl.clone();
      target.pathname = "/login";
      target.search = "";
      target.searchParams.set("status", "session-expired");
      return redirectWithSessionCookies(target, response);
    }

    if (shouldRefreshActivity(profile?.last_active_at)) {
      await supabase.rpc("touch_session_activity");
    }
  }

  if (isProtectedRoute && !user) {
    const target = request.nextUrl.clone();
    target.pathname = "/login";
    target.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return redirectWithSessionCookies(target, response);
  }

  if (user && authRoutes.has(pathname)) {
    const target = request.nextUrl.clone();
    target.pathname = "/app";
    target.search = "";
    return redirectWithSessionCookies(target, response);
  }

  if (user && pathname === "/") {
    const target = request.nextUrl.clone();
    target.pathname = "/app";
    target.search = "";
    return redirectWithSessionCookies(target, response);
  }

  return response;
}
