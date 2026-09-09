import type {
  Allergy,
  BillingCategory,
  BillingLineItem,
  BloodGroup,
  ConsultationNote,
  Department,
  Invoice,
  Medicine,
  Patient,
  PaymentStatus,
  Payslip,
  Prescription,
  PrescriptionItem,
  RoomType,
  StaffMember,
  VitalReading,
} from "@/lib/types";
import type {
  Allergy as DbAllergy,
  BillingLine as DbBillingLine,
  Consultation as DbConsultation,
  Invoice as DbInvoice,
  Medicine as DbMedicine,
  Patient as DbPatient,
  Payslip as DbPayslip,
  Prescription as DbPrescription,
  PrescriptionItem as DbPrescriptionItem,
  StaffMember as DbStaff,
  Vital as DbVital,
} from "@prisma/client";
import { Prisma } from "@prisma/client";

const bloodToDb: Record<BloodGroup, DbPatient["bloodGroup"]> = {
  "A+": "A_POS",
  "A-": "A_NEG",
  "B+": "B_POS",
  "B-": "B_NEG",
  "AB+": "AB_POS",
  "AB-": "AB_NEG",
  "O+": "O_POS",
  "O-": "O_NEG",
};

const bloodFromDb = Object.fromEntries(
  Object.entries(bloodToDb).map(([k, v]) => [v, k]),
) as Record<DbPatient["bloodGroup"], BloodGroup>;

const roomToDb: Record<RoomType, DbPatient["roomType"]> = {
  "General Ward": "GeneralWard",
  "Semi-Private": "SemiPrivate",
  Private: "Private",
  ICU: "ICU",
};

const roomFromDb = Object.fromEntries(
  Object.entries(roomToDb).map(([k, v]) => [v, k]),
) as Record<DbPatient["roomType"], RoomType>;

const payToDb: Record<PaymentStatus, DbInvoice["paymentStatus"]> = {
  Pending: "Pending",
  "Partially Paid": "PartiallyPaid",
  Settled: "Settled",
};

const payFromDb = Object.fromEntries(
  Object.entries(payToDb).map(([k, v]) => [v, k]),
) as Record<DbInvoice["paymentStatus"], PaymentStatus>;

export function money(value: Prisma.Decimal | number | string) {
  return Number(value);
}

export function toDbBlood(value: BloodGroup) {
  return bloodToDb[value];
}
export function fromDbBlood(value: DbPatient["bloodGroup"]) {
  return bloodFromDb[value];
}
export function toDbRoom(value: RoomType) {
  return roomToDb[value];
}
export function fromDbRoom(value: DbPatient["roomType"]) {
  return roomFromDb[value];
}
export function toDbPay(value: PaymentStatus) {
  return payToDb[value];
}
export function fromDbPay(value: DbInvoice["paymentStatus"]) {
  return payFromDb[value];
}

export function mapPatient(
  patient: DbPatient & {
    allergies: DbAllergy[];
    vitals: DbVital[];
    consultations: DbConsultation[];
  },
): Patient {
  return {
    id: patient.id,
    mrn: patient.mrn,
    firstName: patient.firstName,
    lastName: patient.lastName,
    age: patient.age,
    gender: patient.gender,
    bloodGroup: fromDbBlood(patient.bloodGroup),
    contact: patient.contact,
    email: patient.email,
    admittedAt: patient.admittedAt.toISOString(),
    roomType: fromDbRoom(patient.roomType),
    bed: patient.bed,
    dailyRoomRate: money(patient.dailyRoomRate),
    attendingPhysician: patient.attendingPhysician,
    status: patient.status,
    diagnoses: patient.diagnoses,
    allergies: patient.allergies.map(
      (a): Allergy => ({
        id: a.id,
        substance: a.substance,
        reaction: a.reaction,
        severity: a.severity,
      }),
    ),
    vitals: patient.vitals.map(
      (v): VitalReading => ({
        id: v.id,
        recordedAt: v.recordedAt.toISOString(),
        systolic: v.systolic,
        diastolic: v.diastolic,
        heartRate: v.heartRate,
        temperatureC: money(v.temperatureC),
        spo2: v.spo2,
        recordedBy: v.recordedBy,
      }),
    ),
    consultations: patient.consultations.map(
      (c): ConsultationNote => ({
        id: c.id,
        date: c.date.toISOString(),
        clinician: c.clinician,
        department: c.department,
        diagnosis: c.diagnosis,
        notes: c.notes,
      }),
    ),
  };
}

export function mapMedicine(med: DbMedicine): Medicine {
  return {
    id: med.id,
    name: med.name,
    genericName: med.genericName,
    strength: med.strength,
    form: med.form,
    manufacturer: med.manufacturer,
    batchNumber: med.batchNumber,
    expiryDate: med.expiryDate.toISOString().slice(0, 10),
    stock: med.stock,
    unitPrice: money(med.unitPrice),
    location: med.location,
  };
}

export function mapPrescription(
  rx: DbPrescription & { items: DbPrescriptionItem[] },
): Prescription {
  return {
    id: rx.id,
    patientId: rx.patientId,
    prescribedBy: rx.prescribedBy,
    prescribedAt: rx.prescribedAt.toISOString(),
    status: rx.status,
    notes: rx.notes,
    dispensedAt: rx.dispensedAt?.toISOString(),
    dispensedBy: rx.dispensedBy ?? undefined,
    items: rx.items.map(
      (item): PrescriptionItem => ({
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        dosage: item.dosage,
        frequency: item.frequency,
        quantity: item.quantity,
        unitPrice: money(item.unitPrice),
      }),
    ),
  };
}

export function mapInvoice(
  invoice: DbInvoice & { lineItems: DbBillingLine[] },
): Invoice {
  return {
    id: invoice.id,
    patientId: invoice.patientId,
    discountPercent: money(invoice.discountPercent),
    taxPercent: money(invoice.taxPercent),
    insuranceProvider: invoice.insuranceProvider,
    insuranceCoveragePercent: money(invoice.insuranceCoveragePercent),
    deductible: money(invoice.deductible),
    copay: money(invoice.copay),
    amountPaid: money(invoice.amountPaid),
    paymentStatus: fromDbPay(invoice.paymentStatus),
    lineItems: invoice.lineItems.map(
      (item): BillingLineItem => ({
        id: item.id,
        category: item.category as BillingCategory,
        description: item.description,
        quantity: item.quantity,
        unitPrice: money(item.unitPrice),
        createdAt: item.createdAt.toISOString(),
        linkedPrescriptionId: item.linkedPrescriptionId ?? undefined,
      }),
    ),
  };
}

export function mapStaff(staff: DbStaff): StaffMember {
  return {
    id: staff.id,
    employeeId: staff.employeeId,
    name: staff.name,
    department: staff.department as Department,
    title: staff.title,
    email: staff.email,
    hiredAt: staff.hiredAt.toISOString().slice(0, 10),
    baseSalary: money(staff.baseSalary),
    overtimeRate: money(staff.overtimeRate),
    nightShiftBonus: money(staff.nightShiftBonus),
    healthPremium: money(staff.healthPremium),
    unpaidLeavePenaltyPerDay: money(staff.unpaidLeavePenaltyPerDay),
  };
}

export function mapPayslip(slip: DbPayslip): Payslip {
  return {
    id: slip.id,
    staffId: slip.staffId,
    period: slip.period,
    overtimeHours: slip.overtimeHours,
    nightShifts: slip.nightShifts,
    unpaidLeaveDays: slip.unpaidLeaveDays,
    taxPercent: money(slip.taxPercent),
    paidOn: slip.paidOn.toISOString().slice(0, 10),
  };
}
