export type TipoReclamo = "deuda" | "consumo" | "alquiler";

export type PlazoId = "48h" | "5d" | "10d";

export interface Persona {
  nombre: string;
  documento: string;
  domicilio: string;
  localidad: string;
}

export interface Reclamo {
  tipo: TipoReclamo | null;
  hechos: { fecha: string; descripcion: string };
  destinatario: Persona;
  pedido: { id: string; monto: string; detalle: string; plazo: PlazoId };
  consecuencias: string[];
  remitente: Persona;
}

const personaVacia = (): Persona => ({
  nombre: "",
  documento: "",
  domicilio: "",
  localidad: "",
});

export const reclamoVacio = (): Reclamo => ({
  tipo: null,
  hechos: { fecha: "", descripcion: "" },
  destinatario: personaVacia(),
  pedido: { id: "", monto: "", detalle: "", plazo: "10d" },
  consecuencias: ["judicial"],
  remitente: personaVacia(),
});
