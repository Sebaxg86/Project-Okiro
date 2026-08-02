import Link from "next/link";
import { Activity, ArrowRight, CalendarDays, Scale } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: weights }] = await Promise.all([
    supabase.from("profiles").select("unit_system").eq("id", user!.id).single(),
    supabase.from("weight_entries").select("id,measured_on,weight_kg,source").eq("user_id", user!.id).order("measured_on", { ascending: false }).limit(30),
  ]);
  const imperial = profile?.unit_system === "imperial";

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <header><p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Trazabilidad personal</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">Historial</h1><p className="mt-2 text-sm text-muted">Aquí aparecen únicamente registros que existen en tu cuenta.</p></header>

      <section className="system-frame panel mt-8 p-6 sm:p-8">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent"><Activity size={20} /></div><div><h2 className="font-display text-lg font-semibold uppercase">Actividades</h2><p className="text-xs text-muted">Ejercicio, sueño, alimentación, agua y programación</p></div></div>
        <div className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center"><CalendarDays className="mx-auto text-muted" size={28} /><h3 className="mt-4 font-display text-sm font-semibold uppercase">Sin actividades registradas</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">No mostramos ejemplos ficticios. Los formularios de actividades y sus transacciones de XP corresponden a la siguiente etapa del motor de registros.</p></div>
      </section>

      <section className="panel mt-5 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Scale className="text-cyan" size={20} /><div><h2 className="font-display text-lg font-semibold uppercase">Mediciones de peso</h2><p className="text-xs text-muted">Historial privado, sin impacto en XP</p></div></div><Link href="/app/profile#weight" className="flex items-center gap-2 text-sm font-medium text-cyan">Agregar <ArrowRight size={14} /></Link></div>
        {weights?.length ? <div className="mt-6 divide-y divide-line/50">{weights.map((entry) => <div key={entry.id} className="flex items-center justify-between py-4"><div><p className="text-sm font-medium">{formatDate(entry.measured_on)}</p><p className="mt-1 text-xs text-muted">{entry.source === "signup" ? "Registro inicial" : "Registro manual"}</p></div><strong className="text-lg">{imperial ? `${(Number(entry.weight_kg) * 2.2046226218).toFixed(1)} lb` : `${Number(entry.weight_kg).toFixed(1)} kg`}</strong></div>)}</div> : <p className="mt-6 text-sm text-muted">No existen mediciones todavía.</p>}
      </section>
    </div>
  );
}

function formatDate(value: string) { return new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }

