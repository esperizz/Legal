import { DesignSystem } from "@/components/DesignSystem";
import { Footer, Header } from "@/components/ui/Header";

export const metadata = { title: "Design system · Reclamá" };

export default function DesignSystemPage() {
  return (
    <>
      <Header />
      <DesignSystem />
      <Footer />
    </>
  );
}
