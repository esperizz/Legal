"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { borrarEventos, leerEventos, type Evento, type NombreEvento } from "@/lib/eventos";

const EMBUDO: { nombre: string; cuenta: (e: Evento[]) => number }[] = [
  { nombre: "Empezaron un reclamo", cuenta: (e) => contar(e, "reclamo_iniciado") },
  { nombre: "Llegaron a la carta lista", cuenta: (e) => contar(e, "carta_lista") },
  {
    nombre: "Copiaron o descargaron la carta",
    cuenta: (e) => contar(e, "carta_copiada") + contar(e, "carta_descargada"),
  },
];

const PRUEBAS: { nombre: string; hipotesis: string; evento: NombreEvento }[] = [
  { nombre: "Pidieron revisión por abogado", hipotesis: "Negocio", evento: "interes_revision" },
  { nombre: "Pidieron contacto con un abogado", hipotesis: "H3 · Negocio", evento: "interes_abogado" },
  { nombre: "Pidieron el recordatorio del plazo", hipotesis: "H2 · Retención", evento: "recordatorio_pedido" },
  { nombre: "Derivados al telegrama laboral", hipotesis: "Alcance", evento: "derivacion_laboral" },
];

function contar(eventos: Evento[], nombre: NombreEvento) {
  return eventos.filter((e) => e.nombre === nombre).length;
}

function porcentaje(parte: number, total: number) {
  return total ? `${Math.round((parte / total) * 100)}%` : "–";
}

export function Metricas() {
  const [eventos, setEventos] = useState<Evento[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leer localStorage al montar
    setEventos(leerEventos());
  }, []);

  if (!eventos) return null;
  const iniciados = contar(eventos, "reclamo_iniciado");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Métricas del MVP</h1>
        <p className="text-muted">
          El embudo de la acción principal y las pruebas de interés que validan el negocio.
        </p>
      </div>

      <Callout tono="warning">
        Estos datos son solo de este navegador. En producción se reemplaza por una herramienta de
        analítica, con los mismos eventos.
      </Callout>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Embudo · H1 (valor y usabilidad)</h2>
        <p className="text-sm text-muted">Meta inicial: más del 60% de quienes empiezan llegan a la carta lista.</p>
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          {EMBUDO.map((paso) => {
            const n = paso.cuenta(eventos);
            return (
              <div key={paso.nombre} className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0">
                <span>{paso.nombre}</span>
                <span className="font-mono text-sm">
                  {n} <span className="text-muted">({porcentaje(n, iniciados)})</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Pruebas de interés</h2>
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          {PRUEBAS.map((p) => (
            <div key={p.evento} className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0">
              <span className="flex flex-col">
                <span>{p.nombre}</span>
                <span className="text-xs text-muted">{p.hipotesis}</span>
              </span>
              <span className="font-mono text-sm">{contar(eventos, p.evento)}</span>
            </div>
          ))}
        </div>
      </section>

      <div>
        <Button
          variante="secondary"
          onClick={() => {
            borrarEventos();
            setEventos([]);
          }}
        >
          Borrar datos de prueba
        </Button>
      </div>
    </main>
  );
}
