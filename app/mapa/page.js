import { sql } from "@/lib/db";
import TalleresConMapa from "@/app/components/TalleresConMapa";

export const dynamic = "force-dynamic"; // ver explicación en app/entrevistas/page.js

export const metadata = {
  title: "Mapa de Talleres | Tocar Madera",
};

export default async function MapaPage() {
  const talleres = await sql`
    SELECT id, nombre, oficio, foto_url, ciudad, region, lat, lng
    FROM talleres
    ORDER BY nombre ASC
  `;

  return (
    <main className="max-w-7xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-2">Mapa de Talleres</h1>
      <p className="mb-8" style={{ color: "var(--gris-texto)" }}>
        Explora la ubicación de los talleres a lo largo de Chile.
      </p>
      <TalleresConMapa talleres={talleres} />
    </main>
  );
}
