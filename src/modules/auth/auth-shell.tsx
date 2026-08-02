import Link from "next/link";
import { Activity, ShieldCheck, Sparkles, Zap } from "lucide-react";

function OkiroMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="Ir al inicio de Okiro">
      <span className="relative grid size-10 place-items-center border border-accent/60 bg-accent/10 [clip-path:polygon(0_10px,10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)]">
        <span className="size-4 rotate-45 border-2 border-cyan shadow-[0_0_14px_rgba(0,229,255,.45)]" />
      </span>
      <span className="font-display text-lg font-semibold tracking-[0.16em]">OKIRO</span>
    </Link>
  );
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="app-grid relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan/70 to-transparent shadow-[0_0_28px_rgba(0,229,255,.6)]" />
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden border-r border-line/70 p-12 lg:flex lg:flex-col xl:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_36%,rgba(139,92,255,.22),transparent_28rem)]" />
          <div className="relative z-10">
            <OkiroMark />
          </div>

          <div className="relative z-10 my-auto max-w-xl">
            <p className="font-display text-xs font-medium uppercase tracking-[0.28em] text-cyan">
              Sistema de progresión personal
            </p>
            <h2 className="mt-6 font-display text-5xl font-semibold uppercase leading-[1.04] tracking-[-0.055em] xl:text-6xl">
              Cada decisión
              <span className="block text-transparent [-webkit-text-stroke:1px_#8b5cff]">
                cambia tu nivel.
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              Cinco pilares. Un solo progreso. Construye constancia sin convertir un mal día en una derrota permanente.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                { icon: Activity, label: "5 pilares", value: "Equilibrio" },
                { icon: Zap, label: "XP semanal", value: "Progreso" },
                { icon: ShieldCheck, label: "Nivel seguro", value: "Permanente" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="system-frame border border-line/80 bg-surface/80 p-4 [clip-path:polygon(0_9px,9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%)]">
                  <Icon size={17} className="text-cyan" aria-hidden="true" />
                  <p className="mt-5 font-display text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-muted">
            <Sparkles size={14} className="text-accent" />
            La constancia vale más que la perfección.
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[470px]">
            <div className="mb-10 lg:hidden">
              <OkiroMark />
            </div>
            <div className="system-frame panel p-6 sm:p-9">
              <p className="font-display text-[10px] font-medium uppercase tracking-[0.24em] text-cyan">{eyebrow}</p>
              <h1 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[-0.045em] sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
              <div className="mt-8">{children}</div>
              <div className="mt-7 border-t border-line/65 pt-6 text-center text-sm text-muted">{footer}</div>
            </div>
            <p className="mt-6 text-center font-display text-[9px] uppercase tracking-[0.2em] text-muted/70">
              Protocolo seguro · Sesión cifrada · Datos privados
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
