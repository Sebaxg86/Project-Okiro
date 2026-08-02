import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="app-grid min-h-screen px-5 py-16">
      <article className="panel system-frame mx-auto max-w-3xl p-7 sm:p-10">
        <p className="font-display text-[10px] uppercase tracking-[0.22em] text-cyan">Documento preliminar</p>
        <h1 className="mt-3 text-3xl font-semibold uppercase">Términos de uso</h1>
        <p className="mt-6 leading-7 text-muted">Okiro se encuentra en desarrollo. Estos términos deberán revisarse legalmente antes del lanzamiento público. La aplicación ofrece seguimiento personal y no sustituye asesoría médica, nutricional o profesional.</p>
        <Link href="/register" className="mt-8 inline-block font-semibold text-cyan hover:underline">Volver al registro</Link>
      </article>
    </main>
  );
}
