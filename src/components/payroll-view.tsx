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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { computePayslip } from "@/lib/finance";
import { formatCurrency, formatDate } from "@/lib/format";
import { canAccess } from "@/lib/permissions";
import { printPayslip } from "@/lib/print";
import { useHospital } from "@/lib/store";
import type { Department, Payslip, StaffMember } from "@/lib/types";

const DEPARTMENTS: Department[] = ["Doctors", "Nurses", "Pharmacists", "Admins"];

export function PayrollView() {
  const { state, hydrated } = useHospital();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<Department | "all">("all");
  const [staffId, setStaffId] = useState<string | null>(null);
  const [slip, setSlip] = useState<Payslip | null>(null);

  const staff = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.staff.filter((s) => {
      if (dept !== "all" && s.department !== dept) return false;
      if (!q) return true;
      return [s.name, s.employeeId, s.title, s.email, s.department]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [state.staff, query, dept]);

  if (!hydrated) return <p className="text-sm text-muted-foreground">Loading payroll…</p>;
  if (!canAccess(state.role, "payroll")) {
    return <AccessDenied moduleLabel="Payroll" />;
  }

  const selected = state.staff.find((s) => s.id === staffId) ?? null;
  const selectedSlips = selected
    ? state.payslips.filter((p) => p.staffId === selected.id)
    : [];

  const augustPayroll = state.payslips
    .filter((p) => p.period === "2026-08")
    .reduce((sum, p) => {
      const member = state.staff.find((s) => s.id === p.staffId);
      if (!member) return sum;
      return sum + computePayslip(member, p).net;
    }, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Staff & payroll</h1>
        <p className="text-sm text-muted-foreground">
          Base pay, overtime, night differentials, taxes, and leave penalties
          roll into a printable monthly payslip.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            August 2026 net payroll (posted slips)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {formatCurrency(augustPayroll)}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search staff by name, employee ID, or title…"
        />
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant={dept === "all" ? "default" : "outline"}
            onClick={() => setDept("all")}
          >
            All
          </Button>
          {DEPARTMENTS.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={dept === d ? "default" : "outline"}
              onClick={() => setDept(d)}
            >
              {d}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="directory">
        <TabsList>
          <TabsTrigger value="directory">Staff directory</TabsTrigger>
          <TabsTrigger value="config">Payroll configurator</TabsTrigger>
        </TabsList>
        <TabsContent value="directory">
          {staff.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
              No staff match that search.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {staff.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStaffId(s.id)}
                  className="rounded-xl border bg-white p-4 text-left transition hover:border-primary"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.title}</p>
                    </div>
                    <Badge variant="secondary">{s.department}</Badge>
                  </div>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {s.employeeId} · {s.email}
                  </p>
                  <p className="mt-1 text-sm">
                    Base {formatCurrency(s.baseSalary)} / month
                  </p>
                </button>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="config">
          <div className="overflow-hidden rounded-xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Base</TableHead>
                  <TableHead className="text-right">OT rate</TableHead>
                  <TableHead className="text-right">Night bonus</TableHead>
                  <TableHead className="text-right">Health premium</TableHead>
                  <TableHead className="text-right">Leave penalty / day</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.employeeId}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.baseSalary)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.overtimeRate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.nightShiftBonus)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.healthPremium)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.unpaidLeavePenaltyPerDay)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={() => setStaffId(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selected.name}
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                    {selected.employeeId}
                  </span>
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Hired {formatDate(selected.hiredAt)} · {selected.title}
              </p>
              <h3 className="text-sm font-semibold">Payslip ledger</h3>
              {selectedSlips.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No historical payouts on file.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedSlips.map((p) => {
                    const calc = computePayslip(selected, p);
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">{p.period}</p>
                          <p className="text-xs text-muted-foreground">
                            Net {formatCurrency(calc.net)} · paid {formatDate(p.paidOn)}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setSlip(p)}>
                          View payslip
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!slip} onOpenChange={() => setSlip(null)}>
        <DialogContent>
          {selected && slip && (
            <PayslipBody staff={selected} slip={slip} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PayslipBody({ staff, slip }: { staff: StaffMember; slip: Payslip }) {
  const calc = computePayslip(staff, slip);
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Payslip {slip.period}
        </DialogTitle>
      </DialogHeader>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Employee</dt>
        <dd className="text-right">{staff.name}</dd>
        <dt className="text-muted-foreground">Base salary</dt>
        <dd className="text-right">{formatCurrency(staff.baseSalary)}</dd>
        <dt className="text-muted-foreground">Overtime ({slip.overtimeHours} hrs)</dt>
        <dd className="text-right">{formatCurrency(calc.overtimePay)}</dd>
        <dt className="text-muted-foreground">Night shifts ({slip.nightShifts})</dt>
        <dd className="text-right">{formatCurrency(calc.nightPay)}</dd>
        <dt className="font-medium">Gross</dt>
        <dd className="text-right font-medium">{formatCurrency(calc.gross)}</dd>
        <dt className="text-muted-foreground">Tax ({slip.taxPercent}%)</dt>
        <dd className="text-right">-{formatCurrency(calc.tax)}</dd>
        <dt className="text-muted-foreground">Health premium</dt>
        <dd className="text-right">-{formatCurrency(calc.healthPremium)}</dd>
        <dt className="text-muted-foreground">Unpaid leave ({slip.unpaidLeaveDays} d)</dt>
        <dd className="text-right">-{formatCurrency(calc.leavePenalty)}</dd>
        <dt className="font-semibold">Net pay</dt>
        <dd className="text-right font-semibold">{formatCurrency(calc.net)}</dd>
      </dl>
      <Button onClick={() => printPayslip(staff, slip)}>
        <FileDown className="mr-2 size-4" />
        Download payslip
      </Button>
    </>
  );
}
