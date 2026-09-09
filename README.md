# Meridian General Hospital

Public hospital website plus a staff clinical information system for Meridian General Hospital.

The homepage is the official-looking public site (services, physicians, visiting hours, appointments). Staff tools live under `/portal`.

## Public website

- `/` — hospital homepage
- `/physicians` — attending physician directory
- `/contact` — appointment request form

## Staff portal (`/portal`)

Interactive HIS for administrators, clinicians, and pharmacists: EMR, inpatient pharmacy, centralized billing, and payroll on one shared ledger.

Data lives in the browser (`localStorage`). Use **Reset demo data** on the command center to restore the sample hospital.

- Browse and search the patient directory, open a chart, and write e-prescriptions
- Dispense medication: stock drops and a pharmacy line posts to the patient bill
- Itemize room, consult, lab, and pharmacy charges; print invoices
- Payroll by department with printable payslips
- Role selector: Admin, Doctor/Nurse, Pharmacist

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui.
