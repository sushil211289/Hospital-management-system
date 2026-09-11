"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FEATURED_PHYSICIAN,
  HOSPITAL_ADDRESS,
  HOSPITAL_EMAIL,
  HOSPITAL_PHONE,
  HOSPITAL_PHONE_TEL,
  HOSPITAL_WEBSITE,
  HOSPITAL_WEBSITE_LABEL,
} from "@/lib/hospital";

export function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Book your appointment today
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Request an appointment
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Request a visit with {FEATURED_PHYSICIAN.name}, {FEATURED_PHYSICIAN.credentials},
          Consultant Orthopaedic Surgeon. For severe injury or an emergency,
          call {HOSPITAL_PHONE} immediately.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-slate-900">Appointments</dt>
            <dd className="text-muted-foreground">
              <a href={`tel:${HOSPITAL_PHONE_TEL}`}>{HOSPITAL_PHONE}</a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Email</dt>
            <dd className="text-muted-foreground">
              <a href={`mailto:${HOSPITAL_EMAIL}`}>{HOSPITAL_EMAIL}</a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Website</dt>
            <dd className="text-muted-foreground">
              <a href={HOSPITAL_WEBSITE} target="_blank" rel="noreferrer">
                {HOSPITAL_WEBSITE_LABEL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Address</dt>
            <dd className="text-muted-foreground">{HOSPITAL_ADDRESS}</dd>
          </div>
        </dl>
      </div>
      <form
        className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const payload = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
            reason: (form.elements.namedItem("reason") as HTMLTextAreaElement).value,
          };
          const res = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            toast.error("Could not save the request. Try again.");
            return;
          }
          setSent(true);
          toast.success("Appointment request saved. We will call you shortly.");
        }}
      >
        {sent ? (
          <p className="text-sm text-emerald-800">
            Thank you. Your request is with Kaveri Medical Center scheduling.
            For urgent orthopaedic injury, call {HOSPITAL_PHONE}.
          </p>
        ) : (
          <>
            <div className="grid gap-1">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required placeholder="Your name" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required placeholder="63801 11273" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="reason">Reason for visit</Label>
              <Textarea
                id="reason"
                name="reason"
                required
                placeholder="Knee pain, fracture follow-up, joint replacement consult…"
              />
            </div>
            <Button type="submit">Submit request</Button>
          </>
        )}
      </form>
    </div>
  );
}
