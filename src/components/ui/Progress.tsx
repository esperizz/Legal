export function Progress({ actual, total, etiqueta }: { actual: number; total: number; etiqueta?: string }) {
  const pct = Math.round((actual / total) * 100);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted">
        {etiqueta ?? `Paso ${actual} de ${total}`}
      </p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={actual}
        aria-label={etiqueta ?? `Paso ${actual} de ${total}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-line"
      >
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
