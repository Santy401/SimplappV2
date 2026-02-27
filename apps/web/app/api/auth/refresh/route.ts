import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
} from "@interfaces/lib/auth/token";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/auth/refresh
 * Renueva el access token usando el refresh token
 */
export async function POST(req: NextRequest) {
  // Rate limiting más permisivo: tokens se auto-renuevan cada 13 min
  const { allowed, response: rateLimitResponse } = rateLimit(req, {
    limit: 30,
    windowSec: 15 * 60,
  });
  if (!allowed) return rateLimitResponse!
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 },
      );
    }

    const tokenData = await verifyRefreshToken(refreshToken);

    if (!tokenData?.user) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 },
      );
    }

    const newAccessToken = await generateAccessToken(
      tokenData.user.id,
      tokenData.user.email
    );

    await revokeRefreshToken(refreshToken);
    const newRefreshToken = await generateRefreshToken(tokenData.user.id);

    const response = NextResponse.json({
      message: "Token refreshed successfully",
    });

    // Domain para cookies cross-subdomain
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

    response.cookies.set("access-token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
      ...(cookieDomain && { domain: cookieDomain }),
    });

    response.cookies.set("refresh-token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      ...(cookieDomain && { domain: cookieDomain }),
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
