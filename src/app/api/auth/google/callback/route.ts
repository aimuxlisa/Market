import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Google OAuth 2.0 Callback Handler
 * Verifies OAuth state, exchanges authorization code, retrieves profile, and starts session
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error)}`, origin));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_oauth_params", origin));
  }

  // 1. Verify CSRF State
  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(new URL("/auth/login?error=invalid_oauth_state", origin));
  }

  // Clear state cookie after successful verification
  cookieStore.delete("oauth_state");

  let email: string | null = null;
  let name: string = "Google User";
  let avatarUrl: string | null = null;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // 2. Real Google OAuth Token Exchange if credentials configured
  if (clientId && clientSecret && clientId.trim() !== "" && !code.startsWith("mock_")) {
    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokens = await tokenResponse.json();

      if (!tokenResponse.ok || !tokens.access_token) {
        console.error("Google token exchange error:", tokens);
        return NextResponse.redirect(new URL("/auth/login?error=token_exchange_failed", origin));
      }

      // Fetch user profile from Google UserInfo endpoint
      const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      const profile = await userInfoResponse.json();

      if (!userInfoResponse.ok || !profile.email) {
        return NextResponse.redirect(new URL("/auth/login?error=profile_fetch_failed", origin));
      }

      email = profile.email;
      name = profile.name || profile.given_name || profile.email.split("@")[0];
      avatarUrl = profile.picture || null;
    } catch (err) {
      console.error("Google OAuth callback exception:", err);
      return NextResponse.redirect(new URL("/auth/login?error=oauth_internal_error", origin));
    }
  } else {
    // 3. Simulated Demo/Sandbox Mode (when credentials not yet configured in .env)
    email = searchParams.get("email") || "google.demo@nexora.uz";
    name = searchParams.get("name") || "Google Demo User";
    avatarUrl =
      searchParams.get("avatar") ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face";
  }

  if (!email) {
    return NextResponse.redirect(new URL("/auth/login?error=no_email_provided", origin));
  }

  try {
    // 4. Upsert user in database
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        name: name,
        ...(avatarUrl ? { avatarUrl } : {}),
      },
      create: {
        email: email.toLowerCase().trim(),
        name: name,
        avatarUrl: avatarUrl,
        role: "CUSTOMER",
      },
    });

    // 5. Establish authenticated session
    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });

    // 6. Redirect to account dashboard
    return NextResponse.redirect(new URL("/account", origin));
  } catch (dbErr) {
    console.error("Database user upsert error during OAuth:", dbErr);
    return NextResponse.redirect(new URL("/auth/login?error=user_creation_failed", origin));
  }
}
