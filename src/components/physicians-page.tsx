import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  HOSPITAL_EMAIL,
  HOSPITAL_NAME,
  HOSPITAL_PHONE,
  HOSPITAL_PHONE_TEL,
  ORTHO_SERVICES,
  PHYSICIANS,
} from "@/lib/hospital";
import { cn } from "@/lib/utils";

export function PhysiciansPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        {HOSPITAL_NAME}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        Our doctors
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Consultants at Kaveri Medical Center. Book a visit for general medicine,
        family care, orthopaedics, women&apos;s health, or nutrition.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {PHYSICIANS.map((doctor) => (
          <article key={doctor.id} id={doctor.id} className="overflow-hidden rounded-2xl border bg-white">
            <div className="relative aspect-[16/9]">
              <Image
                src={doctor.photo}
                alt={doctor.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900">{doctor.name}</h2>
              <p className="mt-1 text-sm font-medium text-primary">{doctor.credentials}</p>
              <p className="mt-2 text-sm text-slate-700">{doctor.title}</p>
              <p className="mt-4 text-sm">
                <a className="text-primary hover:underline" href={`mailto:${HOSPITAL_EMAIL}`}>
                  {HOSPITAL_EMAIL}
                </a>
                <br />
                <a className="text-primary hover:underline" href={`tel:${HOSPITAL_PHONE_TEL}`}>
                  {HOSPITAL_PHONE}
                </a>
              </p>
              <Link href="/contact" className={cn(buttonVariants(), "mt-5")}>
                Book an appointment
              </Link>
              {doctor.id === "vignesh" ? (
                <>
                  <h3 className="mt-8 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Orthopaedic clinics
                  </h3>
                  <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {ORTHO_SERVICES.map((service) => (
                      <li key={service.title} className="rounded-lg bg-slate-50 px-3 py-2">
                        {service.title}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
