"use client";

import Link from "next/link";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { OptionCard } from "@/components/ui/OptionCard";
import { consecuenciasPara, PEDIDOS, PLAZOS, TIPOS, tipoPorId } from "@/lib/reclamo/catalogo";
import type { Persona, Reclamo } from "@/lib/reclamo/tipos";
import type { Errores, Paso } from "@/lib/reclamo/validar";

export interface PasoProps {
  reclamo: Reclamo;
  actualizar: (cambio: (r: Reclamo) => Reclamo) => void;
  errores: Errores;
}

export const TEXTOS: Record<Paso, { titulo: string; bajada: string }> = {
  tipo: {
    titulo: "¿Qué tipo de reclamo tenés?",
    bajada: "Elegí la opción que más se parezca a tu caso. Después podés cambiarla.",
  },
  hechos: {
    titulo: "¿Qué pasó?",
    bajada: "Contalo con tus palabras, en 2 o 3 frases. Lo que escribas va a aparecer en la carta tal cual.",
  },
  destinatario: {
    titulo: "¿A quién le reclamás?",
    bajada: "La persona o empresa que tiene que responderte. La carta llega a esta dirección.",
  },
  pedido: {
    titulo: "¿Qué le pedís?",
    bajada: "Lo que querés que haga para resolver el problema, y cuánto tiempo le das.",
  },
  consecuencias: {
    titulo: "¿Qué vas a hacer si no cumple?",
    bajada:
      "Avisarle qué pasa si no responde le da seriedad a tu reclamo. No te obliga a hacerlo: podés decidirlo después.",
  },
  remitente: {
    titulo: "Por último, tus datos",
    bajada: "Son obligatorios para enviar una carta documento. No los guardamos en ningún servidor.",
  },
};

function Grupo({ legend, error, children }: { legend: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-semibold text-ink">{legend}</legend>
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function PasoTipo({ reclamo, actualizar, errores }: PasoProps) {
  return (
    <div className="flex flex-col gap-6">
      <Grupo legend="Tipo de reclamo" error={errores.tipo}>
        {TIPOS.map((t) => (
          <OptionCard
            key={t.id}
            name="tipo"
            titulo={t.titulo}
            descripcion={t.descripcion}
            seleccionada={reclamo.tipo === t.id}
            onSelect={() =>
              actualizar((r) =>
                r.tipo === t.id ? r : { ...r, tipo: t.id, pedido: { ...r.pedido, id: "" } },
              )
            }
          />
        ))}
      </Grupo>
      <div className="flex flex-col gap-2 rounded-card border border-dashed border-line-strong p-4 text-sm">
        <p className="font-semibold">¿No es ninguno de estos?</p>
        <Link href="/derivacion?motivo=laboral" className="text-primary underline underline-offset-2">
          Es un reclamo laboral (con mi empleador)
        </Link>
        <Link href="/derivacion?motivo=complejo" className="text-primary underline underline-offset-2">
          Es otra cosa o mi caso es complicado
        </Link>
      </div>
    </div>
  );
}

export function PasoHechos({ reclamo, actualizar, errores }: PasoProps) {
  const ejemplo = tipoPorId(reclamo.tipo)?.ejemploHechos;
  return (
    <div className="flex flex-col gap-5">
      <TextAreaField
        label="Qué pasó"
        ayuda="Qué, cuándo y cuánto. Evitá insultos o amenazas: le restan seriedad al reclamo."
        placeholder={ejemplo ? `Por ejemplo: ${ejemplo}` : undefined}
        value={reclamo.hechos.descripcion}
        error={errores["hechos.descripcion"]}
        maxLength={700}
        onChange={(e) =>
          actualizar((r) => ({ ...r, hechos: { ...r.hechos, descripcion: e.target.value } }))
        }
      />
      <TextField
        label="¿Cuándo pasó?"
        opcional
        ayuda="La fecha del hecho principal, si la recordás."
        type="date"
        value={reclamo.hechos.fecha}
        error={errores["hechos.fecha"]}
        onChange={(e) => actualizar((r) => ({ ...r, hechos: { ...r.hechos, fecha: e.target.value } }))}
      />
    </div>
  );
}

function CamposPersona({
  persona,
  prefijo,
  errores,
  onChange,
  esRemitente,
}: {
  persona: Persona;
  prefijo: string;
  errores: Errores;
  onChange: (p: Persona) => void;
  esRemitente: boolean;
}) {
  const set = (campo: keyof Persona) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...persona, [campo]: e.target.value });
  return (
    <div className="flex flex-col gap-5">
      <TextField
        label={esRemitente ? "Tu nombre y apellido" : "Nombre de la persona o empresa"}
        ayuda={esRemitente ? undefined : "Si es una empresa, usá el nombre que figura en la factura o el contrato."}
        autoComplete={esRemitente ? "name" : "off"}
        value={persona.nombre}
        error={errores[`${prefijo}.nombre`]}
        onChange={set("nombre")}
      />
      <TextField
        label={esRemitente ? "Tu DNI" : "DNI o CUIT"}
        opcional={!esRemitente}
        ayuda={esRemitente ? "Solo números, sin puntos." : "Si no lo sabés, dejalo vacío."}
        inputMode="numeric"
        value={persona.documento}
        error={errores[`${prefijo}.documento`]}
        onChange={set("documento")}
      />
      <TextField
        label={esRemitente ? "Tu dirección" : "Dirección"}
        ayuda={
          esRemitente
            ? "Donde querés recibir la respuesta."
            : "Donde vive o tiene su local. Calle, número, piso y departamento."
        }
        autoComplete={esRemitente ? "street-address" : "off"}
        value={persona.domicilio}
        error={errores[`${prefijo}.domicilio`]}
        onChange={set("domicilio")}
      />
      <TextField
        label="Localidad"
        ayuda="Ciudad y provincia. Por ejemplo: CABA, o Rosario, Santa Fe."
        autoComplete={esRemitente ? "address-level2" : "off"}
        value={persona.localidad}
        error={errores[`${prefijo}.localidad`]}
        onChange={set("localidad")}
      />
    </div>
  );
}

