import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { buttonVariants } from "@/components/ui/button";
import {
  HOSPITAL_NAME,
  HOSPITAL_PHONE,
  HOSPITAL_PHONE_TEL,
  HOSPITAL_TAGLINE,
  PHYSICIANS,
} from "@/lib/hospital";
import { cn } from "@/lib/utils";

const MARQUEE_DOCTORS = [...PHYSICIANS, ...PHYSICIANS];

export function DoctorHeroSlider() {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#2563eb_0%,_transparent_45%),linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#0f172a_100%)]" />
      <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:pt-16">
        <BrandLogo
          size={96}
          priority
          className="mb-6 size-20 rounded-2xl shadow-lg ring-1 ring-white/40 sm:size-24"
        />
        <p className="text-xs font-semibold tracking-[0.22em] text-blue-200 uppercase">
          {HOSPITAL_NAME} · {HOSPITAL_TAGLINE}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Our doctors</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Consultants in orthopaedics, general medicine, family care, women&apos;s
          health, and nutrition.
        </p>
      </div>

      <div
        className="doctor-marquee relative mt-8"
        aria-label="Scrolling list of doctors"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-900 to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-slate-900 to-transparent sm:w-24" />
        <div className="overflow-hidden">
          <div className="doctor-marquee-track flex gap-5 pe-5">
            {MARQUEE_DOCTORS.map((doctor, i) => (
              <article
                key={`${doctor.id}-${i}`}
                className="w-[260px] shrink-0 overflow-hidden rounded-2xl bg-white/10 shadow-xl ring-1 ring-white/15 sm:w-[300px]"
                aria-hidden={i >= PHYSICIANS.length}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={doctor.photo}
                    alt={i >= PHYSICIANS.length ? "" : doctor.name}
                    fill
                    sizes="300px"
                    className="object-cover object-top"
                    priority={i < 2}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold tracking-tight">{doctor.name}</h2>
                  <p className="mt-1 text-sm font-medium text-blue-100">{doctor.credentials}</p>
                  <p className="mt-1 text-sm text-slate-200">{doctor.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/contact" className={cn(buttonVariants({ size: "lg" }))}>
            Book your appointment today
          </Link>
          <Link
            href="/physicians"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white",
            )}
          >
            Meet the team
          </Link>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-blue-100">
          <Phone className="size-4" />
          <a href={`tel:${HOSPITAL_PHONE_TEL}`} className="hover:underline">
            {HOSPITAL_PHONE}
          </a>
        </p>
      </div>
    </section>
  );
}
