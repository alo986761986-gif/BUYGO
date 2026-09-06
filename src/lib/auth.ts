import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export type SessionUser = { id: string; email: string; role: 'CUSTOMER'|'SELLER'|'ADMIN'; name?: string|null };
const COOKIE = 'buygo_session';
function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET non configurato');
  return new TextEncoder().encode(secret);
}
export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(key());
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60*60*24*7 });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function currentUser(): Promise<SessionUser|null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, key()); return payload as unknown as SessionUser; } catch { return null; }
}
export async function requireRole(...roles: SessionUser['role'][]) {
  const user = await currentUser();
  if (!user || !roles.includes(user.role)) return null;
  return user;
}
