"use client";

import type { CSSProperties, ElementType } from "react";
import { useMemo, useState } from "react";
import {
  Apple,
  BarChart3,
  BedDouble,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Droplets,
  Dumbbell,
  Flame,
  Home,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { signOutAction } from "@/modules/auth/actions";

type PillarKey = "exercise" | "sleep" | "nutrition" | "hydration" | "focus";

type Mission = {
  id: PillarKey;
  title: string;
  detail: string;
  reward: number;
  completed: boolean;
};

type ActivityItem = {
  id: number;
  pillar: PillarKey;
  label: string;
  detail: string;
  xp: number;
};

const pillarMeta: Record<
  PillarKey,
  { label: string; icon: ElementType; color: string; soft: string }
> = {
  exercise: {
    label: "Ejercicio",
    icon: Dumbbell,
    color: "#8b5cff",
    soft: "rgba(139,92,255,.14)",
  },
  sleep: {
    label: "Sueño",
    icon: BedDouble,
    color: "#6576ff",
    soft: "rgba(101,118,255,.14)",
  },
  nutrition: {
    label: "Alimentación",
    icon: Apple,
    color: "#ff4fa3",
    soft: "rgba(255,79,163,.13)",
  },
  hydration: {
    label: "Hidratación",
    icon: Droplets,
    color: "#00e5ff",
    soft: "rgba(0,229,255,.12)",
  },
  focus: {
    label: "Enfoque",
    icon: Code2,
    color: "#c77dff",
    soft: "rgba(199,125,255,.13)",
  },
};

const initialMissions: Mission[] = [
  {
    id: "exercise",
    title: "Entrenamiento de fuerza",
    detail: "Sesión programada · 45 min",
    reward: 70,
    completed: true,
  },
  {
    id: "hydration",
    title: "Meta de hidratación",
    detail: "1.8 de 2.5 L",
    reward: 15,
    completed: false,
  },
  {
    id: "nutrition",
    title: "Registrar comidas",
    detail: "2 de 3 principales",
    reward: 30,
    completed: false,
  },
  {
    id: "sleep",
    title: "Sueño reparador",
    detail: "7 h 24 min · objetivo cumplido",
    reward: 35,
    completed: true,
  },
  {
    id: "focus",
    title: "Sesión de programación",
    detail: "60 min de enfoque profundo",
    reward: 40,
    completed: true,
  },
];

const pillarProgress = [
  { key: "exercise" as const, value: "4 / 5", helper: "días", progress: 80, xp: 250 },
  { key: "sleep" as const, value: "7 h 24", helper: "promedio", progress: 87, xp: 188 },
  { key: "nutrition" as const, value: "12 / 15", helper: "comidas", progress: 80, xp: 154 },
  { key: "hydration" as const, value: "1.8 L", helper: "hoy", progress: 72, xp: 76 },
  { key: "focus" as const, value: "2 / 3", helper: "sesiones", progress: 67, xp: 80 },
];

const initialActivity: ActivityItem[] = [
  {
    id: 1,
    pillar: "focus",
    label: "Sesión de programación",
    detail: "Hoy · 09:42 · 60 min",
    xp: 40,
  },
  {
    id: 2,
    pillar: "nutrition",
    label: "Desayuno equilibrado",
    detail: "Hoy · 08:18",
    xp: 15,
  },
  {
    id: 3,
    pillar: "sleep",
    label: "Sueño registrado",
    detail: "Hoy · 07:31 · 7 h 24 min",
    xp: 35,
  },
];

const quickLogDetails: Record<PillarKey, { detail: string; xp: number }> = {
  exercise: { detail: "Entrenamiento · 45 min", xp: 70 },
  sleep: { detail: "Sueño principal · 7 h 30 min", xp: 35 },
  nutrition: { detail: "Comida equilibrada", xp: 15 },
  hydration: { detail: "Agua · 350 ml", xp: 5 },
  focus: { detail: "Programación · 30 min", xp: 20 },
};

const navItems = [
  { label: "Inicio", icon: Home, active: true },
  { label: "Historial", icon: CalendarDays },
  { label: "Progreso", icon: BarChart3 },
  { label: "Perfil", icon: UserRound },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3" aria-label="Okiro">
      <div className="relative grid size-9 place-items-center rounded-[11px] border border-accent/35 bg-accent/10">
        <div className="size-3.5 rotate-45 rounded-[4px] border-2 border-accent" />
        <div className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-cyan shadow-[0_0_12px_#00e5ff]" />
      </div>
      <span className="text-lg font-semibold tracking-[-0.04em]">OKIRO</span>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] border-r border-line/70 bg-[#05050e]/95 px-5 py-6 lg:flex lg:flex-col">
      <BrandMark />
      <p className="mt-2 pl-12 text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
        Sistema personal
      </p>

      <nav className="mt-12 space-y-1" aria-label="Navegación principal">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition ${
              active
                ? "bg-accent/10 font-medium text-accent"
                : "text-muted hover:bg-white/[0.04] hover:text-foreground"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-line/80 bg-surface p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <ShieldCheck size={16} className="text-cyan" aria-hidden="true" />
          Semana protegida
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">
          Tu progreso consolidado nunca disminuye.
        </p>
      </div>

      <button
        type="button"
        className="mt-3 flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-white/[0.04] hover:text-foreground"
      >
        <Settings size={18} aria-hidden="true" />
        Configuración
      </button>
      <form action={signOutAction}>
        <button
          type="submit"
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-warning/[0.06] hover:text-warning"
        >
          <LogOut size={18} aria-hidden="true" />
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}

function MissionCard({
  mission,
  onToggle,
}: {
  mission: Mission;
  onToggle: (id: PillarKey) => void;
}) {
  const meta = pillarMeta[mission.id];
  const Icon = meta.icon;

  return (
    <article
      className={`group relative flex min-w-[284px] items-center gap-3 rounded-2xl border p-3.5 transition sm:min-w-0 ${
        mission.completed
          ? "border-line/55 bg-white/[0.025]"
          : "border-line bg-surface hover:border-white/20"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(mission.id)}
        className={`grid size-10 shrink-0 place-items-center rounded-xl border transition ${
          mission.completed
            ? "border-accent/25 bg-accent/10 text-accent"
            : "border-line bg-surface-raised text-muted hover:border-accent/40 hover:text-accent"
        }`}
        aria-label={mission.completed ? `Reabrir ${mission.title}` : `Completar ${mission.title}`}
        aria-pressed={mission.completed}
      >
        {mission.completed ? <Check size={18} /> : <Icon size={18} />}
      </button>
      <div className="min-w-0 flex-1">
        <h3
          className={`truncate text-sm font-medium ${
            mission.completed ? "text-muted line-through decoration-line" : "text-foreground"
          }`}
        >
          {mission.title}
        </h3>
        <p className="mt-1 truncate text-xs text-muted">{mission.detail}</p>
      </div>
      <span className="rounded-lg bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-accent">
        +{mission.reward} XP
      </span>
    </article>
  );
}

function BottomNavigation({ onAdd }: { onAdd: () => void }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-[#05050e]/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
      aria-label="Navegación móvil"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 items-end">
        {navItems.slice(0, 2).map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] ${
              active ? "text-accent" : "text-muted"
            }`}
          >
            <Icon size={19} aria-hidden="true" />
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="mx-auto grid size-14 -translate-y-3 place-items-center rounded-2xl bg-accent text-white shadow-[0_10px_30px_rgba(139,92,255,.34)] transition hover:bg-accent-strong"
          aria-label="Registrar actividad"
        >
          <Plus size={25} strokeWidth={2.4} />
        </button>
        {navItems.slice(2).map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] text-muted"
          >
            <Icon size={19} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function DashboardShell({
  displayName = "Sebastián",
  email,
}: {
  displayName?: string;
  email?: string;
}) {
  const [missions, setMissions] = useState(initialMissions);
  const [activity, setActivity] = useState(initialActivity);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const completedMissions = useMemo(
    () => missions.filter((mission) => mission.completed).length,
    [missions],
  );

  const missionProgress = Math.round((completedMissions / missions.length) * 100);
  const firstName = displayName.trim().split(/\s+/)[0] || "Cazador";
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "OK";

  function toggleMission(id: PillarKey) {
    setMissions((current) =>
      current.map((mission) =>
        mission.id === id ? { ...mission, completed: !mission.completed } : mission,
      ),
    );
  }

  function registerActivity(pillar: PillarKey) {
    const meta = pillarMeta[pillar];
    const log = quickLogDetails[pillar];
    setActivity((current) => [
      {
        id: Date.now(),
        pillar,
        label: meta.label,
        detail: `Ahora · ${log.detail}`,
        xp: log.xp,
      },
      ...current,
    ]);
    setQuickLogOpen(false);
    setNotice(`Registro guardado: ${meta.label} · +${log.xp} XP provisional`);
  }

  return (
    <div className="app-grid min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="lg:pl-[244px]">
        <header className="sticky top-0 z-20 border-b border-line/55 bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-9">
            <div className="lg:hidden">
              <BrandMark />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">Panel de progreso</p>
              <p className="mt-0.5 text-xs text-muted">Domingo, 2 de agosto</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative grid size-10 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:text-foreground"
                aria-label="Notificaciones"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
              </button>
              <div className="hidden items-center gap-3 rounded-xl border border-line bg-surface py-1.5 pl-2 pr-3 sm:flex">
                <div className="grid size-7 place-items-center rounded-lg bg-cyan/10 text-xs font-semibold text-cyan">
                  {initials}
                </div>
                <div>
                  <p className="max-w-28 truncate text-xs font-medium">{displayName}</p>
                  <p className="max-w-28 truncate text-[10px] text-muted">{email ?? "Nivel 12"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 pb-28 pt-6 sm:px-7 lg:px-9 lg:pb-12 lg:pt-8">
          <section className="enter-up flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                <span className="size-1.5 rounded-full bg-cyan shadow-[0_0_12px_#00e5ff]" />
                Ciclo activo · Semana 31
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
                Buen ritmo, {firstName}.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                Hoy no necesitas hacerlo perfecto. Completa lo importante y conserva el equilibrio.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setQuickLogOpen(true)}
              className="hidden h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,255,.25)] transition hover:bg-accent-strong lg:flex"
            >
              <Plus size={18} />
              Registrar
            </button>
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <article className="panel system-frame enter-up relative overflow-hidden rounded-[24px] p-5 sm:p-6" style={{ animationDelay: "60ms" }}>
              <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-accent/[0.055] blur-3xl" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div
                    className="progress-ring grid size-[108px] shrink-0 place-items-center rounded-full p-2.5 sm:size-[124px]"
                    style={{ "--progress": "72%" } as CSSProperties}
                    role="img"
                    aria-label="720 de 1000 XP semanales"
                  >
                    <div className="grid size-full place-items-center rounded-full bg-surface shadow-[inset_0_0_20px_rgba(0,0,0,.35)]">
                      <div className="text-center">
                        <span className="block font-mono text-2xl font-semibold tracking-[-0.05em]">72%</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted">Semana</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Nivel 12</span>
                      <span className="rounded-md bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] text-accent">+720 XP</span>
                    </div>
                    <p className="mt-2 font-mono text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
                      8,460 <span className="text-sm font-normal text-muted">XP total</span>
                    </p>
                    <div className="mt-4 h-1.5 w-full max-w-[270px] overflow-hidden rounded-full bg-[#17152d]">
                      <div className="h-full w-[68%] rounded-full bg-cyan" />
                    </div>
                    <p className="mt-2 text-xs text-muted">340 XP para alcanzar el nivel 13</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-line/70 pt-5 sm:w-[220px] sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Rango actual</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="grid size-9 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 font-mono text-xl font-bold text-cyan">B</span>
                      <div>
                        <p className="text-xs font-medium">Equilibrado</p>
                        <p className="text-[10px] text-muted">76.4 puntos</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Racha</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="grid size-9 place-items-center rounded-xl bg-warning/10 text-warning"><Flame size={19} /></span>
                      <div>
                        <p className="text-xs font-medium">8 días</p>
                        <p className="text-[10px] text-muted">Mejor: 14</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="panel system-frame enter-up rounded-[24px] p-5 sm:p-6" style={{ animationDelay: "100ms" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Pulso semanal</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.035em]">Tu equilibrio</h2>
                </div>
                <span className="flex items-center gap-1.5 rounded-lg bg-cyan/10 px-2 py-1 text-[10px] font-medium text-cyan">
                  <Sparkles size={12} /> Estable
                </span>
              </div>
              <div className="mt-5 flex h-[112px] items-end justify-between gap-2" aria-label="Puntuación por día de la semana">
                {[
                  ["L", 62], ["M", 78], ["X", 74], ["J", 91], ["V", 68], ["S", 84], ["D", 44],
                ].map(([day, score], index) => (
                  <div key={String(day)} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-20 w-full max-w-7 items-end overflow-hidden rounded-md bg-white/[0.035]">
                      <div
                        className={`w-full rounded-md ${index === 6 ? "bg-accent" : "bg-cyan/55"}`}
                        style={{ height: `${score}%` }}
                      />
                    </div>
                    <span className={`font-mono text-[9px] ${index === 6 ? "text-accent" : "text-muted"}`}>{day}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.035em]">Misiones de hoy</h2>
                <p className="mt-1 text-xs text-muted">{completedMissions} de {missions.length} completadas</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden font-mono text-xs text-accent sm:inline">{missionProgress}%</span>
                <button type="button" className="flex items-center gap-1 text-xs font-medium text-muted transition hover:text-foreground">
                  Ver todas <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="mb-4 h-1 overflow-hidden rounded-full bg-[#17152d]">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${missionProgress}%` }} />
            </div>
            <div className="scrollbar-hidden -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 xl:grid-cols-5">
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} onToggle={toggleMission} />
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-[-0.035em]">Pilares de progreso</h2>
                  <p className="mt-1 text-xs text-muted">Esta semana · objetivo personal</p>
                </div>
                <button type="button" className="text-xs font-medium text-muted transition hover:text-foreground">Detalles</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {pillarProgress.map((pillar) => {
                  const meta = pillarMeta[pillar.key];
                  const Icon = meta.icon;
                  return (
                    <article key={pillar.key} className="panel group rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="grid size-9 place-items-center rounded-xl" style={{ background: meta.soft, color: meta.color }}>
                          <Icon size={18} />
                        </span>
                        <span className="font-mono text-[10px]" style={{ color: meta.color }}>+{pillar.xp} XP</span>
                      </div>
                      <p className="mt-5 text-xs text-muted">{meta.label}</p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <p className="font-mono text-xl font-semibold tracking-[-0.04em]">{pillar.value}</p>
                        <span className="text-[10px] text-muted">{pillar.helper}</span>
                      </div>
                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#17152d]">
                        <div className="h-full rounded-full" style={{ width: `${pillar.progress}%`, background: meta.color }} />
                      </div>
                      <button
                        type="button"
                        onClick={() => registerActivity(pillar.key)}
                        className="mt-4 flex w-full items-center justify-between text-[11px] font-medium text-muted transition group-hover:text-foreground"
                      >
                        Registro rápido <Plus size={13} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-[-0.035em]">Actividad reciente</h2>
                  <p className="mt-1 text-xs text-muted">Tus últimos registros</p>
                </div>
                <Clock3 size={16} className="text-muted" />
              </div>
              <div className="panel overflow-hidden rounded-2xl">
                {activity.slice(0, 4).map((item, index) => {
                  const meta = pillarMeta[item.pillar];
                  const Icon = meta.icon;
                  return (
                    <div key={item.id} className={`flex items-center gap-3 p-4 ${index ? "border-t border-line/60" : ""}`}>
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: meta.soft, color: meta.color }}>
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{item.label}</p>
                        <p className="mt-1 truncate text-[10px] text-muted">{item.detail}</p>
                      </div>
                      <span className="font-mono text-[10px] text-accent">+{item.xp}</span>
                    </div>
                  );
                })}
                <button type="button" className="flex h-11 w-full items-center justify-center gap-1 border-t border-line/60 text-xs text-muted transition hover:bg-white/[0.025] hover:text-foreground">
                  Ver historial <ChevronRight size={14} />
                </button>
              </div>
            </aside>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-accent/15 bg-accent/[0.045] p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-accent"><Target size={15} /> Próximo hito</div>
              <p className="mt-2 text-sm font-medium">10 días de constancia</p>
              <p className="mt-1 text-xs text-muted">Faltan 2 días para desbloquearlo.</p>
            </div>
            <div className="rounded-2xl border border-cyan/15 bg-cyan/[0.04] p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-cyan"><Trophy size={15} /> Mejor atributo</div>
              <p className="mt-2 text-sm font-medium">Disciplina · Nivel 18</p>
              <p className="mt-1 text-xs text-muted">Tu constancia lidera esta semana.</p>
            </div>
            <div className="rounded-2xl border border-warning/15 bg-warning/[0.04] p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-warning"><Zap size={15} /> Área de atención</div>
              <p className="mt-2 text-sm font-medium">Hidratación</p>
              <p className="mt-1 text-xs text-muted">700 ml para completar tu objetivo.</p>
            </div>
          </section>
        </main>
      </div>

      <BottomNavigation onAdd={() => setQuickLogOpen(true)} />

      {quickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="quick-log-title">
          <button type="button" className="absolute inset-0 cursor-default" onClick={() => setQuickLogOpen(false)} aria-label="Cerrar registro rápido" />
          <div className="enter-up system-frame relative w-full rounded-t-[28px] border border-line bg-[#080816] p-5 pb-[max(24px,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-[28px] sm:p-6">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line sm:hidden" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">Acción rápida</p>
                <h2 id="quick-log-title" className="mt-2 text-xl font-semibold tracking-[-0.04em]">¿Qué quieres registrar?</h2>
                <p className="mt-1 text-xs text-muted">Podrás completar los detalles después.</p>
              </div>
              <button type="button" onClick={() => setQuickLogOpen(false)} className="grid size-9 place-items-center rounded-xl border border-line text-muted hover:text-foreground" aria-label="Cerrar">
                <X size={17} />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {(Object.keys(pillarMeta) as PillarKey[]).map((key) => {
                const meta = pillarMeta[key];
                const Icon = meta.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => registerActivity(key)}
                    className="flex min-h-24 flex-col items-start justify-between rounded-2xl border border-line bg-surface-raised p-4 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <Icon size={20} style={{ color: meta.color }} />
                    <span className="text-sm font-medium">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed bottom-24 left-1/2 z-[60] flex w-[calc(100%-32px)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-accent/25 bg-[#17102a] px-4 py-3 text-sm shadow-2xl lg:bottom-6" role="status" aria-live="polite">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-white"><Check size={15} strokeWidth={3} /></span>
          <span className="min-w-0 flex-1">{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className="text-muted hover:text-foreground" aria-label="Cerrar aviso"><X size={15} /></button>
        </div>
      )}
    </div>
  );
}
