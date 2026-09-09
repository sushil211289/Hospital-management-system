"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS } from "@/lib/permissions";

export function SessionBadge() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium leading-tight">{user.name}</p>
        <p className="text-xs text-muted-foreground">
          {ROLE_LABELS[user.role]} · {user.title}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await logout();
          router.push("/login");
          router.refresh();
        }}
      >
        <LogOut className="size-3.5" />
        Sign out
      </Button>
    </div>
  );
}
