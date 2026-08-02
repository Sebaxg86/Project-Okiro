import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="app-grid min-h-screen px-5 py-16">
      <article className="panel system-frame mx-auto max-w-3xl p-7 sm:p-10">
        <p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Documento preliminar</p>
        <h1 className="mt-3 text-3xl font-semibold uppercase">Aviso de privacidad</h1>
        <p className="mt-6 leading-7 text-muted">Los datos de cada usuario serán privados y estarán aislados mediante políticas de acceso en Supabase. Este aviso deberá completarse y revisarse legalmente antes del lanzamiento público.</p>
        <Link href="/register" className="mt-8 inline-block font-semibold text-cyan hover:underline">Volver al registro</Link>
      </article>
    </main>
  );
}
