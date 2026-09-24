import { consecuenciasPara, pedidoPorId } from "./catalogo";
import { parsearMonto } from "./formato";
import type { Persona, Reclamo } from "./tipos";

export type Errores = Record<string, string>;

export const PASOS = [
  "tipo",
  "hechos",
  "destinatario",
  "pedido",
  "consecuencias",
  "remitente",
] as const;

export type Paso = (typeof PASOS)[number];

function persona(p: Persona, prefijo: string, conDocumento: boolean): Errores {
  const e: Errores = {};
  if (!p.nombre.trim()) e[`${prefijo}.nombre`] = "Falta el nombre.";
  if (conDocumento && !/^\d{7,8}$/.test(p.documento.replace(/\D/g, "")))
    e[`${prefijo}.documento`] = "Escribí tu DNI, solo números (7 u 8 dígitos).";
  if (!p.domicilio.trim()) e[`${prefijo}.domicilio`] = "Falta la dirección.";
  if (!p.localidad.trim()) e[`${prefijo}.localidad`] = "Falta la localidad.";
  return e;
}

export function validarPaso(paso: Paso, r: Reclamo): Errores {
  switch (paso) {
    case "tipo":
      return r.tipo ? {} : { tipo: "Elegí el tipo de reclamo." };
    case "hechos": {
      const e: Errores = {};
      if (r.hechos.descripcion.trim().length < 20)
        e["hechos.descripcion"] = "Contanos un poco más: qué pasó, cuándo y con quién.";
      if (r.hechos.fecha && r.hechos.fecha > hoyISO())
        e["hechos.fecha"] = "La fecha no puede ser futura.";
      return e;
    }
    case "destinatario":
      return persona(r.destinatario, "destinatario", false);
    case "pedido": {
      const e: Errores = {};
      const pedido = pedidoPorId(r.tipo, r.pedido.id);
      if (!pedido) e["pedido.id"] = "Elegí qué le pedís.";
      if (pedido?.pideMonto && !parsearMonto(r.pedido.monto))
        e["pedido.monto"] = "Escribí el monto, por ejemplo 450.000.";
      if (pedido?.pideDetalle && r.pedido.detalle.trim().length < 10)
        e["pedido.detalle"] = "Escribí qué le pedís, en una frase.";
      return e;
    }
    case "consecuencias": {
      const validas = consecuenciasPara(r.tipo).map((c) => c.id);
      return r.consecuencias.some((c) => validas.includes(c))
        ? {}
        : { consecuencias: "Elegí al menos una opción." };
    }
    case "remitente":
      return persona(r.remitente, "remitente", true);
  }
}

export function validarTodo(r: Reclamo): Errores {
  return Object.assign({}, ...PASOS.map((p) => validarPaso(p, r)));
}

/** Primer paso con datos incompletos, o null si está todo bien. */
export function primerPasoIncompleto(r: Reclamo): Paso | null {
  return PASOS.find((p) => Object.keys(validarPaso(p, r)).length > 0) ?? null;
}

function hoyISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
