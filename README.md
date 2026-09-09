# Meridian General Hospital HIS

Interactive hospital information system for administrators, clinicians, and pharmacists. It covers the EMR, inpatient pharmacy, centralized billing, and payroll on a single shared ledger.

Data lives in the browser (`localStorage`) so census, inventory, prescriptions, and invoices stay in sync across modules and reloads. Use **Reset demo data** on the command center if you want the original sample hospital.

## What you can do

- Browse and search the patient directory, open a chart (vitals, notes, allergies), and write e-prescriptions
- Review formulary stock with low-stock and near-expiry flags
- Dispense an active prescription: stock drops, status becomes Dispensed, and a pharmacy line posts to that patient’s bill
- Itemize room (by days admitted), consults, labs, procedures, and pharmacy charges; apply discount, tax, insurance, copay, and payment status; print a PDF invoice
- Group staff by department, inspect payroll configuration, and print monthly payslips
- Switch personas with the role control in the header. Pharmacy is locked for Doctor/Nurse; payroll is Admin-only

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

```bash
npm run build
npm start
```

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui.
