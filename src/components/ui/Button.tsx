import Link from "next/link";

type Variante = "primary" | "secondary" | "ghost";
type Tamano = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variantes: Record<Variante, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-canvas",
  ghost: "text-primary hover:bg-primary-soft",
};

const tamanos: Record<Tamano, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-13 px-6 text-base",
};

interface Props {
  variante?: Variante;
  tamano?: Tamano;
  bloque?: boolean;
  className?: string;
}

export function clasesBoton({ variante = "primary", tamano = "md", bloque, className }: Props) {
  return [base, variantes[variante], tamanos[tamano], bloque && "w-full", className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variante,
  tamano,
  bloque,
  className,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={clasesBoton({ variante, tamano, bloque, className })}
      {...rest}
    />
  );
}

export function ButtonLink({
  variante,
  tamano,
  bloque,
  className,
  href,
  children,
  onClick,
}: Props & { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clasesBoton({ variante, tamano, bloque, className })}
    >
      {children}
    </Link>
  );
}
