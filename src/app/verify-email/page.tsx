import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/modules/auth/auth-shell";

export const metadata = {
  title: "Confirma tu correo",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthShell
      eyebrow="Verificación requerida"
      title="Revisa tu correo"
      description="Enviamos un vínculo para confirmar tu identidad y activar tu cuenta."
      footer={
        <Link href="/login" className="font-semibold text-cyan hover:underline">
          Volver al inicio de sesión
        </Link>
      }
    >
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center border border-cyan/35 bg-cyan/[0.08] text-cyan shadow-[0_0_28px_rgba(0,229,255,.12)] [clip-path:polygon(0_13px,13px_0,100%_0,100%_calc(100%-13px),calc(100%-13px)_100%,0_100%)]">
          <MailCheck size={28} aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm leading-6 text-muted">
          Abre el mensaje enviado{email ? <> a <strong className="text-foreground">{email}</strong></> : null} y selecciona el botón de confirmación.
        </p>
        <p className="mt-4 text-xs leading-5 text-muted/75">
          Si no aparece, revisa spam. Por seguridad, no podrás entrar al dashboard hasta confirmar el correo.
        </p>
      </div>
    </AuthShell>
  );
}
