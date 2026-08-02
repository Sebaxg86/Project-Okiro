import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Escribe un correo válido."),
  password: z.string().min(1, "Escribe tu contraseña."),
  next: z.string().optional(),
});

export const registerSchema = z
  .object({
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
