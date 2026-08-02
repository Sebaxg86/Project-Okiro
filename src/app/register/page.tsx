import Link from "next/link";
import { AuthForm } from "@/modules/auth/auth-form";
import { AuthShell } from "@/modules/auth/auth-shell";

export const metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Nuevo vínculo"
      title="Inicia tu progreso"
      description="Crea una cuenta privada. Tu nivel histórico quedará protegido desde el primer ciclo."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
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
