import Link from "next/link";
import { ArrowRight, Check, CircleDashed, Flame, ShieldCheck, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type MissionItem = {
  id: string;
  mission_type: string;
  title: string;
  current_value: number;
  target_value: number;
  unit: string;
  status: string;
  is_required: boolean;
};

type DailyMission = {
  id: string;
  mission_date: string;
  status: string;
  completed_required_items: number;
  total_required_items: number;
  bonus_earned: boolean;
  daily_mission_items: MissionItem[];
};

export default async function MissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user!.id).single();
  const { data: cycle } = await supabase
    .from("weekly_cycles")
    .select("id,week_start,week_end,status")
    .eq("user_id", user!.id)
    .eq("status", "open")
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  const [{ data: missions }, { data: live }] = cycle
    ? await Promise.all([
        supabase
          .from("daily_missions")
          .select("id,mission_date,status,completed_required_items,total_required_items,bonus_earned,daily_mission_items(id,mission_type,title,current_value,target_value,unit,status,is_required)")
          .eq("weekly_cycle_id", cycle.id)
          .order("mission_date"),
        supabase
          .from("weekly_live_state")
          .select("completed_missions,provisional_xp,rank")
          .eq("weekly_cycle_id", cycle.id)
          .maybeSingle(),
      ])
    : [{ data: [] }, { data: null }];

  const timezone = profile?.timezone ?? "UTC";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(new Date());
  const week = (missions ?? []) as DailyMission[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Objetivos adaptados a tus metas</p>
          <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">Misiones diarias</h1>
          <p className="mt-2 text-sm text-muted">Se completan automáticamente con tus registros. Hasta cinco bonos de +8 XP por semana.</p>
        </div>
        <Link href="/app/log" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white">
          Registrar actividad <ArrowRight size={16} />
        </Link>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Misiones completas" value={`${live?.completed_missions ?? 0} / 5`} icon={<Flame size={20} />} />
        <Stat label="XP provisional" value={`${(live?.provisional_xp ?? 0) > 0 ? "+" : ""}${live?.provisional_xp ?? 0}`} icon={<Target size={20} />} />
        <Stat label="Rango en curso" value={live?.rank ?? "E"} icon={<ShieldCheck size={20} />} accent />
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-2">
        {week.map((mission) => {
          const isToday = mission.mission_date === today;
          const isFuture = mission.mission_date > today;
          return (
            <article key={mission.id} className={`${isToday ? "system-frame border-cyan/40" : ""} panel p-5 sm:p-6`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`font-display text-[10px] uppercase tracking-[0.17em] ${isToday ? "text-cyan" : "text-muted"}`}>
                    {isToday ? "Jornada activa" : formatDay(mission.mission_date)}
                  </p>
                  <h2 className="mt-2 font-display text-lg font-semibold uppercase">{formatDate(mission.mission_date)}</h2>
                </div>
                <StatusBadge status={mission.status} future={isFuture} />
              </div>

              <div className="mt-5 space-y-3">
                {mission.daily_mission_items.map((item) => {
                  const complete = item.status === "completed";
                  const percent = Math.min(100, Number(item.current_value) / Math.max(1, Number(item.target_value)) * 100);
                  return (
                    <div key={item.id} className="rounded-xl border border-line/70 bg-black/10 p-3">
                      <div className="flex items-center gap-3">
                        <span className={`grid size-8 shrink-0 place-items-center rounded-lg border ${complete ? "border-cyan/40 bg-cyan/[0.08] text-cyan" : "border-line text-muted"}`}>
                          {complete ? <Check size={15} /> : <CircleDashed size={15} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium">{item.title}</p>
                            <span className="shrink-0 text-[10px] text-muted">{formatValue(item.current_value)} / {formatValue(item.target_value)} {item.unit}</span>
                          </div>
                          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#17152d]">
                            <div className={`h-full rounded-full ${complete ? "bg-cyan" : "bg-accent"}`} style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4 text-xs">
                <span className="text-muted">{mission.completed_required_items} de {mission.total_required_items} requisitos</span>
                <span className={mission.bonus_earned ? "font-semibold text-cyan" : "text-muted"}>{mission.bonus_earned ? "+8 XP obtenida" : "Bono +8 XP"}</span>
              </div>
            </article>
          );
        })}
      </section>

      {!week.length && <div className="panel mt-5 p-10 text-center text-sm text-muted">El ciclo semanal se está preparando. Vuelve al inicio para actualizarlo con tu próximo registro.</div>}
    </div>
  );
}

function Stat({ label, value, icon, accent = false }: { label: string; value: string; icon: React.ReactNode; accent?: boolean }) {
  return <article className="panel p-5"><div className="flex items-center justify-between"><div><p className="font-display text-[9px] uppercase tracking-[0.16em] text-muted">{label}</p><p className={`mt-2 text-3xl font-semibold ${accent ? "text-cyan" : ""}`}>{value}</p></div><span className="text-accent">{icon}</span></div></article>;
}

function StatusBadge({ status, future }: { status: string; future: boolean }) {
  const complete = status === "completed";
  const label = future ? "Próxima" : complete ? "Completa" : status === "in_progress" ? "En marcha" : "Pendiente";
  return <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.12em] ${complete ? "border-cyan/30 bg-cyan/[0.06] text-cyan" : "border-line text-muted"}`}>{label}</span>;
}

function formatDay(value: string) { return new Intl.DateTimeFormat("es-MX", { weekday: "long", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }
function formatDate(value: string) { return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)); }
function formatValue(value: number) { return Number(value).toLocaleString("es-MX", { maximumFractionDigits: 1 }); }
