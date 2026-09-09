"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HOSPITAL_ADDRESS, HOSPITAL_EMAIL, HOSPITAL_EMERGENCY, HOSPITAL_PHONE } from "@/lib/hospital";

export function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Scheduling
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Request an appointment
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A scheduling coordinator will return your request on the next business
          day. For chest pain, stroke symptoms, or severe bleeding, call 911 or
          go to the Emergency Department — do not use this form.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-slate-900">Switchboard</dt>
            <dd className="text-muted-foreground">{HOSPITAL_PHONE}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Emergency</dt>
            <dd className="text-muted-foreground">{HOSPITAL_EMERGENCY}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Health information</dt>
            <dd className="text-muted-foreground">{HOSPITAL_EMAIL}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Address</dt>
            <dd className="text-muted-foreground">{HOSPITAL_ADDRESS}</dd>
          </div>
        </dl>
      </div>
      <form
        className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          toast.success("Appointment request received. Scheduling will call you.");
        }}
      >
        {sent ? (
          <p className="text-sm text-emerald-800">
            Thank you. Your request is in the scheduling queue. If your symptoms
            worsen, come to the Emergency Department.
          </p>
        ) : (
          <>
            <div className="grid gap-1">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required placeholder="Jordan Lee" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required placeholder="(415) 555-0100" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="reason">Reason for visit</Label>
              <Textarea
                id="reason"
                name="reason"
                required
                placeholder="New patient visit, follow-up, preoperative clearance…"
              />
            </div>
            <Button type="submit">Submit request</Button>
          </>
        )}
      </form>
    </div>
  );
}
