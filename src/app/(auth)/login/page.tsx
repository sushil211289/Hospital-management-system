import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Loading sign-in…</p>}>
      <LoginForm />
    </Suspense>
  );
}
