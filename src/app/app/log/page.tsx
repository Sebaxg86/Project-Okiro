import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ActivityForm } from "@/modules/activities/activity-form";
import { activityKinds, type ActivityKind } from "@/modules/activities/schemas";

export const dynamic = "force-dynamic";

export default async function LogPage({ searchParams }: { searchParams: Promise<{ type?: string; id?: string }> }) {
  const params = await searchParams;
  const kind = activityKinds.includes(params.type as ActivityKind) ? params.type as ActivityKind : "hydration";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: intelligenceGoal }] = await Promise.all([
    supabase.from("profiles").select("timezone").eq("id", user!.id).single(),
    supabase.from("goal_versions").select("intelligence_activity_type,intelligence_activity_label").eq("user_id", user!.id).is("effective_until", null).maybeSingle(),
  ]);
  const timezone = profile?.timezone ?? "UTC";
  const now = new Date();
  const defaults: Record<string, string> = {
    localDate: new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(now),
    time: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone }).format(now),
    sleepTime: "23:30",
    wakeTime: "07:30",
  };

  const initial = params.id ? await loadActivity(supabase, user!.id, kind, params.id, timezone) : defaults;
  if (!initial) redirect("/app/history?status=not-found");

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
      <header><p className="flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.22em] text-cyan"><Sparkles size={14} /> Registro verificado</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">{params.id ? "Editar actividad" : "Registrar actividad"}</h1><p className="mt-2 text-sm text-muted">La XP se calcula en el servidor y respeta los límites diarios y semanales.</p></header>
      <section className="system-frame panel mt-8 p-6 sm:p-8"><ActivityForm kind={kind} initial={{ ...defaults, ...initial }} idempotencyKey={randomUUID()} intelligenceType={intelligenceGoal?.intelligence_activity_type ?? "programming"} intelligenceLabel={intelligenceGoal?.intelligence_activity_label ?? "Programación"} /></section>
    </div>
  );
}

async function loadActivity(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, kind: ActivityKind, id: string, timezone: string): Promise<Record<string, string> | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  if (kind === "workout") {
    const { data } = await supabase.from("workouts").select("id,occurred_at,local_date,duration_minutes,workout_type,intensity,title,notes").eq("id", id).eq("user_id", userId).is("deleted_at", null).maybeSingle();
    return data ? { recordId: data.id, localDate: data.local_date, time: formatTime(data.occurred_at, timezone), durationMinutes: String(data.duration_minutes), workoutType: data.workout_type, intensity: data.intensity, title: data.title ?? "", notes: data.notes ?? "" } : null;
  }
  if (kind === "sleep") {
    const { data } = await supabase.from("sleep_logs").select("id,sleep_started_at,woke_up_at,wake_local_date,quality,interruptions,notes").eq("id", id).eq("user_id", userId).is("deleted_at", null).maybeSingle();
    return data ? { recordId: data.id, localDate: data.wake_local_date, sleepTime: formatTime(data.sleep_started_at, timezone), wakeTime: formatTime(data.woke_up_at, timezone), quality: data.quality ? String(data.quality) : "", interruptions: data.interruptions === null ? "" : String(data.interruptions), notes: data.notes ?? "" } : null;
  }
  if (kind === "meal") {
    const { data } = await supabase.from("meal_logs").select("id,occurred_at,local_date,meal_type,description,classification,notes").eq("id", id).eq("user_id", userId).is("deleted_at", null).maybeSingle();
    return data ? { recordId: data.id, localDate: data.local_date, time: formatTime(data.occurred_at, timezone), mealType: data.meal_type, description: data.description, classification: data.classification, notes: data.notes ?? "" } : null;
  }
  if (kind === "hydration") {
    const { data } = await supabase.from("hydration_entries").select("id,occurred_at,local_date,amount_ml").eq("id", id).eq("user_id", userId).is("deleted_at", null).maybeSingle();
    return data ? { recordId: data.id, localDate: data.local_date, time: formatTime(data.occurred_at, timezone), amountMl: String(data.amount_ml) } : null;
  }
  const { data } = await supabase.from("focus_sessions").select("id,started_at,local_date,duration_minutes,focus_type,intelligence_activity_type,objective,project_name,notes").eq("id", id).eq("user_id", userId).is("deleted_at", null).maybeSingle();
  return data ? { recordId: data.id, localDate: data.local_date, time: formatTime(data.started_at, timezone), durationMinutes: String(data.duration_minutes), focusType: data.intelligence_activity_type ?? data.focus_type, objective: data.objective, projectName: data.project_name ?? "", notes: data.notes ?? "" } : null;
}

function formatTime(value: string, timezone: string) { return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone }).format(new Date(value)); }
