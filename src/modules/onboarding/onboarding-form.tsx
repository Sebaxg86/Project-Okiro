"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Brain, LoaderCircle, ShieldCheck } from "lucide-react";
import { completeOnboardingAction, type OnboardingActionState } from "./actions";
import { getIntelligenceActivity, intelligenceActivities } from "@/modules/intelligence/activities";

const initialState: OnboardingActionState = {};

function NumberField({ name, label, defaultValue, min, max, step = 1, suffix }: { name: string; label: string; defaultValue: number; min: number; max: number; step?: number; suffix?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span>
      <span className="relative block">
        <input name={name} type="number" required defaultValue={defaultValue} min={min} max={max} step={step} className="h-12 w-full rounded-xl border border-line bg-[#060611] px-4 pr-16 text-foreground outline-none focus:border-cyan/70" />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">{suffix}</span>}
      </span>
    </label>
  );
}

export function OnboardingForm({ initialTimezone }: { initialTimezone: string }) {
  const [state, action, pending] = useActionState(completeOnboardingAction, initialState);
  const timezoneRef = useRef<HTMLInputElement>(null);
  const [intelligenceType, setIntelligenceType] = useState("programming");
  const selectedIntelligence = getIntelligenceActivity(intelligenceType);
  const IntelligenceIcon = selectedIntelligence.icon;

  useEffect(() => {
    if (initialTimezone === "UTC" && timezoneRef.current) {
      timezoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    }
  }, [initialTimezone]);

  return (
    <form action={action} className="space-y-8">
      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-cyan">01 · Preferencias</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Zona horaria</span>
            <input ref={timezoneRef} name="timezone" defaultValue={initialTimezone || "UTC"} required className="h-12 w-full rounded-xl border border-line bg-[#060611] px-4 text-foreground outline-none focus:border-cyan/70" />
            <span className="mt-2 block text-xs text-muted">La detectamos automáticamente; confírmala antes de continuar.</span>
          </label>
          <label className="block">
            <span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Sistema de unidades</span>
            <select name="unitSystem" defaultValue="metric" className="h-12 w-full rounded-xl border border-line bg-[#060611] px-4 text-foreground outline-none focus:border-cyan/70">
              <option value="metric">Métrico · kg, ml</option>
              <option value="imperial">Imperial · lb, oz</option>
            </select>
          </label>
        </div>
      </section>

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-cyan">02 · Objetivos semanales</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NumberField name="exerciseDaysTarget" label="Ejercicio" defaultValue={5} min={0} max={7} step={0.5} suffix="días" />
          <div className="sm:col-span-2 rounded-xl border border-accent/25 bg-accent/[0.045] p-4 sm:p-5">
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent"><IntelligenceIcon size={21} /></div>
              <div className="min-w-0 flex-1">
                <label className="block">
                  <span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Actividad principal de inteligencia</span>
                  <select name="intelligenceActivityType" value={intelligenceType} onChange={(event) => setIntelligenceType(event.target.value)} className="h-12 w-full rounded-xl border border-line bg-[#060611] px-4 text-foreground outline-none focus:border-cyan/70">
                    {intelligenceActivities.map((activity) => <option key={activity.type} value={activity.type}>{activity.label}</option>)}
                  </select>
                </label>
                <p className="mt-2 text-xs leading-5 text-muted">{selectedIntelligence.description}. Esta elección personalizará tus misiones y registros.</p>
              </div>
            </div>
            {intelligenceType === "custom" && <label className="mt-4 block"><span className="mb-2 flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.15em] text-muted"><Brain size={14} className="text-cyan" /> Nombre de tu actividad</span><input name="intelligenceCustomLabel" required minLength={2} maxLength={60} placeholder="Ej. debate, filosofía o fotografía" className="h-12 w-full rounded-xl border border-line bg-[#060611] px-4 text-foreground outline-none focus:border-cyan/70" /></label>}
            {intelligenceType !== "custom" && <input type="hidden" name="intelligenceCustomLabel" value="" />}
          </div>
          <NumberField name="intelligenceDaysTarget" label={`Días de ${selectedIntelligence.label.toLowerCase()}`} defaultValue={3} min={0} max={7} suffix="días" />
          <NumberField name="hydrationTargetMl" label="Hidratación diaria" defaultValue={2500} min={250} max={10000} step={50} suffix="ml" />
          <NumberField name="expectedMainMeals" label="Comidas principales" defaultValue={3} min={1} max={8} suffix="al día" />
          <NumberField name="flexibleMealsPerWeek" label="Comidas flexibles" defaultValue={2} min={0} max={21} suffix="semana" />
        </div>
      </section>

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-cyan">03 · Sueño</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <NumberField name="sleepMinHours" label="Mínimo" defaultValue={7} min={3} max={15} step={0.5} suffix="horas" />
          <NumberField name="sleepMaxHours" label="Máximo" defaultValue={9} min={3} max={15} step={0.5} suffix="horas" />
          <label className="block">
            <span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Hora objetivo</span>
            <input name="sleepTargetTime" type="time" defaultValue="23:30" required className="h-12 w-full rounded-xl border border-line bg-[#060611] px-4 text-foreground outline-none focus:border-cyan/70" />
          </label>
        </div>
      </section>

      {state.error && <div role="alert" className="rounded-xl border border-warning/30 bg-warning/[0.07] px-4 py-3 text-sm text-[#ff9acb]">{state.error}</div>}

      <div className="rounded-xl border border-cyan/20 bg-cyan/[0.04] p-4 text-sm leading-6 text-muted">
        <ShieldCheck className="mr-2 inline text-cyan" size={16} />
        Tus objetivos podrán cambiar después mediante versiones nuevas; el historial anterior no se reescribe.
      </div>

      <button type="submit" disabled={pending} className="flex h-12 w-full items-center justify-center gap-2 bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.13em] text-white shadow-[0_0_28px_rgba(139,92,255,.28)] disabled:opacity-60 [clip-path:polygon(0_9px,9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%)]">
        {pending ? <LoaderCircle className="animate-spin" size={17} /> : <ShieldCheck size={17} />}
        {pending ? "Creando tu sistema" : "Confirmar y comenzar"}
      </button>
    </form>
  );
}
