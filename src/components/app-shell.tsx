"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Pill,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { SessionBadge } from "@/components/session-badge";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HOSPITAL_NAME } from "@/lib/seed";
import { canAccess, ROLE_LABELS, type ModuleKey } from "@/lib/permissions";
import { useHospital } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: typeof LayoutDashboard; module: ModuleKey }[] = [
  { href: "/portal", label: "Command Center", icon: LayoutDashboard, module: "dashboard" },
  { href: "/portal/patients", label: "Patient Records", icon: ClipboardList, module: "patients" },
  { href: "/portal/pharmacy", label: "Pharmacy", icon: Pill, module: "pharmacy" },
  { href: "/portal/billing", label: "Billing", icon: Receipt, module: "billing" },
  { href: "/portal/payroll", label: "Payroll", icon: Wallet, module: "payroll" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { state } = useHospital();

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const allowed = canAccess(state.role, item.module);
        const active = pathname === item.href;
        const Icon = item.icon;
        if (!allowed) {
          return (
            <div
              key={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/35"
              title="Restricted for this role"
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wide">Locked</span>
            </div>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state, hydrated } = useHospital();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <BrandLogo size={40} className="size-10 rounded-lg" />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sidebar-foreground/60">
              Clinical HIS
            </p>
            <p className="font-semibold leading-tight">{HOSPITAL_NAME}</p>
          </div>
        </div>
        <div className="flex-1 px-3 py-4">
          <NavLinks />
        </div>
        <div className="border-t border-sidebar-border px-5 py-4 text-xs text-sidebar-foreground/60">
          <div className="flex items-center gap-2">
            <Building2 className="size-3.5" />
            Campus · Coimbatore
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Users className="size-3.5" />
            Session: {hydrated ? ROLE_LABELS[state.role] : "…"}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
            <Sheet>
              <SheetTrigger
                className={cn(buttonVariants({ variant: "outline", size: "icon" }), "lg:hidden")}
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar p-0 text-sidebar-foreground">
                <div className="flex items-center gap-3 px-5 py-5">
                  <BrandLogo size={40} className="size-10 rounded-lg" />
                  <p className="text-sm font-semibold">{HOSPITAL_NAME}</p>
                </div>
                <div className="px-3">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden text-sm text-muted-foreground sm:block">
              Staff HIS · live PostgreSQL ledger
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/"
                className="hidden text-sm text-primary hover:underline sm:block"
              >
                Hospital website
              </Link>
              <SessionBadge />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
