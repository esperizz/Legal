import { describe, expect, it } from "vitest";
import { enumerar, fechaLarga, formatearPesos, oracion, parsearMonto, sumarDiasHabiles } from "./formato";
import { generarCarta, tieneMarcadores } from "./generar";
import { reclamoVacio, type Reclamo } from "./tipos";
import { primerPasoIncompleto, validarPaso } from "./validar";

const HOY = new Date(2026, 8, 24); // 24 de septiembre de 2026

function reclamoCompleto(): Reclamo {
  return {
    tipo: "alquiler",
    hechos: {
      fecha: "2026-08-01",
      descripcion: "entregué el departamento en buen estado y no me devolvieron el depósito",
    },
    destinatario: { nombre: "Carlos Pérez", documento: "", domicilio: "Av. Corrientes 1234", localidad: "CABA" },
    pedido: { id: "deposito", monto: "450.000", detalle: "", plazo: "10d" },
    consecuencias: ["judicial", "danos"],
    remitente: { nombre: "Lucía Gómez", documento: "35123456", domicilio: "Thames 500", localidad: "CABA" },
  };
}

describe("formato", () => {
  it("formatea fechas en castellano", () => {
    expect(fechaLarga("2026-03-01")).toBe("1 de marzo de 2026");
    expect(fechaLarga(HOY)).toBe("24 de septiembre de 2026");
  });

  it("interpreta montos escritos a la argentina", () => {
    expect(parsearMonto("450.000")).toBe(450000);
    expect(parsearMonto("$ 1.250,50")).toBe(1250.5);
    expect(parsearMonto("abc")).toBeNull();
    expect(parsearMonto("0")).toBeNull();
    expect(formatearPesos(450000)).toBe("$ 450.000,00");
  });

  it("arma oraciones y enumeraciones", () => {
    expect(oracion("  hola   mundo ")).toBe("Hola mundo.");
    expect(oracion("¿Por qué?")).toBe("¿Por qué?");
    expect(enumerar(["a"])).toBe("a");
    expect(enumerar(["a", "b", "c"])).toBe("a, b y c");
  });

  it("suma días hábiles salteando fines de semana", () => {
    // Jueves 24/9 + 2 hábiles = lunes 28/9
    expect(sumarDiasHabiles(HOY, 2).getDate()).toBe(28);
  });
});

describe("generarCarta", () => {
  it("genera una carta completa sin marcadores", () => {
    const carta = generarCarta(reclamoCompleto(), HOY);
    expect(tieneMarcadores(carta.cuerpo)).toBe(false);
    expect(carta.cuerpo).toContain("CABA, 24 de septiembre de 2026.");
    expect(carta.cuerpo).toContain(
      "Con fecha 1 de agosto de 2026 ocurrió lo siguiente: Entregué el departamento en buen estado y no me devolvieron el depósito.",
    );
    expect(carta.cuerpo).toContain(
      "INTIMO a Ud. para que dentro del plazo de 10 días hábiles de recibida la presente me restituya el depósito en garantía por la suma de $ 450.000,00",
    );
    expect(carta.cuerpo).toContain(
      "Bajo apercibimiento de iniciar las acciones judiciales correspondientes y reclamar los daños y perjuicios ocasionados.",
    );
    expect(carta.cuerpo).toContain("Lucía Gómez\nDNI 35123456");
    expect(carta.destinatario).toBe("Carlos Pérez\nAv. Corrientes 1234, CABA");
  });

  it("muestra marcadores cuando faltan datos", () => {
    const carta = generarCarta(reclamoVacio(), HOY);
    expect(carta.cuerpo).toContain("[qué pasó]");
    expect(carta.cuerpo).toContain("[qué le pedís]");
    expect(carta.remitente).toContain("[tu nombre]");
  });

  it("ignora consecuencias que no aplican al tipo de reclamo", () => {
    const r = { ...reclamoCompleto(), consecuencias: ["consumidor"] };
    expect(generarCarta(r, HOY).cuerpo).toContain("[qué vas a hacer si no cumple]");
  });

  it("usa el texto libre cuando el pedido es 'otro'", () => {
    const r = reclamoCompleto();
    r.pedido = { id: "otro", monto: "", detalle: "me entregue las llaves de la baulera.", plazo: "48h" };
    expect(generarCarta(r, HOY).cuerpo).toContain(
      "dentro del plazo de 48 horas de recibida la presente me entregue las llaves de la baulera, conforme",
    );
  });
});

describe("validar", () => {
  it("un reclamo completo no tiene pasos pendientes", () => {
    expect(primerPasoIncompleto(reclamoCompleto())).toBeNull();
  });

  it("detecta el primer paso incompleto", () => {
    expect(primerPasoIncompleto(reclamoVacio())).toBe("tipo");
  });

  it("pide monto cuando el pedido lo requiere", () => {
    const r = reclamoCompleto();
    r.pedido.monto = "";
    expect(validarPaso("pedido", r)).toHaveProperty("pedido.monto");
  });

  it("valida el DNI del remitente", () => {
    const r = reclamoCompleto();
    r.remitente.documento = "12";
    expect(validarPaso("remitente", r)).toHaveProperty("remitente.documento");
  });
});
