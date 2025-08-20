import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

const SUPER_ADMIN_PATHS = ["/api/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret });

  // 1. NextAuth.js 관련 경로 처리
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. 로그인 상태에 따른 리디렉션 처리
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  // 토큰이 있는데 로그인 페이지에 접근하면 대시보드로 리디렉션
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  // 토큰이 없는데 보호된 페이지(대시보드)에 접근하면 로그인 페이지로 리디렉션
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3. 슈퍼 어드민 권한 확인
  // 정의된 슈퍼 어드민 경로에 접근할 때만 권한을 확인
  if (SUPER_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    if (!token || token.role !== "SUPERADMIN") {
      return NextResponse.json(
        {
          error:
            "접근 권한이 없습니다. 최고 관리자만 이 작업을 수행할 수 있습니다.",
        },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login", "/", "/api/admin/:path*"],
};
