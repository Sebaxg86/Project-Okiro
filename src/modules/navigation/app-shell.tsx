"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Home,
  LogOut,
  LoaderCircle,
  Plus,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
} from "lucide-react";
import { signOutAction } from "@/modules/auth/actions";
import { RouteLoading } from "@/modules/navigation/route-loading";

const navItems = [
  { href: "/app", label: "Estado", icon: Home },
  { href: "/app/history", label: "Registro", icon: CalendarDays },
  { href: "/app/progress", label: "Ascenso", icon: BarChart3 },
  { href: "/app/profile", label: "Identidad", icon: UserRound },
];

function BrandMark({ onNavigate }: { onNavigate?: (href: string) => void }) {
  return (
    <Link href="/app" onClick={() => onNavigate?.("/app")} className="flex items-center gap-3 transition active:scale-95" aria-label="Ir al estado de Okiro">
      <span className="relative grid size-9 place-items-center rounded-[11px] border border-accent/35 bg-accent/10">
        <span className="size-3.5 rotate-45 rounded-[4px] border-2 border-accent" />
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-cyan shadow-[0_0_12px_#00e5ff]" />
      </span>
      <span className="font-display text-lg font-semibold tracking-[0.12em]">OKIRO</span>
    </Link>
  );
}

function NavLink({ href, label, icon: Icon, onNavigate, pending }: (typeof navItems)[number] & { onNavigate: (href: string) => void; pending: boolean }) {
  const pathname = usePathname();
  const active = href === "/app" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={() => onNavigate(href)}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition duration-150 active:scale-[.96] ${
        active
          ? "bg-accent/10 font-medium text-accent"
          : "text-muted hover:bg-white/[0.04] hover:text-foreground"
      }`}
    >
      {pending ? <LoaderCircle size={18} className="animate-spin text-cyan" aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({
  displayName,
  children,
}: {
  displayName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navigation, setNavigation] = useState<{ href: string; from: string } | null>(null);
  const pendingHref = navigation?.from === pathname ? navigation.href : null;
  const beginNavigation = (href: string) => {
    if (href.split("?")[0] !== pathname) setNavigation({ href, from: pathname });
  };

  useEffect(() => {
    if (!navigation) return;
    const timeout = window.setTimeout(() => setNavigation(null), 12_000);
    return () => window.clearTimeout(timeout);
  }, [navigation]);

  return (
    <div className="app-grid min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] border-r border-line/70 bg-[#05050e]/95 px-5 py-6 lg:flex lg:flex-col">
        <BrandMark onNavigate={beginNavigation} />
        <p className="mt-2 pl-12 font-display text-[9px] uppercase tracking-[0.22em] text-muted">
          Sistema Okiro
        </p>

        <nav className="mt-12 space-y-1" aria-label="Navegación principal">
          <NavLink {...navItems[0]} onNavigate={beginNavigation} pending={pendingHref === navItems[0].href} />
          <Link href="/app/log" onClick={() => beginNavigation("/app/log")} className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted transition duration-150 hover:bg-white/[0.04] hover:text-foreground active:scale-[.96]">{pendingHref === "/app/log" ? <LoaderCircle size={18} className="animate-spin text-cyan" /> : <Plus size={18} />}Registrar</Link>
          <Link href="/app/missions" onClick={() => beginNavigation("/app/missions")} className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted transition duration-150 hover:bg-white/[0.04] hover:text-foreground active:scale-[.96]">{pendingHref === "/app/missions" ? <LoaderCircle size={18} className="animate-spin text-cyan" /> : <Target size={18} />}Misiones</Link>
          {navItems.slice(1).map((item) => <NavLink key={item.href} {...item} onNavigate={beginNavigation} pending={pendingHref === item.href} />)}
        </nav>

        <div className="mt-auto rounded-2xl border border-line/80 bg-surface p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <ShieldCheck size={16} className="text-cyan" aria-hidden="true" />
            Datos protegidos
          </div>
          <p className="mt-2 truncate text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted">Solo tú puedes consultar estos datos.</p>
        </div>

        <Link href="/app/profile" className="mt-3 flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-white/[0.04] hover:text-foreground">
          <Settings size={18} aria-hidden="true" />
          Ajustes
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-warning/[0.06] hover:text-warning">
            <LogOut size={18} aria-hidden="true" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      <header className="sticky top-0 z-20 flex h-[calc(4rem+env(safe-area-inset-top))] items-center justify-start border-b border-line/70 bg-[#05050e]/90 px-5 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
        <BrandMark onNavigate={beginNavigation} />
      </header>

      <main className="relative min-h-screen pb-28 lg:ml-[244px] lg:pb-8">
        {pendingHref && <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] top-[calc(4rem+env(safe-area-inset-top))] z-10 overflow-hidden bg-background lg:bottom-0 lg:left-[244px] lg:top-0"><RouteLoading destination={destinationLabel(pendingHref)} /></div>}
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line/80 bg-[#05050e]/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden" aria-label="Navegación móvil">
        {navItems.slice(0, 2).map((item) => <MobileNavLink key={item.href} {...item} onNavigate={beginNavigation} pending={pendingHref === item.href} />)}
        <Link href="/app/log" onClick={() => beginNavigation("/app/log")} className="mx-auto grid size-14 -translate-y-5 place-items-center rounded-[1.15rem] bg-accent text-white shadow-[0_0_28px_rgba(139,92,255,.42)] ring-4 ring-[#05050e] transition duration-150 active:scale-90" aria-label="Registrar acción">
          {pendingHref === "/app/log" ? <LoaderCircle size={24} className="animate-spin" /> : <Plus size={25} />}
        </Link>
        {navItems.slice(2).map((item) => <MobileNavLink key={item.href} {...item} onNavigate={beginNavigation} pending={pendingHref === item.href} />)}
      </nav>
    </div>
  );
}

function MobileNavLink({ href, label, icon: Icon, onNavigate, pending }: (typeof navItems)[number] & { onNavigate: (href: string) => void; pending: boolean }) {
  const pathname = usePathname();
  const active = href === "/app" ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} onClick={() => onNavigate(href)} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-col items-center gap-1 py-1 text-[10px] transition duration-150 active:scale-90 ${active || pending ? "text-cyan" : "text-muted"}`}>
      {pending ? <LoaderCircle size={18} className="animate-spin" /> : <Icon size={18} />}
      <span className="truncate">{label}</span>
    </Link>
  );
}

function destinationLabel(href: string) {
  return ({ "/app": "Estado", "/app/history": "Registro", "/app/progress": "Ascenso", "/app/profile": "Identidad", "/app/log": "Registro", "/app/missions": "Misiones" } as Record<string, string>)[href] ?? "la sección";
}
