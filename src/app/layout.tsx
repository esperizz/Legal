import type { Metadata, Viewport } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { ReclamoProvider } from "@/lib/reclamo/ReclamoProvider";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const serif = Source_Serif_4({ variable: "--font-serif-carta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reclamá · Tu carta documento, paso a paso",
  description:
    "Respondé unas preguntas simples y obtené el texto de tu carta documento listo para enviar. Sin saber de leyes.",
};

export const viewport: Viewport = {
  themeColor: "#f6f5f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${geist.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ReclamoProvider>{children}</ReclamoProvider>
      </body>
    </html>
  );
}
