import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-8" style={{ backgroundColor: "var(--oscuro)" }}>
      <div className="flex flex-col md:flex-row justify-between gap-8 max-w-6xl mx-auto">
        {/* Columna 1 — Marca. SIEMPRE visible, en todos los tamaños. */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-xl">🪵 Tocar Madera</h3>
          <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
            Conectamos con las historias detrás <br /> de los talleres de Chile
          </p>
          {/* Redes sociales */}
          <div className="flex gap-4 mt-2">
            <a
              href="https://instagram.com/tocarmadera_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-75 text-sm"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/@tocarmaderafilms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-75 text-sm"
            >
              YouTube
            </a>
            <a
              href="https://www.facebook.com/tocarmaderafb/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-75 text-sm"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* ── Columnas 2, 3 y 4 — SOLO desde md (768px) ──────────
            Mismo breakpoint que usa el Navbar para pasar del menú
            hamburguesa al menú horizontal, así el footer se comporta
            de forma consistente con el resto del sitio.
        */}
        <div className="hidden md:flex gap-8">
          {/* Columna 2 — Navegación: mismos links reales que el Navbar */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold">Explorar</h4>
            <Link
              href="/talleres"
              className="text-sm hover:text-white hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Talleres
            </Link>
            <Link
              href="/entrevistas"
              className="text-sm hover:text-white hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Entrevistas
            </Link>
            <Link
              href="/nosotros"
              className="text-sm hover:text-white hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Nuestra Historia
            </Link>
            <Link
              href="/mercado"
              className="text-sm hover:text-white hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Mercado
            </Link>
          </div>

          {/* Columna 3 — Comunidad */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold">Comunidad</h4>
            <Link
              href="/register"
              className="text-sm hover:text-white hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              ¿Tienes un taller o trabajas la madera? Únete
            </Link>
            <Link
              href="/nosotros"
              className="text-sm hover:text-white hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Sobre nosotros
            </Link>
          </div>

          {/* Columna 4 — Contacto */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold">Contacto</h4>
            <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
              📧 hola@tocarmadera.cl
            </p>
            <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
              📍 Chile
            </p>
            <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
              📱 +56 9 xxxx xxxx
            </p>
          </div>
        </div>
      </div>

      {/* Línea divisora — SIEMPRE visible (copyright siempre se ve) */}
      <div className="border-t border-gray-700 mt-8 pt-6 max-w-6xl mx-auto">
        <p
          className="text-sm text-center"
          style={{ color: "var(--gris-texto)" }}
        >
          © {new Date().getFullYear()} Tocar Madera — Jorge Bosch
        </p>
      </div>
    </footer>
  );
}
