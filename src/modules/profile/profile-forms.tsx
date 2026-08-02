"use client";

import { useActionState } from "react";
import type { InputHTMLAttributes } from "react";
import { LoaderCircle, Save, Scale } from "lucide-react";
import { saveWeightAction, updateProfileAction, type ProfileActionState } from "./actions";

const initialState: ProfileActionState = {};
const inputClass = "h-12 w-full rounded-xl border border-line bg-[#060611] px-4 text-foreground outline-none focus:border-cyan/70";

function Feedback({ state }: { state: ProfileActionState }) {
  if (!state.error && !state.success) return null;
  return <div role="status" className={`rounded-xl border px-4 py-3 text-sm ${state.error ? "border-warning/30 bg-warning/[0.07] text-[#ff9acb]" : "border-cyan/30 bg-cyan/[0.06] text-cyan"}`}>{state.error ?? state.success}</div>;
}

export function ProfileForm({ profile }: { profile: { full_name: string; display_name: string; birth_date: string | null; timezone: string; unit_system: "metric" | "imperial" } }) {
  const [state, action, pending] = useActionState(updateProfileAction, initialState);
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="fullName" label="Nombre completo" defaultValue={profile.full_name} autoComplete="name" required />
        <Field name="displayName" label="Nombre preferido" defaultValue={profile.display_name} autoComplete="nickname" required />
        <Field name="birthDate" label="Cumpleaños · opcional" defaultValue={profile.birth_date ?? ""} type="date" autoComplete="bday" />
        <Field name="timezone" label="Zona horaria" defaultValue={profile.timezone} required />
        <label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">Unidades</span><select name="unitSystem" defaultValue={profile.unit_system} className={inputClass}><option value="metric">Métrico · kg, ml</option><option value="imperial">Imperial · lb, oz</option></select></label>
      </div>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className="flex h-11 items-center gap-2 rounded-xl bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white disabled:opacity-60">{pending ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}{pending ? "Guardando" : "Guardar perfil"}</button>
    </form>
  );
}

export function WeightForm({ unitSystem, today }: { unitSystem: "metric" | "imperial"; today: string }) {
  const [state, action, pending] = useActionState(saveWeightAction, initialState);
  const unit = unitSystem === "imperial" ? "lb" : "kg";
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="unitSystem" value={unitSystem} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="measuredOn" label="Fecha" defaultValue={today} type="date" required />
        <Field name="weight" label={`Peso · ${unit}`} type="number" step="0.1" min={unitSystem === "imperial" ? "44" : "20"} max={unitSystem === "imperial" ? "1102" : "500"} placeholder={unitSystem === "imperial" ? "160" : "72.5"} required />
      </div>
      <p className="text-xs leading-5 text-muted">Una medición en la misma fecha reemplaza la anterior. El peso es privado y no afecta tu XP.</p>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className="flex h-11 items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/[0.08] px-5 font-display text-xs font-semibold uppercase tracking-[0.1em] text-cyan disabled:opacity-60">{pending ? <LoaderCircle className="animate-spin" size={16} /> : <Scale size={16} />}{pending ? "Guardando" : "Guardar medición"}</button>
    </form>
  );
}

function Field({ name, label, defaultValue, type = "text", required = false, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "name"> & { name: string; label: string }) {
  return <label className="block"><span className="mb-2 block font-display text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span><input name={name} type={type} defaultValue={defaultValue} required={required} className={inputClass} {...props} /></label>;
}
