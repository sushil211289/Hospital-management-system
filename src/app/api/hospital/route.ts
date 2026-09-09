import { NextResponse } from "next/server";
import { loadHospitalState } from "@/lib/hospital-db";
import { requireStaffSession } from "@/lib/require-staff";

export async function GET() {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await loadHospitalState();
  return NextResponse.json({
    version: 1,
    role: session.role,
    ...data,
    serverTime: new Date().toISOString(),
  });
}
