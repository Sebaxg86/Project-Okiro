import { LoaderCircle } from "lucide-react";

export function RouteLoading({ destination = "tu panel" }: { destination?: string }) {
  return (
    <div className="enter-up min-h-full bg-background px-5 py-8 sm:px-8 lg:px-10" role="status" aria-live="polite">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3 text-cyan">
          <LoaderCircle className="animate-spin" size={18} />
          <p className="font-display text-[10px] uppercase tracking-[0.2em]">Abriendo {destination}</p>
        </div>
        <div className="mt-5 h-9 w-48 animate-pulse rounded-lg bg-white/[0.07]" />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <div className="panel h-64 animate-pulse bg-surface-raised/60" />
          <div className="panel h-64 animate-pulse bg-surface-raised/60 [animation-delay:120ms]" />
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="panel h-36 animate-pulse bg-surface-raised/50" style={{ animationDelay: `${180 + item * 80}ms` }} />)}
        </div>
      </div>
    </div>
  );
}
