import Link from "next/link";
import { Activity, Apple, ArrowRight, BedDouble, Brain, CalendarDays, Check, Droplets, Dumbbell, Flame, HeartPulse, Plus, Scale, ShieldCheck, Swords, Target, Trophy, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getIntelligenceActivity } from "@/modules/intelligence/activities";

export const dynamic = "force-dynamic";

type MissionItem = { mission_type: string; title: string; current_value: number; target_value: number; unit: string; status: string };
type AttributeRow = { attribute: string; level: number; current_level_xp: number; xp_required_for_next_level: number; total_xp: number };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [profileResult, goalResult, cycleResult, progressResult, weightResult] = await Promise.all([
    supabase.from("profiles").select("display_name,timezone").eq("id", user!.id).single(),
    supabase.from("goal_versions").select("exercise_days_target,programming_days_target,intelligence_activity_type,intelligence_activity_label,hydration_target_ml,sleep_min_minutes,sleep_max_minutes,expected_main_meals").eq("user_id", user!.id).is("effective_until", null).maybeSingle(),
    supabase.from("weekly_cycles").select("id,week_start,week_end,status").eq("user_id", user!.id).eq("status", "open").order("week_start", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("user_progress").select("current_level,total_consolidated_xp,current_level_xp,xp_required_for_next_level").eq("user_id", user!.id).single(),
    supabase.from("weight_entries").select("weight_kg,measured_on").eq("user_id", user!.id).order("measured_on", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const profile = profileResult.data;
  const goal = goalResult.data;
  const cycle = cycleResult.data;
  const progress = progressResult.data;
  const latestWeight = weightResult.data;
  const IntelligenceIcon = getIntelligenceActivity(goal?.intelligence_activity_type).icon;
  const intelligenceLabel = goal?.intelligence_activity_label ?? "Programación";
  const timezone = profile?.timezone ?? "UTC";
  const now = new Date();
  const todayLabel = new Intl.DateTimeFormat("es-MX", { dateStyle: "full", timeZone: timezone }).format(now);
  const todayIso = new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(now);

  const detail = cycle ? await Promise.all([
    supabase.from("xp_transactions").select("category,amount,attribute").eq("weekly_cycle_id", cycle.id).eq("status", "provisional"),
    supabase.from("weekly_live_state").select("provisional_xp,rank,rank_score,exercise_score,sleep_score,nutrition_score,hydration_score,programming_score,data_coverage,completed_missions").eq("weekly_cycle_id", cycle.id).maybeSingle(),
    supabase.from("attribute_progress").select("attribute,level,current_level_xp,xp_required_for_next_level,total_xp").eq("user_id", user!.id).order("attribute"),
    supabase.from("daily_missions").select("id,status,completed_required_items,total_required_items,bonus_earned,daily_mission_items(mission_type,title,current_value,target_value,unit,status)").eq("weekly_cycle_id", cycle.id).eq("mission_date", todayIso).maybeSingle(),
    supabase.from("workouts").select("id", { count: "exact", head: true }).eq("weekly_cycle_id", cycle.id).is("deleted_at", null),
    supabase.from("sleep_logs").select("id", { count: "exact", head: true }).eq("weekly_cycle_id", cycle.id).is("deleted_at", null),
    supabase.from("meal_logs").select("id", { count: "exact", head: true }).eq("weekly_cycle_id", cycle.id).is("deleted_at", null),
    supabase.from("hydration_entries").select("id", { count: "exact", head: true }).eq("weekly_cycle_id", cycle.id).is("deleted_at", null),
    supabase.from("focus_sessions").select("id", { count: "exact", head: true }).eq("weekly_cycle_id", cycle.id).is("deleted_at", null),
  ]) : null;
  const transactions = detail?.[0].data ?? [];
  const live = detail?.[1].data;
  const attributes = (detail?.[2].data ?? []) as AttributeRow[];
  const mission = detail?.[3].data;
  const missionItems = (mission?.daily_mission_items ?? []) as MissionItem[];
  const provisionalXp = live?.provisional_xp ?? transactions.reduce((sum, item) => sum + item.amount, 0);
  const categoryXp = (category: string) => transactions.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0);
  const attributePending = (attribute: string) => transactions.filter((item) => item.attribute === attribute && item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
  const activityCount = detail ? detail.slice(4).reduce((sum, result) => sum + (result.count ?? 0), 0) : 0;
  const permanentPercent = progress ? Math.min(100, progress.current_level_xp / progress.xp_required_for_next_level * 100) : 0;
  const projectedXp = (progress?.current_level_xp ?? 0) + Math.max(0, provisionalXp);
  const projectedPercent = progress ? Math.min(100, projectedXp / progress.xp_required_for_next_level * 100) : 0;
  const weeklyPercent = Math.min(100, Math.max(0, provisionalXp) / 1000 * 100);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Panel operativo · semana en curso</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em] sm:text-4xl">Hola, {profile?.display_name}</h1><p className="mt-2 capitalize text-sm text-muted">{todayLabel}</p></div>
        <Link href="/app/log" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white shadow-[0_0_24px_rgba(139,92,255,.25)]"><Plus size={17} /> Registrar actividad</Link>
      </header>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
        <article className="system-frame panel p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-muted">Proyección al consolidar</p><p className="mt-3 font-display text-5xl font-semibold">Nivel {progress?.current_level ?? 1}</p></div><div className="grid size-12 place-items-center rounded-2xl border border-cyan/30 bg-cyan/[0.07] text-cyan"><Zap size={22} /></div></div>
          <div className="mt-8">
            <div className="relative h-3 overflow-hidden rounded-full bg-[#17152d]" aria-label={`${Math.round(projectedPercent)}% proyectado del nivel`}>
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-cyan transition-[width] duration-500" style={{ width: `${projectedPercent}%` }} />
              <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${permanentPercent}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs"><span className="text-muted">{progress?.current_level_xp ?? 0} XP consolidada en el nivel</span><span className={provisionalXp < 0 ? "text-warning" : "text-cyan"}>{provisionalXp > 0 ? "+" : ""}{provisionalXp} XP provisional</span><span className="text-muted">Meta {progress?.xp_required_for_next_level ?? 400}</span></div>
          </div>
          <div className="mt-7 border-t border-line/60 pt-5">
            <div className="flex justify-between text-xs text-muted"><span>Pulso semanal</span><span>{Math.max(0, provisionalXp)} / 1,000 XP objetivo</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#17152d]"><div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan transition-[width] duration-500" style={{ width: `${weeklyPercent}%` }} /></div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted"><ShieldCheck size={16} className="text-cyan" />{progress?.total_consolidated_xp ?? 0} XP histórica protegida</p>
          </div>
        </article>

        <article className="panel flex flex-col p-6">
          <div className="flex items-center justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.16em] text-muted">Rango provisional</p><p className="mt-1 text-sm text-muted">Evaluación en tiempo real</p></div><Trophy className={rankColor(live?.rank ?? "E")} size={22} /></div>
          <div className={`my-auto py-6 text-center font-display text-8xl font-bold ${rankColor(live?.rank ?? "E")}`}>{live?.rank ?? "E"}</div>
          <div className="flex items-end justify-between border-t border-line/60 pt-4"><div><p className="text-2xl font-semibold">{Number(live?.rank_score ?? 0).toFixed(1)}</p><p className="text-xs text-muted">puntuación ponderada</p></div><div className="text-right"><p className="font-semibold">{Number(live?.data_coverage ?? 0).toFixed(0)}%</p><p className="text-xs text-muted">cobertura</p></div></div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <article className="panel p-6">
          <div className="flex items-center justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Misiones del día</p><h2 className="mt-2 font-display text-xl font-semibold uppercase">{mission?.completed_required_items ?? 0} de {mission?.total_required_items ?? missionItems.length} completadas</h2></div><Flame className={mission?.status === "completed" ? "text-cyan" : "text-accent"} /></div>
          <div className="mt-6 space-y-3">{missionItems.map((item) => <div key={item.mission_type} className="flex items-center gap-3 rounded-xl border border-line/70 bg-black/10 p-3"><span className={`grid size-8 shrink-0 place-items-center rounded-lg border ${item.status === "completed" ? "border-cyan/40 bg-cyan/[0.08] text-cyan" : "border-line text-muted"}`}>{item.status === "completed" ? <Check size={15} /> : missionIcon(item.mission_type, IntelligenceIcon)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-muted">{Number(item.current_value).toFixed(0)} / {Number(item.target_value).toFixed(0)} {item.unit}</p></div></div>)}</div>
          {mission?.bonus_earned && <p className="mt-4 rounded-xl border border-cyan/25 bg-cyan/[0.05] p-3 text-sm text-cyan">Misión diaria completa · +8 XP provisional</p>}
          <Link href="/app/missions" className="mt-5 flex items-center gap-2 text-sm font-medium text-cyan">Ver semana de misiones <ArrowRight size={15} /></Link>
        </article>

        <article className="panel p-6">
          <div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Atributos</p><h2 className="mt-2 font-display text-xl font-semibold uppercase">Trayectoria + impulso semanal</h2></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{attributes.map((attribute) => <AttributeCard key={attribute.attribute} attribute={attribute} pending={attributePending(attribute.attribute)} />)}</div>
          <Link href="/app/progress" className="mt-5 flex items-center gap-2 text-sm font-medium text-cyan">Abrir progreso completo <ArrowRight size={15} /></Link>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_.72fr]">
        <article className="panel p-6"><div className="flex items-center justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Pilares de la semana</p><h2 className="mt-2 font-display text-xl font-semibold uppercase">Puntuación y XP</h2></div><Target className="text-accent" /></div>{goal && <div className="mt-6 grid gap-3 sm:grid-cols-2"><Goal label="Ejercicio" value={`${goal.exercise_days_target} días`} xp={categoryXp("exercise")} score={live?.exercise_score} /><Goal label={intelligenceLabel} value={`${goal.programming_days_target} días`} xp={categoryXp("focus")} score={live?.programming_score} /><Goal label="Hidratación" value={`${goal.hydration_target_ml} ml`} xp={categoryXp("hydration")} score={live?.hydration_score} /><Goal label="Sueño" value={`${goal.sleep_min_minutes / 60}–${goal.sleep_max_minutes / 60} h`} xp={categoryXp("sleep")} score={live?.sleep_score} /><Goal label="Alimentación" value={`${goal.expected_main_meals} comidas`} xp={categoryXp("nutrition")} score={live?.nutrition_score} /></div>}</article>
        <article className="panel p-6"><div className="flex items-center justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Ciclo actual</p><h2 className="mt-2 font-display text-xl font-semibold uppercase">Semana abierta</h2></div><CalendarDays className="text-accent" /></div>{cycle && <p className="mt-6 text-sm text-muted">{formatDate(cycle.week_start)} — {formatDate(cycle.week_end)} · {activityCount} registros</p>}<div className="mt-5 rounded-xl border border-line bg-black/10 p-4"><p className="font-display text-[9px] uppercase tracking-[0.14em] text-muted">XP provisional neta</p><p className={`mt-1 text-3xl font-semibold ${provisionalXp < 0 ? "text-warning" : "text-cyan"}`}>{provisionalXp > 0 ? "+" : ""}{provisionalXp}</p></div>{latestWeight ? <p className="mt-5 flex items-center gap-2 text-xs text-muted"><Scale size={14} />Último peso: {latestWeight.weight_kg} kg · no afecta XP</p> : null}</article>
      </section>

      <section className="mt-5 panel p-6 sm:p-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Acción rápida</p><h2 className="mt-2 font-display text-lg font-semibold uppercase">¿Qué quieres registrar?</h2></div><Link href="/app/history" className="flex items-center gap-2 text-sm font-medium text-cyan">Ver {activityCount} registros <ArrowRight size={15} /></Link></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5"><QuickLog href="/app/log?type=workout" label="Ejercicio" icon={Dumbbell} /><QuickLog href="/app/log?type=sleep" label="Sueño" icon={BedDouble} /><QuickLog href="/app/log?type=meal" label="Comida" icon={Apple} /><QuickLog href="/app/log?type=hydration" label="Agua" icon={Droplets} /><QuickLog href="/app/log?type=focus" label={intelligenceLabel} icon={IntelligenceIcon} /></div></section>
    </div>
  );
}

function AttributeCard({ attribute, pending }: { attribute: AttributeRow; pending: number }) { const projected = projectAttribute(attribute.level, attribute.current_level_xp, attribute.xp_required_for_next_level, pending); const meta = attributeMeta(attribute.attribute); return <div className="rounded-xl border border-line/70 bg-black/10 p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2">{meta.icon}<span className="text-sm font-medium">{meta.label}</span></div><span className="font-display text-xs text-muted">Nv. {projected.level}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#17152d]"><div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${Math.min(100, projected.xp / projected.required * 100)}%` }} /></div><p className="mt-2 text-[10px] text-muted">{projected.xp}/{projected.required} XP {pending > 0 && <span className="text-cyan">· +{pending} pendiente</span>}</p></div>; }
function projectAttribute(level: number, xp: number, required: number, pending: number) { let nextLevel=level,nextXp=xp+pending,nextRequired=required; while(nextXp>=nextRequired){nextXp-=nextRequired;nextLevel+=1;nextRequired=150+25*(nextLevel-1);} return {level:nextLevel,xp:nextXp,required:nextRequired}; }
function attributeMeta(value: string) { const map: Record<string,{label:string;icon:React.ReactNode}>={strength:{label:"Fuerza",icon:<Swords size={15} className="text-[#ff5f9e]"/>},endurance:{label:"Resistencia",icon:<Flame size={15} className="text-[#ff9f43]"/>},vitality:{label:"Vitalidad",icon:<HeartPulse size={15} className="text-cyan"/>},intelligence:{label:"Inteligencia",icon:<Brain size={15} className="text-accent-strong"/>},discipline:{label:"Disciplina",icon:<ShieldCheck size={15} className="text-[#ffe66d]"/>}}; return map[value] ?? {label:value,icon:<Zap size={15}/>}; }
function Goal({ label,value,xp,score }: { label:string;value:string;xp:number;score:number|null|undefined }) { return <div className="rounded-xl border border-line/70 bg-black/10 p-4"><div className="flex justify-between gap-2"><p className="font-display text-[9px] uppercase tracking-[0.15em] text-muted">{label}</p><span className={xp<0?"text-xs font-semibold text-warning":"text-xs font-semibold text-cyan"}>{xp>0?"+":""}{xp} XP</span></div><p className="mt-1 font-medium">{value}</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-[#17152d]"><div className="h-full bg-cyan" style={{width:`${Math.min(100,Number(score??0))}%`}}/></div><p className="mt-1 text-[10px] text-muted">{Number(score??0).toFixed(0)} / 100</p></div>; }
function QuickLog({href,label,icon:Icon}:{href:string;label:string;icon:typeof Activity}) { return <Link href={href} className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-line bg-black/10 text-sm text-muted hover:border-cyan/40 hover:text-cyan"><Icon size={20}/>{label}</Link>; }
function rankColor(rank:string){return({S:"text-[#ffe66d] drop-shadow-[0_0_14px_rgba(255,230,109,.45)]",A:"text-[#c77dff]",B:"text-cyan",C:"text-[#65d890]",D:"text-[#ff9f43]",E:"text-warning"} as Record<string,string>)[rank]??"text-muted";}
function missionIcon(type:string,IntelligenceIcon:typeof Activity){return({exercise:<Dumbbell size={14}/>,sleep:<BedDouble size={14}/>,nutrition:<Apple size={14}/>,hydration:<Droplets size={14}/>,focus:<IntelligenceIcon size={14}/>} as Record<string,React.ReactNode>)[type]??<Target size={14}/>;}
function formatDate(value:string){return new Intl.DateTimeFormat("es-MX",{day:"numeric",month:"short",timeZone:"UTC"}).format(new Date(`${value}T12:00:00Z`));}
