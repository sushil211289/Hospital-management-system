"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HospitalProvider } from "@/lib/store";
import { AppShell } from "@/components/app-shell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <HospitalProvider>
        <AppShell>{children}</AppShell>
        <Toaster richColors position="bottom-right" />
      </HospitalProvider>
    </TooltipProvider>
  );
}
