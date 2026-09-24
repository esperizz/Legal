import {
  consecuenciasPara,
  pedidoPorId,
  plazoPorId,
  tipoPorId,
} from "./catalogo";
import { enumerar, fechaLarga, formatearPesos, oracion, parsearMonto } from "./formato";
import type { Persona, Reclamo } from "./tipos";

export interface Carta {
  remitente: string;
  destinatario: string;
  /** Texto de la carta, listo para pegar en el formulario del Correo. */
  cuerpo: string;
}

/**
 * Arma la carta a partir de las respuestas. Los datos que faltan se muestran
 * como marcadores entre corchetes, para que la vista previa funcione desde el
 * primer paso.
 */
export function generarCarta(r: Reclamo, hoy: Date = new Date()): Carta {
  const tipo = tipoPorId(r.tipo);
  const pedido = pedidoPorId(r.tipo, r.pedido.id);
  const plazo = plazoPorId(r.pedido.plazo);

  const monto = parsearMonto(r.pedido.monto);
  const montoTexto = monto ? formatearPesos(monto) : "[monto]";

  const lugar = r.remitente.localidad.trim() || "[tu localidad]";
  const encabezado = `${lugar}, ${fechaLarga(hoy)}.`;

  const intro = tipo?.intro ?? "Me dirijo a Ud. a fin de formular el siguiente reclamo.";
  const relato = oracion(r.hechos.descripcion) || "[qué pasó]";
  const hechos = r.hechos.fecha
    ? `Con fecha ${fechaLarga(r.hechos.fecha)} ocurrió lo siguiente: ${relato}`
    : `Los hechos son los siguientes: ${relato}`;

  let queHacer = "[qué le pedís]";
  if (pedido) {
    const texto = pedido.texto(montoTexto, r.pedido.detalle.trim().replace(/[.\s]+$/, ""));
    queHacer = texto || "[qué le pedís]";
  }
  const base = tipo ? `, ${tipo.base}` : "";
  const intimacion = `Por la presente, INTIMO a Ud. para que dentro del plazo de ${plazo.titulo} de recibida la presente ${queHacer}${base}.`;

  const elegidas = consecuenciasPara(r.tipo)
    .filter((c) => r.consecuencias.includes(c.id))
    .map((c) => c.texto);
  const apercibimiento = `Bajo apercibimiento de ${
    elegidas.length ? enumerar(elegidas) : "[qué vas a hacer si no cumple]"
  }.`;

  const firma = [
    r.remitente.nombre.trim() || "[tu nombre]",
    `DNI ${r.remitente.documento.trim() || "[tu DNI]"}`,
  ].join("\n");

  const cuerpo = [
    encabezado,
    `${intro} ${hechos}`,
    intimacion,
    apercibimiento,
    "Queda Ud. debidamente notificado/a.",
    firma,
  ].join("\n\n");

  return {
    remitente: datosPersona(r.remitente, "[tu nombre]", "DNI"),
    destinatario: datosPersona(r.destinatario, "[nombre del destinatario]", "DNI/CUIT"),
    cuerpo,
  };
}

function datosPersona(p: Persona, marcadorNombre: string, etiquetaDoc: string): string {
  const nombre = p.nombre.trim() || marcadorNombre;
  const doc = p.documento.trim();
  const domicilio = p.domicilio.trim() || "[domicilio]";
  const localidad = p.localidad.trim() || "[localidad]";
  return [nombre, doc ? `${etiquetaDoc} ${doc}` : null, `${domicilio}, ${localidad}`]
    .filter(Boolean)
    .join("\n");
}

export const tieneMarcadores = (texto: string) => /\[[^\]]+\]/.test(texto);
