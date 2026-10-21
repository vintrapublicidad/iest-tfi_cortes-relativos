import { Poppins, Bangers } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Cortes Relativos | Reservá tu turno online en Tinogasta",
  description:
    "Agendá tu turno en la peluquería de forma rápida y sencilla. Elegí servicio, peluquero, día y hora en Tinogasta, Catamarca.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${poppins.variable} ${bangers.variable}`}>
      <body>{children}</body>
    </html>
  );
}
