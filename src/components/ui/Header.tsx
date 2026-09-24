import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-ink">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
        <svg viewBox="0 0 20 20" className="size-4.5" fill="none" aria-hidden>
          <path d="M3 5.5h14v9H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M3.5 6l6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-lg tracking-tight">Reclamá</span>
    </Link>
  );
}

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="no-print border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        {children}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:px-6">
        <p>
          Reclamá es una herramienta para redactar tu propio reclamo. No brinda asesoramiento legal
          ni reemplaza la consulta con un abogado.
        </p>
        <p>
          <Link href="/design-system" className="underline hover:text-ink">
            Design system
          </Link>
          {" · "}
          <Link href="/metricas" className="underline hover:text-ink">
            Métricas del MVP
          </Link>
        </p>
      </div>
    </footer>
  );
}
