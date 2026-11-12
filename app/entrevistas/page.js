import { sql } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

// Sin esta línea, Next.js genera la página UNA vez al hacer `npm run build`
// y la sirve congelada: lo que agregues después a la base de datos no
// aparecería hasta el próximo deploy. "force-dynamic" = consultar la base
// en cada visita.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrevistas | Tocar Madera",
};

export default async function EntrevistasPage() {
  const entrevistas = await sql`
    SELECT id, titulo, taller, oficio, imagen_principal, ciudad, region, fecha
    FROM entrevistas
    ORDER BY fecha DESC
  `;

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Entrevistas</h1>

      {entrevistas.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>
          Aún no hay entrevistas publicadas.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entrevistas.map((entrevista) => (
            <Link
              key={entrevista.id}
              href={`/entrevistas/${entrevista.id}`}
              className="block rounded-xl overflow-hidden shadow-sm border border-transparent transition-all duration-200 hover:shadow-md hover:scale-[1.03] hover:border-[var(--madera)]"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              {entrevista.imagen_principal && (
                <div className="relative w-full h-48">
                  <Image
                    src={entrevista.imagen_principal}
                    alt={entrevista.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-1">{entrevista.titulo}</h3>
                <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
                  {entrevista.taller} — {entrevista.oficio}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--gris-texto)" }}
                >
                  {[entrevista.ciudad, entrevista.region]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
