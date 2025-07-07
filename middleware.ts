import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

// ✅ Prevents middleware from running on login/signup pages
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|login|signup|.*\\.png$).*)",
  ],
}
