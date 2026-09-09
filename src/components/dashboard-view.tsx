"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BedDouble,
  ClipboardList,
  Pill,
  Receipt,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeInvoiceTotals } from "@/lib/finance";
import { daysUntil, formatCurrency } from "@/lib/format";
import { HOSPITAL_NAME } from "@/lib/seed";
import { ROLE_LABELS } from "@/lib/permissions";
import { useHospital } from "@/lib/store";

function Stat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Activity;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardView() {
  const { state, hydrated, resetDemo } = useHospital();
  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Loading census…</p>;
  }

  const admitted = state.patients.filter((p) => p.status === "Admitted");
  const lowStock = state.medicines.filter((m) => m.stock < 50);
  const nearExpiry = state.medicines.filter((m) => daysUntil(m.expiryDate) <= 45);
  const activeRx = state.prescriptions.filter((p) => p.status === "Active");
  const outstanding = state.invoices.reduce((sum, invoice) => {
    const patient = state.patients.find((p) => p.id === invoice.patientId);
    if (!patient) return sum;
    return sum + computeInvoiceTotals(patient, invoice).balance;
  }, 0);
  const severeAllergies = state.patients.filter((p) =>
    p.allergies.some((a) => a.severity === "Severe"),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {HOSPITAL_NAME}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Operations command center
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            You are viewing the hospital as{" "}
            <span className="font-medium text-foreground">
              {ROLE_LABELS[state.role]}
            </span>
            . Census, pharmacy risk, and revenue all share one ledger — dispensing
            a medication updates inventory and the patient bill immediately.
          </p>
        </div>
        <Button variant="outline" onClick={resetDemo}>
          Reset demo data
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Inpatient census"
          value={String(admitted.length)}
          hint={`${state.patients.length} records in the EMR`}
          icon={BedDouble}
        />
        <Stat
          label="Active e-prescriptions"
          value={String(activeRx.length)}
          hint="Waiting on pharmacy dispense"
          icon={Pill}
        />
        <Stat
          label="Open patient balances"
          value={formatCurrency(outstanding)}
          hint="After insurance, copay, and payments"
          icon={Receipt}
        />
        <Stat
          label="Inventory alerts"
          value={String(lowStock.length + nearExpiry.length)}
          hint={`${lowStock.length} low stock · ${nearExpiry.length} near expiry`}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Care unit snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {admitted.slice(0, 6).map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col gap-1 rounded-lg border bg-slate-50/70 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {patient.lastName}, {patient.firstName}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {patient.mrn} · {patient.bed}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {patient.diagnoses[0]} · {patient.attendingPhysician}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies
                    .filter((a) => a.severity !== "Mild")
                    .map((a) => (
                      <Badge key={a.id} variant="destructive">
                        {a.substance}
                      </Badge>
                    ))}
                  <Badge variant="secondary">{patient.roomType}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Watch list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="mb-2 font-medium">Low stock (&lt; 50 units)</p>
              {lowStock.length === 0 ? (
                <p className="text-muted-foreground">No low-stock items.</p>
              ) : (
                <ul className="space-y-1">
                  {lowStock.map((m) => (
                    <li key={m.id} className="flex justify-between">
                      <span>{m.name}</span>
                      <span className="font-medium text-amber-700">{m.stock}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="mb-2 font-medium">Near expiry (45 days)</p>
              {nearExpiry.length === 0 ? (
                <p className="text-muted-foreground">No near-expiry lots.</p>
              ) : (
                <ul className="space-y-1">
                  {nearExpiry.map((m) => (
                    <li key={m.id} className="flex justify-between">
                      <span>{m.name}</span>
                      <span className="text-rose-700">{m.expiryDate}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {severeAllergies.length} inpatients carry a severe allergy flag.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/patients" className={cn(buttonVariants())}>
          <ClipboardList className="mr-2 size-4" />
          Open EMR
        </Link>
        <Link href="/pharmacy" className={cn(buttonVariants({ variant: "outline" }))}>
          <Pill className="mr-2 size-4" />
          Pharmacy queue
        </Link>
        <Link href="/billing" className={cn(buttonVariants({ variant: "outline" }))}>
          <Receipt className="mr-2 size-4" />
          Billing ledger
        </Link>
        <Link href="/payroll" className={cn(buttonVariants({ variant: "outline" }))}>
          <Wallet className="mr-2 size-4" />
          Payroll
        </Link>
      </div>
    </div>
  );
}
