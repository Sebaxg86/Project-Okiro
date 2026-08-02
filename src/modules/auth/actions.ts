"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loginSchema, registerSchema, safeRedirectPath } from "./schemas";

export type AuthActionState = {
  error?: string;
};

const initialError = "No fue posible completar la operación. Inténtalo nuevamente.";

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? initialError };
  }

  if (!isSupabaseConfigured()) {
    return { error: "La conexión segura todavía no está configurada." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect(safeRedirectPath(formData.get("next")));
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    displayName: formData.get("displayName"),
    birthDate: formData.get("birthDate") ?? "",
    weightKg: formData.get("weightKg") ?? "",
    timezone: formData.get("timezone") ?? "UTC",
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    acceptedTerms: formData.get("acceptedTerms") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? initialError };
  }

  if (!isSupabaseConfigured()) {
    return { error: "La conexión segura todavía no está configurada." };
  }

  const requestHeaders = await headers();
  const origin =
    requestHeaders.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
      data: {
        full_name: parsed.data.fullName,
        display_name: parsed.data.displayName,
        birth_date: parsed.data.birthDate || null,
        weight_kg: parsed.data.weightKg || null,
        timezone: parsed.data.timezone,
      },
    },
  });

  if (error) {
    return { error: initialError };
  }

  if (data.session) {
    redirect("/onboarding");
  }

  redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}
