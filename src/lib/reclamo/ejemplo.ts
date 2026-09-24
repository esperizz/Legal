import type { Reclamo } from "./tipos";

/** Caso de Lucía (proto-persona): se usa en la landing y en el design system. */
export const RECLAMO_EJEMPLO: Reclamo = {
  tipo: "alquiler",
  hechos: {
    fecha: "2026-08-01",
    descripcion:
      "entregué el departamento en buen estado al terminar el contrato y hasta hoy no me devolvieron el depósito",
  },
  destinatario: { nombre: "Carlos Pérez", documento: "", domicilio: "Av. Corrientes 1234, 5° B", localidad: "CABA" },
  pedido: { id: "deposito", monto: "450.000", detalle: "", plazo: "10d" },
  consecuencias: ["judicial"],
  remitente: { nombre: "Lucía Gómez", documento: "35123456", domicilio: "Thames 500, 2° A", localidad: "CABA" },
};
