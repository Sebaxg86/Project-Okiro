import { redirect } from "next/navigation";
import { DashboardShell } from "@/modules/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login?status=configuration");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    (typeof user.user_metadata?.display_name === "string" &&
      user.user_metadata.display_name) ||
    user.email?.split("@")[0] ||
    "Cazador";

  return <DashboardShell displayName={displayName} email={user.email} />;
}
