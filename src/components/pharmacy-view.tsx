"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Clock, PackageMinus } from "lucide-react";
import { toast } from "sonner";
import { AccessDenied } from "@/components/access-denied";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { daysUntil, formatCurrency, formatDate } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import { canAccess, canDispense } from "@/lib/permissions";
import { useHospital } from "@/lib/store";

export function PharmacyView() {
  const { state, hydrated, dispensePrescription } = useHospital();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [rxQuery, setRxQuery] = useState("");

  const medicines = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.medicines.filter((m) => {
      if (!q) return true;
      return [m.name, m.genericName, m.batchNumber, m.manufacturer, m.location]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [state.medicines, query]);

  const prescriptions = useMemo(() => {
    const q = rxQuery.trim().toLowerCase();
    return state.prescriptions.filter((rx) => {
      const patient = state.patients.find((p) => p.id === rx.patientId);
      const hay = [
        rx.id,
        rx.prescribedBy,
        rx.status,
        patient?.firstName,
        patient?.lastName,
        patient?.mrn,
        ...rx.items.map((i) => i.medicineName),
      ]
        .join(" ")
        .toLowerCase();
      return !q || hay.includes(q);
    });
  }, [state.prescriptions, state.patients, rxQuery]);

  if (!hydrated) return <p className="text-sm text-muted-foreground">Loading formulary…</p>;
  if (!canAccess(state.role, "pharmacy")) {
    return <AccessDenied moduleLabel="Pharmacy" />;
  }

  const low = state.medicines.filter((m) => m.stock < 50).length;
  const expiring = state.medicines.filter((m) => daysUntil(m.expiryDate) <= 45).length;
  const active = state.prescriptions.filter((p) => p.status === "Active").length;
  const pharmacistName = user?.name ?? "Staff pharmacist";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pharmacy operations</h1>
        <p className="text-sm text-muted-foreground">
          Dispensing deducts inventory and posts a pharmacy charge to the patient
          invoice in the same transaction.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active queue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{active}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Low stock SKUs</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-700">{low}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Near expiry lots</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-rose-700">{expiring}</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">E-prescription queue</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="queue" className="space-y-3">
          <SearchBar
            value={rxQuery}
            onChange={setRxQuery}
            placeholder="Search prescriptions by patient, Rx ID, or drug…"
          />
          {prescriptions.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
              No prescriptions match that search.
            </div>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((rx) => {
                const patient = state.patients.find((p) => p.id === rx.patientId);
                const allergyHits = patient?.allergies.filter((a) =>
                  rx.items.some((item) =>
                    item.medicineName.toLowerCase().includes(a.substance.toLowerCase().split(" ")[0] ?? ""),
                  ),
                );
                return (
                  <Card key={rx.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base">
                          {patient
                            ? `${patient.lastName}, ${patient.firstName}`
                            : rx.patientId}{" "}
                          <span className="font-mono text-xs font-normal text-muted-foreground">
                            {rx.id} · {patient?.mrn}
                          </span>
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {rx.prescribedBy} · {formatDate(rx.prescribedAt, true)}
                        </p>
                      </div>
                      <Badge variant={rx.status === "Active" ? "default" : "secondary"}>
                        {rx.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {allergyHits && allergyHits.length > 0 && (
                        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-800">
                          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                          Cross-check allergy:{" "}
                          {allergyHits.map((a) => a.substance).join(", ")}
                        </div>
                      )}
                      <ul className="text-sm">
                        {rx.items.map((item) => {
                          const med = state.medicines.find((m) => m.id === item.medicineId);
                          return (
                            <li
                              key={item.medicineId}
                              className="flex flex-wrap justify-between gap-2 border-b py-1 last:border-0"
                            >
                              <span>
                                {item.medicineName} · {item.frequency} · qty{" "}
                                {item.quantity}
                              </span>
                              <span className="text-muted-foreground">
                                On hand: {med?.stock ?? "—"} ·{" "}
                                {formatCurrency(item.quantity * item.unitPrice)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      {rx.notes && (
                        <p className="text-xs text-amber-800">{rx.notes}</p>
                      )}
                      {rx.status === "Active" && canDispense(state.role) && (
                        <Button
                          onClick={() => {
                            const error = dispensePrescription(rx.id, pharmacistName);
                            if (error) toast.error(error);
                            else
                              toast.success(
                                "Dispensed — inventory reduced and billing line posted",
                              );
                          }}
                        >
                          <PackageMinus className="mr-2 size-4" />
                          Dispense medicine
                        </Button>
                      )}
                      {rx.status === "Active" && !canDispense(state.role) && (
                        <p className="text-xs text-muted-foreground">
                          Switch to a pharmacist or administrator account to dispense.
                        </p>
                      )}
                      {rx.status === "Dispensed" && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3.5" />
                          Dispensed {rx.dispensedAt ? formatDate(rx.dispensedAt, true) : ""}{" "}
                          by {rx.dispensedBy}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="inventory" className="space-y-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search formulary by name, batch, or manufacturer…"
          />
          <div className="overflow-hidden rounded-xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((m) => {
                  const until = daysUntil(m.expiryDate);
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {m.genericName} · {m.strength} · {m.form} · {m.location}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{m.batchNumber}</TableCell>
                      <TableCell>
                        {m.expiryDate}
                        {until <= 45 && (
                          <Badge variant="destructive" className="ml-2">
                            Near expiry
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{m.manufacturer}</TableCell>
                      <TableCell className="text-right">
                        {m.stock}
                        {m.stock < 50 && (
                          <Badge className="ml-2 bg-amber-600">Low stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(m.unitPrice)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
