import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { fromDbPay, mapInvoice, mapMedicine, mapPatient, mapPayslip, mapPrescription, mapStaff, toDbBlood, toDbPay, toDbRoom } from "@/lib/db-map";
import { STAFF_ACCOUNTS } from "@/lib/auth";
import { computeInvoiceTotals } from "@/lib/finance";
import { uid } from "@/lib/format";
import { seedState } from "@/lib/seed";
import type { HospitalState, PaymentStatus, PrescriptionItem } from "@/lib/types";

export async function loadHospitalState(): Promise<Omit<HospitalState, "role" | "version">> {
  const [patients, medicines, prescriptions, invoices, staff, payslips] =
    await Promise.all([
      prisma.patient.findMany({
        include: { allergies: true, vitals: true, consultations: true },
        orderBy: { lastName: "asc" },
      }),
      prisma.medicine.findMany({ orderBy: { name: "asc" } }),
      prisma.prescription.findMany({
        include: { items: true },
        orderBy: { prescribedAt: "desc" },
      }),
      prisma.invoice.findMany({ include: { lineItems: true } }),
      prisma.staffMember.findMany({ orderBy: { name: "asc" } }),
      prisma.payslip.findMany({ orderBy: { period: "desc" } }),
    ]);

  return {
    patients: patients.map(mapPatient),
    medicines: medicines.map(mapMedicine),
    prescriptions: prescriptions.map(mapPrescription),
    invoices: invoices.map(mapInvoice),
    staff: staff.map(mapStaff),
    payslips: payslips.map(mapPayslip),
  };
}

