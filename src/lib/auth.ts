import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "nexora_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
}

/**
 * Hash password securely using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create and set HTTP-only session cookie
 */
export async function setSessionCookie(user: SessionUser) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
    issuedAt: Date.now(),
  });

  const base64Session = Buffer.from(sessionData).toString("base64");

  cookieStore.set(COOKIE_NAME, base64Session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Get current authenticated user from session cookie
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;

    const decoded = Buffer.from(cookie.value, "base64").toString("utf-8");
    const session = JSON.parse(decoded) as SessionUser;

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  } catch {
    return null;
  }
}

/**
 * Remove session cookie (logout)
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Server-side guard to enforce ADMIN role
 */
export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

/**
 * Record critical admin actions to the AuditLog table
 */
export async function logAudit(
  actor: string,
  action: string,
  entity: string,
  entityId?: string | null,
  metadata?: Record<string, unknown> | null
) {
  try {
    await prisma.auditLog.create({
      data: {
        actor,
        action,
        entity,
        entityId: entityId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
