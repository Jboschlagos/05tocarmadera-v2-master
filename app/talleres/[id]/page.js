import { cache } from "react";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { esIdValido } from "@/lib/validar";
import TallerPerfilConMapa from "@/app/components/TallerPerfilConMapa";

// Ver explicación de `cache` en app/mercado/[id]/page.js
const obtenerTaller = cache(async (id) => {
  if (!esIdValido(id)) return null;
  const [taller] = await sql`
    SELECT id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng,
      direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo
    FROM talleres
    WHERE id = ${id}
  `;
  return taller ?? null;
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const taller = await obtenerTaller(id);
  if (!taller) return { title: "Taller no encontrado | Tocar Madera" };
  return {
    title: `${taller.nombre} | Talleres Tocar Madera`,
    description:
      taller.bio?.slice(0, 160) ||
      `${taller.nombre} — ${taller.oficio ?? "taller de madera"} en Chile.`,
  };
}

export default async function TallerDetallePage({ params }) {
  const { id } = await params;
  const taller = await obtenerTaller(id);

  if (!taller) {
    notFound();
  }

  const [productos, entrevistas] = await Promise.all([
    sql`
      SELECT id, name, price
      FROM products
      WHERE taller_id = ${id}
      ORDER BY id DESC
    `,
    sql`
      SELECT id, titulo, fecha
      FROM entrevistas
      WHERE taller_id = ${id}
      ORDER BY fecha DESC
    `,
  ]);

  return (
    <main className="max-w-7xl mx-auto px-8 py-16">
      <TallerPerfilConMapa
        taller={taller}
        productos={productos}
        entrevistas={entrevistas}
      />
    </main>
  );
}
