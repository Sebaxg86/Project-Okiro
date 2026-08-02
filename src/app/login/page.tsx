import Link from "next/link";
import { AuthForm } from "@/modules/auth/auth-form";
import { AuthShell } from "@/modules/auth/auth-shell";

export const metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; status?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Acceso al Sistema"
      title="Continúa tu ascenso"
      description="Tu ciclo sigue activo. Inicia sesión para continuar."
      footer={
        <>
          ¿Todavía no has iniciado tu ascenso?{" "}
          <Link href="/register" className="font-semibold text-cyan hover:underline">
            Crear cuenta
          </Link>
        </>
      }
    >
      {params.status === "configuration" && (
        <div className="mb-5 border border-warning/25 bg-warning/[0.06] px-4 py-3 text-sm text-[#ff9acb]">
          El acceso todavía no está disponible.
        </div>
      )}
      {params.status === "session-expired" && (
        <div className="mb-5 border border-cyan/25 bg-cyan/[0.06] px-4 py-3 text-sm text-cyan">
          Tu sesión se cerró después de 15 días sin actividad. Inicia sesión para continuar.
        </div>
      )}
      <AuthForm mode="login" next={params.next} />
    </AuthShell>
  );
}
