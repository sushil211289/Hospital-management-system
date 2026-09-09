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
        The {ROLE_LABELS[state.role]} persona cannot open {moduleLabel}. Use the
        role selector at the top of the screen to switch to Admin, or another
        role with permission.
      </CardContent>
    </Card>
  );
}
