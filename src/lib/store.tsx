"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { computeInvoiceTotals } from "./finance";
import { uid } from "./format";
import { seedState, STATE_VERSION } from "./seed";
import type {
  HospitalState,
  Invoice,
  PaymentStatus,
  PrescriptionItem,
  Role,
} from "./types";

const STORAGE_KEY = "meridian-his-v1";

type InvoicePatch = Partial<
  Pick<
    Invoice,
    | "discountPercent"
    | "taxPercent"
    | "insuranceCoveragePercent"
    | "deductible"
    | "copay"
    | "amountPaid"
    | "paymentStatus"
  >
>;

type HospitalContextValue = {
  state: HospitalState;
  hydrated: boolean;
  setRole: (role: Role) => void;
  dispensePrescription: (prescriptionId: string, dispensedBy: string) => string | null;
  addPrescription: (input: {
    patientId: string;
    prescribedBy: string;
    notes: string;
    items: PrescriptionItem[];
  }) => void;
  updateInvoice: (invoiceId: string, patch: InvoicePatch) => void;
  cyclePaymentStatus: (invoiceId: string) => void;
  resetDemo: () => void;
};

const HospitalContext = createContext<HospitalContextValue | null>(null);

function readStorage(): HospitalState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...seedState };
    const parsed = JSON.parse(raw) as HospitalState;
    if (parsed.version !== STATE_VERSION) return { ...seedState };
    return { ...seedState, ...parsed, version: STATE_VERSION };
  } catch {
    return { ...seedState };
  }
}

let memory: HospitalState = { ...seedState };
let booted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist(next: HospitalState) {
  memory = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!booted) {
    memory = readStorage();
    booted = true;
  }
  return memory;
}

function getServerSnapshot() {
  return seedState;
}

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const setRole = useCallback((role: Role) => {
    persist({ ...getSnapshot(), role });
  }, []);

  const dispensePrescription = useCallback(
    (prescriptionId: string, dispensedBy: string) => {
      const prev = getSnapshot();
      const rx = prev.prescriptions.find((p) => p.id === prescriptionId);
      if (!rx) return "Prescription not found.";
      if (rx.status !== "Active") return "This prescription is no longer active.";

      const nextMedicines = prev.medicines.map((med) => ({ ...med }));
      for (const item of rx.items) {
        const med = nextMedicines.find((m) => m.id === item.medicineId);
        if (!med) return `Inventory item missing for ${item.medicineName}.`;
        if (med.stock < item.quantity) {
          return `Insufficient stock for ${med.name} (${med.stock} on hand, ${item.quantity} required).`;
        }
      }

      for (const item of rx.items) {
        const med = nextMedicines.find((m) => m.id === item.medicineId);
        if (med) med.stock -= item.quantity;
      }

      const pharmacyTotal = rx.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );

      persist({
        ...prev,
        medicines: nextMedicines,
        prescriptions: prev.prescriptions.map((p) =>
          p.id === prescriptionId
            ? {
                ...p,
                status: "Dispensed" as const,
                dispensedAt: new Date().toISOString(),
                dispensedBy,
              }
            : p,
        ),
        invoices: prev.invoices.map((invoice) => {
          if (invoice.patientId !== rx.patientId) return invoice;
          if (invoice.lineItems.some((li) => li.linkedPrescriptionId === rx.id)) {
            return invoice;
          }
          return {
            ...invoice,
            lineItems: [
              ...invoice.lineItems,
              {
                id: uid("li"),
                category: "Pharmacy" as const,
                description: `Rx ${rx.id} — ${rx.items.map((i) => i.medicineName).join(", ")}`,
                quantity: 1,
                unitPrice: Number(pharmacyTotal.toFixed(2)),
                createdAt: new Date().toISOString(),
                linkedPrescriptionId: rx.id,
              },
            ],
            paymentStatus:
              invoice.paymentStatus === "Settled"
                ? ("Partially Paid" as PaymentStatus)
                : invoice.paymentStatus,
          };
        }),
      });
      return null;
    },
    [],
  );

  const addPrescription = useCallback(
    (input: {
      patientId: string;
      prescribedBy: string;
      notes: string;
      items: PrescriptionItem[];
    }) => {
      const prev = getSnapshot();
      persist({
        ...prev,
        prescriptions: [
          {
            id: uid("rx"),
            patientId: input.patientId,
            prescribedBy: input.prescribedBy,
            prescribedAt: new Date().toISOString(),
            status: "Active",
            notes: input.notes,
            items: input.items,
          },
          ...prev.prescriptions,
        ],
      });
    },
    [],
  );

  const updateInvoice = useCallback((invoiceId: string, patch: InvoicePatch) => {
    const prev = getSnapshot();
    persist({
      ...prev,
      invoices: prev.invoices.map((invoice) => {
        if (invoice.id !== invoiceId) return invoice;
        const next = { ...invoice, ...patch };
        const patient = prev.patients.find((p) => p.id === next.patientId);
        if (patient && patch.amountPaid !== undefined) {
          const totals = computeInvoiceTotals(patient, next);
          if (next.amountPaid <= 0) next.paymentStatus = "Pending";
          else if (next.amountPaid + 0.009 >= totals.patientShare)
            next.paymentStatus = "Settled";
          else next.paymentStatus = "Partially Paid";
        }
        return next;
      }),
    });
  }, []);

  const cyclePaymentStatus = useCallback((invoiceId: string) => {
    const order: PaymentStatus[] = ["Pending", "Partially Paid", "Settled"];
    const prev = getSnapshot();
    persist({
      ...prev,
      invoices: prev.invoices.map((invoice) => {
        if (invoice.id !== invoiceId) return invoice;
        const idx = order.indexOf(invoice.paymentStatus);
        const nextStatus = order[(idx + 1) % order.length];
        const patient = prev.patients.find((p) => p.id === invoice.patientId);
        let amountPaid = invoice.amountPaid;
        if (patient) {
          const totals = computeInvoiceTotals(patient, invoice);
          if (nextStatus === "Pending") amountPaid = 0;
          if (nextStatus === "Partially Paid")
            amountPaid = Number((totals.patientShare * 0.4).toFixed(2));
          if (nextStatus === "Settled") amountPaid = Number(totals.patientShare.toFixed(2));
        }
        return { ...invoice, paymentStatus: nextStatus, amountPaid };
      }),
    });
  }, []);

  const resetDemo = useCallback(() => {
    persist({ ...seedState, role: getSnapshot().role });
  }, []);

  const value = useMemo(
    () => ({
      state,
      hydrated,
      setRole,
      dispensePrescription,
      addPrescription,
      updateInvoice,
      cyclePaymentStatus,
      resetDemo,
    }),
    [
      state,
      hydrated,
      setRole,
      dispensePrescription,
      addPrescription,
      updateInvoice,
      cyclePaymentStatus,
      resetDemo,
    ],
  );

  return (
    <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>
  );
}

export function useHospital() {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error("useHospital must be used within HospitalProvider");
  return ctx;
}
