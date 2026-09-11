"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  HOSPITAL_NAME,
  HOSPITAL_PHONE,
  HOSPITAL_PHONE_TEL,
  HOSPITAL_SHORT,
  HOSPITAL_TAGLINE,
} from "@/lib/hospital";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Orthopaedics" },
  { href: "/physicians", label: "Our doctors" },
  { href: "/#visit", label: "Location" },
  { href: "/contact", label: "Book visit" },
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
            {HOSPITAL_SHORT} · Department of Orthopaedics · {HOSPITAL_TAGLINE}
          </p>
          <a href={`tel:${HOSPITAL_PHONE_TEL}`} className="hover:underline">
            Book now · {HOSPITAL_PHONE}
          </a>
        </div>
      </div>
      <div className="border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={52} priority className="size-12 shrink-0 rounded-lg shadow-sm ring-1 ring-slate-200" />
            <span>
              <span className="block text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                {HOSPITAL_SHORT}
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
              Book appointment
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
                <div className="mb-4 flex items-center gap-3">
                  <BrandLogo size={44} className="size-11 rounded-lg ring-1 ring-slate-200" />
                  <p className="font-semibold">{HOSPITAL_NAME}</p>
                </div>
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
