import Link from "next/link";
import {
  Ambulance,
  Baby,
  Bone,
  Brain,
  HeartPulse,
  Stethoscope,
  Syringe,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HOSPITAL_ADDRESS, HOSPITAL_EMERGENCY, HOSPITAL_PHONE } from "@/lib/hospital";
import { HOSPITAL_NAME, seedState } from "@/lib/seed";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    icon: Ambulance,
    title: "Emergency & trauma",
    copy: "24/7 Level I trauma bay with dedicated stroke and STEMI pathways.",
  },
  {
    icon: HeartPulse,
    title: "Heart & vascular",
    copy: "Cardiac catheterization, electrophysiology, and inpatient telemetry.",
  },
  {
    icon: Baby,
    title: "Women & newborns",
    copy: "Labor and delivery, postpartum suites, and a Level II nursery.",
  },
  {
    icon: Bone,
    title: "Surgery",
    copy: "General, orthopedic, and minimally invasive operating rooms.",
  },
  {
    icon: Brain,
    title: "Pulmonary & ICU",
    copy: "Medical-surgical ICU with respiratory therapy on every shift.",
  },
  {
    icon: Syringe,
    title: "Pharmacy & infusion",
    copy: "Inpatient pharmacy, sterile compounding, and outpatient infusion.",
  },
];

export function PublicHome() {
  const physicians = seedState.staff.filter((s) => s.department === "Doctors");

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#2563eb_0%,_transparent_45%),linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#0f172a_100%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-200 uppercase">
              Bay Area academic medical center
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Care you can trust, close to home.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200">
              {HOSPITAL_NAME} is a 312-bed hospital where emergency physicians,
              specialists, and nurses work as one team. Whether you need the ER,
              a scheduled surgery, or a new primary physician, we are here around
              the clock.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className={cn(buttonVariants({ size: "lg" }))}>
                Request an appointment
              </Link>
              <Link
                href="/physicians"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white",
                )}
              >
                Find a physician
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-blue-100">
              <Ambulance className="size-4" />
              If this is an emergency, call 911 or {HOSPITAL_EMERGENCY}.
            </p>
          </div>
          <div className="grid content-end gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              ["312", "Licensed beds"],
              ["1,400+", "Clinicians & staff"],
              ["73 yrs", "Serving this city"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-5 backdrop-blur"
              >
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-sm text-blue-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Clinical programs
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Hospital services
          </h2>
          <p className="mt-2 text-muted-foreground">
            From the trauma bay to postpartum recovery, every unit is staffed for
            inpatient and emergency care.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <service.icon className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {service.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Medical staff
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Our physicians
              </h2>
            </div>
            <Link href="/physicians" className={cn(buttonVariants({ variant: "outline" }))}>
              View the full directory
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {physicians.map((doc) => (
              <div key={doc.id} className="rounded-xl border bg-slate-50 p-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Stethoscope className="size-5" />
                </div>
                <p className="mt-3 font-semibold text-slate-900">{doc.name}</p>
                <p className="text-sm text-muted-foreground">{doc.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="visitors" className="mx-auto grid max-w-6xl scroll-mt-28 gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 lg:col-span-2">
          <div className="flex items-center gap-2 text-primary">
            <Clock className="size-5" />
            <h2 className="text-xl font-semibold text-slate-900">Visiting hours</h2>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium">Medical / surgical units</dt>
              <dd className="text-muted-foreground">10:00 a.m. – 8:00 p.m. daily</dd>
            </div>
            <div>
              <dt className="font-medium">ICU</dt>
              <dd className="text-muted-foreground">11:00 a.m. – 2:00 p.m. and 5:00 – 8:00 p.m.</dd>
            </div>
            <div>
              <dt className="font-medium">Labor & delivery</dt>
              <dd className="text-muted-foreground">Support person 24 hours; guests 1:00 – 8:00 p.m.</dd>
            </div>
            <div>
              <dt className="font-medium">Pediatrics</dt>
              <dd className="text-muted-foreground">Parents 24 hours; siblings by arrangement</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border bg-[#0f172a] p-6 text-white">
          <div className="flex items-center gap-2 text-blue-200">
            <MapPin className="size-5" />
            <h2 className="text-xl font-semibold text-white">Campus</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {HOSPITAL_ADDRESS}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Main entrance on Embarcadero. Valet 6 a.m. – 8 p.m. Garage open 24 hours.
          </p>
          <p className="mt-4 text-sm">
            Appointments {HOSPITAL_PHONE}
          </p>
        </div>
      </section>

      <section className="border-t bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Joint Commission accredited
              </h2>
              <p className="text-sm text-muted-foreground">
                Magnet-recognized nursing. Stroke Gold Plus. We accept most
                commercial plans, Medicare Advantage, and Medi-Cal.
              </p>
            </div>
          </div>
          <Link href="/contact" className={cn(buttonVariants())}>
            Talk with scheduling
          </Link>
        </div>
      </section>
    </div>
  );
}
