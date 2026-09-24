import type { PlazoId, TipoReclamo } from "./tipos";

export interface OpcionTipo {
  id: TipoReclamo;
  titulo: string;
  descripcion: string;
  /** Primer párrafo de la carta. */
  intro: string;
  /** Norma que respalda la intimación. */
  base: string;
  /** Ejemplo para el campo "¿Qué pasó?". */
  ejemploHechos: string;
}

export const TIPOS: OpcionTipo[] = [
  {
    id: "deuda",
    titulo: "Me deben plata",
    descripcion: "Un préstamo, un trabajo que no te pagaron, una seña que no te devuelven.",
    intro: "Me dirijo a Ud. en relación con la suma de dinero que me adeuda.",
    base: "conforme lo dispuesto por el Código Civil y Comercial de la Nación",
    ejemploHechos:
      "Le presté $200.000 en marzo y acordamos que me los devolvía en junio. Le escribí varias veces y no me responde.",
  },
  {
    id: "consumo",
    titulo: "Tuve un problema con una compra o un servicio",
    descripcion: "Un producto fallado, un servicio que no cumplió, cobros que no corresponden.",
    intro:
      "Me dirijo a Ud. en mi carácter de consumidor/a, en relación con el producto o servicio que le adquirí o contraté.",
    base: "conforme lo dispuesto por la Ley 24.240 de Defensa del Consumidor",
    ejemploHechos:
      "Compré una heladera en su local, llegó sin enfriar y el service técnico no vino a las dos visitas que me confirmaron.",
  },
  {
    id: "alquiler",
    titulo: "Tengo un problema con un alquiler",
    descripcion: "El depósito que no te devuelven, reparaciones pendientes, alquileres adeudados.",
    intro: "Me dirijo a Ud. en relación con el contrato de alquiler que nos vincula.",
    base: "conforme lo dispuesto por el Código Civil y Comercial de la Nación",
    ejemploHechos:
      "Entregué el departamento en buen estado al terminar el contrato y hasta hoy no me devolvieron el depósito.",
  },
];

export interface OpcionPedido {
  id: string;
  titulo: string;
  pideMonto?: boolean;
  pideDetalle?: boolean;
  /** Texto de la carta; recibe el monto ya formateado y el detalle. */
  texto: (monto: string, detalle: string) => string;
}

const OTRO: OpcionPedido = {
  id: "otro",
  titulo: "Otra cosa (la escribís vos)",
  pideDetalle: true,
  texto: (_monto, detalle) => detalle,
};

export const PEDIDOS: Record<TipoReclamo, OpcionPedido[]> = {
  deuda: [
    {
      id: "pagar",
      titulo: "Que me pague lo que me debe",
      pideMonto: true,
      texto: (m) => `abone la suma adeudada de ${m}`,
    },
    {
      id: "prestamo",
      titulo: "Que me devuelva la plata que le presté",
      pideMonto: true,
      texto: (m) => `me restituya la suma de ${m} que le fuera prestada`,
    },
    OTRO,
  ],
  consumo: [
    {
      id: "reparar",
      titulo: "Que reparen el producto sin costo",
      texto: () => "proceda a reparar el producto adquirido sin costo alguno",
    },
    {
      id: "cambiar",
      titulo: "Que me lo cambien por uno nuevo",
      texto: () =>
        "proceda a reemplazar el producto adquirido por otro nuevo de idénticas características",
    },
    {
      id: "reintegrar",
      titulo: "Que me devuelvan lo que pagué",
      pideMonto: true,
      texto: (m) => `me reintegre la suma abonada de ${m}`,
    },
    {
      id: "servicio",
      titulo: "Que cumplan con el servicio que contraté",
      texto: () => "cumpla con la prestación del servicio contratado en las condiciones pactadas",
    },
    {
      id: "cobros",
      titulo: "Que dejen de cobrarme algo que no corresponde",
      texto: () => "cese de inmediato en los cobros indebidos y me reintegre las sumas percibidas",
    },
    OTRO,
  ],
  alquiler: [
    {
      id: "deposito",
      titulo: "Que me devuelvan el depósito",
      pideMonto: true,
      texto: (m) => `me restituya el depósito en garantía por la suma de ${m}`,
    },
    {
      id: "reparaciones",
      titulo: "Que hagan las reparaciones que le corresponden",
      texto: () => "realice las reparaciones a su cargo en el inmueble alquilado",
    },
    {
      id: "alquileres",
      titulo: "Que me paguen alquileres que me deben",
      pideMonto: true,
      texto: (m) => `abone los alquileres adeudados por la suma de ${m}`,
    },
    OTRO,
  ],
};

export interface OpcionPlazo {
  id: PlazoId;
  titulo: string;
  descripcion: string;
  diasHabiles: number;
}

export const PLAZOS: OpcionPlazo[] = [
  { id: "48h", titulo: "48 horas", descripcion: "Para algo urgente.", diasHabiles: 2 },
  { id: "5d", titulo: "5 días hábiles", descripcion: "Una semana, aproximadamente.", diasHabiles: 5 },
  { id: "10d", titulo: "10 días hábiles", descripcion: "Dos semanas. El más habitual.", diasHabiles: 10 },
];

export interface OpcionConsecuencia {
  id: string;
  titulo: string;
  descripcion: string;
  texto: string;
  soloTipos?: TipoReclamo[];
}

export const CONSECUENCIAS: OpcionConsecuencia[] = [
  {
    id: "judicial",
    titulo: "Hacerle juicio",
    descripcion: "Avisás que vas a ir a la Justicia.",
    texto: "iniciar las acciones judiciales correspondientes",
  },
  {
    id: "mediacion",
    titulo: "Iniciar una mediación",
    descripcion: "Una reunión con un mediador para intentar un acuerdo antes del juicio.",
    texto: "iniciar el procedimiento de mediación prejudicial",
  },
  {
    id: "consumidor",
    titulo: "Denunciarlo en Defensa del Consumidor",
    descripcion: "Un reclamo gratuito ante el organismo que controla a las empresas.",
    texto:
      "formular la denuncia correspondiente ante la autoridad de aplicación de la Ley 24.240",
    soloTipos: ["consumo"],
  },
  {
    id: "danos",
    titulo: "Reclamar además los daños",
    descripcion: "Pedir que te compensen por los perjuicios que te causó.",
    texto: "reclamar los daños y perjuicios ocasionados",
  },
  {
    id: "intereses",
    titulo: "Reclamar intereses",
    descripcion: "Sumar los intereses por el tiempo que pasó sin pagarte.",
    texto: "reclamar los intereses correspondientes",
  },
];

export const tipoPorId = (id: TipoReclamo | null) => TIPOS.find((t) => t.id === id);

export const pedidoPorId = (tipo: TipoReclamo | null, id: string) =>
  tipo ? PEDIDOS[tipo].find((p) => p.id === id) : undefined;

export const plazoPorId = (id: PlazoId) => PLAZOS.find((p) => p.id === id) ?? PLAZOS[2];

export const consecuenciasPara = (tipo: TipoReclamo | null) =>
  CONSECUENCIAS.filter((c) => !c.soloTipos || (tipo && c.soloTipos.includes(tipo)));
