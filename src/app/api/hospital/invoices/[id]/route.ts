import { NextResponse } from "next/server";
import { updateInvoiceInDatabase } from "@/lib/hospital-db";
import { requireStaffSession } from "@/lib/require-staff";
import type { PaymentStatus } from "@/lib/types";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await context.params;
  const patch = (await request.json()) as Partial<{
    discountPercent: number;
    taxPercent: number;
    insuranceCoveragePercent: number;
    deductible: number;
    copay: number;
    amountPaid: number;
    paymentStatus: PaymentStatus;
  }>;
  const error = await updateInvoiceInDatabase(id, patch);
  if (error) return NextResponse.json({ error }, { status: 404 });
  return NextResponse.json({ ok: true });
}
