import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Flame, HeartPulse, Scale, ShieldCheck, Swords, Trophy, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Attribute = { attribute: string; level: number; current_level_xp: number; xp_required_for_next_level: number; total_xp: number };
type Summary = { id: string; weekly_cycle_id: string; rank: string; rank_score: number; consolidated_xp: number; created_at: string; previous_level: number; resulting_level: number };

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: progress }, { data: weights }, { data: cycle }, { data: attributes }, { data: streaks }, { data: summaries }] = await Promise.all([
    supabase.from("profiles").select("unit_system").eq("id", user!.id).single(),
    supabase.from("user_progress").select("current_level,total_consolidated_xp,current_level_xp,xp_required_for_next_level").eq("user_id", user!.id).single(),
    supabase.from("weight_entries").select("measured_on,weight_kg").eq("user_id", user!.id).order("measured_on", { ascending: true }).limit(60),
    supabase.from("weekly_cycles").select("id").eq("user_id", user!.id).eq("status", "open").order("week_start", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("attribute_progress").select("attribute,level,current_level_xp,xp_required_for_next_level,total_xp").eq("user_id", user!.id).order("attribute"),
    supabase.from("streaks").select("streak_type,current_count,best_count,last_qualified_date").eq("user_id", user!.id),
    supabase.from("weekly_summaries").select("id,weekly_cycle_id,rank,rank_score,consolidated_xp,created_at,previous_level,resulting_level").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(8),
  ]);
  const { data: transactions } = cycle ? await supabase.from("xp_transactions").select("category,amount,attribute").eq("user_id", user!.id).eq("weekly_cycle_id", cycle.id).eq("status", "provisional") : { data: [] };
  const provisionalXp = (transactions ?? []).reduce((sum, item) => sum + item.amount, 0);
  const permanentPercent = progress ? Math.min(100, progress.current_level_xp / progress.xp_required_for_next_level * 100) : 0;
  const projectedPercent = progress ? Math.min(100, (progress.current_level_xp + Math.max(0, provisionalXp)) / progress.xp_required_for_next_level * 100) : 0;
  const imperial = profile?.unit_system === "imperial";
  const pendingFor = (attribute: string) => (transactions ?? []).filter((item) => item.attribute === attribute && item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
  const dailyStreak = streaks?.find((item) => item.streak_type === "daily");
  const weeklyStreak = streaks?.find((item) => item.streak_type === "weekly");

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <header><p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Ascenso registrado</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">Ascenso</h1><p className="mt-2 text-sm text-muted">Consulta tu nivel, atributos y experiencia pendiente del ciclo actual.</p></header>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Zap} label="Nivel" value={String(progress?.current_level ?? 1)} />
        <Stat icon={ShieldCheck} label="XP asegurada" value={`${progress?.total_consolidated_xp ?? 0} XP`} />
        <Stat icon={BarChart3} label="Progreso permanente" value={`${Math.round(permanentPercent)}%`} />
        <Stat icon={Zap} label="XP pendiente" value={`${provisionalXp > 0 ? "+" : ""}${provisionalXp} XP`} warning={provisionalXp < 0} />
      </section>

      <section className="system-frame panel mt-5 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Ascenso previsto</p><h2 className="mt-2 font-display text-2xl font-semibold uppercase">Nivel {progress?.current_level ?? 1}</h2></div><p className="text-sm text-muted"><span className={provisionalXp < 0 ? "text-warning" : "text-cyan"}>{provisionalXp > 0 ? "+" : ""}{provisionalXp} XP pendiente</span> · siguiente nivel {progress?.xp_required_for_next_level ?? 400} XP</p></div>
        <div className="relative mt-6 h-3 overflow-hidden rounded-full bg-[#17152d]">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${projectedPercent}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${permanentPercent}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted"><span>{progress?.current_level_xp ?? 0} XP asegurada en este nivel</span><span>{Math.round(projectedPercent)}% con XP pendiente</span></div>
      </section>

      <section className="panel mt-5 p-6 sm:p-8">
        <div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Atributos</p><h2 className="mt-2 font-display text-xl font-semibold uppercase">Desarrollo del cazador</h2><p className="mt-2 text-xs text-muted">La franja luminosa representa la XP pendiente del ciclo.</p></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{((attributes ?? []) as Attribute[]).map((attribute) => <AttributeCard key={attribute.attribute} attribute={attribute} pending={pendingFor(attribute.attribute)} />)}</div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
        <article className="panel p-6 sm:p-8">
          <div className="flex items-center gap-3"><Flame className="text-accent" /><div><p className="font-display text-[10px] uppercase tracking-[0.17em] text-muted">Constancia</p><h2 className="font-display text-xl font-semibold uppercase">Rachas activas</h2></div></div>
          <div className="mt-6 space-y-4"><Streak label="Diaria" current={dailyStreak?.current_count ?? 0} best={dailyStreak?.best_count ?? 0} milestones={[3,7,14,30,60,90]} /><Streak label="De ciclos" current={weeklyStreak?.current_count ?? 0} best={weeklyStreak?.best_count ?? 0} milestones={[2,4,8,12,24,52]} /></div>
          <p className="mt-5 text-xs leading-5 text-muted">Los hitos se validan al resolver el ciclo.</p>
        </article>

        <article className="panel p-6 sm:p-8">
          <div className="flex items-center justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.17em] text-muted">Ciclos sellados</p><h2 className="mt-1 font-display text-xl font-semibold uppercase">Historial de ciclos</h2></div><Trophy className="text-cyan" /></div>
          <div className="mt-5 space-y-3">{((summaries ?? []) as Summary[]).map((summary) => <Link key={summary.id} href={`/app/reports/${summary.weekly_cycle_id}`} className="flex items-center gap-4 rounded-xl border border-line/70 bg-black/10 p-4 hover:border-cyan/35"><span className={`font-display text-3xl font-bold ${rankColor(summary.rank)}`}>{summary.rank}</span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{formatSummaryDate(summary.created_at)}</p><p className="mt-1 text-xs text-muted">{summary.consolidated_xp} XP asegurada · nivel {summary.previous_level} → {summary.resulting_level}</p></div><ArrowRight className="shrink-0 text-muted" size={16} /></Link>)}</div>
          {!summaries?.length && <div className="mt-6 rounded-xl border border-dashed border-line p-7 text-center text-sm text-muted">Tu primer resultado aparecerá cuando termine el ciclo actual.</div>}
        </article>
      </section>

      <section className="panel mt-5 p-6 sm:p-8">
        <div className="flex items-center gap-3"><Scale className="text-cyan" size={20} /><div><h2 className="font-display text-lg font-semibold uppercase">Evolución de peso</h2><p className="text-xs text-muted">Seguimiento privado</p></div></div>
        {weights && weights.length >= 2 ? <WeightTrend weights={weights.map((entry) => ({ date: entry.measured_on, value: imperial ? Number(entry.weight_kg) * 2.2046226218 : Number(entry.weight_kg) }))} unit={imperial ? "lb" : "kg"} /> : <div className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center text-sm leading-6 text-muted">Se necesitan al menos dos mediciones para mostrar una tendencia.</div>}
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value, warning = false }: { icon: typeof Zap; label: string; value: string; warning?: boolean }) { return <article className="panel p-6"><Icon className="text-accent" size={20} /><p className="mt-6 font-display text-[9px] uppercase tracking-[0.16em] text-muted">{label}</p><p className={`mt-1 text-3xl font-semibold ${warning ? "text-warning" : ""}`}>{value}</p></article>; }

function AttributeCard({ attribute, pending }: { attribute: Attribute; pending: number }) {
  const projected = projectAttribute(attribute, pending);
  const meta = attributeMeta(attribute.attribute);
  const base = Math.min(100, attribute.current_level_xp / attribute.xp_required_for_next_level * 100);
  const projectedPercent = Math.min(100, projected.xp / projected.required * 100);
  return <article className="rounded-xl border border-line bg-black/10 p-4"><div className="flex items-center justify-between"><span className={meta.color}>{meta.icon}</span><span className="font-display text-xs text-muted">Nv. {projected.level}</span></div><p className="mt-4 text-sm font-medium">{meta.label}</p><div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-[#17152d]"><div className="absolute inset-y-0 left-0 rounded-full bg-cyan/60" style={{ width: `${projectedPercent}%` }} /><div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${base}%` }} /></div><p className="mt-2 text-[10px] text-muted">{projected.xp}/{projected.required} XP{pending > 0 && <span className="text-cyan"> · +{pending}</span>}</p></article>;
}

function Streak({ label, current, best, milestones }: { label: string; current: number; best: number; milestones: number[] }) { const next = milestones.find((value) => value > current); return <div className="rounded-xl border border-line bg-black/10 p-4"><div className="flex items-end justify-between"><div><p className="text-xs text-muted">Racha {label.toLowerCase()}</p><p className="mt-1 text-3xl font-semibold">{current}</p></div><p className="text-right text-xs text-muted">Récord: {best}<br />{next ? `Siguiente hito: ${next}` : "Todos los hitos han sido superados"}</p></div></div>; }

function projectAttribute(attribute: Attribute, pending: number) { let level = attribute.level; let xp = attribute.current_level_xp + pending; let required = attribute.xp_required_for_next_level; while (xp >= required) { xp -= required; level += 1; required = 150 + 25 * (level - 1); } return { level, xp, required }; }
function attributeMeta(value: string) { const map = { strength: { label: "Fuerza", icon: <Swords size={20} />, color: "text-[#ff5f9e]" }, endurance: { label: "Resistencia", icon: <Flame size={20} />, color: "text-[#ff9f43]" }, vitality: { label: "Vitalidad", icon: <HeartPulse size={20} />, color: "text-cyan" }, intelligence: { label: "Inteligencia", icon: <Brain size={20} />, color: "text-accent-strong" }, discipline: { label: "Disciplina", icon: <ShieldCheck size={20} />, color: "text-[#ffe66d]" } } as const; return map[value as keyof typeof map] ?? { label: value, icon: <Zap size={20} />, color: "text-muted" }; }
function rankColor(rank: string) { return ({ S: "text-[#ffe66d]", A: "text-[#c77dff]", B: "text-cyan", C: "text-[#65d890]", D: "text-[#ff9f43]", E: "text-warning" } as Record<string, string>)[rank] ?? "text-muted"; }
function formatSummaryDate(value: string) { return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)); }

function WeightTrend({ weights, unit }: { weights: Array<{ date: string; value: number }>; unit: string }) {
  const min = Math.min(...weights.map((item) => item.value)); const max = Math.max(...weights.map((item) => item.value)); const range = Math.max(max - min, 1);
  return <div className="mt-8"><div className="flex h-44 items-end gap-2" aria-label="Gráfica de mediciones de peso">{weights.map((item) => { const height = 28 + ((item.value - min) / range) * 72; return <div key={item.date} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] text-muted opacity-0 transition group-hover:opacity-100">{item.value.toFixed(1)}</span><div className="w-full max-w-8 rounded-t bg-gradient-to-t from-accent to-cyan" style={{ height: `${height}%` }} /><span className="truncate text-[9px] text-muted">{item.date.slice(5)}</span></div>; })}</div><p className="mt-4 text-right text-xs text-muted">Unidad: {unit}</p></div>;
}
