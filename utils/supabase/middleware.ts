import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  // Refreshes the auth token and writes the rotated cookies onto supabaseResponse.
  // Do not remove: without this call the session is never refreshed.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 로그인하지 않은 사용자는 인증 페이지만 볼 수 있습니다.
  // 그 외 페이지(인덱스, 폴더별, 새 링크)는 로그인 페이지로 보냅니다.
  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return supabaseResponse
};

/** 로그인 없이 열 수 있는 경로. API 라우트는 페이지가 아니므로 리다이렉트 대상에서 뺍니다. */
const PUBLIC_PATHS = ["/login", "/signup"]

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ) || pathname.startsWith("/api/")
  )
}
