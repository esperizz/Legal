import { Derivacion, type Motivo } from "@/components/reclamo/Derivacion";
import { Footer, Header } from "@/components/ui/Header";

export const metadata = { title: "Hablar con un abogado · Reclamá" };

const MOTIVOS: Motivo[] = ["laboral", "complejo", "revision", "sin-respuesta"];

export default async function DerivacionPage({ searchParams }: PageProps<"/derivacion">) {
  const { motivo } = await searchParams;
  const elegido = MOTIVOS.includes(motivo as Motivo) ? (motivo as Motivo) : "complejo";
  return (
    <>
      <Header />
      <Derivacion motivo={elegido} />
      <Footer />
    </>
  );
}
