"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Header } from "@/components/ui/Header";
import { Progress } from "@/components/ui/Progress";
import { registrar } from "@/lib/eventos";
import { generarCarta, type Carta } from "@/lib/reclamo/generar";
import { useReclamo } from "@/lib/reclamo/ReclamoProvider";
import { PASOS, primerPasoIncompleto, validarPaso, type Errores, type Paso } from "@/lib/reclamo/validar";
import { LetterPreview } from "./LetterPreview";
import { COMPONENTES, TEXTOS } from "./Pasos";

type Vista = Paso | "revision";

/** Por encima de este largo sugerimos acortar: un texto largo puede requerir más de un formulario. */
const LARGO_SUGERIDO = 1800;

export function Wizard() {
  const router = useRouter();
  const params = useSearchParams();
  const { reclamo, listo, actualizar } = useReclamo();
  const [errores, setErrores] = useState<Errores>({});
  const [verCarta, setVerCarta] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);

  const pedido = params.get("paso");
  const vista: Vista = pedido === "revision" || PASOS.includes(pedido as Paso) ? (pedido as Vista) : "tipo";
  const indice = vista === "revision" ? PASOS.length : PASOS.indexOf(vista);
  const carta = useMemo(() => generarCarta(reclamo), [reclamo]);

  // No dejar saltar a un paso posterior si falta completar uno anterior.
  useEffect(() => {
    if (!listo) return;
    const pendiente = primerPasoIncompleto(reclamo);
    if (pendiente && PASOS.indexOf(pendiente) < indice) {
      router.replace(`/reclamo?paso=${pendiente}`);
    }
    // Solo al cambiar de vista: mientras se completa un paso no hay que redirigir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista, listo]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    titulo.current?.focus();
  }, [vista]);

  const ir = (v: Vista) => {
    setErrores({});
    router.push(`/reclamo?paso=${v}`);
  };

  const continuar = (e: React.FormEvent) => {
    e.preventDefault();
    if (vista === "revision") return;
    const encontrados = validarPaso(vista, reclamo);
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;
    if (vista === "tipo") registrar("reclamo_iniciado", { tipo: reclamo.tipo ?? "" });
    registrar("paso_completado", { paso: vista });
    ir(indice + 1 < PASOS.length ? PASOS[indice + 1] : "revision");
  };

  const volver = () => (indice === 0 ? router.push("/") : ir(PASOS[indice - 1]));

  const confirmar = () => {
    registrar("carta_lista", { tipo: reclamo.tipo ?? "" });
    router.push("/reclamo/lista");
  };

  if (!listo) return <Header />;

  const Contenido = vista !== "revision" ? COMPONENTES[vista] : null;
  const textos =
    vista === "revision"
      ? {
          titulo: "Revisá tu carta",
          bajada: "Leela con calma. Si algo no está bien, podés volver a cualquier paso y corregirlo.",
        }
      : TEXTOS[vista];

  return (
    <>
      <Header>
        <span className="text-sm text-muted">Se guarda automáticamente</span>
      </Header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 pt-6 pb-32 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:pb-16">
        <section className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={volver}
              className="-ml-1 flex w-fit items-center gap-1 rounded-md px-1 text-sm font-medium text-muted hover:text-ink"
            >
              <span aria-hidden>←</span> Volver
            </button>
            <Progress actual={Math.min(indice + 1, PASOS.length)} total={PASOS.length} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 ref={titulo} tabIndex={-1} className="text-2xl font-bold tracking-tight outline-none sm:text-3xl">
              {textos.titulo}
            </h1>
            <p className="text-muted">{textos.bajada}</p>
          </div>

          {Contenido ? (
            <form id="paso" onSubmit={continuar} noValidate className="flex flex-col gap-8">
              <Contenido reclamo={reclamo} actualizar={actualizar} errores={errores} />
              <div className="hidden lg:block">
                <Button type="submit" tamano="lg">
                  {indice === PASOS.length - 1 ? "Ver mi carta completa" : "Continuar"}
                </Button>
              </div>
            </form>
          ) : (
            <Revision carta={carta} onEditar={ir} onConfirmar={confirmar} />
          )}
        </section>

        <aside className="hidden lg:block">
          <div className="flex flex-col gap-3 lg:sticky lg:top-6">
            {vista !== "revision" && (
              <p className="text-sm font-semibold text-muted">Tu carta se arma mientras respondés</p>
            )}
            <LetterPreview carta={carta} />
          </div>
        </aside>
      </main>

      {Contenido && (
        <div className="no-print fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl gap-3">
            {indice > 0 && (
              <Button variante="secondary" tamano="lg" className="shrink-0 whitespace-nowrap" onClick={() => setVerCarta(true)}>
                Ver mi carta
              </Button>
            )}
            <Button type="submit" form="paso" tamano="lg" bloque>
              {indice === PASOS.length - 1 ? "Ver mi carta completa" : "Continuar"}
            </Button>
          </div>
        </div>
      )}

      {verCarta && (
        <div className="fixed inset-0 z-20 flex flex-col justify-end bg-ink/40 lg:hidden" onClick={() => setVerCarta(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Vista previa de tu carta"
            className="max-h-[85vh] overflow-y-auto rounded-t-3xl bg-canvas p-4 shadow-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">Así va tu carta</p>
              <Button variante="ghost" onClick={() => setVerCarta(false)}>
                Cerrar
              </Button>
            </div>
            <LetterPreview carta={carta} />
          </div>
        </div>
      )}
    </>
  );
}

const SECCIONES: { paso: Paso; nombre: string }[] = [
  { paso: "hechos", nombre: "Qué pasó" },
  { paso: "destinatario", nombre: "A quién" },
  { paso: "pedido", nombre: "Qué pedís" },
  { paso: "consecuencias", nombre: "Si no cumple" },
  { paso: "remitente", nombre: "Tus datos" },
];

function Revision({
  carta,
  onEditar,
  onConfirmar,
}: {
  carta: Carta;
  onEditar: (p: Paso) => void;
  onConfirmar: () => void;
}) {
  const largo = carta.cuerpo.length;
  return (
    <div className="flex flex-col gap-6">
      <div className="lg:hidden">
        <LetterPreview carta={carta} />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">¿Querés cambiar algo?</p>
        <div className="flex flex-wrap gap-2">
          {SECCIONES.map((s) => (
            <Button key={s.paso} variante="secondary" onClick={() => onEditar(s.paso)}>
              Editar: {s.nombre}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted">
        Tu carta tiene <strong className="text-ink">{largo.toLocaleString("es-AR")} caracteres</strong>.
      </p>
      {largo > LARGO_SUGERIDO && (
        <Callout tono="warning" titulo="Tu carta es bastante larga">
          Si no entra en un formulario, el Correo te pide usar más de uno, y se paga cada uno. Probá
          acortar el relato de &quot;Qué pasó&quot;.
        </Callout>
      )}

      <Callout titulo="Antes de seguir">
        Revisá que los nombres y las direcciones estén bien escritos: si la dirección es incorrecta,
        la carta no llega. Reclamá te ayuda a redactar tu reclamo, pero <strong>no es asesoramiento legal</strong>.
      </Callout>

      <div>
        <Button tamano="lg" onClick={onConfirmar} className="w-full sm:w-auto">
          Mi carta está lista
        </Button>
      </div>
    </div>
  );
}
