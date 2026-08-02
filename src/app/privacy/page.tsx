import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="app-grid min-h-screen px-5 py-16">
      <article className="panel system-frame mx-auto max-w-3xl p-7 sm:p-10">
        <p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Documento en revisión</p>
        <h1 className="mt-3 text-3xl font-semibold uppercase">Aviso de privacidad</h1>
        <div className="mt-6 space-y-4 leading-7 text-muted">
          <p>Okiro almacena los datos necesarios para operar tu cuenta: correo, nombre completo, nombre preferido y, cuando decides proporcionarlos, cumpleaños, objetivos y mediciones de peso.</p>
          <p>El cumpleaños y el peso son opcionales y privados. Se utilizan exclusivamente para tu seguimiento personal; no producen recompensas, penalizaciones ni comparaciones públicas.</p>
          <p>Cada cuenta solo puede consultar y modificar su propia información. Este aviso se encuentra en revisión y deberá completarse legalmente antes del lanzamiento público.</p>
        </div>
        <Link href="/register" className="mt-8 inline-block font-semibold text-cyan hover:underline">Volver al registro</Link>
      </article>
    </main>
  );
}
