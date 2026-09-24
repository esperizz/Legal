import { Metricas } from "@/components/Metricas";
import { Footer, Header } from "@/components/ui/Header";

export const metadata = { title: "Métricas · Reclamá" };

export default function MetricasPage() {
  return (
    <>
      <Header />
      <Metricas />
      <Footer />
    </>
  );
}
