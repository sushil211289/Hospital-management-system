import { NextResponse } from "next/server";
import { addPrescriptionInDatabase } from "@/lib/hospital-db";
import { requireStaffSession } from "@/lib/require-staff";
import type { PrescriptionItem } from "@/lib/types";

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin" && session.role !== "clinical") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await request.json()) as {
    patientId?: string;
    prescribedBy?: string;
    notes?: string;
    items?: PrescriptionItem[];
  };
  if (!body.patientId || !body.items?.length) {
    return NextResponse.json({ error: "Invalid prescription" }, { status: 400 });
  }
  await addPrescriptionInDatabase({
    patientId: body.patientId,
    prescribedBy: body.prescribedBy || session.name,
    notes: body.notes ?? "",
    items: body.items,
  });
  return NextResponse.json({ ok: true });
}
