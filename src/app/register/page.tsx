import Link from "next/link";
import { AuthForm } from "@/modules/auth/auth-form";
import { AuthShell } from "@/modules/auth/auth-shell";

export const metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Vínculo inicial"
      title="Activa tu sistema"
      description="Crea tu cuenta y establece el punto de inicio de tu ascenso."
      footer={
        <>
          ¿El Sistema ya te reconoce?{" "}
          <Link href="/login" className="font-semibold text-cyan hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
