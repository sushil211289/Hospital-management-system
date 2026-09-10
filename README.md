# Kaveri Medical Center

Public hospital website and staff clinical information system for **Kaveri Medical Center** (Department of Orthopaedics), Selvapuram, Coimbatore.

Consultant: **Dr. Vignesh Arumugam, MS (Ortho)**. Appointments: **63801 11273** · kaverimedicalcenter@gmail.com

The homepage is the public site. Staff HIS at `/portal` requires sign-in. Clinical data, users, and appointment requests persist in **PostgreSQL** (Prisma). The portal refreshes from the database every few seconds so inventory, prescriptions, and bills stay in sync.

## Public website

- `/` — hospital homepage
- `/physicians` — attending physician directory
- `/contact` — appointment request (writes `AppointmentRequest` rows)

## Staff portal (`/login` → `/portal`)

Unauthenticated visits to `/portal` redirect to `/login`. Sign-in checks `User` rows (bcrypt) and sets an HTTP-only session cookie (8 hours).

Demo accounts (seeded):

| Role | Email | Password |
| --- | --- | --- |
| Admin | `a.desai@meridian.hospital` | `Meridian#Admin24` |
| Doctor / Nurse | `p.nair@meridian.hospital` | `Meridian#Care24` |
| Pharmacist | `d.park@meridian.hospital` | `Meridian#Rx24` |

## Database

PostgreSQL schema is in `prisma/schema.prisma`: patients/allergies/vitals/consults, medicines, prescriptions, invoices/billing lines, staff/payslips, users, appointment requests.

```bash
cp .env.example .env
# Start Postgres (Docker) or use a hosted URL
docker compose up -d
npx prisma migrate deploy
npx prisma db seed
```

Local default: `postgresql://meridian:meridian@127.0.0.1:5432/meridian_his`

Admin **Reset demo data** re-seeds the database.

## Run locally

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL, Prisma.
