"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useReclamo } from "@/lib/reclamo/ReclamoProvider";

/** Borra el borrador guardado en el dispositivo. Importa en computadoras compartidas. */
export function EmpezarDeNuevo({ texto = "Empezar de nuevo", destino = "/reclamo?paso=tipo" }: { texto?: string; destino?: string }) {
  const router = useRouter();
  const { reiniciar } = useReclamo();

  const borrar = () => {
    const ok = window.confirm(
      "¿Querés borrar tu carta? Se eliminan todos los datos guardados en este dispositivo.",
    );
    if (!ok) return;
    reiniciar();
    router.push(destino);
  };

  return (
    <Button variante="ghost" onClick={borrar}>
      {texto}
    </Button>
  );
}
