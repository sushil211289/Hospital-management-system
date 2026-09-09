import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/hospital-db";
import { requireStaffSession } from "@/lib/require-staff";

export async function POST() {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await seedDatabase();
  return NextResponse.json({ ok: true });
}
