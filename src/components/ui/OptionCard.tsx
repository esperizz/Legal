interface Props {
  titulo: string;
  descripcion?: string;
  seleccionada: boolean;
  /** "radio" para elegir una opción, "checkbox" para varias. */
  tipo?: "radio" | "checkbox";
  name?: string;
  onSelect: () => void;
}

export function OptionCard({
  titulo,
  descripcion,
  seleccionada,
  tipo = "radio",
  name,
  onSelect,
}: Props) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-card border-2 p-4 transition-colors ${
        seleccionada ? "border-primary bg-primary-soft" : "border-line bg-surface hover:border-line-strong"
      }`}
    >
      <input
        type={tipo}
        name={name}
        checked={seleccionada}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 peer-focus-visible:ring-3 peer-focus-visible:ring-primary ${
          tipo === "radio" ? "rounded-full" : "rounded-md"
        } ${seleccionada ? "border-primary bg-primary" : "border-line-strong bg-surface"}`}
      >
        {seleccionada &&
          (tipo === "radio" ? (
            <span className="size-2 rounded-full bg-white" />
          ) : (
            <svg viewBox="0 0 16 16" className="size-3.5 text-white" fill="none">
              <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold text-ink">{titulo}</span>
        {descripcion && <span className="text-sm text-muted">{descripcion}</span>}
      </span>
    </label>
  );
}
