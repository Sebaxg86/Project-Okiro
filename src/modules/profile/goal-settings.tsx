"use client";

import { useActionState, useEffect, useState } from "react";
import { AlertTriangle, Brain, LoaderCircle, Settings2, ShieldCheck, X } from "lucide-react";
import { getIntelligenceActivity, intelligenceActivities } from "@/modules/intelligence/activities";
import { updateGoalSettingsAction, type ProfileActionState } from "./actions";

type GoalSettings = {
  exercise_days_target: number;
  programming_days_target: number;
  intelligence_activity_type: string;
  intelligence_activity_label: string;
  hydration_target_ml: number;
  sleep_min_minutes: number;
  sleep_max_minutes: number;
  sleep_target_time: string;
  expected_main_meals: number;
  flexible_meals_per_week: number;
};

const initialState: ProfileActionState = {};
const inputClass = "h-12 w-full rounded-xl border border-line bg-[#060611] px-4 text-foreground outline-none transition focus:border-cyan/70";

export function GoalSettingsPanel({ goal, canChange, changedAt }: { goal: GoalSettings; canChange: boolean; changedAt: string | null }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [intelligenceType, setIntelligenceType] = useState(goal.intelligence_activity_type);
  const [state, action, pending] = useActionState(updateGoalSettingsAction, initialState);
  const selectedIntelligence = getIntelligenceActivity(intelligenceType);
  const IntelligenceIcon = selectedIntelligence.icon;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        setOpen(false);
        setConfirming(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, pending]);

  const close = () => {
    if (pending) return;
    setOpen(false);
    setConfirming(false);
  };

  return (
    <>
      <section className="panel mt-5 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent"><Settings2 size={20} /></div>
            <div>
              <h2 className="font-display text-lg font-semibold uppercase">Parámetros del Sistema</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">Define las metas que determinan tus misiones, dominios y evaluación de cada ciclo.</p>
            </div>
          </div>
          {canChange ? (
            <button type="button" onClick={() => setOpen(true)} className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan/35 bg-cyan/[0.07] px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-cyan transition hover:bg-cyan/[0.11] active:scale-[.98]">
              <Settings2 size={16} /> Cambiar configuración
            </button>
          ) : (
            <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-line bg-black/10 px-4 font-display text-[9px] uppercase tracking-[0.14em] text-muted"><ShieldCheck size={14} className="text-cyan" /> Configuración definitiva</span>
          )}
        </div>

        <div className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${canChange ? "border-warning/30 bg-warning/[0.06] text-[#ffb0d4]" : "border-cyan/20 bg-cyan/[0.04] text-muted"}`}>
          {canChange ? <AlertTriangle className="mt-0.5 shrink-0" size={17} /> : <ShieldCheck className="mt-0.5 shrink-0 text-cyan" size={17} />}
          <p>{canChange ? <><strong>Importante:</strong> esta configuración solo puede cambiarse una vez en toda la historia de tu cuenta.</> : <>Tu único cambio de configuración ya fue utilizado{changedAt ? ` el ${formatDate(changedAt)}` : ""}. Los parámetros actuales son definitivos.</>}</p>
        </div>
        {state.success && <p role="status" className="mt-4 text-sm text-cyan">{state.success}</p>}
      </section>

      {open && canChange && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#020207]/85 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="goal-settings-title" className="system-frame panel max-h-[min(92vh,900px)] w-full max-w-3xl overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line/70 bg-[#090914]/95 p-5 backdrop-blur sm:p-6">
              <div><p className="font-display text-[9px] uppercase tracking-[0.2em] text-cyan">Cambio único disponible</p><h2 id="goal-settings-title" className="mt-2 font-display text-2xl font-semibold uppercase">Cambiar parámetros</h2></div>
              <button type="button" onClick={close} disabled={pending} aria-label="Cerrar configuración" className="grid size-10 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-white/[0.04] hover:text-foreground disabled:opacity-40"><X size={19} /></button>
            </div>

            <form action={action} className="p-5 sm:p-7">
              <div className="flex items-start gap-3 rounded-xl border border-warning/35 bg-warning/[0.07] p-4 text-sm leading-6 text-[#ffb0d4]">
                <AlertTriangle className="mt-0.5 shrink-0" size={18} />
                <p><strong>Esta decisión es irreversible.</strong> Al confirmar, no podrás volver a modificar estos parámetros desde esta cuenta. Los ciclos completados conservarán sus reglas originales.</p>
              </div>

              <div className={confirming ? "hidden" : "mt-7 space-y-7"}>
                <section>
                  <h3 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Dominios del ciclo</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <NumberField name="exerciseDaysTarget" label="Días de entrenamiento" defaultValue={goal.exercise_days_target} min={0} max={7} step={0.5} suffix="días" />
                    <NumberField name="intelligenceDaysTarget" label="Días de práctica mental" defaultValue={goal.programming_days_target} min={0} max={7} suffix="días" />
                    <NumberField name="hydrationTargetMl" label="Meta diaria de hidratación" defaultValue={goal.hydration_target_ml} min={250} max={10000} step={50} suffix="ml" />
                    <NumberField name="expectedMainMeals" label="Comidas principales por día" defaultValue={goal.expected_main_meals} min={1} max={8} suffix="al día" />
                    <NumberField name="flexibleMealsPerWeek" label="Comidas flexibles por ciclo" defaultValue={goal.flexible_meals_per_week} min={0} max={21} suffix="ciclo" />
                  </div>
                </section>

                <section className="rounded-xl border border-accent/25 bg-accent/[0.045] p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent"><IntelligenceIcon size={21} /></div>
                    <div className="min-w-0 flex-1">
                      <label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Disciplina mental principal</span><select name="intelligenceActivityType" value={intelligenceType} onChange={(event) => setIntelligenceType(event.target.value)} className={inputClass}>{intelligenceActivities.map((activity) => <option key={activity.type} value={activity.type}>{activity.label}</option>)}</select></label>
                      <p className="mt-2 text-xs leading-5 text-muted">{selectedIntelligence.description}. Okiro generará misiones relacionadas con esta disciplina.</p>
                    </div>
                  </div>
                  {intelligenceType === "custom" ? <label className="mt-4 block"><span className="mb-2 flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.15em] text-muted"><Brain size={14} className="text-cyan" /> Nombre de la disciplina</span><input name="intelligenceCustomLabel" required minLength={2} maxLength={60} defaultValue={goal.intelligence_activity_type === "custom" ? goal.intelligence_activity_label : ""} placeholder="Ej. debate, filosofía o fotografía" className={inputClass} /></label> : <input type="hidden" name="intelligenceCustomLabel" value="" />}
                </section>

                <section>
                  <h3 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Recuperación</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <NumberField name="sleepMinHours" label="Descanso mínimo" defaultValue={goal.sleep_min_minutes / 60} min={3} max={15} step={0.5} suffix="horas" />
                    <NumberField name="sleepMaxHours" label="Descanso máximo" defaultValue={goal.sleep_max_minutes / 60} min={3} max={15} step={0.5} suffix="horas" />
                    <label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Hora de recuperación</span><input name="sleepTargetTime" type="time" defaultValue={goal.sleep_target_time.slice(0, 5)} required className={inputClass} /></label>
                  </div>
                </section>
              </div>

              {state.error && <div role="alert" className="mt-6 rounded-xl border border-warning/30 bg-warning/[0.07] px-4 py-3 text-sm text-[#ff9acb]">{state.error}</div>}

              {confirming ? (
                <div className="mt-7 rounded-2xl border border-warning/40 bg-warning/[0.07] p-5 text-center sm:p-7">
                  <AlertTriangle className="mx-auto text-warning" size={30} />
                  <h3 className="mt-4 font-display text-lg font-semibold uppercase">Confirmar cambio definitivo</h3>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">Esta será la única modificación permitida durante toda la historia de tu cuenta. ¿Deseas activar estos parámetros?</p>
                  <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row">
                    <button type="button" onClick={close} disabled={pending} className="h-11 rounded-xl border border-line px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-foreground disabled:opacity-40">Cancelar</button>
                    <button type="button" onClick={() => setConfirming(false)} disabled={pending} className="h-11 rounded-xl border border-line px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-foreground disabled:opacity-40">Volver y revisar</button>
                    <button type="submit" disabled={pending} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-warning px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-[#13030b] disabled:opacity-60">{pending ? <LoaderCircle className="animate-spin" size={16} /> : <ShieldCheck size={16} />}{pending ? "Activando parámetros…" : "Confirmar cambio definitivo"}</button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line/60 pt-6 sm:flex-row sm:justify-end">
                  <button type="button" onClick={close} className="h-11 rounded-xl border border-line px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-foreground">Cancelar</button>
                  <button type="button" onClick={(event) => { if (event.currentTarget.form?.reportValidity()) setConfirming(true); }} className="h-11 rounded-xl bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white">Revisar cambios</button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function NumberField({ name, label, defaultValue, min, max, step = 1, suffix }: { name: string; label: string; defaultValue: number; min: number; max: number; step?: number; suffix?: string }) {
  return <label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span><span className="relative block"><input name={name} type="number" required defaultValue={defaultValue} min={min} max={max} step={step} className={`${inputClass} pr-16`} />{suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">{suffix}</span>}</span></label>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(value));
}
