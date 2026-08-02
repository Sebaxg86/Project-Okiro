import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Escribe un correo válido."),
  password: z.string().min(1, "Escribe tu contraseña."),
  next: z.string().optional(),
});

const optionalBirthDate = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
        value >= "1900-01-01" &&
        new Date(`${value}T00:00:00Z`) <= new Date()),
    "Escribe una fecha de nacimiento válida.",
  );

const optionalWeight = z
  .string()
  .trim()
  .refine((value) => {
    if (value === "") return true;
    const weight = Number(value);
    return Number.isFinite(weight) && weight >= 20 && weight <= 500;
  }, "El peso debe estar entre 20 y 500 kg.");

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Escribe tu nombre completo.")
      .max(120, "El nombre es demasiado largo."),
    displayName: z
      .string()
      .trim()
      .min(2, "Escribe el nombre que quieres ver en Okiro.")
      .max(40, "El nombre visible es demasiado largo."),
    birthDate: optionalBirthDate,
    weightKg: optionalWeight,
    timezone: z.string().trim().min(1).max(64).default("UTC"),
    email: z.email("Escribe un correo válido."),
    password: z
      .string()
      .min(10, "La contraseña debe tener al menos 10 caracteres."),
    confirmPassword: z.string(),
    acceptedTerms: z.literal(true, {
      error: "Debes aceptar los términos y el aviso de privacidad.",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export function safeRedirectPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}
