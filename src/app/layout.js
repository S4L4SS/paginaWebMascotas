import { Geist, Geist_Mono, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import NavbarInteligente from "../components/NavbarInteligente";
import { CarritoProvider } from "../contexts/CarritoContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '700', '900'],
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-be-vietnam-pro",
});

export const metadata = {
  title: "Mundo Mascotas🐶",
  description: "Tu tienda de productos para mascotas favorita",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${beVietnamPro.variable} antialiased`}>
        <CarritoProvider>
          <NavbarInteligente />
          {children}
        </CarritoProvider>
      </body>
    </html>
  );
}
