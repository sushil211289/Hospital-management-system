import { cookies } from "next/headers";
import { decodeSession, SESSION_COOKIE, type StaffSession } from "@/lib/auth";

export async function requireStaffSession(): Promise<StaffSession | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}
