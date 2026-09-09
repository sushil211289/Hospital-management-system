import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    reason?: string;
  };
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const reason = body.reason?.trim() ?? "";
  if (name.length < 2 || phone.length < 7 || reason.length < 4) {
    return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
  }
  const row = await prisma.appointmentRequest.create({
    data: { name, phone, reason },
  });
  return NextResponse.json({ id: row.id });
}
