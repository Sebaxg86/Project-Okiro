import { z } from "zod";

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

