"use client";

import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABELS } from "@/lib/permissions";
import { useHospital } from "@/lib/store";

export function AccessDenied({ moduleLabel }: { moduleLabel: string }) {
  const { state } = useHospital();
  return (
    <Card className="mx-auto max-w-lg border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="size-5 text-amber-600" />
          Access restricted
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Your {ROLE_LABELS[state.role]} account cannot open {moduleLabel}. Sign out
        and use a staff login that includes this module.
      </CardContent>
    </Card>
  );
}
