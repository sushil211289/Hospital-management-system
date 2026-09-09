import { Stethoscope } from "lucide-react";
import { seedState } from "@/lib/seed";

export function PhysiciansPage() {
  const physicians = seedState.staff.filter((s) => s.department === "Doctors");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        Medical staff
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        Find a physician
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        These attending physicians practice at Meridian General. To schedule,
        call the switchboard or send an appointment request.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {physicians.map((doc) => (
          <article key={doc.id} className="flex gap-4 rounded-xl border bg-white p-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Stethoscope className="size-6" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">{doc.name}</h2>
              <p className="text-sm text-muted-foreground">{doc.title}</p>
              <p className="mt-2 text-sm">{doc.email}</p>
              <p className="text-xs text-muted-foreground">
                Accepting referrals · Campus clinic & inpatient attending
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
