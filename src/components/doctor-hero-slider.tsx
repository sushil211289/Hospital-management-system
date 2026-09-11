"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
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

export function DoctorHeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = PHYSICIANS.length;

  const [touchX, setTouchX] = useState<number | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => go(index + 1), 7000);
    return () => window.clearInterval(timer);
  }, [go, index, paused]);

  return (
    <section
      className="relative overflow-hidden bg-slate-900 text-white"
      aria-roledescription="carousel"
      aria-label="Doctors at Kaveri Medical Center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#2563eb_0%,_transparent_45%),linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#0f172a_100%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <BrandLogo
          size={96}
          priority
          className="mb-6 size-20 rounded-2xl shadow-lg ring-1 ring-white/40 sm:size-24"
        />
        <p className="text-xs font-semibold tracking-[0.22em] text-blue-200 uppercase">
          {HOSPITAL_NAME} · {HOSPITAL_TAGLINE}
        </p>

        <div
          className="mt-6 overflow-hidden"
          onTouchStart={(event) => setTouchX(event.touches[0]?.clientX ?? null)}
          onTouchEnd={(event) => {
            if (touchX == null) return;
            const delta = (event.changedTouches[0]?.clientX ?? touchX) - touchX;
            if (delta > 50) go(index - 1);
            if (delta < -50) go(index + 1);
            setTouchX(null);
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {PHYSICIANS.map((doctor, i) => (
              <article
                key={doctor.id}
                className="min-w-full"
                aria-hidden={i !== index}
                aria-label={`${i + 1} of ${count}`}
              >
                <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/10 shadow-2xl ring-1 ring-white/20">
                    <Image
                      src={doctor.photo}
                      alt={doctor.name}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 320px, 90vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-200">Our doctors</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
                      {doctor.name}
                    </h1>
                    <p className="mt-3 text-lg font-medium text-blue-100">
                      {doctor.credentials}
                    </p>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-200">
                      {doctor.title}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
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

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/20"
            aria-label="Previous doctor"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2" role="tablist" aria-label="Choose a doctor">
            {PHYSICIANS.map((doctor, i) => (
              <button
                key={doctor.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={doctor.name}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70",
                )}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/20"
            aria-label="Next doctor"
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
