"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/permissions";
import { useHospital } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLES: Role[] = ["admin", "clinical", "pharmacist"];

export function RoleSwitcher() {
  const { state, setRole } = useHospital();

  return (
    <div className="flex items-center gap-2 rounded-full border bg-white p-1 shadow-sm">
      <span className="hidden items-center gap-1 px-2 text-xs font-medium text-slate-500 sm:flex">
        <Shield className="size-3.5" />
        Role
      </span>
      {ROLES.map((role) => (
        <Button
          key={role}
          size="sm"
          variant={state.role === role ? "default" : "ghost"}
          className={cn(
            "h-8 rounded-full px-3 text-xs",
            state.role === role ? "" : "text-slate-600",
          )}
          onClick={() => setRole(role)}
        >
          {ROLE_LABELS[role]}
        </Button>
      ))}
    </div>
  );
}
