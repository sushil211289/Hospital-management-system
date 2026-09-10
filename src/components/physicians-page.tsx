import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  FEATURED_PHYSICIAN,
  HOSPITAL_EMAIL,
  HOSPITAL_NAME,
  HOSPITAL_PHONE,
  HOSPITAL_PHONE_TEL,
  ORTHO_SERVICES,
} from "@/lib/hospital";
import { cn } from "@/lib/utils";

export function PhysiciansPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        Department of Orthopaedics
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {FEATURED_PHYSICIAN.name}
      </h1>
      <p className="mt-1 text-primary">{FEATURED_PHYSICIAN.nameTa}</p>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {FEATURED_PHYSICIAN.credentials} · {FEATURED_PHYSICIAN.title} at{" "}
        {HOSPITAL_NAME}. {FEATURED_PHYSICIAN.titleTa}.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <Image
            src={FEATURED_PHYSICIAN.photo}
            alt={`${FEATURED_PHYSICIAN.name}, ${FEATURED_PHYSICIAN.title}`}
            width={900}
            height={1200}
            className="h-auto w-full"
          />
        </div>
        <article className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Consultant profile</h2>
          <blockquote className="mt-4 border-l-4 border-primary pl-4 text-sm leading-relaxed text-slate-700">
            “{FEATURED_PHYSICIAN.quote}”
            <span className="mt-2 block text-muted-foreground">
              “{FEATURED_PHYSICIAN.quoteTa}”
            </span>
          </blockquote>
          <p className="mt-4 text-sm">
            <a className="text-primary hover:underline" href={`mailto:${HOSPITAL_EMAIL}`}>
              {HOSPITAL_EMAIL}
            </a>
            <br />
            <a className="text-primary hover:underline" href={`tel:${HOSPITAL_PHONE_TEL}`}>
              {HOSPITAL_PHONE}
            </a>
          </p>
          <Link href="/contact" className={cn(buttonVariants(), "mt-6")}>
            Book an appointment
          </Link>
          <h3 className="mt-8 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Clinics covered
          </h3>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {ORTHO_SERVICES.map((service) => (
              <li key={service.title} className="rounded-lg bg-slate-50 px-3 py-2">
                {service.title}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
