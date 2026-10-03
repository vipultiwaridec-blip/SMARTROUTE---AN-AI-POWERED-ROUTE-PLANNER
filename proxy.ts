// Runs before each page (Next.js 16 name for middleware; 04-AUTH N2): refreshes the Supabase session
// cookie and routes people — logged out → /login, logged in → away from /login and /signup, and each role
// to its own area. Routing only: every server action and database rule still checks the user itself.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROLE_HOME, isRole, rolesForPath } from "@/lib/roles";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet, headers) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Keeps the session fresh; must run before any early return.
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  const { pathname } = request.nextUrl;
  const allowed = rolesForPath(pathname);
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (!allowed && !isAuthPage) return response;
  if (!userId) return allowed ? redirectTo(request, response, "/login") : response;

  const { data: me } = await supabase.from("users").select("role, active").eq("id", userId).maybeSingle();
  if (!me?.active || !isRole(me.role)) {
    await supabase.auth.signOut();
    return redirectTo(request, response, "/login?reason=inactive");
  }
  if (isAuthPage || !allowed!.includes(me.role)) return redirectTo(request, response, ROLE_HOME[me.role]);
  return response;
}

// A redirect must carry any refreshed session cookies, or the user is logged out on arrival.
function redirectTo(request: NextRequest, from: NextResponse, path: string) {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|brand/|images/).*)"],
};