export function PasoDestinatario({ reclamo, actualizar, errores }: PasoProps) {
  return (
    <CamposPersona
      persona={reclamo.destinatario}
      prefijo="destinatario"
      errores={errores}
      esRemitente={false}
      onChange={(p) => actualizar((r) => ({ ...r, destinatario: p }))}
    />
  );
}

export function PasoRemitente({ reclamo, actualizar, errores }: PasoProps) {
  return (
    <CamposPersona
      persona={reclamo.remitente}
      prefijo="remitente"
      errores={errores}
      esRemitente
      onChange={(p) => actualizar((r) => ({ ...r, remitente: p }))}
    />
  );
}

export function PasoPedido({ reclamo, actualizar, errores }: PasoProps) {
  const opciones = reclamo.tipo ? PEDIDOS[reclamo.tipo] : [];
  const elegido = opciones.find((p) => p.id === reclamo.pedido.id);
  const setPedido = (cambio: Partial<Reclamo["pedido"]>) =>
    actualizar((r) => ({ ...r, pedido: { ...r.pedido, ...cambio } }));

  return (
    <div className="flex flex-col gap-8">
      <Grupo legend="Elegí una opción" error={errores["pedido.id"]}>
        {opciones.map((p) => (
          <OptionCard
            key={p.id}
            name="pedido"
            titulo={p.titulo}
            seleccionada={reclamo.pedido.id === p.id}
            onSelect={() => setPedido({ id: p.id })}
          />
        ))}
      </Grupo>

      {elegido?.pideMonto && (
        <TextField
          label="¿Cuánto dinero?"
          ayuda="En pesos. Por ejemplo: 450.000"
          inputMode="decimal"
          placeholder="450.000"
          value={reclamo.pedido.monto}
          error={errores["pedido.monto"]}
          onChange={(e) => setPedido({ monto: e.target.value })}
        />
      )}

      {elegido?.pideDetalle && (
        <TextField
          label="Escribí qué le pedís"
          ayuda='Empezá con un verbo. Por ejemplo: "me entregue las llaves de la baulera".'
          value={reclamo.pedido.detalle}
          error={errores["pedido.detalle"]}
          maxLength={200}
          onChange={(e) => setPedido({ detalle: e.target.value })}
        />
      )}

      <Grupo legend="¿Cuánto tiempo le das para responder?">
        <p className="-mt-2 mb-1 text-sm text-muted">
          Los días hábiles son de lunes a viernes, sin contar feriados. Se cuentan desde que recibe la carta.
        </p>
        {PLAZOS.map((p) => (
          <OptionCard
            key={p.id}
            name="plazo"
            titulo={p.titulo}
            descripcion={p.descripcion}
            seleccionada={reclamo.pedido.plazo === p.id}
            onSelect={() => setPedido({ plazo: p.id })}
          />
        ))}
      </Grupo>
    </div>
  );
}

export function PasoConsecuencias({ reclamo, actualizar, errores }: PasoProps) {
  return (
    <Grupo legend="Podés elegir más de una" error={errores.consecuencias}>
      {consecuenciasPara(reclamo.tipo).map((c) => {
        const activa = reclamo.consecuencias.includes(c.id);
        return (
          <OptionCard
            key={c.id}
            tipo="checkbox"
            titulo={c.titulo}
            descripcion={c.descripcion}
            seleccionada={activa}
            onSelect={() =>
              actualizar((r) => ({
                ...r,
                consecuencias: activa
                  ? r.consecuencias.filter((x) => x !== c.id)
                  : [...r.consecuencias, c.id],
              }))
            }
          />
        );
      })}
    </Grupo>
  );
}

export const COMPONENTES: Record<Paso, (p: PasoProps) => React.ReactNode> = {
  tipo: PasoTipo,
  hechos: PasoHechos,
  destinatario: PasoDestinatario,
  pedido: PasoPedido,
  consecuencias: PasoConsecuencias,
  remitente: PasoRemitente,
};
