import { CalendarDays, LockKeyhole, Scale, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm, WeightForm } from "@/modules/profile/profile-forms";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: weights }] = await Promise.all([
    supabase.from("profiles").select("full_name,display_name,birth_date,timezone,unit_system,created_at").eq("id", user!.id).single(),
    supabase.from("weight_entries").select("id,measured_on,weight_kg,source").eq("user_id", user!.id).order("measured_on", { ascending: false }).limit(12),
  ]);

  if (!profile) return null;
  const unitSystem = profile.unit_system as "metric" | "imperial";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: profile.timezone }).format(new Date());

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
      <header><p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Identidad del sistema</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">Perfil</h1><p className="mt-2 text-sm text-muted">Administra tu identidad, preferencias y mediciones privadas.</p></header>

      <section className="system-frame panel mt-8 p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent"><UserRound size={20} /></div><div><h2 className="font-display text-lg font-semibold uppercase">Información personal</h2><p className="text-xs text-muted">El correo de acceso es {user?.email}</p></div></div>
        <ProfileForm profile={{ ...profile, unit_system: unitSystem }} />
      </section>

      <section id="weight" className="panel mt-5 scroll-mt-24 p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl border border-cyan/30 bg-cyan/[0.07] text-cyan"><Scale size={20} /></div><div><h2 className="font-display text-lg font-semibold uppercase">Registro de peso</h2><p className="text-xs text-muted">Seguimiento informativo, separado del sistema de XP.</p></div></div>
        <WeightForm unitSystem={unitSystem} today={today} />
        <div className="mt-8 border-t border-line/60 pt-6">
          <h3 className="font-display text-xs font-semibold uppercase tracking-[0.12em]">Últimas mediciones</h3>
          {weights?.length ? <div className="mt-4 divide-y divide-line/50">{weights.map((entry) => <div key={entry.id} className="flex items-center justify-between py-3"><div className="flex items-center gap-3 text-sm"><CalendarDays size={15} className="text-muted" />{formatDate(entry.measured_on)}</div><strong>{formatWeight(Number(entry.weight_kg), unitSystem)}</strong></div>)}</div> : <p className="mt-4 text-sm text-muted">Todavía no hay mediciones registradas.</p>}
        </div>
      </section>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-line bg-surface/70 p-4 text-xs leading-5 text-muted"><LockKeyhole size={16} className="mt-0.5 shrink-0 text-cyan" /> Estos datos solo pueden ser consultados y modificados por tu cuenta mediante políticas RLS.</div>
    </div>
  );
}

function formatDate(value: string) { return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }
function formatWeight(kg: number, units: "metric" | "imperial") { return units === "imperial" ? `${(kg * 2.2046226218).toFixed(1)} lb` : `${kg.toFixed(1)} kg`; }

