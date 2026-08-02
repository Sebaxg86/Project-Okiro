import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/modules/onboarding/onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name,timezone,onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_completed_at) redirect("/app");

  return (
    <main className="app-grid min-h-screen bg-background px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="font-display text-sm font-semibold tracking-[0.18em] text-foreground">OKIRO</Link>
        <div className="system-frame panel mt-8 p-6 sm:p-10">
          <p className="flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.24em] text-cyan"><Sparkles size={14} /> Configuración inicial</p>
          <h1 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[-0.04em] sm:text-4xl">
            Bienvenido{profile?.display_name ? `, ${profile.display_name}` : ""}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Okiro transforma registros cotidianos en una representación de progreso. No sustituye asesoría médica y nunca premia cambios de peso.
          </p>
          <div className="my-8 h-px bg-gradient-to-r from-accent/70 via-cyan/40 to-transparent" />
          <OnboardingForm initialTimezone={profile?.timezone ?? "UTC"} />
        </div>
      </div>
    </main>
  );
}

