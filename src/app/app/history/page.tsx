import { randomUUID } from "node:crypto";
import Link from "next/link";
import { Activity, Apple, ArrowRight, BedDouble, Code2, Droplets, Dumbbell, Plus, Scale } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ActivityActions } from "@/modules/activities/activity-actions";
import type { ActivityKind } from "@/modules/activities/schemas";
import { getIntelligenceActivity, intelligenceActivityLabel } from "@/modules/intelligence/activities";

export const dynamic = "force-dynamic";

type HistoryItem = { id: string; kind: ActivityKind; sourceType: string; occurredAt: string; title: string; detail: string; intelligenceType?: string };
const icons = { workout: Dumbbell, sleep: BedDouble, meal: Apple, hydration: Droplets, focus: Code2 };

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ status?: string; xp?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [profileResult, workoutsResult, sleepResult, mealsResult, hydrationResult, focusResult, xpResult, weightResult, goalResult] = await Promise.all([
    supabase.from("profiles").select("unit_system,timezone").eq("id", user!.id).single(),
    supabase.from("workouts").select("id,occurred_at,duration_minutes,workout_type,title").eq("user_id", user!.id).is("deleted_at", null).order("occurred_at", { ascending: false }).limit(30),
    supabase.from("sleep_logs").select("id,woke_up_at,duration_minutes,quality").eq("user_id", user!.id).is("deleted_at", null).order("woke_up_at", { ascending: false }).limit(30),
    supabase.from("meal_logs").select("id,occurred_at,meal_type,description,classification").eq("user_id", user!.id).is("deleted_at", null).order("occurred_at", { ascending: false }).limit(30),
    supabase.from("hydration_entries").select("id,occurred_at,amount_ml").eq("user_id", user!.id).is("deleted_at", null).order("occurred_at", { ascending: false }).limit(30),
    supabase.from("focus_sessions").select("id,started_at,duration_minutes,focus_type,intelligence_activity_type,objective").eq("user_id", user!.id).is("deleted_at", null).order("started_at", { ascending: false }).limit(30),
    supabase.from("xp_transactions").select("source_type,source_id,amount").eq("user_id", user!.id).eq("status", "provisional"),
    supabase.from("weight_entries").select("id,measured_on,weight_kg,source").eq("user_id", user!.id).order("measured_on", { ascending: false }).limit(12),
    supabase.from("goal_versions").select("intelligence_activity_type,intelligence_activity_label").eq("user_id", user!.id).is("effective_until", null).maybeSingle(),
  ]);

  const profile = profileResult.data;
  const timezone = profile?.timezone ?? "UTC";
  const xpMap = new Map((xpResult.data ?? []).map((transaction) => [`${transaction.source_type}:${transaction.source_id}`, transaction.amount]));
  const items: HistoryItem[] = [
    ...(workoutsResult.data ?? []).map((item) => ({ id: item.id, kind: "workout" as const, sourceType: "workout", occurredAt: item.occurred_at, title: item.title || workoutLabel(item.workout_type), detail: `${item.duration_minutes} min · ${workoutLabel(item.workout_type)}` })),
    ...(sleepResult.data ?? []).map((item) => ({ id: item.id, kind: "sleep" as const, sourceType: "sleep_log", occurredAt: item.woke_up_at, title: "Descanso principal", detail: `${Math.floor(item.duration_minutes / 60)} h ${item.duration_minutes % 60} min${item.quality ? ` · calidad ${item.quality}/5` : ""}` })),
    ...(mealsResult.data ?? []).map((item) => ({ id: item.id, kind: "meal" as const, sourceType: "meal_log", occurredAt: item.occurred_at, title: item.description, detail: `${mealTypeLabel(item.meal_type)} · ${classificationLabel(item.classification)}` })),
    ...(hydrationResult.data ?? []).map((item) => ({ id: item.id, kind: "hydration" as const, sourceType: "hydration_entry", occurredAt: item.occurred_at, title: `${item.amount_ml} ml de agua`, detail: "Cuenta para tu meta diaria" })),
    ...(focusResult.data ?? []).map((item) => ({ id: item.id, kind: "focus" as const, sourceType: "focus_session", occurredAt: item.started_at, title: item.objective, detail: `${item.duration_minutes} min · ${focusLabel(item.intelligence_activity_type ?? item.focus_type, goalResult.data?.intelligence_activity_label)}`, intelligenceType: item.intelligence_activity_type ?? item.focus_type })),
  ].sort((a, b) => +new Date(b.occurredAt) - +new Date(a.occurredAt)).slice(0, 60);
  const imperial = profile?.unit_system === "imperial";
  const notice = noticeFor(params.status, Number(params.xp ?? 0));

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Archivo del Sistema</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">Registro</h1><p className="mt-2 text-sm text-muted">Consulta todas las acciones vinculadas a tu progreso.</p></div><Link href="/app/log" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white"><Plus size={17} />Registrar acción</Link></header>
      {notice && <div className="mt-6 rounded-xl border border-cyan/30 bg-cyan/[0.06] px-4 py-3 text-sm text-cyan">{notice}</div>}

      <section className="system-frame panel mt-8 p-6 sm:p-8">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent"><Activity size={20} /></div><div><h2 className="font-display text-lg font-semibold uppercase">Acciones registradas</h2><p className="text-xs text-muted">{items.length} registros</p></div></div>
        {items.length ? <div className="mt-6 divide-y divide-line/50">{items.map((item) => { const Icon = item.kind === "focus" ? getIntelligenceActivity(item.intelligenceType).icon : icons[item.kind]; const xp = xpMap.get(`${item.sourceType}:${item.id}`) ?? 0; return <article key={`${item.kind}:${item.id}`} className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center"><div className="grid size-10 place-items-center rounded-xl border border-line bg-black/10 text-accent"><Icon size={18} /></div><div><h3 className="font-medium">{item.title}</h3><p className="mt-1 text-xs text-muted">{formatDateTime(item.occurredAt, timezone)} · {item.detail}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${xp > 0 ? "bg-cyan/[0.08] text-cyan" : xp < 0 ? "bg-warning/[0.08] text-warning" : "bg-white/[0.04] text-muted"}`}>{xp > 0 ? "+" : ""}{xp} XP</span><ActivityActions kind={item.kind} id={item.id} idempotencyKey={randomUUID()} /></article>; })}</div> : <div className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center"><Activity className="mx-auto text-muted" size={28} /><h3 className="mt-4 font-display text-sm font-semibold uppercase">Aún no hay acciones registradas</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">Registra tu primera acción para comenzar a construir tu perfil.</p><Link href="/app/log" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan">Registrar primera acción <ArrowRight size={15} /></Link></div>}
      </section>

      <section className="panel mt-5 p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Scale className="text-cyan" size={20} /><div><h2 className="font-display text-lg font-semibold uppercase">Registro de peso</h2><p className="text-xs text-muted">Seguimiento privado</p></div></div><Link href="/app/profile#weight" className="text-sm font-medium text-cyan">Registrar peso</Link></div>{weightResult.data?.length ? <div className="mt-5 divide-y divide-line/50">{weightResult.data.map((entry) => <div key={entry.id} className="flex items-center justify-between py-3"><span className="text-sm text-muted">{formatDate(entry.measured_on)}</span><strong>{imperial ? `${(Number(entry.weight_kg) * 2.2046226218).toFixed(1)} lb` : `${Number(entry.weight_kg).toFixed(1)} kg`}</strong></div>)}</div> : <p className="mt-5 text-sm text-muted">Aún no has registrado mediciones.</p>}</section>
    </div>
  );
}

function noticeFor(status?: string, xp = 0) { if (status === "saved") return `Acción registrada · ${xp >= 0 ? "+" : ""}${xp} XP`; if (status === "updated") return `Registro actualizado · ${xp >= 0 ? "+" : ""}${xp} XP`; if (status === "deleted") return `Registro eliminado · balance ${xp >= 0 ? "+" : ""}${xp} XP`; if (status === "delete-error") return "No fue posible eliminar el registro."; return null; }
function formatDateTime(value: string, timezone: string) { return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: timezone }).format(new Date(value)); }
function formatDate(value: string) { return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }
function workoutLabel(value: string) { return ({ strength: "Fuerza", cardio: "Cardio", walking: "Caminata", cycling: "Ciclismo", swimming: "Natación", boxing: "Box", mma: "MMA", sport: "Deporte", mobility: "Movilidad", yoga: "Yoga", active_recovery: "Recuperación activa", functional: "Funcional", mixed: "Mixto", other: "Otro" } as Record<string,string>)[value] ?? value; }
function mealTypeLabel(value: string) { return ({ breakfast: "Desayuno", lunch: "Comida", dinner: "Cena", snack: "Snack", other: "Otra" } as Record<string,string>)[value] ?? value; }
function classificationLabel(value: string) { return ({ balanced: "Equilibrada", adequate: "Adecuada", flexible: "Flexible", out_of_plan: "Fuera del plan", considerable_excess: "Exceso considerable" } as Record<string,string>)[value] ?? value; }
function focusLabel(value: string, customLabel?: string | null) { const legacy = ({ technical_study: "Estudio técnico", exercises: "Ejercicios", course: "Curso", technical_reading: "Lectura técnica", personal_project: "Proyecto personal" } as Record<string,string>)[value]; return legacy ?? intelligenceActivityLabel(value, value === "custom" ? customLabel : null); }
