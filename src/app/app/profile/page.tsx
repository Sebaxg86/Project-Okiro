import { CalendarDays, LockKeyhole, LogOut, Scale, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GoalSettingsPanel } from "@/modules/profile/goal-settings";
import { ProfileForm, WeightForm } from "@/modules/profile/profile-forms";
import { signOutAction } from "@/modules/auth/actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: weights }, { data: goal }] = await Promise.all([
    supabase.from("profiles").select("full_name,display_name,birth_date,timezone,unit_system,created_at,goal_change_used_at").eq("id", user!.id).single(),
    supabase.from("weight_entries").select("id,measured_on,weight_kg,source").eq("user_id", user!.id).order("measured_on", { ascending: false }).limit(12),
    supabase.from("goal_versions").select("exercise_days_target,programming_days_target,intelligence_activity_type,intelligence_activity_label,hydration_target_ml,sleep_min_minutes,sleep_max_minutes,sleep_target_time,expected_main_meals,flexible_meals_per_week").eq("user_id", user!.id).is("effective_until", null).maybeSingle(),
  ]);

  if (!profile) return null;
  const unitSystem = profile.unit_system as "metric" | "imperial";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: profile.timezone }).format(new Date());

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
      <header><p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Identidad vinculada</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">Identidad</h1><p className="mt-2 text-sm text-muted">Gestiona los datos vinculados a tu cuenta.</p></header>

      <section className="system-frame panel mt-8 p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent"><UserRound size={20} /></div><div><h2 className="font-display text-lg font-semibold uppercase">Datos de identidad</h2><p className="text-xs text-muted">Cuenta vinculada: {user?.email}</p></div></div>
        <ProfileForm profile={{ ...profile, unit_system: unitSystem }} />
      </section>

      {goal && <GoalSettingsPanel goal={goal} canChange={!profile.goal_change_used_at} changedAt={profile.goal_change_used_at} />}

      <section id="weight" className="panel mt-5 scroll-mt-24 p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl border border-cyan/30 bg-cyan/[0.07] text-cyan"><Scale size={20} /></div><div><h2 className="font-display text-lg font-semibold uppercase">Registro de peso</h2><p className="text-xs text-muted">Seguimiento privado. No modifica tu XP.</p></div></div>
        <WeightForm unitSystem={unitSystem} today={today} />
        <div className="mt-8 border-t border-line/60 pt-6">
          <h3 className="font-display text-xs font-semibold uppercase tracking-[0.12em]">Mediciones recientes</h3>
          {weights?.length ? <div className="mt-4 divide-y divide-line/50">{weights.map((entry) => <div key={entry.id} className="flex items-center justify-between py-3"><div className="flex items-center gap-3 text-sm"><CalendarDays size={15} className="text-muted" />{formatDate(entry.measured_on)}</div><strong>{formatWeight(Number(entry.weight_kg), unitSystem)}</strong></div>)}</div> : <p className="mt-4 text-sm text-muted">Aún no has registrado mediciones.</p>}
        </div>
      </section>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-line bg-surface/70 p-4 text-xs leading-5 text-muted"><LockKeyhole size={16} className="mt-0.5 shrink-0 text-cyan" /><span><strong className="block font-display uppercase text-cyan">Datos protegidos</strong>Solo tu cuenta puede consultar y modificar esta información.</span></div>

      <section className="panel mt-5 p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold uppercase">Sesión activa</h2>
        <p className="mt-2 text-sm text-muted">Tu progreso permanecerá protegido después de salir.</p>
        <form action={signOutAction} className="mt-5">
          <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-warning/35 bg-warning/[0.07] px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-warning transition active:scale-[.98] sm:w-auto">
            <LogOut size={17} /> Cerrar sesión
          </button>
        </form>
      </section>
    </div>
  );
}

function formatDate(value: string) { return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }
function formatWeight(kg: number, units: "metric" | "imperial") { return units === "imperial" ? `${(kg * 2.2046226218).toFixed(1)} lb` : `${kg.toFixed(1)} kg`; }
