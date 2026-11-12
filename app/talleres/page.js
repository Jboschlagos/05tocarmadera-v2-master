import { sql } from "@/lib/db";
import TalleresConMapa from "@/app/components/TalleresConMapa";

export const dynamic = "force-dynamic"; // ver explicación en app/entrevistas/page.js

export const metadata = {
  title: "Talleres | Tocar Madera",
};

export default async function TalleresPage() {
  const talleres = await sql`
    SELECT id, nombre, oficio, foto_url, ciudad, region, lat, lng, tipo_trabajo
    FROM talleres
    ORDER BY nombre ASC
  `;

  return (
    <main className="max-w-7xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Talleres</h1>
      <TalleresConMapa talleres={talleres} />
    </main>
  );
}
