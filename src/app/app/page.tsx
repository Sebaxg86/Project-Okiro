import Link from "next/link";
import { Activity, ArrowRight, CalendarDays, Scale, ShieldCheck, Target, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [profileResult, goalResult, cycleResult, progressResult, weightResult] = await Promise.all([
    supabase.from("profiles").select("display_name,timezone").eq("id", user!.id).single(),
    supabase.from("goal_versions").select("exercise_days_target,programming_days_target,hydration_target_ml,sleep_min_minutes,sleep_max_minutes,expected_main_meals").eq("user_id", user!.id).is("effective_until", null).maybeSingle(),
    supabase.from("weekly_cycles").select("week_start,week_end,status").eq("user_id", user!.id).eq("status", "open").order("week_start", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("user_progress").select("current_level,total_consolidated_xp,current_level_xp,xp_required_for_next_level").eq("user_id", user!.id).single(),
    supabase.from("weight_entries").select("weight_kg,measured_on").eq("user_id", user!.id).order("measured_on", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const profile = profileResult.data;
  const goal = goalResult.data;
  const cycle = cycleResult.data;
  const progress = progressResult.data;
  const latestWeight = weightResult.data;
  const timezone = profile?.timezone ?? "UTC";
  const today = new Intl.DateTimeFormat("es-MX", { dateStyle: "full", timeZone: timezone }).format(new Date());
  const percent = progress ? Math.min(100, Math.round((progress.current_level_xp / progress.xp_required_for_next_level) * 100)) : 0;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Panel operativo · datos reales</p>
          <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em] sm:text-4xl">Hola, {profile?.display_name}</h1>
          <p className="mt-2 capitalize text-sm text-muted">{today}</p>
        </div>
        <Link href="/app/profile#weight" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white shadow-[0_0_24px_rgba(139,92,255,.25)]">
          <Scale size={17} /> Registrar peso
        </Link>
      </header>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <article className="system-frame panel p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.18em] text-muted">Progreso consolidado</p>
              <p className="mt-3 font-display text-5xl font-semibold text-foreground">Nivel {progress?.current_level ?? 1}</p>
            </div>
            <div className="grid size-12 place-items-center rounded-2xl border border-cyan/30 bg-cyan/[0.07] text-cyan"><Zap size={22} /></div>
          </div>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-[#17152d]" aria-label={`${percent}% del nivel actual`}>
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted">
            <span>{progress?.current_level_xp ?? 0} XP en este nivel</span>
            <span>{progress?.xp_required_for_next_level ?? 400} XP requeridos</span>
          </div>
          <div className="mt-6 flex items-center gap-2 border-t border-line/60 pt-5 text-sm text-muted">
            <ShieldCheck size={16} className="text-cyan" /> {progress?.total_consolidated_xp ?? 0} XP histórica · nunca disminuye
          </div>
        </article>

        <article className="panel p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-accent" size={20} />
            <div><p className="font-display text-[10px] uppercase tracking-[0.16em] text-muted">Ciclo actual</p><p className="mt-1 font-semibold">Semana abierta</p></div>
          </div>
          {cycle ? (
            <p className="mt-6 text-sm leading-6 text-muted">Del {formatDate(cycle.week_start)} al {formatDate(cycle.week_end)}. Todavía no hay XP provisional porque no existen actividades registradas.</p>
          ) : (
            <p className="mt-6 text-sm leading-6 text-muted">Tu ciclo semanal se creará al completar el onboarding.</p>
          )}
          <div className="mt-6 rounded-xl border border-line bg-black/10 p-4"><p className="font-display text-[10px] uppercase tracking-[0.14em] text-muted">XP provisional</p><p className="mt-1 text-2xl font-semibold text-cyan">0 XP</p></div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_.72fr]">
        <article className="panel p-6">
          <div className="flex items-center justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Objetivos vigentes</p><h2 className="mt-2 font-display text-xl font-semibold uppercase">Tu configuración</h2></div><Target className="text-accent" /></div>
          {goal ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Goal label="Ejercicio" value={`${goal.exercise_days_target} días / semana`} />
              <Goal label="Programación" value={`${goal.programming_days_target} días / semana`} />
              <Goal label="Hidratación" value={`${goal.hydration_target_ml} ml / día`} />
              <Goal label="Sueño" value={`${goal.sleep_min_minutes / 60}–${goal.sleep_max_minutes / 60} horas`} />
              <Goal label="Alimentación" value={`${goal.expected_main_meals} comidas principales`} />
            </div>
          ) : <p className="mt-6 text-sm text-muted">Aún no hay objetivos configurados.</p>}
        </article>

        <article className="panel p-6">
          <div className="flex items-center justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Estado corporal</p><h2 className="mt-2 font-display text-xl font-semibold uppercase">Peso privado</h2></div><Scale className="text-accent" /></div>
          {latestWeight ? <><p className="mt-7 text-4xl font-semibold">{latestWeight.weight_kg} <span className="text-base text-muted">kg</span></p><p className="mt-2 text-sm text-muted">Última medición · {formatDate(latestWeight.measured_on)}</p></> : <p className="mt-7 text-sm leading-6 text-muted">No tienes mediciones. Registrar el peso es opcional y no afecta tu XP.</p>}
          <Link href="/app/profile#weight" className="mt-6 flex items-center gap-2 text-sm font-medium text-cyan">Ver historial de peso <ArrowRight size={15} /></Link>
        </article>
      </section>

      <section className="mt-5 panel p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="grid size-12 place-items-center rounded-2xl border border-line bg-accent/10 text-accent"><Activity size={22} /></div>
          <div><h2 className="font-display text-lg font-semibold uppercase">Sin actividad inventada</h2><p className="mt-2 text-sm leading-6 text-muted">Tu historial comienza vacío. La siguiente etapa incorporará los formularios de ejercicio, sueño, comidas, agua y programación con cálculo real de XP.</p></div>
          <Link href="/app/history" className="flex items-center gap-2 text-sm font-medium text-cyan">Abrir historial <ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}

function Goal({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-line/70 bg-black/10 p-4"><p className="font-display text-[9px] uppercase tracking-[0.15em] text-muted">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}
