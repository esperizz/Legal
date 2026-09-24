"use client";

import { useState } from "react";
import { LetterPreview } from "@/components/reclamo/LetterPreview";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { OptionCard } from "@/components/ui/OptionCard";
import { Progress } from "@/components/ui/Progress";
import { RECLAMO_EJEMPLO } from "@/lib/reclamo/ejemplo";
import { generarCarta } from "@/lib/reclamo/generar";
import { reclamoVacio } from "@/lib/reclamo/tipos";

const COLORES: { grupo: string; tokens: { nombre: string; clase: string; uso: string }[] }[] = [
  {
    grupo: "Marca",
    tokens: [
      { nombre: "primary", clase: "bg-primary", uso: "Acciones principales, foco, progreso" },
      { nombre: "primary-hover", clase: "bg-primary-hover", uso: "Hover de acciones principales" },
      { nombre: "primary-soft", clase: "bg-primary-soft", uso: "Selección, fondos informativos" },
    ],
  },
  {
    grupo: "Texto",
    tokens: [
      { nombre: "ink", clase: "bg-ink", uso: "Texto principal" },
      { nombre: "muted", clase: "bg-muted", uso: "Texto secundario y ayudas" },
      { nombre: "subtle", clase: "bg-subtle", uso: "Placeholders, etiquetas menores" },
    ],
  },
  {
    grupo: "Superficies",
    tokens: [
      { nombre: "canvas", clase: "bg-canvas", uso: "Fondo de la app" },
      { nombre: "surface", clase: "bg-surface", uso: "Tarjetas y campos" },
      { nombre: "paper", clase: "bg-paper", uso: "La carta" },
      { nombre: "line", clase: "bg-line", uso: "Bordes suaves" },
      { nombre: "line-strong", clase: "bg-line-strong", uso: "Bordes de campos" },
    ],
  },
  {
    grupo: "Estados",
    tokens: [
      { nombre: "success", clase: "bg-success", uso: "Confirmaciones" },
      { nombre: "warning", clase: "bg-warning", uso: "Advertencias" },
      { nombre: "danger", clase: "bg-danger", uso: "Errores de validación" },
      { nombre: "marker", clase: "bg-marker", uso: "Datos faltantes en la carta" },
    ],
  },
];

const TIPOGRAFIA = [
  { nombre: "Display", clase: "text-5xl font-bold tracking-tight", muestra: "Reclamá lo tuyo" },
  { nombre: "Título 1", clase: "text-3xl font-bold tracking-tight", muestra: "¿Qué pasó?" },
  { nombre: "Título 2", clase: "text-xl font-bold", muestra: "Cómo enviarla" },
  { nombre: "Cuerpo", clase: "text-base", muestra: "Contalo con tus palabras, en 2 o 3 frases." },
  { nombre: "Ayuda", clase: "text-sm text-muted", muestra: "Solo números, sin puntos." },
  { nombre: "Carta (serif)", clase: "font-serif text-[15px]", muestra: "Por la presente, INTIMO a Ud. para que…" },
];

function Seccion({ titulo, descripcion, children }: { titulo: string; descripcion?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-t border-line pt-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">{titulo}</h2>
        {descripcion && <p className="max-w-2xl text-muted">{descripcion}</p>}
      </div>
      {children}
    </section>
  );
}

