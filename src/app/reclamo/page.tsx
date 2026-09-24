import { Suspense } from "react";
import { Wizard } from "@/components/reclamo/Wizard";

export const metadata = { title: "Tu reclamo · Reclamá" };

export default function ReclamoPage() {
  return (
    <Suspense>
      <Wizard />
    </Suspense>
  );
}
