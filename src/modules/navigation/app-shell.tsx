"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  Home,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { signOutAction } from "@/modules/auth/actions";

const navItems = [
  { href: "/app", label: "Inicio", icon: Home },
  { href: "/app/history", label: "Historial", icon: CalendarDays },
  { href: "/app/progress", label: "Progreso", icon: BarChart3 },
  { href: "/app/profile", label: "Perfil", icon: UserRound },
];

function BrandMark() {
  return (
    <Link href="/app" className="flex items-center gap-3" aria-label="Ir al inicio de Okiro">
      <span className="relative grid size-9 place-items-center rounded-[11px] border border-accent/35 bg-accent/10">
        <span className="size-3.5 rotate-45 rounded-[4px] border-2 border-accent" />
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-cyan shadow-[0_0_12px_#00e5ff]" />
      </span>
      <span className="font-display text-lg font-semibold tracking-[0.12em]">OKIRO</span>
    </Link>
  );
}

function NavLink({ href, label, icon: Icon }: (typeof navItems)[number]) {
  const pathname = usePathname();
  const active = href === "/app" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition ${
        active
          ? "bg-accent/10 font-medium text-accent"
          : "text-muted hover:bg-white/[0.04] hover:text-foreground"
      }`}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({
  displayName,
  email,
  children,
}: {
  displayName: string;
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-grid min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] border-r border-line/70 bg-[#05050e]/95 px-5 py-6 lg:flex lg:flex-col">
        <BrandMark />
        <p className="mt-2 pl-12 font-display text-[9px] uppercase tracking-[0.22em] text-muted">
          Sistema personal
        </p>

        <nav className="mt-12 space-y-1" aria-label="Navegación principal">
          {navItems.map((item) => <NavLink key={item.href} {...item} />)}
        </nav>

        <div className="mt-auto rounded-2xl border border-line/80 bg-surface p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <ShieldCheck size={16} className="text-cyan" aria-hidden="true" />
            Datos privados
          </div>
          <p className="mt-2 truncate text-sm font-medium">{displayName}</p>
          <p className="truncate text-xs text-muted">{email}</p>
        </div>

        <Link href="/app/profile" className="mt-3 flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-white/[0.04] hover:text-foreground">
          <Settings size={18} aria-hidden="true" />
          Configuración
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-warning/[0.06] hover:text-warning">
            <LogOut size={18} aria-hidden="true" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line/70 bg-[#05050e]/90 px-5 backdrop-blur lg:hidden">
        <BrandMark />
        <Link href="/app/profile" className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-muted" aria-label="Abrir perfil">
          <UserRound size={18} />
        </Link>
      </header>

      <main className="min-h-screen pb-28 lg:ml-[244px] lg:pb-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line/80 bg-[#05050e]/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden" aria-label="Navegación móvil">
        {navItems.slice(0, 2).map((item) => <MobileNavLink key={item.href} {...item} />)}
        <Link href="/app/profile#weight" className="mx-auto grid size-12 -translate-y-4 place-items-center rounded-2xl bg-accent text-white shadow-[0_0_24px_rgba(139,92,255,.35)]" aria-label="Registrar peso">
          <Plus size={22} />
        </Link>
        {navItems.slice(2).map((item) => <MobileNavLink key={item.href} {...item} />)}
      </nav>
    </div>
  );
}

function MobileNavLink({ href, label, icon: Icon }: (typeof navItems)[number]) {
  const pathname = usePathname();
  const active = href === "/app" ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-col items-center gap-1 py-1 text-[10px] ${active ? "text-cyan" : "text-muted"}`}>
      <Icon size={18} />
      <span className="truncate">{label}</span>
    </Link>
  );
}
