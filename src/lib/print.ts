import { HOSPITAL_NAME } from "./seed";
import { computeInvoiceTotals, computePayslip } from "./finance";
import { formatCurrency, formatDate, patientName } from "./format";
import type { Invoice, Patient, Payslip, StaffMember } from "./types";

function openPrintWindow(title: string, body: string) {
  const popup = window.open("", "_blank", "width=900,height=1100");
  if (!popup) {
    window.alert("Allow pop-ups to generate a PDF.");
    return;
  }
  popup.document.write(`<!doctype html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: Georgia, serif; color: #0f172a; margin: 40px; }
    h1 { font-size: 22px; margin: 0; }
    h2 { font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; color: #2563eb; margin: 0 0 8px; }
    .muted { color: #64748b; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 8px 6px; font-size: 13px; text-align: left; }
    th { color: #475569; font-weight: 600; }
    .right { text-align: right; }
    .totals td { border: none; }
    .brand { display: flex; justify-content: space-between; margin-bottom: 24px; }
    .flag { color: #dc2626; font-weight: 700; }
  </style>
</head>
<body>${body}
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`);
  popup.document.close();
}

export function printInvoice(patient: Patient, invoice: Invoice) {
  const totals = computeInvoiceTotals(patient, invoice);
  const rows = [
    `<tr><td>Room / ${patient.roomType} · ${patient.bed} (${totals.roomDays} days)</td><td class="right">${formatCurrency(totals.roomCharges)}</td></tr>`,
    ...invoice.lineItems.map(
      (item) =>
        `<tr><td>${item.category} — ${item.description}</td><td class="right">${formatCurrency(item.quantity * item.unitPrice)}</td></tr>`,
    ),
  ].join("");

  openPrintWindow(
    `${invoice.id} · ${patient.mrn}`,
    `<div class="brand">
      <div>
        <h2>${HOSPITAL_NAME}</h2>
        <h1>Patient Invoice</h1>
        <p class="muted">${invoice.id} · Issued ${formatDate(new Date().toISOString())}</p>
      </div>
      <div class="muted right">
        ${patientName(patient.firstName, patient.lastName)}<br/>
        ${patient.mrn} · ${patient.contact}<br/>
        ${invoice.insuranceProvider}
      </div>
    </div>
    <table>
      <thead><tr><th>Description</th><th class="right">Amount</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <table class="totals" style="margin-top:24px;max-width:360px;margin-left:auto">
      <tr><td>Subtotal</td><td class="right">${formatCurrency(totals.subtotal)}</td></tr>
      <tr><td>Discount (${invoice.discountPercent}%)</td><td class="right">-${formatCurrency(totals.discountAmount)}</td></tr>
      <tr><td>Tax (${invoice.taxPercent}%)</td><td class="right">${formatCurrency(totals.taxAmount)}</td></tr>
      <tr><td><strong>Total</strong></td><td class="right"><strong>${formatCurrency(totals.total)}</strong></td></tr>
      <tr><td>Insurance pays</td><td class="right">${formatCurrency(totals.insurancePays)}</td></tr>
      <tr><td>Deductible applied</td><td class="right">${formatCurrency(totals.deductibleApplied)}</td></tr>
      <tr><td>Copay</td><td class="right">${formatCurrency(invoice.copay)}</td></tr>
      <tr><td>Patient share</td><td class="right">${formatCurrency(totals.patientShare)}</td></tr>
      <tr><td>Amount paid</td><td class="right">${formatCurrency(invoice.amountPaid)}</td></tr>
      <tr><td><strong>Balance due</strong></td><td class="right"><strong>${formatCurrency(totals.balance)}</strong></td></tr>
      <tr><td>Status</td><td class="right">${invoice.paymentStatus}</td></tr>
    </table>
    <p class="muted" style="margin-top:32px">This statement is generated from the Meridian HIS billing ledger. Not a legal claim form.</p>`,
  );
}

export function printPayslip(staff: StaffMember, slip: Payslip) {
  const calc = computePayslip(staff, slip);
  openPrintWindow(
    `Payslip ${slip.period} · ${staff.employeeId}`,
    `<div class="brand">
      <div>
        <h2>${HOSPITAL_NAME}</h2>
        <h1>Employee Payslip</h1>
        <p class="muted">Period ${slip.period} · Paid ${formatDate(slip.paidOn)}</p>
      </div>
      <div class="muted right">
        ${staff.name}<br/>
        ${staff.employeeId} · ${staff.title}<br/>
        ${staff.department}
      </div>
    </div>
    <table>
      <tbody>
        <tr><td>Base salary</td><td class="right">${formatCurrency(staff.baseSalary)}</td></tr>
        <tr><td>Overtime (${slip.overtimeHours} hrs × ${formatCurrency(staff.overtimeRate)})</td><td class="right">${formatCurrency(calc.overtimePay)}</td></tr>
        <tr><td>Night shift bonus (${slip.nightShifts})</td><td class="right">${formatCurrency(calc.nightPay)}</td></tr>
        <tr><td><strong>Gross</strong></td><td class="right"><strong>${formatCurrency(calc.gross)}</strong></td></tr>
        <tr><td>Income tax (${slip.taxPercent}%)</td><td class="right">-${formatCurrency(calc.tax)}</td></tr>
        <tr><td>Health insurance premium</td><td class="right">-${formatCurrency(calc.healthPremium)}</td></tr>
        <tr><td>Unpaid leave penalty (${slip.unpaidLeaveDays} days)</td><td class="right">-${formatCurrency(calc.leavePenalty)}</td></tr>
        <tr><td><strong>Net pay</strong></td><td class="right"><strong>${formatCurrency(calc.net)}</strong></td></tr>
      </tbody>
    </table>
    <p class="muted" style="margin-top:32px">Confidential payroll record. For internal distribution only.</p>`,
  );
}
