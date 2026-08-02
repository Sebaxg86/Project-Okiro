import { z } from "zod";
import { intelligenceActivityTypes } from "@/modules/intelligence/activities";

export const activityKinds = ["workout", "sleep", "meal", "hydration", "focus"] as const;
export type ActivityKind = (typeof activityKinds)[number];

const localDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Escribe una fecha válida.");
const localTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Escribe una hora válida.");
const optionalText = (maximum: number) => z.string().trim().max(maximum).default("");

const base = {
  localDate,
  idempotencyKey: z.string().min(8).max(120),
  recordId: z.union([z.literal(""), z.uuid()]).default(""),
};

export const workoutSchema = z.object({
  kind: z.literal("workout"),
  ...base,
  time: localTime,
  durationMinutes: z.coerce.number().int().min(1).max(1440),
  workoutType: z.enum(["strength","cardio","walking","cycling","swimming","boxing","mma","sport","mobility","yoga","active_recovery","functional","mixed","other"]),
  intensity: z.enum(["light", "moderate", "intense"]),
  title: optionalText(120),
  notes: optionalText(1000),
});

export const sleepSchema = z.object({
  kind: z.literal("sleep"),
  ...base,
  sleepTime: localTime,
  wakeTime: localTime,
  quality: z.union([z.literal(""), z.coerce.number().int().min(1).max(5)]).default(""),
  interruptions: z.union([z.literal(""), z.coerce.number().int().min(0).max(50)]).default(""),
  notes: optionalText(1000),
});

export const mealSchema = z.object({
  kind: z.literal("meal"),
  ...base,
  time: localTime,
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack", "other"]),
  description: z.string().trim().min(2, "Describe brevemente la comida.").max(160),
  classification: z.enum(["balanced", "adequate", "flexible", "out_of_plan", "considerable_excess"]),
  notes: optionalText(1000),
});

export const hydrationSchema = z.object({
  kind: z.literal("hydration"),
  ...base,
  time: localTime,
  amountMl: z.coerce.number().int().min(1).max(5000),
});

export const focusSchema = z.object({
  kind: z.literal("focus"),
  ...base,
  time: localTime,
  durationMinutes: z.coerce.number().int().min(1).max(720),
  focusType: z.enum([...intelligenceActivityTypes, "technical_study", "exercises", "course", "technical_reading", "personal_project"]),
  objective: z.string().trim().min(2, "Escribe el objetivo de la sesión.").max(200),
  projectName: optionalText(120),
  notes: optionalText(1000),
});

export const activitySchema = z.discriminatedUnion("kind", [workoutSchema, sleepSchema, mealSchema, hydrationSchema, focusSchema]);

export function parseActivityForm(formData: FormData) {
  return activitySchema.safeParse(Object.fromEntries(formData.entries()));
}
