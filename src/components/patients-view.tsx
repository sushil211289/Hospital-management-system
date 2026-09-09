"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, FilePlus2, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { AccessDenied } from "@/components/access-denied";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { daysAdmitted, formatDate } from "@/lib/format";
import { canAccess, canPrescribe } from "@/lib/permissions";
import { useHospital } from "@/lib/store";
import type { Patient, PrescriptionItem } from "@/lib/types";

export function PatientsView() {
  const { state, hydrated, addPrescription } = useHospital();
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("all");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [rxOpen, setRxOpen] = useState(false);

  const patients = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.patients.filter((p) => {
      if (gender !== "all" && p.gender !== gender) return false;
      if (!q) return true;
      const hay = [
        p.mrn,
        p.firstName,
        p.lastName,
        p.bloodGroup,
        p.contact,
        p.bed,
        p.attendingPhysician,
        ...p.diagnoses,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [state.patients, query, gender]);

  if (!hydrated) return <p className="text-sm text-muted-foreground">Loading records…</p>;
  if (!canAccess(state.role, "patients")) {
    return <AccessDenied moduleLabel="Patient Records" />;
  }

  const liveSelected = selected
    ? state.patients.find((p) => p.id === selected.id) ?? selected
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Patient directory</h1>
        <p className="text-sm text-muted-foreground">
          Search the EMR, open a chart for vitals and allergies, and push
          prescriptions into the pharmacy queue.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by name, MRN, diagnosis, or physician…"
        />
        <Select value={gender} onValueChange={(value) => value && setGender(value)}>
          <SelectTrigger className="w-full bg-white sm:w-40">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genders</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">{patients.length} records</p>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
          No patients match that filter.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Blood</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Admitted</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.mrn}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {p.lastName}, {p.firstName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.bed} · {p.attendingPhysician}
                    </div>
                  </TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.bloodGroup}</TableCell>
                  <TableCell>{p.contact}</TableCell>
                  <TableCell>
                    {formatDate(p.admittedAt)}
                    <div className="text-xs text-muted-foreground">
                      Day {daysAdmitted(p.admittedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelected(p)}>
                      Open chart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!liveSelected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {liveSelected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  {liveSelected.lastName}, {liveSelected.firstName}
                  <Badge variant="secondary">{liveSelected.mrn}</Badge>
                  <Badge>{liveSelected.status}</Badge>
                </DialogTitle>
              </DialogHeader>

              {liveSelected.allergies.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-800">
                    <AlertTriangle className="size-4" />
                    Known drug allergies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {liveSelected.allergies.map((a) => (
                      <Badge
                        key={a.id}
                        variant="destructive"
                        className={
                          a.severity === "Mild"
                            ? "bg-amber-600"
                            : undefined
                        }
                      >
                        {a.substance} · {a.severity} · {a.reaction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Tabs defaultValue="vitals">
                <TabsList>
                  <TabsTrigger value="vitals">Vitals</TabsTrigger>
                  <TabsTrigger value="notes">Notes & diagnoses</TabsTrigger>
                  <TabsTrigger value="rx">Prescriptions</TabsTrigger>
                </TabsList>
                <TabsContent value="vitals" className="space-y-2">
                  {liveSelected.vitals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No vitals logged.</p>
                  ) : (
                    liveSelected.vitals.map((v) => (
                      <div
                        key={v.id}
                        className="grid grid-cols-2 gap-2 rounded-lg border p-3 text-sm sm:grid-cols-6"
                      >
                        <div className="col-span-2 sm:col-span-6 flex items-center gap-2 text-xs text-muted-foreground">
                          <HeartPulse className="size-3.5 text-primary" />
                          {formatDate(v.recordedAt, true)} · {v.recordedBy}
                        </div>
                        <Vital label="BP" value={`${v.systolic}/${v.diastolic}`} />
                        <Vital label="HR" value={`${v.heartRate} bpm`} />
                        <Vital label="Temp" value={`${v.temperatureC.toFixed(1)} °C`} />
                        <Vital label="SpO2" value={`${v.spo2}%`} />
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="notes" className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {liveSelected.diagnoses.map((d) => (
                      <Badge key={d} variant="secondary">
                        {d}
                      </Badge>
                    ))}
                  </div>
                  {liveSelected.consultations.map((c) => (
                    <div key={c.id} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">
                        {c.diagnosis}
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          {formatDate(c.date, true)} · {c.clinician} · {c.department}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-slate-700">{c.notes}</p>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="rx" className="space-y-3">
                  {canPrescribe(state.role) && (
                    <Button size="sm" onClick={() => setRxOpen(true)}>
                      <FilePlus2 className="mr-2 size-4" />
                      New e-prescription
                    </Button>
                  )}
                  {state.prescriptions
                    .filter((rx) => rx.patientId === liveSelected.id)
                    .map((rx) => (
                      <div key={rx.id} className="rounded-lg border p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{rx.id}</span>
                          <Badge
                            variant={rx.status === "Active" ? "default" : "secondary"}
                          >
                            {rx.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rx.prescribedBy} · {formatDate(rx.prescribedAt, true)}
                          {rx.dispensedBy
                            ? ` · Dispensed by ${rx.dispensedBy}`
                            : ""}
                        </p>
                        <ul className="mt-2 list-disc pl-5">
                          {rx.items.map((item) => (
                            <li key={item.medicineId}>
                              {item.medicineName} — {item.dosage}, {item.frequency}{" "}
                              (qty {item.quantity})
                            </li>
                          ))}
                        </ul>
                        {rx.notes && (
                          <p className="mt-2 text-xs text-amber-800">{rx.notes}</p>
                        )}
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {liveSelected && (
        <NewRxDialog
          open={rxOpen}
          onOpenChange={setRxOpen}
          patient={liveSelected}
          onSubmit={(items, notes, prescribedBy) => {
            addPrescription({
              patientId: liveSelected.id,
              prescribedBy,
              notes,
              items,
            });
            toast.success("Prescription sent to pharmacy");
            setRxOpen(false);
          }}
        />
      )}
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function NewRxDialog({
  open,
  onOpenChange,
  patient,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient;
  onSubmit: (items: PrescriptionItem[], notes: string, prescribedBy: string) => void;
}) {
  const { state } = useHospital();
  const [medicineId, setMedicineId] = useState(state.medicines[0]?.id ?? "");
  const [qty, setQty] = useState("7");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [notes, setNotes] = useState("");
  const [prescribedBy, setPrescribedBy] = useState(patient.attendingPhysician);
  const [items, setItems] = useState<PrescriptionItem[]>([]);

  const med = state.medicines.find((m) => m.id === medicineId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New prescription · {patient.lastName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Prescribing clinician</Label>
            <Input value={prescribedBy} onChange={(e) => setPrescribedBy(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <Label>Medication</Label>
            <Select value={medicineId} onValueChange={(value) => value && setMedicineId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {state.medicines.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} {m.strength} ({m.stock} in stock)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="grid gap-1">
              <Label>Qty</Label>
              <Input value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Dosage</Label>
              <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder={med?.strength} />
            </div>
            <div className="grid gap-1">
              <Label>Frequency</Label>
              <Input value={frequency} onChange={(e) => setFrequency(e.target.value)} />
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (!med) return;
              const quantity = Number(qty);
              if (!quantity || quantity < 1) {
                toast.error("Enter a valid quantity");
                return;
              }
              setItems((prev) => [
                ...prev.filter((i) => i.medicineId !== med.id),
                {
                  medicineId: med.id,
                  medicineName: `${med.name} ${med.strength}`,
                  dosage: dosage || med.strength,
                  frequency,
                  quantity,
                  unitPrice: med.unitPrice,
                },
              ]);
            }}
          >
            Add line
          </Button>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No medications added yet.</p>
          ) : (
            <ul className="list-disc pl-5 text-sm">
              {items.map((i) => (
                <li key={i.medicineId}>
                  {i.medicineName} × {i.quantity}
                </li>
              ))}
            </ul>
          )}
          <div className="grid gap-1">
            <Label>Clinical notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button
            onClick={() => {
              if (items.length === 0) {
                toast.error("Add at least one medication");
                return;
              }
              onSubmit(items, notes, prescribedBy);
              setItems([]);
              setNotes("");
            }}
          >
            Send to pharmacy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
