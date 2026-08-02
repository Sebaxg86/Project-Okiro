"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { intelligenceActivityLabel } from "@/modules/intelligence/activities";
import { goalSettingsSchema, profileSchema, weightSchema } from "./schemas";

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
  return { success: "Identidad actualizada." };
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

export async function updateGoalSettingsAction(_state: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const parsed = goalSettingsSchema.safeParse({
    exerciseDaysTarget: formData.get("exerciseDaysTarget"),
    intelligenceDaysTarget: formData.get("intelligenceDaysTarget"),
    intelligenceActivityType: formData.get("intelligenceActivityType"),
    intelligenceCustomLabel: formData.get("intelligenceCustomLabel") ?? "",
    hydrationTargetMl: formData.get("hydrationTargetMl"),
    sleepMinHours: formData.get("sleepMinHours"),
    sleepMaxHours: formData.get("sleepMaxHours"),
    sleepTargetTime: formData.get("sleepTargetTime"),
    expectedMainMeals: formData.get("expectedMainMeals"),
    flexibleMealsPerWeek: formData.get("flexibleMealsPerWeek"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los parámetros del ciclo." };

  const { supabase } = await getUser();
  const values = parsed.data;
  const { error } = await supabase.rpc("update_goal_configuration_once", {
    p_exercise_days_target: values.exerciseDaysTarget,
    p_programming_days_target: values.intelligenceDaysTarget,
    p_intelligence_activity_type: values.intelligenceActivityType,
    p_intelligence_activity_label: intelligenceActivityLabel(values.intelligenceActivityType, values.intelligenceCustomLabel),
    p_hydration_target_ml: values.hydrationTargetMl,
    p_sleep_min_minutes: Math.round(values.sleepMinHours * 60),
    p_sleep_max_minutes: Math.round(values.sleepMaxHours * 60),
    p_sleep_target_time: values.sleepTargetTime,
    p_expected_main_meals: values.expectedMainMeals,
    p_flexible_meals_per_week: values.flexibleMealsPerWeek,
  });

  if (error) {
    if (error.message.includes("already used")) return { error: "El cambio único de configuración ya fue utilizado." };
    return { error: "No fue posible actualizar tus parámetros. Inténtalo nuevamente." };
  }

  revalidatePath("/app", "layout");
  return { success: "Configuración actualizada. Tus nuevos parámetros ya están activos." };
}
