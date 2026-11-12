// Mientras una página del servidor espera a la base de datos, Next.js
// muestra esto automáticamente (usa <Suspense> por debajo).
export default function Loading() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-8 py-16">
      <p className="animate-pulse" style={{ color: "var(--gris-texto)" }}>
        Cargando...
      </p>
    </main>
  );
}
