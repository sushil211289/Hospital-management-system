import type { Role } from "./types";

export type StaffSession = {
  email: string;
  name: string;
  role: Role;
  title: string;
};

export type StaffAccount = StaffSession & {
  password: string;
};

export const STAFF_ACCOUNTS: StaffAccount[] = [
  {
    email: "a.desai@meridian.hospital",
    password: "Meridian#Admin24",
    name: "Anita Desai",
    role: "admin",
    title: "Hospital Administrator",
  },
  {
    email: "p.nair@meridian.hospital",
    password: "Meridian#Care24",
    name: "Dr. Priya Nair",
    role: "clinical",
    title: "Pulmonologist",
  },
  {
    email: "d.park@meridian.hospital",
    password: "Meridian#Rx24",
    name: "David Park, PharmD",
    role: "pharmacist",
    title: "Clinical Pharmacist",
  },
];

export const SESSION_COOKIE = "meridian_staff_session";

export function authenticateStaff(email: string, password: string): StaffSession | null {
  const normalized = email.trim().toLowerCase();
  const account = STAFF_ACCOUNTS.find(
    (item) => item.email === normalized && item.password === password,
  );
  if (!account) return null;
  return {
    email: account.email,
    name: account.name,
    role: account.role,
    title: account.title,
  };
}

export function encodeSession(session: StaffSession) {
  const bytes = new TextEncoder().encode(JSON.stringify(session));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeSession(token: string | undefined): StaffSession | null {
  if (!token) return null;
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded + "=".repeat((4 - (padded.length % 4)) % 4);
    const binary = atob(pad);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as StaffSession;
    if (!parsed.email || !parsed.role || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}
