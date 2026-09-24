/**
 * Registro mínimo de eventos para medir el embudo y las pruebas de interés
 * (revisión por abogado, derivación, recordatorio). En el MVP se guarda en el
 * navegador; en producción se reemplaza por una herramienta de analítica.
 */
export type NombreEvento =
  | "reclamo_iniciado"
  | "paso_completado"
  | "carta_lista"
  | "carta_copiada"
  | "carta_descargada"
  | "interes_revision"
  | "interes_abogado"
  | "recordatorio_pedido"
  | "derivacion_laboral";

export interface Evento {
  nombre: NombreEvento;
  datos?: Record<string, string>;
  fecha: string;
}

const CLAVE = "eventos";

export function registrar(nombre: NombreEvento, datos?: Record<string, string>) {
  try {
    const lista = leerEventos();
    lista.push({ nombre, datos, fecha: new Date().toISOString() });
    localStorage.setItem(CLAVE, JSON.stringify(lista.slice(-500)));
  } catch {
    // Sin almacenamiento: la medición se pierde, la app sigue funcionando.
  }
}

export function leerEventos(): Evento[] {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
  } catch {
    return [];
  }
}

export function borrarEventos() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // nada
  }
}
