import type { Carta } from "@/lib/reclamo/generar";

/** Resalta los marcadores [así] que indican datos que faltan completar. */
function ConMarcadores({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(\[[^\]]+\])/g).map((parte, i) =>
        /^\[[^\]]+\]$/.test(parte) ? (
          <mark key={i} className="rounded bg-marker px-1 font-sans text-[0.85em] text-warning">
            {parte.slice(1, -1)}
          </mark>
        ) : (
          // Evita que "$" quede separado del monto en otra línea.
          <span key={i}>{parte.replace(/\$ /g, "$\u00a0")}</span>
        ),
      )}
    </>
  );
}

function Bloque({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="flex-1 rounded-lg border border-line p-3">
      <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-subtle">
        {titulo}
      </p>
      <p className="whitespace-pre-line text-sm leading-snug">
        <ConMarcadores texto={texto} />
      </p>
    </div>
  );
}

export function LetterPreview({ carta }: { carta: Carta }) {
  return (
    <article
      aria-label="Vista previa de tu carta documento"
      className="rounded-card border border-line bg-paper p-5 font-serif text-ink shadow-card sm:p-7"
    >
      <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-muted">
        Carta documento
      </p>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <Bloque titulo="Remitente" texto={carta.remitente} />
        <Bloque titulo="Destinatario" texto={carta.destinatario} />
      </div>
      <div className="flex flex-col gap-4 text-[15px] leading-relaxed">
        {carta.cuerpo.split("\n\n").map((parrafo, i) => (
          <p key={i} className="whitespace-pre-line">
            <ConMarcadores texto={parrafo} />
          </p>
        ))}
      </div>
    </article>
  );
}
