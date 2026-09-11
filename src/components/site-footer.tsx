import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import {
  HOSPITAL_ADDRESS,
  HOSPITAL_EMAIL,
  HOSPITAL_NAME,
  HOSPITAL_PHONE,
  HOSPITAL_PHONE_TEL,
  HOSPITAL_WEBSITE,
  HOSPITAL_WEBSITE_LABEL,
  VALUES,
} from "@/lib/hospital";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0f172a] text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <BrandLogo size={56} className="size-14 rounded-lg" />
            <p className="text-sm font-semibold text-white">{HOSPITAL_NAME}</p>
          </div>
          <p className="mt-1 text-xs tracking-wide text-blue-200 uppercase">
            Department of Orthopaedics
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Stronger together for a healthier tomorrow. Expert care, personalized
            treatment, faster recovery, and compassionate support in Selvapuram,
            Coimbatore.
          </p>
          <p className="mt-4 text-sm">
            {HOSPITAL_ADDRESS}
            <br />
            <a className="hover:text-white" href={`tel:${HOSPITAL_PHONE_TEL}`}>
              {HOSPITAL_PHONE}
            </a>
            <br />
            <a className="hover:text-white" href={`mailto:${HOSPITAL_EMAIL}`}>
              {HOSPITAL_EMAIL}
            </a>
            <br />
            <a
              className="hover:text-white"
              href={HOSPITAL_WEBSITE}
              target="_blank"
              rel="noreferrer"
            >
              {HOSPITAL_WEBSITE_LABEL}
            </a>
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">For patients</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/physicians" className="hover:text-white">
                Dr. Vignesh Arumugam
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Book your appointment today
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-white">
                Orthopaedic services
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Our promise</p>
          <ul className="mt-3 space-y-2 text-sm">
            {VALUES.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link href="/login" className="hover:text-white">
              Staff portal sign-in
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {HOSPITAL_NAME}. Move Better · Live Better.
      </div>
    </footer>
  );
}
