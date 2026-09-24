const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-03-01" o Date → "1 de marzo de 2026". */
export function fechaLarga(fecha: string | Date): string {
  const d = typeof fecha === "string" ? desdeISO(fecha) : fecha;
  if (!d) return "";
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

function desdeISO(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/**
 * Interpreta montos escritos a la argentina: "450.000", "1.250,50", "$ 3000".
 * Un punto solo es separador de miles si le siguen grupos de 3 dígitos
 * ("1.500" = 1500); si no, es decimal ("1.5" = 1,5).
 */
export function parsearMonto(texto: string): number | null {
  const limpio = texto.replace(/[^\d.,]/g, "");
  if (!/\d/.test(limpio)) return null;
  let normalizado = limpio;
  if (limpio.includes(",")) normalizado = limpio.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(limpio)) normalizado = limpio.replace(/\./g, "");
  const numero = Number(normalizado);
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

/** 450000 → "$ 450.000,00" (con espacio normal, apto para copiar). */
export function formatearPesos(monto: number): string {
  return pesos.format(monto).replace(/\s/g, " ");
}

/** Primera letra en mayúscula y punto final. */
export function oracion(texto: string): string {
  const t = texto.trim().replace(/\s+/g, " ");
  if (!t) return "";
  const conMayuscula = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?]$/.test(conMayuscula) ? conMayuscula : `${conMayuscula}.`;
}

/** ["a", "b", "c"] → "a, b y c". */
export function enumerar(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

/** Suma días hábiles (lunes a viernes). No contempla feriados. */
export function sumarDiasHabiles(desde: Date, dias: number): Date {
  const d = new Date(desde);
  let restantes = dias;
  while (restantes > 0) {
    d.setDate(d.getDate() + 1);
    const dia = d.getDay();
    if (dia !== 0 && dia !== 6) restantes--;
  }
  return d;
}
