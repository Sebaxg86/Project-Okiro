"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, weightSchema } from "./schemas";

export type ProfileActionState = { error?: string; success?: string };

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/profile");
  return { supabase, user };
}

export async function updateProfileAction(_state: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    displayName: formData.get("displayName"),
    birthDate: formData.get("birthDate") ?? "",
    timezone: formData.get("timezone"),
    unitSystem: formData.get("unitSystem"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa tu información." };

  const { supabase, user } = await getUser();
  const { error } = await supabase.from("profiles").update({
    full_name: parsed.data.fullName,
    display_name: parsed.data.displayName,
    birth_date: parsed.data.birthDate || null,
    timezone: parsed.data.timezone,
    unit_system: parsed.data.unitSystem,
  }).eq("id", user.id);

  if (error) return { error: "No pudimos actualizar tu perfil." };
  revalidatePath("/app", "layout");
  return { success: "Perfil actualizado." };
}

export async function saveWeightAction(_state: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const parsed = weightSchema.safeParse({
    measuredOn: formData.get("measuredOn"),
    weight: formData.get("weight"),
    unitSystem: formData.get("unitSystem"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa la medición." };

  const { supabase, user } = await getUser();
  const weightKg = parsed.data.unitSystem === "imperial" ? parsed.data.weight * 0.45359237 : parsed.data.weight;
  const { error } = await supabase.from("weight_entries").upsert({
    user_id: user.id,
    measured_on: parsed.data.measuredOn,
    weight_kg: Math.round(weightKg * 100) / 100,
    source: "manual",
  }, { onConflict: "user_id,measured_on" });

  if (error) return { error: "No pudimos guardar la medición." };
  revalidatePath("/app");
  revalidatePath("/app/history");
  revalidatePath("/app/progress");
  revalidatePath("/app/profile");
  return { success: "Medición guardada." };
}

