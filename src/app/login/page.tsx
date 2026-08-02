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
      eyebrow="Acceso autorizado"
      title="Continúa tu ascenso"
      description="Ingresa a tu sistema personal y retoma el progreso de esta semana."
      footer={
        <>
          ¿Aún no tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-cyan hover:underline">
            Crear cuenta
          </Link>
        </>
      }
    >
      {params.status === "configuration" && (
        <div className="mb-5 border border-warning/25 bg-warning/[0.06] px-4 py-3 text-sm text-[#ff9acb]">
          La conexión con Supabase debe configurarse antes de iniciar sesión.
        </div>
      )}
      <AuthForm mode="login" next={params.next} />
    </AuthShell>
  );
}
