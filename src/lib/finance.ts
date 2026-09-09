import type { BillingCategory, Invoice, Patient, Payslip, StaffMember } from "./types";
import { daysAdmitted } from "./format";

export interface InvoiceTotals {
  roomCharges: number;
  roomDays: number;
  consultation: number;
  lab: number;
  pharmacy: number;
  procedure: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  deductibleApplied: number;
  insurancePays: number;
  patientShare: number;
  balance: number;
}

function categorySum(invoice: Invoice, category: BillingCategory) {
  return invoice.lineItems
    .filter((item) => item.category === category)
    .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function computeInvoiceTotals(
  patient: Patient,
  invoice: Invoice,
  asOf = new Date(),
): InvoiceTotals {
  const roomDays = patient.status === "Discharged" ? daysAdmitted(patient.admittedAt, asOf) : daysAdmitted(patient.admittedAt, asOf);
  const roomCharges = roomDays * patient.dailyRoomRate;
  const consultation = categorySum(invoice, "Consultation");
  const lab = categorySum(invoice, "Lab");
  const pharmacy = categorySum(invoice, "Pharmacy");
  const procedure = categorySum(invoice, "Procedure");
  const subtotal = roomCharges + consultation + lab + pharmacy + procedure;
  const discountAmount = subtotal * (invoice.discountPercent / 100);
  const taxAmount = (subtotal - discountAmount) * (invoice.taxPercent / 100);
  const total = subtotal - discountAmount + taxAmount;
  const deductibleApplied = Math.min(invoice.deductible, total);
  const insurable = Math.max(0, total - deductibleApplied);
  const insurancePays = insurable * (invoice.insuranceCoveragePercent / 100);
  const patientShare = Math.max(
    0,
    total - insurancePays + invoice.copay,
  );
  const balance = Math.max(0, patientShare - invoice.amountPaid);

  return {
    roomCharges,
    roomDays,
    consultation,
    lab,
    pharmacy,
    procedure,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    deductibleApplied,
    insurancePays,
    patientShare,
    balance,
  };
}

export function computePayslip(staff: StaffMember, slip: Payslip) {
  const overtimePay = slip.overtimeHours * staff.overtimeRate;
  const nightPay = slip.nightShifts * staff.nightShiftBonus;
  const gross = staff.baseSalary + overtimePay + nightPay;
  const leavePenalty = slip.unpaidLeaveDays * staff.unpaidLeavePenaltyPerDay;
  const tax = gross * (slip.taxPercent / 100);
  const deductions = tax + staff.healthPremium + leavePenalty;
  const net = gross - deductions;
  return {
    overtimePay,
    nightPay,
    gross,
    leavePenalty,
    tax,
    healthPremium: staff.healthPremium,
    deductions,
    net,
  };
}
