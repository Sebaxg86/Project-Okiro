import { z } from "zod";

export const onboardingSchema = z
  .object({
    timezone: z.string().trim().min(1, "Confirma tu zona horaria.").max(64),
    unitSystem: z.enum(["metric", "imperial"]),
    exerciseDaysTarget: z.coerce.number().min(0).max(7),
    programmingDaysTarget: z.coerce.number().int().min(0).max(7),
    hydrationTargetMl: z.coerce.number().int().min(250).max(10000),
    sleepMinHours: z.coerce.number().min(3).max(15),
    sleepMaxHours: z.coerce.number().min(3).max(15),
    sleepTargetTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Escribe una hora válida."),
    expectedMainMeals: z.coerce.number().int().min(1).max(8),
    flexibleMealsPerWeek: z.coerce.number().int().min(0).max(21),
  })
  .refine((data) => data.sleepMaxHours >= data.sleepMinHours, {
    message: "El máximo de sueño no puede ser menor que el mínimo.",
    path: ["sleepMaxHours"],
  });

