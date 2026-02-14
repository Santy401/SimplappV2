import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
} from "@interfaces/lib/auth/token";

/**
 * POST /api/auth/refresh
 * Renueva el access token usando el refresh token
 */
export async function POST(req: NextRequest) {
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

    const refreshTokenRecord = await verifyRefreshToken(refreshToken);
    if (!refreshTokenRecord?.user) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    if (!tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 },
      );
    }

    const newAccessToken = await generateAccessToken(
      refreshTokenRecord.user.id,
      refreshTokenRecord.user.email
    );

    await revokeRefreshToken(refreshToken);
    const newRefreshToken = await generateRefreshToken(tokenData.user.id);

    const response = NextResponse.json({
      message: "Token refreshed successfully",
      user: {
        id: tokenData.user.id,
        email: tokenData.user.email,
        name: tokenData.user.name,
      },
      accessToken: newAccessToken,
    });

    response.cookies.set("access-token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, 
      path: "/",
    });

    response.cookies.set("refresh-token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, 
      path: "/",
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
