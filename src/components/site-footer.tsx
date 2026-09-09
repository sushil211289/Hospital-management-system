import Link from "next/link";
import { HOSPITAL_ADDRESS, HOSPITAL_EMAIL, HOSPITAL_PHONE } from "@/lib/hospital";
import { HOSPITAL_NAME } from "@/lib/seed";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0f172a] text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-white">{HOSPITAL_NAME}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed">
            A not-for-profit academic medical center serving the Bay Area with
            emergency, surgical, maternal, and specialty care.
          </p>
          <p className="mt-4 text-sm">
            {HOSPITAL_ADDRESS}
            <br />
            {HOSPITAL_PHONE}
            <br />
            {HOSPITAL_EMAIL}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">For patients</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/physicians" className="hover:text-white">
                Find a physician
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Request an appointment
              </Link>
            </li>
            <li>
              <Link href="/#visitors" className="hover:text-white">
                Visiting hours
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">For staff</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/login" className="hover:text-white">
                Staff portal sign-in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {HOSPITAL_NAME}. For demonstration; not a
        live care facility.
      </div>
    </footer>
  );
}
