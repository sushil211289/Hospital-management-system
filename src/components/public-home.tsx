import Link from "next/link";
import { Bone, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DEPARTMENT,
  FEATURED_PHYSICIAN,
  HOSPITAL_ADDRESS,
  HOSPITAL_NAME,
  HOSPITAL_PHONE,
  HOSPITAL_PHONE_TEL,
  HOSPITAL_TAGLINE,
  ORTHO_SERVICES,
  PROMISE_POINTS,
  VALUES,
} from "@/lib/hospital";
import { cn } from "@/lib/utils";

export function PublicHome() {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#2563eb_0%,_transparent_45%),linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#0f172a_100%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-xs font-semibold tracking-[0.22em] text-blue-200 uppercase">
            {HOSPITAL_NAME} · {HOSPITAL_TAGLINE}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {DEPARTMENT.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-blue-100">{DEPARTMENT.slogan}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200">
            {FEATURED_PHYSICIAN.name}, {FEATURED_PHYSICIAN.credentials},{" "}
            {FEATURED_PHYSICIAN.title}. {FEATURED_PHYSICIAN.quote}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
              Meet Dr. Vignesh Arumugam
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
        <div className="grid items-start gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Consultant
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {FEATURED_PHYSICIAN.name}
            </h2>
            <p className="mt-3 font-medium text-slate-800">
              {FEATURED_PHYSICIAN.credentials} · {FEATURED_PHYSICIAN.title}
            </p>
            <blockquote className="mt-5 border-l-4 border-primary pl-4 text-sm leading-relaxed text-slate-700">
              “{FEATURED_PHYSICIAN.quote}”
            </blockquote>
            <Link href="/physicians" className={cn(buttonVariants(), "mt-6")}>
              Surgeon profile
            </Link>
          </div>
          <div className="lg:col-span-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {VALUES.map((value) => (
                <div key={value} className="rounded-xl border bg-white p-4 text-sm font-medium">
                  {value}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Stronger together for a healthier tomorrow — from paediatric bone
              problems to joint replacement and physiotherapy-guided recovery.
            </p>
          </div>
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