export async function seedDatabase() {
  await prisma.$transaction([
    prisma.billingLine.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.prescriptionItem.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.allergy.deleteMany(),
    prisma.vital.deleteMany(),
    prisma.consultation.deleteMany(),
    prisma.payslip.deleteMany(),
    prisma.appointmentRequest.deleteMany(),
    prisma.medicine.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.staffMember.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  for (const account of STAFF_ACCOUNTS) {
    await prisma.user.create({
      data: {
        email: account.email,
        passwordHash: await bcrypt.hash(account.password, 10),
        name: account.name,
        role: account.role,
        title: account.title,
      },
    });
  }

  for (const patient of seedState.patients) {
    await prisma.patient.create({
      data: {
        id: patient.id,
        mrn: patient.mrn,
        firstName: patient.firstName,
        lastName: patient.lastName,
        age: patient.age,
        gender: patient.gender,
        bloodGroup: toDbBlood(patient.bloodGroup),
        contact: patient.contact,
        email: patient.email,
        admittedAt: new Date(patient.admittedAt),
        roomType: toDbRoom(patient.roomType),
        bed: patient.bed,
        dailyRoomRate: patient.dailyRoomRate,
        attendingPhysician: patient.attendingPhysician,
        status: patient.status,
        diagnoses: patient.diagnoses,
        allergies: {
          create: patient.allergies.map((a) => ({
            id: a.id,
            substance: a.substance,
            reaction: a.reaction,
            severity: a.severity,
          })),
        },
        vitals: {
          create: patient.vitals.map((v) => ({
            id: v.id,
            recordedAt: new Date(v.recordedAt),
            systolic: v.systolic,
            diastolic: v.diastolic,
            heartRate: v.heartRate,
            temperatureC: v.temperatureC,
            spo2: v.spo2,
            recordedBy: v.recordedBy,
          })),
        },
        consultations: {
          create: patient.consultations.map((c) => ({
            id: c.id,
            date: new Date(c.date),
            clinician: c.clinician,
            department: c.department,
            diagnosis: c.diagnosis,
            notes: c.notes,
          })),
        },
      },
    });
  }

  for (const med of seedState.medicines) {
    await prisma.medicine.create({
      data: {
        id: med.id,
        name: med.name,
        genericName: med.genericName,
        strength: med.strength,
        form: med.form,
        manufacturer: med.manufacturer,
        batchNumber: med.batchNumber,
        expiryDate: new Date(med.expiryDate),
        stock: med.stock,
        unitPrice: med.unitPrice,
        location: med.location,
      },
    });
  }

  for (const staff of seedState.staff) {
    await prisma.staffMember.create({
      data: {
        id: staff.id,
        employeeId: staff.employeeId,
        name: staff.name,
        department: staff.department,
        title: staff.title,
        email: staff.email,
        hiredAt: new Date(staff.hiredAt),
        baseSalary: staff.baseSalary,
        overtimeRate: staff.overtimeRate,
        nightShiftBonus: staff.nightShiftBonus,
        healthPremium: staff.healthPremium,
        unpaidLeavePenaltyPerDay: staff.unpaidLeavePenaltyPerDay,
      },
    });
  }

  for (const slip of seedState.payslips) {
    await prisma.payslip.create({
      data: {
        id: slip.id,
        staffId: slip.staffId,
        period: slip.period,
        overtimeHours: slip.overtimeHours,
        nightShifts: slip.nightShifts,
        unpaidLeaveDays: slip.unpaidLeaveDays,
        taxPercent: slip.taxPercent,
        paidOn: new Date(slip.paidOn),
      },
    });
  }

  for (const rx of seedState.prescriptions) {
    await prisma.prescription.create({
      data: {
        id: rx.id,
        patientId: rx.patientId,
        prescribedBy: rx.prescribedBy,
        prescribedAt: new Date(rx.prescribedAt),
        status: rx.status,
        notes: rx.notes,
        dispensedAt: rx.dispensedAt ? new Date(rx.dispensedAt) : null,
        dispensedBy: rx.dispensedBy ?? null,
        items: {
          create: rx.items.map((item) => ({
            medicineId: item.medicineId,
            medicineName: item.medicineName,
            dosage: item.dosage,
            frequency: item.frequency,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
    });
  }

  for (const invoice of seedState.invoices) {
    await prisma.invoice.create({
      data: {
        id: invoice.id,
        patientId: invoice.patientId,
        discountPercent: invoice.discountPercent,
        taxPercent: invoice.taxPercent,
        insuranceProvider: invoice.insuranceProvider,
        insuranceCoveragePercent: invoice.insuranceCoveragePercent,
        deductible: invoice.deductible,
        copay: invoice.copay,
        amountPaid: invoice.amountPaid,
        paymentStatus: toDbPay(invoice.paymentStatus),
        lineItems: {
          create: invoice.lineItems.map((item) => ({
            id: item.id,
            category: item.category,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            createdAt: new Date(item.createdAt),
            linkedPrescriptionId: item.linkedPrescriptionId ?? null,
          })),
        },
      },
    });
  }
}

export async function dispenseInDatabase(prescriptionId: string, dispensedBy: string) {
  return prisma.$transaction(async (tx) => {
    const rx = await tx.prescription.findUnique({
      where: { id: prescriptionId },
      include: { items: true },
    });
    if (!rx) return "Prescription not found.";
    if (rx.status !== "Active") return "This prescription is no longer active.";

    for (const item of rx.items) {
      const med = await tx.medicine.findUnique({ where: { id: item.medicineId } });
      if (!med) return `Inventory item missing for ${item.medicineName}.`;
      if (med.stock < item.quantity) {
        return `Insufficient stock for ${med.name} (${med.stock} on hand, ${item.quantity} required).`;
      }
    }

    for (const item of rx.items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.prescription.update({
      where: { id: rx.id },
      data: {
        status: "Dispensed",
        dispensedAt: new Date(),
        dispensedBy,
      },
    });

    const pharmacyTotal = rx.items.reduce(
      (sum, item) => sum + item.quantity * Number(item.unitPrice),
      0,
    );

    const invoice = await tx.invoice.findFirst({ where: { patientId: rx.patientId } });
    if (invoice) {
      const already = await tx.billingLine.findFirst({
        where: { invoiceId: invoice.id, linkedPrescriptionId: rx.id },
      });
      if (!already) {
        await tx.billingLine.create({
          data: {
            id: uid("li"),
            invoiceId: invoice.id,
            category: "Pharmacy",
            description: `Rx ${rx.id} — ${rx.items.map((i) => i.medicineName).join(", ")}`,
            quantity: 1,
            unitPrice: Number(pharmacyTotal.toFixed(2)),
            createdAt: new Date(),
            linkedPrescriptionId: rx.id,
          },
        });
        if (invoice.paymentStatus === "Settled") {
          await tx.invoice.update({
            where: { id: invoice.id },
            data: { paymentStatus: "PartiallyPaid" },
          });
        }
      }
    }

    return null;
  });
}

export async function addPrescriptionInDatabase(input: {
  patientId: string;
  prescribedBy: string;
  notes: string;
  items: PrescriptionItem[];
}) {
  await prisma.prescription.create({
    data: {
      id: uid("rx"),
      patientId: input.patientId,
      prescribedBy: input.prescribedBy,
      prescribedAt: new Date(),
      status: "Active",
      notes: input.notes,
      items: {
        create: input.items.map((item) => ({
          medicineId: item.medicineId,
          medicineName: item.medicineName,
          dosage: item.dosage,
          frequency: item.frequency,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });
}

export async function updateInvoiceInDatabase(
  invoiceId: string,
  patch: Partial<{
    discountPercent: number;
    taxPercent: number;
    insuranceCoveragePercent: number;
    deductible: number;
    copay: number;
    amountPaid: number;
    paymentStatus: PaymentStatus;
  }>,
) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { lineItems: true, patient: true },
  });
  if (!invoice) return "Invoice not found.";

  const next = {
    ...mapInvoice(invoice),
    ...patch,
  };

  let paymentStatus = toDbPay(next.paymentStatus);
  if (patch.amountPaid !== undefined) {
    const totals = computeInvoiceTotals(
      mapPatient({
        ...invoice.patient,
        allergies: [],
        vitals: [],
        consultations: [],
      }),
      next,
    );
    if (next.amountPaid <= 0) paymentStatus = "Pending";
    else if (next.amountPaid + 0.009 >= totals.patientShare) paymentStatus = "Settled";
    else paymentStatus = "PartiallyPaid";
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      discountPercent: next.discountPercent,
      taxPercent: next.taxPercent,
      insuranceCoveragePercent: next.insuranceCoveragePercent,
      deductible: next.deductible,
      copay: next.copay,
      amountPaid: next.amountPaid,
      paymentStatus,
    },
  });
  return null;
}

export async function cycleInvoicePayment(invoiceId: string) {
  const order: PaymentStatus[] = ["Pending", "Partially Paid", "Settled"];
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { lineItems: true, patient: true },
  });
  if (!invoice) return "Invoice not found.";

  const current = fromDbPay(invoice.paymentStatus);
  const nextStatus = order[(order.indexOf(current) + 1) % order.length];
  const mappedInvoice = mapInvoice(invoice);
  const totals = computeInvoiceTotals(
    mapPatient({ ...invoice.patient, allergies: [], vitals: [], consultations: [] }),
    mappedInvoice,
  );

  let amountPaid = Number(invoice.amountPaid);
  if (nextStatus === "Pending") amountPaid = 0;
  if (nextStatus === "Partially Paid") amountPaid = Number((totals.patientShare * 0.4).toFixed(2));
  if (nextStatus === "Settled") amountPaid = Number(totals.patientShare.toFixed(2));

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { paymentStatus: toDbPay(nextStatus), amountPaid },
  });
  return null;
}
