import { BarChart3, Scale, ShieldCheck, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: progress }, { data: weights }, { data: cycle }] = await Promise.all([
    supabase.from("profiles").select("unit_system").eq("id", user!.id).single(),
    supabase.from("user_progress").select("current_level,total_consolidated_xp,current_level_xp,xp_required_for_next_level").eq("user_id", user!.id).single(),
    supabase.from("weight_entries").select("measured_on,weight_kg").eq("user_id", user!.id).order("measured_on", { ascending: true }).limit(60),
    supabase.from("weekly_cycles").select("id").eq("user_id", user!.id).eq("status", "open").order("week_start", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const { data: transactions } = cycle ? await supabase.from("xp_transactions").select("category,amount,attribute").eq("user_id", user!.id).eq("weekly_cycle_id", cycle.id).eq("status", "provisional") : { data: [] };
  const provisionalXp = (transactions ?? []).reduce((sum, item) => sum + item.amount, 0);
  const percent = progress ? Math.min(100, Math.round(progress.current_level_xp / progress.xp_required_for_next_level * 100)) : 0;
  const imperial = profile?.unit_system === "imperial";

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <header><p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Evolución verificable</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">Progreso</h1><p className="mt-2 text-sm text-muted">Sin comparaciones con otros usuarios y sin datos de demostración.</p></header>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Zap} label="Nivel actual" value={String(progress?.current_level ?? 1)} />
        <Stat icon={ShieldCheck} label="XP consolidada" value={`${progress?.total_consolidated_xp ?? 0} XP`} />
        <Stat icon={BarChart3} label="Avance de nivel" value={`${percent}%`} />
        <Stat icon={Zap} label="XP provisional" value={`${provisionalXp > 0 ? "+" : ""}${provisionalXp} XP`} />
      </section>

      <section className="panel mt-5 p-6 sm:p-8">
        <p className="font-display text-[10px] uppercase tracking-[0.18em] text-cyan">XP provisional por pilar</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">{["exercise","sleep","nutrition","hydration","focus"].map((category) => { const value = (transactions ?? []).filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0); return <div key={category} className="rounded-xl border border-line bg-black/10 p-4"><p className="text-xs capitalize text-muted">{({ exercise: "Ejercicio", sleep: "Sueño", nutrition: "Alimentación", hydration: "Hidratación", focus: "Programación" } as Record<string,string>)[category]}</p><p className={`mt-2 text-lg font-semibold ${value < 0 ? "text-warning" : "text-cyan"}`}>{value > 0 ? "+" : ""}{value}</p></div>; })}</div>
      </section>

      <section className="system-frame panel mt-5 p-6 sm:p-8">
        <div className="flex items-center justify-between text-xs text-muted"><span>{progress?.current_level_xp ?? 0} XP</span><span>{progress?.xp_required_for_next_level ?? 400} XP</span></div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#17152d]"><div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${percent}%` }} /></div>
        <p className="mt-5 flex items-center gap-2 text-sm text-muted"><ShieldCheck size={16} className="text-cyan" />La XP histórica únicamente cambiará cuando el motor procese y consolide semanas reales.</p>
      </section>

      <section className="panel mt-5 p-6 sm:p-8">
        <div className="flex items-center gap-3"><Scale className="text-cyan" size={20} /><div><h2 className="font-display text-lg font-semibold uppercase">Evolución de peso</h2><p className="text-xs text-muted">Referencia privada · no afecta XP ni nivel</p></div></div>
        {weights && weights.length >= 2 ? <WeightTrend weights={weights.map((entry) => ({ date: entry.measured_on, value: imperial ? Number(entry.weight_kg) * 2.2046226218 : Number(entry.weight_kg) }))} unit={imperial ? "lb" : "kg"} /> : <div className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center text-sm leading-6 text-muted">Se necesitan al menos dos mediciones para mostrar una tendencia.</div>}
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) { return <article className="panel p-6"><Icon className="text-accent" size={20} /><p className="mt-6 font-display text-[9px] uppercase tracking-[0.16em] text-muted">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p></article>; }

function WeightTrend({ weights, unit }: { weights: Array<{ date: string; value: number }>; unit: string }) {
  const min = Math.min(...weights.map((item) => item.value));
  const max = Math.max(...weights.map((item) => item.value));
  const range = Math.max(max - min, 1);
  return <div className="mt-8"><div className="flex h-44 items-end gap-2" aria-label="Gráfica de mediciones de peso">{weights.map((item) => { const height = 28 + ((item.value - min) / range) * 72; return <div key={item.date} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] text-muted opacity-0 transition group-hover:opacity-100">{item.value.toFixed(1)}</span><div className="w-full max-w-8 rounded-t bg-gradient-to-t from-accent to-cyan" style={{ height: `${height}%` }} /><span className="truncate text-[9px] text-muted">{item.date.slice(5)}</span></div>; })}</div><p className="mt-4 text-right text-xs text-muted">Unidad: {unit}</p></div>;
}
