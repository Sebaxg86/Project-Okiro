"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  Cake,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  loginAction,
  registerAction,
  type AuthActionState,
} from "./actions";

const initialState: AuthActionState = {};

function TextField({
  name,
  label,
  placeholder,
  autoComplete,
  icon: Icon,
  type = "text",
  required = false,
  min,
  max,
  step,
}: {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  icon: typeof UserRound;
  type?: "text" | "date" | "number";
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-accent" size={17} aria-hidden="true" />
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          min={min}
          max={max}
          step={step}
          className="h-12 w-full border border-line bg-[#060611] pl-11 pr-4 text-base text-foreground outline-none transition placeholder:text-muted/50 focus:border-cyan/70 focus:shadow-[0_0_0_3px_rgba(0,229,255,.08)] [clip-path:polygon(0_8px,8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]"
          placeholder={placeholder}
        />
      </span>
    </label>
  );
}

function PasswordField({
  name,
  label,
  autoComplete,
  minimumLength,
}: {
  name: string;
  label: string;
  autoComplete: string;
  minimumLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block font-display text-[10px] font-medium uppercase tracking-[0.16em] text-muted">{label}</span>
      <span className="relative block">
        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-accent" size={17} aria-hidden="true" />
        <input
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minimumLength}
          required
          className="h-12 w-full border border-line bg-[#060611] pl-11 pr-12 text-base text-foreground outline-none transition placeholder:text-muted/50 focus:border-cyan/70 focus:shadow-[0_0_0_3px_rgba(0,229,255,.08)] [clip-path:polygon(0_8px,8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]"
          placeholder={minimumLength ? "Mínimo 10 caracteres" : "Tu contraseña"}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-muted transition hover:text-cyan"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
    </label>
  );
}

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const isRegister = mode === "register";
  const timezoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timezoneRef.current) {
      timezoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    }
  }, []);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {isRegister && (
        <>
          <input ref={timezoneRef} type="hidden" name="timezone" defaultValue="UTC" />
          <TextField
            name="fullName"
            label="Nombre completo"
            placeholder="Tu nombre y apellidos"
            autoComplete="name"
            icon={UserRound}
            required
          />
          <TextField
            name="displayName"
            label="Nombre preferido"
            placeholder="Cómo quieres que te llamemos"
            autoComplete="nickname"
            icon={UserRound}
            required
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="birthDate"
              label="Cumpleaños · opcional"
              autoComplete="bday"
              icon={Cake}
              type="date"
            />
            <TextField
              name="weightKg"
              label="Peso inicial · kg · opcional"
              placeholder="72.5"
              autoComplete="off"
              icon={Scale}
              type="number"
              min="20"
              max="500"
              step="0.1"
            />
          </div>
          <p className="-mt-2 text-xs leading-5 text-muted">
            Tu cumpleaños y peso son privados. El peso se guarda como el primer punto de tu historial y nunca genera ni resta XP.
          </p>
        </>
      )}
      <label className="block">
        <span className="mb-2 block font-display text-[10px] font-medium uppercase tracking-[0.16em] text-muted">Correo electrónico</span>
        <span className="relative block">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-accent" size={17} aria-hidden="true" />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-12 w-full border border-line bg-[#060611] pl-11 pr-4 text-base text-foreground outline-none transition placeholder:text-muted/50 focus:border-cyan/70 focus:shadow-[0_0_0_3px_rgba(0,229,255,.08)] [clip-path:polygon(0_8px,8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]"
            placeholder="nombre@correo.com"
          />
        </span>
      </label>

      <PasswordField
        name="password"
        label="Contraseña"
        autoComplete={isRegister ? "new-password" : "current-password"}
        minimumLength={isRegister ? 10 : undefined}
      />

      {isRegister && (
        <>
          <PasswordField
            name="confirmPassword"
            label="Confirmar contraseña"
            autoComplete="new-password"
            minimumLength={10}
          />
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-muted">
            <input
              name="acceptedTerms"
              type="checkbox"
              required
              className="mt-0.5 size-4 shrink-0 accent-[#8b5cff]"
            />
            <span>
              Acepto los <Link href="/terms" className="text-cyan hover:underline">términos</Link> y el <Link href="/privacy" className="text-cyan hover:underline">aviso de privacidad</Link>.
            </span>
          </label>
        </>
      )}

      {state.error && (
        <div role="alert" className="border border-warning/30 bg-warning/[0.07] px-4 py-3 text-sm text-[#ff9acb] [clip-path:polygon(0_7px,7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%)]">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.13em] text-white shadow-[0_0_28px_rgba(139,92,255,.28)] transition hover:bg-accent-strong disabled:cursor-wait disabled:opacity-60 [clip-path:polygon(0_9px,9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%)]"
      >
        {pending ? <LoaderCircle size={17} className="animate-spin" /> : <ShieldCheck size={17} />}
        {pending ? "Procesando" : isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </button>
    </form>
  );
}
