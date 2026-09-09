"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { AccessDenied } from "@/components/access-denied";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { computeInvoiceTotals } from "@/lib/finance";
import { formatCurrency, formatDate, patientName } from "@/lib/format";
import { canAccess, canEditBilling } from "@/lib/permissions";
import { printInvoice } from "@/lib/print";
import { useHospital } from "@/lib/store";
import type { Invoice, Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

function statusClass(status: Invoice["paymentStatus"]) {
  if (status === "Settled") return "bg-emerald-600";
  if (status === "Partially Paid") return "bg-amber-600";
  return "";
}

export function BillingView() {
  const { state, hydrated, updateInvoice, cyclePaymentStatus } = useHospital();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.invoices
      .map((invoice) => {
        const patient = state.patients.find((p) => p.id === invoice.patientId);
        if (!patient) return null;
        const totals = computeInvoiceTotals(patient, invoice);
        return { invoice, patient, totals };
      })
      .filter((row): row is NonNullable<typeof row> => {
        if (!row) return false;
        if (!q) return true;
        const hay = [
          row.invoice.id,
          row.patient.mrn,
          row.patient.firstName,
          row.patient.lastName,
          row.invoice.paymentStatus,
          row.invoice.insuranceProvider,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
  }, [state.invoices, state.patients, query]);

  if (!hydrated) return <p className="text-sm text-muted-foreground">Loading ledger…</p>;
  if (!canAccess(state.role, "billing")) {
    return <AccessDenied moduleLabel="Billing" />;
  }

  const portfolio = rows.reduce(
    (acc, row) => {
      acc.charges += row.totals.total;
      acc.due += row.totals.balance;
      return acc;
    },
    { charges: 0, due: 0 },
  );

  const selected = rows.find((r) => r.invoice.id === selectedId);
  const editable = canEditBilling(state.role);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hospital billing</h1>
        <p className="text-sm text-muted-foreground">
          Room charges accrue by length of stay. Pharmacy lines appear here the
          moment a prescription is dispensed.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Gross billed (after tax)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatCurrency(portfolio.charges)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Patient balances outstanding
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatCurrency(portfolio.due)}
          </CardContent>
        </Card>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search invoices by patient, MRN, payer, or status…"
      />

      {rows.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
          No invoices match that search.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ invoice, patient, totals }) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {patientName(patient.firstName, patient.lastName)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {patient.mrn} · {totals.roomDays} day stay
                    </div>
                  </TableCell>
                  <TableCell>{invoice.insuranceProvider}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.balance)}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(statusClass(invoice.paymentStatus))}>
                      {invoice.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedId(invoice.id)}
                    >
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <InvoiceDetail
              patient={selected.patient}
              invoice={selected.invoice}
              editable={editable}
              onPrint={() => printInvoice(selected.patient, selected.invoice)}
              onCycle={() => cyclePaymentStatus(selected.invoice.id)}
              onUpdate={(patch) => updateInvoice(selected.invoice.id, patch)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceDetail({
  patient,
  invoice,
  editable,
  onPrint,
  onCycle,
  onUpdate,
}: {
  patient: Patient;
  invoice: Invoice;
  editable: boolean;
  onPrint: () => void;
  onCycle: () => void;
  onUpdate: (patch: Parameters<ReturnType<typeof useHospital>["updateInvoice"]>[1]) => void;
}) {
  const totals = computeInvoiceTotals(patient, invoice);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {invoice.id} · {patientName(patient.firstName, patient.lastName)}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge className={cn(statusClass(invoice.paymentStatus))}>
            {invoice.paymentStatus}
          </Badge>
          <Badge variant="secondary">{invoice.insuranceProvider}</Badge>
          <Badge variant="outline">
            Room {patient.bed} · {totals.roomDays} days × {formatCurrency(patient.dailyRoomRate)}
          </Badge>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>
                  {patient.roomType} · {formatDate(patient.admittedAt)} to today
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totals.roomCharges)}
                </TableCell>
              </TableRow>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Discount %"
            value={invoice.discountPercent}
            disabled={!editable}
            onChange={(n) => onUpdate({ discountPercent: n })}
          />
          <Field
            label="Tax %"
            value={invoice.taxPercent}
            disabled={!editable}
            onChange={(n) => onUpdate({ taxPercent: n })}
          />
          <Field
            label="Insurance coverage %"
            value={invoice.insuranceCoveragePercent}
            disabled={!editable}
            onChange={(n) => onUpdate({ insuranceCoveragePercent: n })}
          />
          <Field
            label="Deductible"
            value={invoice.deductible}
            disabled={!editable}
            onChange={(n) => onUpdate({ deductible: n })}
          />
          <Field
            label="Copay"
            value={invoice.copay}
            disabled={!editable}
            onChange={(n) => onUpdate({ copay: n })}
          />
          <Field
            label="Amount paid"
            value={invoice.amountPaid}
            disabled={!editable}
            onChange={(n) => onUpdate({ amountPaid: n })}
          />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-slate-50 p-3">
          <Row k="Subtotal" v={totals.subtotal} />
          <Row k="Discount" v={-totals.discountAmount} />
          <Row k="Tax" v={totals.taxAmount} />
          <Row k="Invoice total" v={totals.total} strong />
          <Row k="Insurance pays" v={totals.insurancePays} />
          <Row k="Patient share" v={totals.patientShare} />
          <Row k="Balance due" v={totals.balance} strong />
        </dl>

        <div className="flex flex-wrap gap-2">
          <Button onClick={onPrint}>
            <FileDown className="mr-2 size-4" />
            Generate PDF invoice
          </Button>
          {editable && (
            <Button variant="outline" onClick={onCycle}>
              Cycle payment status
            </Button>
          )}
          {!editable && (
            <p className="self-center text-xs text-muted-foreground">
              Financial edits are limited to the Admin persona.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (n: number) => void;
}) {
  return (
    <div className="grid gap-1">
      <Label>{label}</Label>
      <Input
        type="number"
        step="0.01"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: number; strong?: boolean }) {
  return (
    <>
      <dt className={cn(strong && "font-semibold")}>{k}</dt>
      <dd className={cn("text-right", strong && "font-semibold")}>
        {formatCurrency(v)}
      </dd>
    </>
  );
}
