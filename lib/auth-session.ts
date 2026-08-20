import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Talks to the "Simple JWT Login" plugin active on the WP backend — it
// issues/validates/revokes JWTs against real WordPress users (see
// lib/woocommerce.ts for the separate admin-credentialed WC REST client).
const JWT_BASE = `${process.env.NEXT_PUBLIC_WC_URL}/wp-json/simple-jwt-login`;

export const SESSION_COOKIE = "mehr_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Session = { jwt: string; name: string; email: string };

export const jwtAuth = {
  login: (email: string, password: string) =>
    axios.post(`${JWT_BASE}/auth`, { email, password }).then((r) => r.data),

  register: (data: { email: string; password: string; user_login: string; first_name?: string; last_name?: string }) =>
    axios.post(`${JWT_BASE}/register`, data).then((r) => r.data),

  // Confirms the JWT is still valid (not expired/revoked) directly against
  // WordPress — this is what makes "signed in" real instead of a client
  // claim the server just trusts forever.
  validate: (jwt: string) =>
    axios
      .post(`${JWT_BASE}/auth/validate`, { JWT: jwt }, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((r) => r.data)
      .catch(() => ({ success: false })),

  revoke: (jwt: string) =>
    axios
      .post(`${JWT_BASE}/auth/revoke`, { JWT: jwt }, { headers: { Authorization: `Bearer ${jwt}` } })
      .catch(() => null),
};

export function setSessionCookie(res: NextResponse, session: Session) {
  res.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.delete(SESSION_COOKIE);
}

function readCookie(req: NextRequest): Session | null {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.jwt && parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

/** Reads the session cookie and confirms it's still valid against WordPress. */
export async function getSession(req: NextRequest): Promise<Session | null> {
  const session = readCookie(req);
  if (!session) return null;
  const result = await jwtAuth.validate(session.jwt);
  if (!result?.success) return null;
  return session;
}
