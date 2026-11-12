import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Providers from "./providers";

export const metadata = {
  title: "Tocar Madera | Trabajadores de la madera de Chile",
  description:
    "Conectamos con las historias detrás de los talleres de madera chilenos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://basemaps.cartocdn.com" />
      </head>
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
