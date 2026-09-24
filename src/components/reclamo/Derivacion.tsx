"use client";

import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { TextField } from "@/components/ui/Field";
import { registrar } from "@/lib/eventos";

export type Motivo = "laboral" | "complejo" | "revision" | "sin-respuesta";

const TEXTOS: Record<Motivo, { titulo: string; bajada: string; cta: string }> = {
  laboral: {
    titulo: "Para reclamos laborales hay un telegrama gratuito",
    bajada:
      "Si el reclamo es con tu empleador, podés enviar un telegrama laboral sin costo. Tiene reglas propias, por eso Reclamá todavía no lo cubre.",
    cta: "Quiero hablar con un abogado laboralista",
  },
  complejo: {
    titulo: "Tu caso merece la mirada de un profesional",
    bajada:
      "Reclamá sirve para reclamos simples de deudas, compras y alquileres. Para otros casos, lo mejor es que te asesore un abogado.",
    cta: "Quiero que me contacte un abogado",
  },
  revision: {
    titulo: "Revisión de tu carta por un abogado",
    bajada:
      "Un profesional lee tu carta antes de que la envíes, te marca si falta algo importante y te la devuelve corregida.",
    cta: "Quiero la revisión",
  },
  "sin-respuesta": {
    titulo: "Te ponemos en contacto con un abogado",
    bajada:
      "Si no te respondieron, un abogado puede evaluar tu caso y acompañarte en la mediación o el juicio.",
    cta: "Quiero que me contacte",
  },
};

export function Derivacion({ motivo }: { motivo: Motivo }) {
  const textos = TEXTOS[motivo];
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [errores, setErrores] = useState<{ nombre?: string; email?: string }>({});
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (motivo === "laboral") registrar("derivacion_laboral");
  }, [motivo]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevos = {
      nombre: nombre.trim() ? undefined : "Falta tu nombre.",
      email: /^\S+@\S+\.\S+$/.test(email) ? undefined : "Revisá tu email: parece que falta algo.",
    };
    setErrores(nuevos);
    if (nuevos.nombre || nuevos.email) return;
    registrar("interes_abogado", { motivo });
    setEnviado(true);
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{textos.titulo}</h1>
        <p className="text-muted">{textos.bajada}</p>
        {motivo === "laboral" && (
          <a
            href="https://www.argentina.gob.ar/trabajo/telegrama"
            target="_blank"
            rel="noreferrer"
            className="w-fit font-semibold text-primary underline underline-offset-2"
          >
            Cómo enviar el telegrama laboral gratuito ↗
          </a>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        {enviado ? (
          <Callout tono="success" titulo="¡Gracias! Registramos tu interés">
            Estamos armando nuestra red de abogados y todavía no podemos conectarte. Tu respuesta nos
            ayuda a saber cuánta gente lo necesita. No guardamos tus datos.
          </Callout>
        ) : (
          <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
            <h2 className="text-xl font-bold">{textos.cta}</h2>
            <TextField
              label="Tu nombre"
              autoComplete="name"
              value={nombre}
              error={errores.nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
              label="Tu email"
              type="email"
              autoComplete="email"
              value={email}
              error={errores.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <Button type="submit" tamano="lg">
                Enviar
              </Button>
            </div>
          </form>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        {motivo === "revision" || motivo === "sin-respuesta" ? (
          <ButtonLink href="/reclamo/lista" variante="ghost">
            ← Volver a mi carta
          </ButtonLink>
        ) : (
          <ButtonLink href="/reclamo?paso=tipo" variante="ghost">
            ← Elegir otro tipo de reclamo
          </ButtonLink>
        )}
      </div>
    </main>
  );
}
