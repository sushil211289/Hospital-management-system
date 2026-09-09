"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STAFF_ACCOUNTS } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS } from "@/lib/permissions";
import { HOSPITAL_NAME } from "@/lib/seed";

function safeNext(value: string | null) {
  if (value && value.startsWith("/portal") && !value.startsWith("//")) return value;
  return "/portal";
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(nextEmail = email, nextPassword = password) {
    setPending(true);
    setError(null);
    const message = await login(nextEmail, nextPassword);
    setPending(false);
    if (message) {
      setError(message);
      return;
    }
    toast.success("Signed in to the staff portal");
    router.push(safeNext(params.get("next")));
    router.refresh();
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-[#0f172a] p-10 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="size-5" />
          </span>
          {HOSPITAL_NAME}
        </Link>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-blue-200 uppercase">
            Staff access only
          </p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold tracking-tight">
            Sign in to the clinical information system.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
            Patient records, pharmacy dispensing, billing, and payroll are limited
            to authenticated hospital employees. Use your campus credentials.
          </p>
        </div>
        <p className="text-xs text-slate-500">HIPAA training required · Session expires after 8 hours</p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden">
            <Link href="/" className="text-sm font-medium text-primary">
              ← {HOSPITAL_NAME}
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Staff portal sign-in
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your hospital email and password.
            </p>
          </div>

          <form
            className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <div className="grid gap-1">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@meridian.hospital"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Demo accounts
            </p>
            <ul className="mt-3 space-y-2">
              {STAFF_ACCOUNTS.map((account) => (
                <li key={account.email}>
                  <button
                    type="button"
                    className="w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-slate-50"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      void submit(account.email, account.password);
                    }}
                  >
                    <span className="font-medium">{account.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {ROLE_LABELS[account.role]}
                    </span>
                    <span className="mt-0.5 block font-mono text-xs text-slate-500">
                      {account.email}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
