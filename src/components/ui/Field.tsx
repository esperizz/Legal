import { useId } from "react";

const control =
  "w-full rounded-control border bg-surface px-3.5 text-base text-ink placeholder:text-subtle transition-colors focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary-soft";

function borde(error?: string) {
  return error ? "border-danger" : "border-line-strong";
}

interface CampoProps {
  label: string;
  ayuda?: string;
  error?: string;
  opcional?: boolean;
}

function Campo({
  id,
  label,
  ayuda,
  error,
  opcional,
  children,
}: CampoProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {opcional && <span className="font-normal text-muted"> (opcional)</span>}
      </label>
      {ayuda && (
        <p id={`${id}-ayuda`} className="-mt-0.5 text-sm text-muted">
          {ayuda}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, ayuda?: string, error?: string) {
  return [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

export function TextField({
  label,
  ayuda,
  error,
  opcional,
  ...input
}: CampoProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Campo id={id} label={label} ayuda={ayuda} error={error} opcional={opcional}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, ayuda, error)}
        className={`${control} ${borde(error)} h-12`}
        {...input}
      />
    </Campo>
  );
}

export function TextAreaField({
  label,
  ayuda,
  error,
  opcional,
  ...area
}: CampoProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Campo id={id} label={label} ayuda={ayuda} error={error} opcional={opcional}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, ayuda, error)}
        className={`${control} ${borde(error)} min-h-36 py-3 leading-relaxed`}
        {...area}
      />
    </Campo>
  );
}
