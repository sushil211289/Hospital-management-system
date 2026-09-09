"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HospitalProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <HospitalProvider>
        {children}
        <Toaster richColors position="bottom-right" />
      </HospitalProvider>
    </TooltipProvider>
  );
}
