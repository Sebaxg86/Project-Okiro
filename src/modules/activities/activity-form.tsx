"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import { Apple, BedDouble, Droplets, Dumbbell, LoaderCircle, Save } from "lucide-react";
import { saveActivityAction, type ActivityActionState } from "./actions";
import type { ActivityKind } from "./schemas";
import { getIntelligenceActivity } from "@/modules/intelligence/activities";

const initialState: ActivityActionState = {};
const inputClass = "h-12 w-full rounded-xl border border-line bg-[#060611] px-4 text-foreground outline-none transition focus:border-cyan/70";
export function ActivityForm({ kind, initial, idempotencyKey, intelligenceType = "programming", intelligenceLabel = "Programación" }: { kind: ActivityKind; initial: Record<string, string>; idempotencyKey: string; intelligenceType?: string; intelligenceLabel?: string }) {
  const [state, action, pending] = useActionState(saveActivityAction, initialState);
  const preferredIntelligence = getIntelligenceActivity(intelligenceType);
  const IntelligenceIcon = preferredIntelligence.icon;
  const kinds = [
    { key: "workout" as const, label: "Entrenamiento", icon: Dumbbell },
    { key: "sleep" as const, label: "Sueño", icon: BedDouble },
    { key: "meal" as const, label: "Comida", icon: Apple },
    { key: "hydration" as const, label: "Agua", icon: Droplets },
    { key: "focus" as const, label: intelligenceLabel, icon: IntelligenceIcon },
  ];
  return (
    <>
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Tipo de registro">
        {kinds.map(({ key, label, icon: Icon }) => <Link key={key} href={`/app/log?type=${key}`} className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border px-2 text-center text-xs transition ${kind === key ? "border-cyan/50 bg-cyan/[0.08] text-cyan" : "border-line bg-black/10 text-muted hover:text-foreground"}`}><Icon size={18} />{label}</Link>)}
      </nav>

      <form action={action} className="mt-8 space-y-6">
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="recordId" value={initial.recordId ?? ""} />
        <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="localDate" label={kind === "sleep" ? "Día de despertar" : "Fecha"} type="date" defaultValue={initial.localDate} required />
          {kind === "sleep" ? <><Field name="sleepTime" label="Hora de dormir" type="time" defaultValue={initial.sleepTime} required /><Field name="wakeTime" label="Hora de despertar" type="time" defaultValue={initial.wakeTime} required /></> : <Field name="time" label="Hora de inicio" type="time" defaultValue={initial.time} required />}

          {kind === "workout" && <WorkoutFields initial={initial} />}
          {kind === "sleep" && <SleepFields initial={initial} />}
          {kind === "meal" && <MealFields initial={initial} />}
          {kind === "hydration" && <HydrationFields initial={initial} />}
          {kind === "focus" && <FocusFields initial={initial} intelligenceType={intelligenceType} intelligenceLabel={intelligenceLabel} />}
        </div>

        {kind !== "hydration" && <label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Notas · opcional</span><textarea name="notes" defaultValue={initial.notes} rows={3} maxLength={1000} className="w-full rounded-xl border border-line bg-[#060611] p-4 text-foreground outline-none focus:border-cyan/70" /></label>}
        {state.error && <div role="alert" className="rounded-xl border border-warning/30 bg-warning/[0.07] px-4 py-3 text-sm text-[#ff9acb]">{state.error}</div>}
        <button type="submit" disabled={pending} className="flex h-12 w-full items-center justify-center gap-2 bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_0_28px_rgba(139,92,255,.28)] disabled:opacity-60 [clip-path:polygon(0_9px,9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%)]">{pending ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}{pending ? "Calculando XP" : initial.recordId ? "Guardar cambios" : "Guardar registro"}</button>
      </form>
    </>
  );
}

function WorkoutFields({ initial }: { initial: Record<string, string> }) { return <><Field name="durationMinutes" label="Duración" type="number" min="1" max="1440" defaultValue={initial.durationMinutes || "45"} suffix="min" required /><Select name="workoutType" label="Tipo" defaultValue={initial.workoutType || "strength"} options={[["strength","Fuerza"],["cardio","Cardio"],["walking","Caminata"],["cycling","Ciclismo"],["swimming","Natación"],["boxing","Box"],["mma","MMA"],["sport","Deporte"],["mobility","Movilidad"],["yoga","Yoga"],["active_recovery","Recuperación activa"],["functional","Funcional"],["mixed","Mixto"],["other","Otro"]]} /><Select name="intensity" label="Intensidad" defaultValue={initial.intensity || "moderate"} options={[["light","Ligera"],["moderate","Moderada"],["intense","Intensa"]]} /><Field name="title" label="Nombre · opcional" defaultValue={initial.title} placeholder="Fuerza de tren superior" /></>; }
function SleepFields({ initial }: { initial: Record<string, string> }) { return <><Select name="quality" label="Calidad · opcional" defaultValue={initial.quality || ""} options={[["","Sin valorar"],["1","1 · Muy baja"],["2","2 · Baja"],["3","3 · Media"],["4","4 · Buena"],["5","5 · Excelente"]]} /><Field name="interruptions" label="Interrupciones · opcional" type="number" min="0" max="50" defaultValue={initial.interruptions} /></>; }
function MealFields({ initial }: { initial: Record<string, string> }) { return <><Select name="mealType" label="Tipo de comida" defaultValue={initial.mealType || "breakfast"} options={[["breakfast","Desayuno"],["lunch","Comida"],["dinner","Cena"],["snack","Snack"],["other","Otra"]]} /><Select name="classification" label="Clasificación" defaultValue={initial.classification || "balanced"} options={[["balanced","Equilibrada"],["adequate","Adecuada"],["flexible","Flexible planificada"],["out_of_plan","Fuera del plan"],["considerable_excess","Exceso considerable"]]} /><div className="sm:col-span-2"><Field name="description" label="Descripción" defaultValue={initial.description} placeholder="Ej. pollo, arroz y verduras" required /></div></>; }
function HydrationFields({ initial }: { initial: Record<string, string> }) { const ref = useRef<HTMLInputElement>(null); return <div className="sm:col-span-2"><label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Cantidad</span><span className="relative block"><input ref={ref} name="amountMl" type="number" min="1" max="5000" defaultValue={initial.amountMl || "500"} required className={inputClass + " pr-14"} /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">ml</span></span></label><div className="mt-3 grid grid-cols-3 gap-2">{[250,500,750].map((amount) => <button key={amount} type="button" onClick={() => { if (ref.current) ref.current.value = String(amount); }} className="h-10 rounded-xl border border-line text-sm text-muted hover:border-cyan/40 hover:text-cyan">{amount} ml</button>)}</div></div>; }
function FocusFields({ initial, intelligenceType, intelligenceLabel }: { initial: Record<string, string>; intelligenceType: string; intelligenceLabel: string }) { const activity = getIntelligenceActivity(initial.focusType || intelligenceType); const Icon = activity.icon; return <><input type="hidden" name="focusType" value={initial.focusType || intelligenceType} /><Field name="durationMinutes" label="Duración enfocada" type="number" min="1" max="720" defaultValue={initial.durationMinutes || "50"} suffix="min" required /><div className="flex h-12 items-center gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-4"><Icon size={18} className="text-accent" /><div><p className="text-sm font-medium">{intelligenceLabel}</p><p className="text-[10px] text-muted">Actividad principal de inteligencia</p></div></div><div className="sm:col-span-2"><Field name="objective" label="Objetivo de la sesión" defaultValue={initial.objective} placeholder={`Ej. avanzar en ${intelligenceLabel.toLowerCase()}`} required /></div><div className="sm:col-span-2"><Field name="projectName" label="Proyecto · opcional" defaultValue={initial.projectName} /></div></>; }

function Select({ name, label, defaultValue, options }: { name: string; label: string; defaultValue: string; options: string[][] }) { return <label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span><select name={name} defaultValue={defaultValue} className={inputClass}>{options.map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select></label>; }
function Field({ name, label, suffix, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; suffix?: string }) { return <label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span><span className="relative block"><input name={name} className={inputClass + (suffix ? " pr-14" : "")} {...props} />{suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">{suffix}</span>}</span></label>; }
