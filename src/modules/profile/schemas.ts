import { z } from "zod";
import { intelligenceActivityTypes } from "@/modules/intelligence/activities";

const birthDate = z.string().trim().refine((value) => {
  if (!value) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= "1900-01-01" && value <= new Date().toISOString().slice(0, 10);
}, "Escribe una fecha de nacimiento válida.");

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Escribe tu nombre completo.").max(120),
  displayName: z.string().trim().min(2, "Escribe tu nombre preferido.").max(40),
  birthDate,
  timezone: z.string().trim().min(1, "Escribe tu zona horaria.").max(64),
  unitSystem: z.enum(["metric", "imperial"]),
});

export const weightSchema = z.object({
  measuredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => value <= new Date().toISOString().slice(0, 10), "La fecha no puede estar en el futuro."),
  weight: z.coerce.number().positive(),
  unitSystem: z.enum(["metric", "imperial"]),
}).refine(({ weight, unitSystem }) => unitSystem === "metric" ? weight >= 20 && weight <= 500 : weight >= 44 && weight <= 1102, {
  message: "Escribe una medición de peso válida.",
  path: ["weight"],
});

export const goalSettingsSchema = z
  .object({
    exerciseDaysTarget: z.coerce.number().min(0).max(7),
    intelligenceDaysTarget: z.coerce.number().int().min(0).max(7),
    intelligenceActivityType: z.enum(intelligenceActivityTypes),
    intelligenceCustomLabel: z.string().trim().max(60, "El nombre es demasiado largo.").default(""),
    hydrationTargetMl: z.coerce.number().int().min(250).max(10000),
    sleepMinHours: z.coerce.number().min(3).max(15),
    sleepMaxHours: z.coerce.number().min(3).max(15),
    sleepTargetTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Escribe una hora válida."),
    expectedMainMeals: z.coerce.number().int().min(1).max(8),
    flexibleMealsPerWeek: z.coerce.number().int().min(0).max(21),
  })
  .refine((data) => data.sleepMaxHours >= data.sleepMinHours, {
    message: "El descanso máximo debe ser mayor o igual que el mínimo.",
    path: ["sleepMaxHours"],
  })
  .refine((data) => data.intelligenceActivityType !== "custom" || data.intelligenceCustomLabel.length >= 2, {
    message: "Escribe el nombre de tu disciplina mental.",
    path: ["intelligenceCustomLabel"],
  });
