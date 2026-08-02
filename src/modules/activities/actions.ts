"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { activityKinds, parseActivityForm, type ActivityKind } from "./schemas";

export type ActivityActionState = { error?: string };

function friendlyError(message: string) {
  if (message.includes("overlaps")) return "El horario se solapa con otro entrenamiento o sesión de enfoque.";
  if (message.includes("not open")) return "La fecha pertenece a un ciclo que ya no admite cambios.";
  if (message.includes("flexible meals")) return "Ya utilizaste las comidas flexibles disponibles en este ciclo.";
  if (message.includes("duplicate key") || message.includes("sleep_logs_one")) return "Ya existe un registro equivalente para esa fecha.";
  return "No pudimos guardar el registro. Revisa los datos e inténtalo nuevamente.";
}

export async function saveActivityAction(_state: ActivityActionState, formData: FormData): Promise<ActivityActionState> {
  const parsed = parseActivityForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos del registro." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/log");

  const { kind, idempotencyKey, recordId, ...payload } = parsed.data;
  const { data, error } = await supabase.rpc("save_activity", {
    p_kind: kind,
    p_record_id: recordId || null,
    p_payload: payload,
    p_idempotency_key: idempotencyKey,
  });
  if (error) return { error: friendlyError(error.message) };

  const result = data as { xpDelta?: number } | null;
  revalidatePath("/app", "layout");
  const params = new URLSearchParams({ status: recordId ? "updated" : "saved", xp: String(result?.xpDelta ?? 0) });
  redirect(`/app/history?${params}`);
}

export async function deleteActivityAction(kind: ActivityKind, recordId: string, formData: FormData) {
  if (!activityKinds.includes(kind) || !zodUuid(recordId)) return;
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");
  if (idempotencyKey.length < 8) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/history");
  const { data, error } = await supabase.rpc("delete_activity", {
    p_kind: kind,
    p_record_id: recordId,
    p_idempotency_key: idempotencyKey,
  });
  if (error) redirect("/app/history?status=delete-error");

  const result = data as { xpDelta?: number } | null;
  revalidatePath("/app", "layout");
  redirect(`/app/history?status=deleted&xp=${encodeURIComponent(String(result?.xpDelta ?? 0))}`);
}

function zodUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
