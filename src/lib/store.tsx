"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { seedState } from "./seed";
import type {
  HospitalState,
  Invoice,
  PrescriptionItem,
  Role,
} from "./types";

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
  dispensePrescription: (prescriptionId: string, dispensedBy: string) => Promise<string | null>;
  addPrescription: (input: {
    patientId: string;
    prescribedBy: string;
    notes: string;
    items: PrescriptionItem[];
  }) => Promise<void>;
  updateInvoice: (invoiceId: string, patch: InvoicePatch) => Promise<void>;
  cyclePaymentStatus: (invoiceId: string) => Promise<void>;
  resetDemo: () => Promise<void>;
};

const HospitalContext = createContext<HospitalContextValue | null>(null);

async function fetchState(): Promise<HospitalState | null> {
  const res = await fetch("/api/hospital", { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as HospitalState;
}

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onPortal = pathname.startsWith("/portal");
  const [state, setState] = useState<HospitalState>(seedState);
  const [loaded, setLoaded] = useState(false);
  const hydrated = onPortal ? loaded : true;

  const refresh = useCallback(async () => {
    const next = await fetchState();
    if (next) setState(next);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!onPortal) return;
    const kickoff = window.setTimeout(() => {
      void refresh();
    }, 0);
    const timer = window.setInterval(() => {
      void refresh();
    }, 4000);
    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
    };
  }, [onPortal, refresh]);

  const setRole = useCallback((role: Role) => {
    setState((prev) => ({ ...prev, role }));
  }, []);

  const dispensePrescription = useCallback(
    async (prescriptionId: string, dispensedBy: string) => {
      const res = await fetch("/api/hospital/dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptionId, dispensedBy }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) return data.error ?? "Unable to dispense.";
      await refresh();
      return null;
    },
    [refresh],
  );

  const addPrescription = useCallback(
    async (input: {
      patientId: string;
      prescribedBy: string;
      notes: string;
      items: PrescriptionItem[];
    }) => {
      await fetch("/api/hospital/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      await refresh();
    },
    [refresh],
  );

  const updateInvoice = useCallback(
    async (invoiceId: string, patch: InvoicePatch) => {
      await fetch(`/api/hospital/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      await refresh();
    },
    [refresh],
  );

  const cyclePaymentStatus = useCallback(
    async (invoiceId: string) => {
      await fetch(`/api/hospital/invoices/${invoiceId}/cycle`, { method: "POST" });
      await refresh();
    },
    [refresh],
  );

  const resetDemo = useCallback(async () => {
    await fetch("/api/hospital/reset", { method: "POST" });
    await refresh();
  }, [refresh]);

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
