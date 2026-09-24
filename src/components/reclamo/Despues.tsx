"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { TextField } from "@/components/ui/Field";
import { Footer, Header } from "@/components/ui/Header";
import { registrar } from "@/lib/eventos";
import { plazoPorId } from "@/lib/reclamo/catalogo";
import { fechaLarga, sumarDiasHabiles } from "@/lib/reclamo/formato";
import { useReclamo } from "@/lib/reclamo/ReclamoProvider";

/** Días hábiles que el Correo suele tardar en entregar (1 a 3). */
const DIAS_ENTREGA = 3;

export function Despues() {
  const { reclamo, listo } = useReclamo();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  if (!listo) return <Header />;

  const plazo = plazoPorId(reclamo.pedido.plazo);
  const vence = sumarDiasHabiles(new Date(), DIAS_ENTREGA + plazo.diasHabiles);
  const esConsumo = reclamo.tipo === "consumo";

  const pedirRecordatorio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Revisá tu email: parece que falta algo.");
      return;
    }
    setError("");
    registrar("recordatorio_pedido", { plazo: plazo.id });
    setEnviado(true);
  };

  const pasos = [
    { titulo: "Hoy: enviás la carta", texto: "Guardá el comprobante y tu copia. Son la prueba de que reclamaste." },
    { titulo: "En 1 a 3 días hábiles: llega", texto: "El Correo te informa cuándo se entregó." },
    {
      titulo: `Tiene ${plazo.titulo} para responder`,
      texto: `Si la enviás hoy, el plazo vence aproximadamente el ${fechaLarga(vence)}.`,
    },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">¿Y después?</h1>
          <p className="text-muted">
            La carta es el primer paso. Esto es lo que pasa a partir de ahora y qué podés hacer si no te
            responden.
          </p>
        </section>

        <ol className="flex flex-col">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="relative flex gap-4 pb-8 last:pb-0">
              {i < pasos.length - 1 && <span aria-hidden className="absolute top-9 left-[17px] h-[calc(100%-2.5rem)] w-0.5 bg-line" />}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1 pt-1.5">
                <p className="font-semibold">{p.titulo}</p>
                <p className="text-sm text-muted">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
          <h2 className="text-xl font-bold">Te avisamos cuando se venza el plazo</h2>
          {enviado ? (
            <Callout tono="success" titulo="¡Gracias por tu interés!">
              Los recordatorios todavía están en prueba y por ahora no enviamos emails. Tu interés nos
              ayuda a decidir si lo sumamos. Mientras tanto, agendá la fecha:{" "}
              <strong>{fechaLarga(vence)}</strong>.
            </Callout>
          ) : (
            <form onSubmit={pedirRecordatorio} noValidate className="flex flex-col gap-4">
              <p className="text-sm text-muted">
                Si no te responden, ese es el momento de dar el siguiente paso. Te escribimos para que
                no se te pase.
              </p>
              <TextField
                label="Tu email"
                type="email"
                autoComplete="email"
                value={email}
                error={error}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <Button type="submit">Avisame</Button>
              </div>
            </form>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Si no te responden</h2>
          <div className={`grid gap-4 ${esConsumo ? "sm:grid-cols-2" : ""}`}>
            {esConsumo && (
              <div className="flex flex-col gap-2 rounded-card border border-line bg-surface p-5">
                <h3 className="font-bold">Denuncia en Defensa del Consumidor</h3>
                <p className="text-sm text-muted">
                  Es gratuita y no necesitás abogado. Se hace en la oficina de Defensa del Consumidor de
                  tu municipio o provincia. Llevá tu carta y el comprobante de envío.
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
              <h3 className="font-bold">Hablar con un abogado</h3>
              <p className="text-sm text-muted">
                En muchas provincias, antes de un juicio hay una mediación obligatoria, y para eso
                necesitás un abogado. Podemos ponerte en contacto con uno.
              </p>
              <div className="mt-auto">
                <ButtonLink
                  href="/derivacion?motivo=sin-respuesta"
                  variante="secondary"
                  onClick={() => registrar("interes_abogado", { motivo: "sin-respuesta" })}
                >
                  Quiero que me contacte un abogado
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
