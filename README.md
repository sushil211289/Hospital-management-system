# Meridian General Hospital

Public hospital website plus a staff clinical information system for Meridian General Hospital.

The homepage is the official-looking public site (services, physicians, visiting hours, appointments). The staff HIS at `/portal` requires sign-in.

## Public website

- `/` — hospital homepage
- `/physicians` — attending physician directory
- `/contact` — appointment request form

## Staff portal (`/login` → `/portal`)

Unauthenticated visits to `/portal` redirect to `/login`. A successful sign-in sets an HTTP-only session cookie (8 hours) and loads modules for that account’s role.

Demo accounts (also listed on the sign-in page):

| Role | Email | Password |
| --- | --- | --- |
| Admin | `a.desai@meridian.hospital` | `Meridian#Admin24` |
| Doctor / Nurse | `p.nair@meridian.hospital` | `Meridian#Care24` |
| Pharmacist | `d.park@meridian.hospital` | `Meridian#Rx24` |

Interactive HIS for EMR, inpatient pharmacy, centralized billing, and payroll on one shared ledger.

Clinical data lives in the browser (`localStorage`). Use **Reset demo data** on the command center to restore the sample hospital. Session is separate from demo data.

- Browse and search the patient directory, open a chart, and write e-prescriptions
- Dispense medication: stock drops and a pharmacy line posts to the patient bill
- Itemize room, consult, lab, and pharmacy charges; print invoices
- Payroll by department with printable payslips
- Sign out and sign in as another demo account to change roles

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui.
