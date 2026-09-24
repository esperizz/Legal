"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { reclamoVacio, type Reclamo } from "./tipos";

const CLAVE = "reclamo-borrador";

interface Contexto {
  reclamo: Reclamo;
  /** false hasta leer el borrador guardado, para no pisarlo. */
  listo: boolean;
  actualizar: (cambio: (r: Reclamo) => Reclamo) => void;
  reiniciar: () => void;
}

const ReclamoContext = createContext<Contexto | null>(null);

export function ReclamoProvider({ children }: { children: React.ReactNode }) {
  const [reclamo, setReclamo] = useState<Reclamo>(reclamoVacio);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratar desde localStorage
      if (guardado) setReclamo({ ...reclamoVacio(), ...JSON.parse(guardado) });
    } catch {
      // Sin almacenamiento disponible: se arranca de cero.
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(reclamo));
    } catch {
      // Ignorado: el borrador es una comodidad, no un requisito.
    }
  }, [reclamo, listo]);

  const actualizar = useCallback((cambio: (r: Reclamo) => Reclamo) => setReclamo(cambio), []);
  const reiniciar = useCallback(() => setReclamo(reclamoVacio()), []);

  return (
    <ReclamoContext.Provider value={{ reclamo, listo, actualizar, reiniciar }}>
      {children}
    </ReclamoContext.Provider>
  );
}

export function useReclamo() {
  const ctx = useContext(ReclamoContext);
  if (!ctx) throw new Error("useReclamo debe usarse dentro de <ReclamoProvider>");
  return ctx;
}
