import Link from "next/link";
import {
  Apple,
  ArrowRight,
  BedDouble,
  Check,
  Code2,
  Droplets,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const pillars = [
  { icon: Dumbbell, label: "Ejercicio", color: "#8b5cff" },
  { icon: BedDouble, label: "Sueño", color: "#6576ff" },
  { icon: Apple, label: "Alimentación", color: "#ff4fa3" },
  { icon: Droplets, label: "Hidratación", color: "#00e5ff" },
  { icon: Code2, label: "Enfoque", color: "#c77dff" },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Okiro, inicio">
      <span className="relative grid size-10 place-items-center border border-accent/60 bg-accent/10 [clip-path:polygon(0_10px,10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)]">
        <span className="size-4 rotate-45 border-2 border-cyan shadow-[0_0_14px_rgba(0,229,255,.45)]" />
      </span>
      <span className="font-display text-lg font-semibold tracking-[0.16em]">OKIRO</span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="app-grid min-h-screen overflow-hidden bg-background">
      <header className="relative z-30 border-b border-line/60 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <Brand />
          <nav className="flex items-center gap-2" aria-label="Acceso">
            <Link href="/login" className="hidden px-4 py-2 font-display text-[11px] font-medium uppercase tracking-[0.12em] text-muted transition hover:text-cyan sm:block">
              Iniciar sesión
            </Link>
            <Link href="/register" className="bg-accent px-4 py-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_0_24px_rgba(139,92,255,.22)] transition hover:bg-accent-strong [clip-path:polygon(0_8px,8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)] sm:px-5">
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1320px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:py-20">
        <div className="pointer-events-none absolute left-[42%] top-20 size-[520px] rounded-full bg-accent/[0.08] blur-[110px]" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 border border-cyan/25 bg-cyan/[0.055] px-3 py-2 font-display text-[9px] font-medium uppercase tracking-[0.22em] text-cyan [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]">
            <span className="size-1.5 rounded-full bg-cyan shadow-[0_0_9px_#00e5ff]" />
            Sistema activo · Protocolo de ascenso
          </div>

          <h1 className="mt-7 max-w-3xl font-display text-5xl font-semibold uppercase leading-[.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl xl:text-[84px]">
            Convierte tu vida en
            <span className="mt-2 block text-transparent [-webkit-text-stroke:1.5px_#8b5cff]">progreso medible.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted sm:text-xl">
            Okiro transforma tus hábitos reales en niveles, atributos, rangos y misiones. Sin castigos destructivos. Sin progreso falso.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="flex h-13 items-center justify-center gap-2 bg-accent px-6 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_0_34px_rgba(139,92,255,.3)] transition hover:bg-accent-strong [clip-path:polygon(0_10px,10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)]">
              Iniciar mi progreso <ArrowRight size={17} />
            </Link>
            <Link href="/login" className="flex h-13 items-center justify-center gap-2 border border-line bg-surface/70 px-6 font-display text-xs font-medium uppercase tracking-[0.12em] text-muted transition hover:border-cyan/50 hover:text-cyan [clip-path:polygon(0_10px,10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)]">
              Ya tengo una cuenta
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
            {["Nivel permanente", "Datos privados", "Progreso equilibrado"].map((item) => (
              <span key={item} className="flex items-center gap-2"><Check size={14} className="text-cyan" />{item}</span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[550px]">
          <div className="system-frame panel p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-line/70 pb-4">
              <div>
                <p className="font-display text-[9px] uppercase tracking-[0.2em] text-cyan">Interfaz de estado</p>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.08em]">Ciclo semanal 31</p>
              </div>
              <span className="border border-accent/30 bg-accent/10 px-2.5 py-1 font-display text-[9px] uppercase tracking-[0.12em] text-accent">En progreso</span>
            </div>

            <div className="grid gap-5 py-6 sm:grid-cols-[150px_1fr] sm:items-center">
              <div className="relative mx-auto grid size-[142px] place-items-center rounded-full bg-[conic-gradient(#00e5ff_72%,#17152d_0)] p-2.5 shadow-[0_0_38px_rgba(0,229,255,.16)]">
                <div className="grid size-full place-items-center rounded-full border border-line bg-[#070712] text-center">
                  <div>
                    <p className="font-display text-[9px] uppercase tracking-[0.18em] text-muted">Nivel</p>
                    <p className="font-display text-4xl font-semibold text-foreground">12</p>
                    <p className="font-display text-[9px] text-cyan">8,460 XP</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-display text-[9px] uppercase tracking-[0.16em] text-muted">Rango semanal</p>
                    <p className="mt-1 font-display text-4xl font-semibold text-cyan">B</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[9px] uppercase tracking-[0.16em] text-muted">Racha</p>
                    <p className="mt-1 font-display text-lg font-semibold text-foreground">08 días</p>
                  </div>
                </div>
                <div className="mt-5 h-px bg-line" />
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted">Objetivo semanal</span>
                  <span className="font-display text-xs text-accent">720 / 1,000 XP</span>
                </div>
                <div className="mt-2 h-1.5 bg-[#17152d]"><div className="h-full w-[72%] bg-gradient-to-r from-accent to-cyan shadow-[0_0_10px_rgba(0,229,255,.4)]" /></div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 border-t border-line/70 pt-5">
              {pillars.map(({ icon: Icon, label, color }) => (
                <div key={label} className="min-w-0 border border-line/70 bg-[#070712] px-1 py-3 text-center">
                  <Icon size={17} className="mx-auto" style={{ color }} aria-hidden="true" />
                  <p className="mt-2 truncate font-display text-[7px] uppercase tracking-[0.08em] text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-5 -left-4 flex items-center gap-3 border border-cyan/25 bg-[#070712]/95 px-4 py-3 shadow-[0_0_28px_rgba(0,229,255,.1)] [clip-path:polygon(0_8px,8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)] sm:-left-9">
            <span className="grid size-8 place-items-center bg-cyan/10 text-cyan"><Zap size={17} /></span>
            <div><p className="font-display text-[8px] uppercase tracking-[0.14em] text-muted">Misión completada</p><p className="mt-1 text-xs font-semibold">+40 XP provisional</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-line/65 bg-surface/55">
        <div className="mx-auto grid max-w-[1320px] gap-px bg-line/60 sm:grid-cols-3">
          {[
            { icon: Target, title: "Constancia sobre perfección", text: "Dos días difíciles no destruyen una buena semana." },
            { icon: ShieldCheck, title: "Tu nivel no retrocede", text: "El progreso consolidado permanece protegido." },
            { icon: Sparkles, title: "Equilibrio real", text: "Una sola actividad nunca domina todo el sistema." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-background px-6 py-9 sm:px-8">
              <Icon size={20} className="text-accent" />
              <h2 className="mt-5 font-display text-sm font-semibold uppercase tracking-[0.03em]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
