"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "./schema";
import { intelligenceActivityLabel } from "@/modules/intelligence/activities";

export type OnboardingActionState = { error?: string };

export async function completeOnboardingAction(
  _state: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const parsed = onboardingSchema.safeParse({
    timezone: formData.get("timezone"),
    unitSystem: formData.get("unitSystem"),
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

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding");

  const values = parsed.data;
  const { error } = await supabase.rpc("complete_onboarding_v2", {
    p_timezone: values.timezone,
    p_unit_system: values.unitSystem,
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

  if (error) return { error: "No fue posible activar tus parámetros. Inténtalo nuevamente." };

  revalidatePath("/app", "layout");
  redirect("/app");
}
