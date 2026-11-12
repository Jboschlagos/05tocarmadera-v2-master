import Link from "next/link";

// Next.js muestra este archivo cuando una ruta no existe o cuando una
// página llama a notFound() (por ejemplo, /talleres/9999).
export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8 py-16 gap-4">
      <p className="text-6xl">🪵</p>
      <h1 className="text-3xl font-bold">No encontramos esta página</h1>
      <p style={{ color: "var(--gris-texto)" }}>
        Puede que el enlace esté mal escrito o que el contenido ya no exista.
      </p>
      <Link
        href="/"
        className="rounded-lg px-6 py-3 text-white font-semibold mt-2"
        style={{ backgroundColor: "var(--madera)" }}
      >
        Volver al inicio
      </Link>
    </main>
  );
}
