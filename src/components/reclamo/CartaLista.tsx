"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Footer, Header } from "@/components/ui/Header";
import { registrar } from "@/lib/eventos";
import { generarCarta } from "@/lib/reclamo/generar";
import { useReclamo } from "@/lib/reclamo/ReclamoProvider";
import { primerPasoIncompleto } from "@/lib/reclamo/validar";
import { EmpezarDeNuevo } from "./EmpezarDeNuevo";
import { LetterPreview } from "./LetterPreview";

export function CartaLista() {
  const { reclamo, listo } = useReclamo();
  const [copiado, setCopiado] = useState(false);

  if (!listo) return <Header />;

  const pendiente = primerPasoIncompleto(reclamo);
  if (pendiente) {
    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 py-12">
          <h1 className="text-2xl font-bold">Todavía falta completar tu carta</h1>
          <p className="text-muted">Te llevamos al paso que quedó pendiente.</p>
          <ButtonLink href={`/reclamo?paso=${pendiente}`} tamano="lg">
            Seguir con mi carta
          </ButtonLink>
        </main>
      </>
    );
  }

  const carta = generarCarta(reclamo);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(carta.cuerpo);
      setCopiado(true);
      registrar("carta_copiada");
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.alert("No pudimos copiar el texto. Seleccionalo y copialo a mano.");
    }
  };

  const descargar = () => {
    const contenido = [
      "REMITENTE",
      carta.remitente,
      "",
      "DESTINATARIO",
      carta.destinatario,
      "",
      "TEXTO",
      carta.cuerpo,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([contenido], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "carta-documento.txt";
    a.click();
    URL.revokeObjectURL(url);
    registrar("carta_descargada");
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
        <section className="no-print flex flex-col gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
            <svg viewBox="0 0 20 20" className="size-6" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
            </svg>
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Tu carta está lista</h1>
          <p className="text-muted">
            Copiá el texto para pegarlo en el formulario del Correo, o descargalo para tenerlo a mano.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button tamano="lg" onClick={copiar}>
              {copiado ? "¡Copiado!" : "Copiar el texto"}
            </Button>
            <Button tamano="lg" variante="secondary" onClick={descargar}>
              Descargar
            </Button>
            <Button tamano="lg" variante="ghost" onClick={() => window.print()}>
              Imprimir
            </Button>
          </div>
        </section>

        <LetterPreview carta={carta} />

        <section className="no-print flex flex-col gap-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Opcional</p>
          <h2 className="text-xl font-bold">¿Querés que un abogado la revise antes de enviarla?</h2>
          <p className="text-muted">
            Un profesional lee tu carta, te marca si falta algo importante y te la devuelve corregida.
          </p>
          <div>
            <ButtonLink
              href="/derivacion?motivo=revision"
              variante="secondary"
              onClick={() => registrar("interes_revision")}
            >
              Quiero una revisión
            </ButtonLink>
          </div>
        </section>

        <section className="no-print flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Cómo enviarla</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
              <h3 className="font-bold">Online, desde tu casa</h3>
              <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted">
                <li>Entrá al sistema de envíos online del Correo Argentino (SIE) y creá tu cuenta.</li>
                <li>Validá tu identidad: te pide tu DNI y una foto desde el celular.</li>
                <li>Completá tus datos y los del destinatario.</li>
                <li>Pegá el texto de tu carta y pagá online.</li>
              </ol>
              <a
                href="https://www.correoargentino.com.ar/cartas-documento-y-telegramas-online"
                target="_blank"
                rel="noreferrer"
                className="mt-auto text-sm font-semibold text-primary underline underline-offset-2"
              >
                Ir al Correo Argentino ↗
              </a>
            </div>
            <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
              <h3 className="font-bold">En una sucursal</h3>
              <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted">
                <li>Descargá o imprimí tu carta.</li>
                <li>Andá a una sucursal del Correo con tu DNI.</li>
                <li>Pedí el formulario de carta documento y pasá el texto.</li>
                <li>Guardá tu copia: es la prueba de que reclamaste.</li>
              </ol>
            </div>
          </div>
          <Callout tono="info">
            El precio lo fija el Correo y puede cambiar. La carta suele llegar en 1 a 3 días hábiles.
          </Callout>
        </section>

        <section className="no-print flex flex-col items-start gap-4 rounded-card bg-primary p-6 text-white">
          <h2 className="text-2xl font-bold tracking-tight">¿Y si no te responden?</h2>
          <p className="text-white/85">
            Te contamos qué podés hacer después y te avisamos cuando se vence el plazo.
          </p>
          <ButtonLink href="/reclamo/despues" variante="secondary" tamano="lg">
            Ver los próximos pasos
          </ButtonLink>
        </section>

        <div className="no-print -mt-4">
          <EmpezarDeNuevo texto="Borrar mis datos de este dispositivo" destino="/" />
        </div>
      </main>
      <Footer />
    </>
  );
}
