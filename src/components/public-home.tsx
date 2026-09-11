import Link from "next/link";
import Image from "next/image";
import { Bone, MapPin } from "lucide-react";
import { DoctorHeroSlider } from "@/components/doctor-hero-slider";
import { buttonVariants } from "@/components/ui/button";
import {
  HOSPITAL_ADDRESS,
  HOSPITAL_PHONE,
  HOSPITAL_PHONE_TEL,
  ORTHO_SERVICES,
  PHYSICIANS,
  PROMISE_POINTS,
  VALUES,
} from "@/lib/hospital";
import { cn } from "@/lib/utils";

export function PublicHome() {
  return (
    <div>
      <DoctorHeroSlider />

      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {PROMISE_POINTS.map((point) => (
            <div key={point} className="rounded-xl border bg-slate-50 px-4 py-4">
              <p className="font-semibold text-slate-900">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Consultants
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Meet the doctors
            </h2>
          </div>
          <Link href="/physicians" className={cn(buttonVariants({ variant: "outline" }))}>
            Full profiles
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PHYSICIANS.map((doctor) => (
            <Link
              key={doctor.id}
              href="/physicians"
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={doctor.photo}
                  alt={doctor.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-slate-900">{doctor.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{doctor.credentials}</p>
                <p className="mt-1 text-sm text-slate-700">{doctor.title}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <div key={value} className="rounded-xl border bg-white p-4 text-sm font-medium">
              {value}
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="scroll-mt-28 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Care we provide
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Orthopaedic services
            </h2>
            <p className="mt-2 text-muted-foreground">
              Full-spectrum bone, joint, spine, and sports care for every stage
              of life.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORTHO_SERVICES.map((service) => (
              <div key={service.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <Bone className="size-5 text-primary" />
                <h3 className="mt-3 font-semibold text-slate-900">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="visit" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:px-6">
        <div className="rounded-2xl border bg-[#0f172a] p-6 text-white sm:p-8">
          <div className="flex items-center gap-2 text-blue-200">
            <MapPin className="size-5" />
            <h2 className="text-xl font-semibold text-white">Visit the centre</h2>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
            {HOSPITAL_ADDRESS}
          </p>
          <p className="mt-4 text-sm">
            Appointments{" "}
            <a className="underline decoration-blue-300" href={`tel:${HOSPITAL_PHONE_TEL}`}>
              {HOSPITAL_PHONE}
            </a>
          </p>
          <Link href="/contact" className={cn(buttonVariants(), "mt-6")}>
            Book an appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
