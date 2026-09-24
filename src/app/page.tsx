import Link from "next/link";
import { LetterPreview } from "@/components/reclamo/LetterPreview";
import { ButtonLink } from "@/components/ui/Button";
import { Footer, Header } from "@/components/ui/Header";
import { TIPOS } from "@/lib/reclamo/catalogo";
import { RECLAMO_EJEMPLO } from "@/lib/reclamo/ejemplo";
import { generarCarta } from "@/lib/reclamo/generar";

const PASOS = [
  {
    titulo: "Contás qué pasó",
    texto: "Con tus palabras, respondiendo preguntas simples. Sin términos legales.",
  },
  {
    titulo: "Ves tu carta armarse",
    texto: "Mientras respondés, el texto se escribe en el formato formal que necesita el reclamo.",
  },
  {
    titulo: "La enviás y te guiamos",
    texto: "Te explicamos cómo mandarla por el Correo y qué hacer si no te responden.",
  },
];

export default function Home() {
  const ejemplo = generarCarta(RECLAMO_EJEMPLO, new Date(2026, 8, 24));

  return (
    <>
      <Header>
        <ButtonLink href="/reclamo" variante="ghost">
          Empezar
        </ButtonLink>
      </Header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="flex flex-col items-start gap-6">
            <p className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
              Carta documento en lenguaje claro
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Reclamá lo que te corresponde, paso a paso
            </h1>
            <p className="max-w-xl text-lg text-muted">
              Respondé 6 preguntas simples y obtené el texto de tu carta documento listo para enviar.
              Sin saber de leyes, en unos 5 minutos.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto">
              <ButtonLink href="/reclamo" tamano="lg">
                Empezar mi reclamo
              </ButtonLink>
              <p className="text-sm text-muted">Gratis · Sin registrarte · Tus datos quedan en tu dispositivo</p>
            </div>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute -inset-4 -rotate-2 rounded-3xl bg-primary-soft" />
            <div className="relative">
              <LetterPreview carta={ejemplo} />
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Cómo funciona</h2>
            <ol className="grid gap-6 sm:grid-cols-3">
              {PASOS.map((p, i) => (
                <li key={p.titulo} className="flex flex-col gap-2">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-bold">{p.titulo}</h3>
                  <p className="text-muted">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">¿Qué podés reclamar?</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TIPOS.map((t) => (
              <div key={t.id} className="flex flex-col gap-2 rounded-card border border-line bg-surface p-5">
                <h3 className="font-bold">{t.titulo}</h3>
                <p className="text-sm text-muted">{t.descripcion}</p>
              </div>
            ))}
          </div>
          <p className="text-muted">
            ¿Es un reclamo laboral?{" "}
            <Link href="/derivacion?motivo=laboral" className="font-semibold text-primary underline underline-offset-2">
              Mirá cómo enviar un telegrama gratuito
            </Link>
          </p>
          <div>
            <ButtonLink href="/reclamo" tamano="lg">
              Empezar mi reclamo
            </ButtonLink>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
