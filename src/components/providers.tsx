"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { HospitalProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <HospitalProvider>
        <AuthProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </AuthProvider>
      </HospitalProvider>
    </TooltipProvider>
  );
}
