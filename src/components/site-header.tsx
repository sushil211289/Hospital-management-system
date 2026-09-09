"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Menu, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HOSPITAL_EMERGENCY, HOSPITAL_PHONE } from "@/lib/hospital";
import { HOSPITAL_NAME } from "@/lib/seed";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Care services" },
  { href: "/physicians", label: "Find a physician" },
  { href: "/#visitors", label: "Patients & visitors" },
  { href: "/contact", label: "Contact" },
];

function NavItems({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href ? "text-primary" : "text-slate-700",
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-[#0f172a] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6">
          <p className="font-medium tracking-wide">
            Level I Trauma Center · 24/7 Emergency Department
          </p>
          <p className="flex items-center gap-3">
            <a href={`tel:${HOSPITAL_EMERGENCY.replace(/\D/g, "")}`} className="hover:underline">
              Emergency {HOSPITAL_EMERGENCY}
            </a>
            <span className="hidden text-white/40 sm:inline">|</span>
            <a
              href={`tel:${HOSPITAL_PHONE.replace(/\D/g, "")}`}
              className="hidden hover:underline sm:inline"
            >
              Switchboard {HOSPITAL_PHONE}
            </a>
          </p>
        </div>
      </div>
      <div className="border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="size-5" />
            </span>
            <span>
              <span className="block text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                Established 1952
              </span>
              <span className="block text-sm font-semibold leading-tight text-slate-900">
                {HOSPITAL_NAME}
              </span>
            </span>
          </Link>
          <nav className="ml-6 hidden items-center gap-5 lg:flex">
            <NavItems />
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/contact"
              className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
            >
              <Phone className="size-3.5" />
              Request an appointment
            </Link>
            <Link
              href="/portal"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Staff portal
            </Link>
            <Sheet>
              <SheetTrigger
                className={cn(buttonVariants({ variant: "outline", size: "icon" }), "lg:hidden")}
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-6">
                <p className="mb-4 font-semibold">{HOSPITAL_NAME}</p>
                <div className="flex flex-col gap-3">
                  <NavItems />
                  <Link href="/portal" className="text-sm font-medium text-primary">
                    Staff portal
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
