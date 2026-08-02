import { z } from "zod";
import { intelligenceActivityTypes } from "@/modules/intelligence/activities";

export const onboardingSchema = z
  .object({
    timezone: z.string().trim().min(1, "Confirma tu zona horaria.").max(64),
    unitSystem: z.enum(["metric", "imperial"]),
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
