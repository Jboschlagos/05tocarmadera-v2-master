"use client";

// Si una página lanza un error inesperado (por ejemplo, se cae la conexión
// a la base de datos), Next.js muestra esto en vez de una pantalla rota.
// Tiene que ser un componente cliente porque usa el botón "reset".
export default function Error({ reset }) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8 py-16 gap-4">
      <h1 className="text-3xl font-bold">Algo salió mal</h1>
      <p style={{ color: "var(--gris-texto)" }}>
        Tuvimos un problema al cargar esta página. Intenta de nuevo en unos
        segundos.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg px-6 py-3 text-white font-semibold mt-2"
        style={{ backgroundColor: "var(--madera)" }}
      >
        Reintentar
      </button>
    </main>
  );
}
