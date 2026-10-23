import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * Initiates Google OAuth 2.0 flow
 * Generates secure random state, stores in HTTP-only cookie, and redirects
 */
function getAppOrigin(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim() !== "") {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host;
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const state = crypto.randomBytes(24).toString("hex");

  // Save state in HTTP-only cookie to prevent CSRF
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = getAppOrigin(request);
  const redirectUri = `${origin}/api/auth/google/callback`;

  // If real Google Cloud OAuth credentials are configured
  if (clientId && clientSecret && clientId.trim() !== "") {
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", state);
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    return NextResponse.redirect(googleAuthUrl.toString());
  }

  // If credentials are not yet configured in .env, redirect to simulated consent page
  // so the developer and tester can experience the full OAuth flow seamlessly
  const consentUrl = new URL("/auth/google-consent", origin);
  consentUrl.searchParams.set("state", state);
  return NextResponse.redirect(consentUrl.toString());
}
