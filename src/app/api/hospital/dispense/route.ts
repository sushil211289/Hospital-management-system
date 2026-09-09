import { NextResponse } from "next/server";
import { dispenseInDatabase } from "@/lib/hospital-db";
import { requireStaffSession } from "@/lib/require-staff";

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin" && session.role !== "pharmacist") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await request.json()) as {
    prescriptionId?: string;
    dispensedBy?: string;
  };
  if (!body.prescriptionId) {
    return NextResponse.json({ error: "prescriptionId required" }, { status: 400 });
  }
  const error = await dispenseInDatabase(
    body.prescriptionId,
    body.dispensedBy || session.name,
  );
  if (error) return NextResponse.json({ error }, { status: 409 });
  return NextResponse.json({ ok: true });
}
