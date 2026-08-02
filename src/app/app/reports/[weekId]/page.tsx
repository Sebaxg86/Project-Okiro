import Link from "next/link";
import { ArrowLeft, BarChart3, ShieldCheck, Trophy, Zap } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WeeklyReportPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: cycle }, { data: summary }, { data: transactions }] = await Promise.all([
    supabase.from("weekly_cycles").select("id,week_start,week_end,status,closed_at").eq("id", weekId).eq("user_id", user!.id).maybeSingle(),
    supabase.from("weekly_summaries").select("*").eq("weekly_cycle_id", weekId).eq("user_id", user!.id).maybeSingle(),
    supabase.from("xp_transactions").select("id,category,source_type,amount,rule_code,occurred_at,status").eq("weekly_cycle_id", weekId).eq("user_id", user!.id).in("status", ["consolidated", "adjustment"]).order("occurred_at"),
  ]);
  if (!cycle || !summary) notFound();

  const scores = [
    ["Ejercicio", summary.exercise_score],
    ["Sueño", summary.sleep_score],
    ["Alimentación", summary.nutrition_score],
    ["Hidratación", summary.hydration_score],
    ["Programación", summary.programming_score],
  ] as Array<[string, number]>;
  const categoryTotals = ["exercise", "sleep", "nutrition", "hydration", "focus", "mission", "streak"].map((category) => ({ category, value: (transactions ?? []).filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0) }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
      <Link href="/app/progress" className="inline-flex items-center gap-2 text-sm text-muted hover:text-cyan"><ArrowLeft size={16} /> Volver a Progreso</Link>
      <header className="system-frame panel mt-6 overflow-hidden p-7 sm:p-10">
        <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Informe consolidado</p>
            <h1 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">{formatDate(cycle.week_start)} — {formatDate(cycle.week_end)}</h1>
            <p className="mt-3 text-sm text-muted">Cierre verificado · versión {summary.calculation_version}</p>
            <div className="mt-7 flex flex-wrap gap-3"><Pill icon={<Zap size={14} />} text={`${summary.consolidated_xp} XP consolidada`} /><Pill icon={<BarChart3 size={14} />} text={`${Number(summary.rank_score).toFixed(1)} puntos`} /><Pill icon={<ShieldCheck size={14} />} text={`${Number(summary.data_coverage).toFixed(0)}% cobertura`} /></div>
          </div>
          <div className="text-center"><Trophy className={`mx-auto ${rankColor(summary.rank)}`} /><p className={`mt-2 font-display text-8xl font-bold ${rankColor(summary.rank)}`}>{summary.rank}</p><p className="font-display text-[9px] uppercase tracking-[0.16em] text-muted">Rango final</p></div>
        </div>
      </header>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="XP positiva" value={`+${summary.positive_xp}`} />
        <Metric label="Bonificaciones" value={`+${summary.bonus_xp}`} />
        <Metric label="Penalización aplicada" value={`-${summary.applied_penalty_xp}`} warning />
        <Metric label="Nivel" value={`${summary.previous_level} → ${summary.resulting_level}`} />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="panel p-6 sm:p-8"><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Rendimiento por pilar</p><div className="mt-6 space-y-4">{scores.map(([label, score]) => <div key={label}><div className="flex justify-between text-sm"><span>{label}</span><span className="text-muted">{Number(score).toFixed(0)} / 100</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#17152d]"><div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${Math.min(100, Number(score))}%` }} /></div></div>)}</div></article>
        <article className="panel p-6 sm:p-8"><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Balance de XP</p><div className="mt-5 grid grid-cols-2 gap-3">{categoryTotals.map((item) => <div key={item.category} className="rounded-xl border border-line bg-black/10 p-4"><p className="text-xs text-muted">{categoryLabel(item.category)}</p><p className={`mt-2 text-xl font-semibold ${item.value < 0 ? "text-warning" : "text-cyan"}`}>{item.value > 0 ? "+" : ""}{item.value}</p></div>)}</div></article>
      </section>

      <section className="panel mt-5 p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">Auditoría</p><h2 className="mt-1 font-display text-xl font-semibold uppercase">Movimientos consolidados</h2></div><ShieldCheck className="text-cyan" /></div><div className="mt-5 divide-y divide-line/60">{(transactions ?? []).map((item) => <div key={item.id} className="flex items-center gap-4 py-3 text-sm"><div className="min-w-0 flex-1"><p>{categoryLabel(item.category)} · {ruleLabel(item.rule_code)}</p><p className="mt-1 text-xs text-muted">{new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.occurred_at))}</p></div><span className={`font-semibold ${item.amount < 0 ? "text-warning" : "text-cyan"}`}>{item.amount > 0 ? "+" : ""}{item.amount} XP</span></div>)}</div>{!transactions?.length && <p className="mt-5 text-sm text-muted">No hay movimientos visibles para este cierre.</p>}</section>
    </div>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) { return <span className="inline-flex items-center gap-2 rounded-full border border-line bg-black/10 px-3 py-2 text-xs text-muted">{icon}{text}</span>; }
function Metric({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) { return <article className="panel p-5"><p className="font-display text-[9px] uppercase tracking-[0.16em] text-muted">{label}</p><p className={`mt-3 text-2xl font-semibold ${warning ? "text-warning" : ""}`}>{value}</p></article>; }
function rankColor(rank: string) { return ({ S: "text-[#ffe66d] drop-shadow-[0_0_14px_rgba(255,230,109,.45)]", A: "text-[#c77dff]", B: "text-cyan", C: "text-[#65d890]", D: "text-[#ff9f43]", E: "text-warning" } as Record<string, string>)[rank] ?? "text-muted"; }
function categoryLabel(category: string) { return ({ exercise: "Ejercicio", sleep: "Sueño", nutrition: "Alimentación", hydration: "Hidratación", focus: "Programación", mission: "Misiones", streak: "Rachas" } as Record<string, string>)[category] ?? category; }
function ruleLabel(rule: string) { return rule.replaceAll("_", " "); }
function formatDate(value: string) { return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }
