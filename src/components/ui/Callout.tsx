type Tono = "info" | "success" | "warning";

const tonos: Record<Tono, string> = {
  info: "bg-primary-soft text-ink border-primary/20",
  success: "bg-success-soft text-ink border-success/25",
  warning: "bg-warning-soft text-ink border-warning/25",
};

const iconos: Record<Tono, string> = {
  info: "text-primary",
  success: "text-success",
  warning: "text-warning",
};

export function Callout({
  tono = "info",
  titulo,
  children,
}: {
  tono?: Tono;
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex gap-3 rounded-card border p-4 text-sm ${tonos[tono]}`}>
      <svg viewBox="0 0 20 20" className={`mt-0.5 size-5 shrink-0 ${iconos[tono]}`} fill="currentColor" aria-hidden>
        {tono === "success" ? (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        )}
      </svg>
      <div className="flex flex-col gap-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        <div className="leading-relaxed text-muted [&_strong]:text-ink">{children}</div>
      </div>
    </div>
  );
}