export function DesignSystem() {
  const [opcion, setOpcion] = useState("a");
  const [checks, setChecks] = useState<string[]>(["x"]);
  const toggle = (id: string) => setChecks((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight">Design system</h1>
        <p className="max-w-2xl text-lg text-muted">
          Los tokens y componentes de Reclamá. Pensado para una persona estresada, desde el celular: alto
          contraste, controles grandes y lenguaje claro. La carta usa una tipografía serif para
          diferenciar &quot;lo que escribís vos&quot; de &quot;el documento formal&quot;.
        </p>
      </div>

      <Seccion titulo="Color" descripcion="Cada color es un token con un uso definido. En código: bg-primary, text-muted, border-line, etc.">
        <div className="grid gap-8">
          {COLORES.map((g) => (
            <div key={g.grupo} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{g.grupo}</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {g.tokens.map((t) => (
                  <div key={t.nombre} className="flex flex-col gap-2">
                    <div className={`h-16 rounded-card border border-line ${t.clase}`} />
                    <p className="font-mono text-sm font-semibold">{t.nombre}</p>
                    <p className="text-xs text-muted">{t.uso}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Tipografía" descripcion="Inter para la interfaz y Source Serif 4 para la carta.">
        <div className="flex flex-col gap-5">
          {TIPOGRAFIA.map((t) => (
            <div key={t.nombre} className="grid gap-1 sm:grid-cols-[160px_1fr] sm:items-baseline">
              <p className="font-mono text-sm text-muted">{t.nombre}</p>
              <p className={t.clase}>{t.muestra}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Botones" descripcion="Una sola acción principal por pantalla. Altura mínima de 44 px para tocar cómodo en el celular.">
        <div className="flex flex-wrap items-center gap-3">
          <Button tamano="lg">Principal</Button>
          <Button tamano="lg" variante="secondary">Secundario</Button>
          <Button tamano="lg" variante="ghost">Terciario</Button>
          <Button tamano="lg" disabled>Deshabilitado</Button>
        </div>
      </Seccion>

      <Seccion titulo="Campos" descripcion="Etiqueta siempre visible, ayuda en lenguaje claro y error que dice cómo corregirlo.">
        <div className="grid max-w-xl gap-5">
          <TextField label="Tu nombre y apellido" placeholder="Lucía Gómez" />
          <TextField label="Tu DNI" ayuda="Solo números, sin puntos." defaultValue="12" error="Escribí tu DNI, solo números (7 u 8 dígitos)." />
          <TextField label="¿Cuándo pasó?" opcional type="date" />
          <TextAreaField label="Qué pasó" ayuda="Qué, cuándo y cuánto." placeholder="Por ejemplo: entregué el departamento y no me devolvieron el depósito." />
        </div>
      </Seccion>

      <Seccion titulo="Opciones" descripcion="Tarjetas grandes en lugar de listas desplegables: todas las opciones a la vista y fáciles de tocar.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">Una opción (radio)</p>
            <OptionCard name="ds" titulo="Me deben plata" descripcion="Un préstamo, un trabajo que no te pagaron." seleccionada={opcion === "a"} onSelect={() => setOpcion("a")} />
            <OptionCard name="ds" titulo="Tengo un problema con un alquiler" seleccionada={opcion === "b"} onSelect={() => setOpcion("b")} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">Varias opciones (checkbox)</p>
            <OptionCard tipo="checkbox" titulo="Hacerle juicio" descripcion="Avisás que vas a ir a la Justicia." seleccionada={checks.includes("x")} onSelect={() => toggle("x")} />
            <OptionCard tipo="checkbox" titulo="Reclamar además los daños" seleccionada={checks.includes("y")} onSelect={() => toggle("y")} />
          </div>
        </div>
      </Seccion>

      <Seccion titulo="Progreso y mensajes">
        <div className="grid max-w-xl gap-5">
          <Progress actual={3} total={6} />
          <Callout titulo="Antes de seguir">Revisá que los nombres y las direcciones estén bien escritos.</Callout>
          <Callout tono="success" titulo="¡Gracias!">Registramos tu interés.</Callout>
          <Callout tono="warning" titulo="Tu carta es bastante larga">Probá acortar el relato.</Callout>
        </div>
      </Seccion>

      <Seccion
        titulo="Vista previa de la carta"
        descripcion="El componente central del producto. Los datos que faltan aparecen resaltados, para que el usuario vea qué le queda por completar."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-muted">Incompleta</p>
            <LetterPreview carta={generarCarta({ ...reclamoVacio(), tipo: "alquiler" }, new Date(2026, 8, 24))} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-muted">Completa</p>
            <LetterPreview carta={generarCarta(RECLAMO_EJEMPLO, new Date(2026, 8, 24))} />
          </div>
        </div>
      </Seccion>
    </main>
  );
}
